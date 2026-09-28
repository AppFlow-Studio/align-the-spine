-- Two things a worker writing straight to Supabase still needs after
-- 202609270002: a one-call way to upload a whole post (body, FAQs, image,
-- sources, taxonomy) without hand-assembling seven tables, and a way for the
-- live site to notice.
--
-- Part 1 — `blog_blocks_from_markdown()` + `publish_blog_post()`: the
-- ergonomic front door. One `select public.publish_blog_post('{...}')` from the
-- SQL editor, the Supabase client, or any HTTP call to /rest/v1/rpc creates or
-- updates the post and returns whether it went live. docs/blog-publishing.md
-- has copy-paste examples.
--
-- Part 2 — cache revalidation. The app serves /blog and /blog/[slug] from
-- `unstable_cache` (lib/content/public-content.ts). `transition_content` callers
-- get revalidation from the API route that wraps them, but a direct table write
-- has no such route, so the new page would sit behind a stale cache entry. A
-- trigger posts the changed slug to the app's revalidate endpoint through
-- pg_net. It degrades safely: no pg_net, no configuration, or a failing endpoint
-- all fall back to the (now short) cache TTL rather than blocking the write.

-- ---------------------------------------------------------------------------
-- Part 1: authoring helpers
-- ---------------------------------------------------------------------------

/** Turns plain prose into the `content_blocks` array the renderer expects, so a
 * worker can paste an article instead of hand-writing block JSON. Supports the
 * small subset of Markdown this site's blocks can actually represent:
 *
 *   ## / ### / ####    heading (level 2-4)
 *   - item / * item    unordered list (consecutive lines)
 *   1. item            ordered list (consecutive lines)
 *   > quote            quote block
 *   anything else      paragraph
 *
 * Blocks are separated by blank lines. Ids are positional (`blk1`, `blk2`, …) —
 * three characters minimum, because the block-id format is
 * `^[a-z0-9][a-z0-9_-]{2,63}$` and a bare `b1` is rejected — and stay stable
 * across a re-upload of the same text. Deliberately no image/table support: those need an asset id and a
 * header/row shape that prose can't express unambiguously. */
create or replace function public.blog_blocks_from_markdown(source text)
returns jsonb
language plpgsql
immutable
set search_path = public
as $$
declare
  blocks jsonb := '[]'::jsonb;
  chunk text;
  lines text[];
  line text;
  list_items jsonb;
  heading_level integer;
  block_index integer := 0;
  is_unordered boolean;
  is_ordered boolean;
begin
  if source is null or btrim(source) = '' then return blocks; end if;

  for chunk in
    select btrim(value) from regexp_split_to_table(replace(source, E'\r\n', E'\n'), E'\n[ \t]*\n') as t(value)
  loop
    if chunk = '' then continue; end if;
    block_index := block_index + 1;
    lines := regexp_split_to_array(chunk, E'\n');
    is_unordered := true;
    is_ordered := true;
    foreach line in array lines loop
      if btrim(line) !~ '^[-*]\s+\S' then is_unordered := false; end if;
      if btrim(line) !~ '^\d+[.)]\s+\S' then is_ordered := false; end if;
    end loop;

    if chunk ~ '^#{2,4}\s+\S' then
      heading_level := length(substring(chunk from '^#+'));
      blocks := blocks || jsonb_build_object(
        'id', 'blk' || block_index,
        'type', 'heading',
        'level', heading_level,
        'text', btrim(regexp_replace(chunk, '^#+\s*', ''))
      );
    elsif is_unordered or is_ordered then
      list_items := '[]'::jsonb;
      foreach line in array lines loop
        list_items := list_items || to_jsonb(btrim(regexp_replace(btrim(line), '^([-*]|\d+[.)])\s+', '')));
      end loop;
      blocks := blocks || jsonb_build_object(
        'id', 'blk' || block_index,
        'type', 'list',
        'style', case when is_ordered and not is_unordered then 'ordered' else 'unordered' end,
        'items', list_items
      );
    elsif chunk ~ '^>\s*\S' then
      blocks := blocks || jsonb_build_object(
        'id', 'blk' || block_index,
        'type', 'quote',
        'text', btrim(regexp_replace(chunk, '^>\s*', '', 'g'))
      );
    else
      blocks := blocks || jsonb_build_object(
        'id', 'blk' || block_index,
        'type', 'paragraph',
        'text', btrim(regexp_replace(chunk, E'\n', ' ', 'g'))
      );
    end if;
  end loop;

  return blocks;
end;
$$;

/** Creates or updates one blog post from a single JSON payload, then lets
 * 202609270002's trigger decide whether it goes live. Returns the post's id,
 * status, whether it is publicly visible, and the gate result — so the caller
 * sees immediately either "live" or exactly what is missing.
 *
 * Keyed on `slug`: calling it twice with the same slug edits the same post
 * rather than creating a second one, which makes a re-upload safe and makes the
 * function usable as the worker's only write path.
 *
 * Payload (only `slug`, `title`, `excerpt`, and body are required):
 *   slug, title, excerpt, markdown | blocks, directAnswer, keyTakeaways[],
 *   faqs[{question,answer}], seoTitle, metaDescription, ogTitle, ogDescription,
 *   imageUrl, imageAlt, imageWidth, imageHeight, authorSlug, primaryKeyword,
 *   searchIntent, audience, categories[slug], tags[slug], relatedSlugs[slug],
 *   sources[{title,publisher,url,accessedDate,sourceType,primarySource,
 *            verified,claimSupported,geography}],
 *   featured, noindex, noindexReason, emergencyGuidanceRelevant, scheduledFor
 *
 * Security: callers arriving with a JWT must hold an active editorial profile.
 * A call with no JWT (SQL editor, service role) is trusted and attributed to
 * `actorId` if given, else to the longest-standing active editorial account. */
create or replace function public.publish_blog_post(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid;
  actor_role public.editorial_role;
  target_slug citext;
  item_id uuid;
  target_author uuid;
  target_asset uuid;
  blocks jsonb;
  faq_list jsonb := '[]'::jsonb;
  faq_entry jsonb;
  faq_index integer := 0;
  takeaways jsonb;
  source_entry jsonb;
  resolved_source uuid;
  taxonomy_slug text;
  taxonomy_id uuid;
  related_id uuid;
  related_order integer := 0;
  image_url text := nullif(btrim(payload->>'imageUrl'), '');
  image_alt text := coalesce(nullif(btrim(payload->>'imageAlt'), ''), '');
begin
  if auth.uid() is not null then
    select role into actor_role from public.profiles where id = auth.uid() and active = true;
    if actor_role is null or actor_role not in ('admin', 'editor', 'clinician_reviewer') then
      raise exception 'editor_required' using errcode = '42501';
    end if;
  end if;
  actor := coalesce(auth.uid(), nullif(payload->>'actorId', '')::uuid, public.default_editorial_actor());
  if actor is null then
    raise exception 'no_editorial_actor: no active admin/editor/clinician_reviewer profile exists';
  end if;

  target_slug := lower(btrim(coalesce(payload->>'slug', '')));
  if target_slug::text !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'invalid_slug: use lowercase words separated by single hyphens';
  end if;

  -- Body: explicit blocks win; otherwise prose is converted.
  if jsonb_typeof(payload->'blocks') = 'array' then
    blocks := payload->'blocks';
  else
    blocks := public.blog_blocks_from_markdown(
      coalesce(payload->>'markdown', payload->>'body', payload->>'content')
    );
  end if;

  -- FAQs get positional ids when the caller sends bare question/answer pairs.
  if jsonb_typeof(payload->'faqs') = 'array' then
    for faq_entry in select value from jsonb_array_elements(payload->'faqs') loop
      faq_index := faq_index + 1;
      faq_list := faq_list || jsonb_build_object(
        'id', coalesce(nullif(faq_entry->>'id', ''), 'faq' || faq_index),
        'question', btrim(coalesce(faq_entry->>'question', '')),
        'answer', btrim(coalesce(faq_entry->>'answer', ''))
      );
    end loop;
  end if;

  takeaways := case
    when jsonb_typeof(payload->'keyTakeaways') = 'array' then payload->'keyTakeaways'
    else '[]'::jsonb end;

  if nullif(btrim(payload->>'authorSlug'), '') is not null then
    select a.id into target_author from public.authors a
    where a.slug = lower(btrim(payload->>'authorSlug')) and a.active;
    if target_author is null then
      raise exception 'unknown_author: no active author with slug %', payload->>'authorSlug';
    end if;
  else
    target_author := public.default_content_author();
  end if;

  -- Featured image. Reuses the asset row when this URL is already known, so
  -- re-uploading the same post doesn't pile up duplicates.
  if image_url is not null then
    -- Same host rule the gate enforces, raised here so the caller is told
    -- immediately instead of getting a post that silently won't publish.
    if image_url !~* '^https://align-the-spine\.b-cdn\.net/' then
      raise exception 'invalid_image_url: must be an https:// URL on align-the-spine.b-cdn.net (next/image only optimizes that host)';
    end if;
    select id into target_asset from public.assets where url = image_url;
    if target_asset is null then
      insert into public.assets (url, provider, mime_type, width, height, alt, approval_state, created_by)
      values (
        image_url, 'bunny_cdn',
        case when image_url ~* '\.png(\?|$)' then 'image/png'
             when image_url ~* '\.webp(\?|$)' then 'image/webp'
             when image_url ~* '\.avif(\?|$)' then 'image/avif'
             else 'image/jpeg' end,
        coalesce((payload->>'imageWidth')::integer, 1600),
        coalesce((payload->>'imageHeight')::integer, 1000),
        image_alt, 'approved', actor
      )
      returning id into target_asset;
    else
      update public.assets set alt = coalesce(nullif(image_alt, ''), alt), updated_at = now()
      where id = target_asset;
    end if;
  end if;

  select ci.id into item_id from public.content_items ci where ci.slug = target_slug;

  if item_id is null then
    insert into public.content_items (
      content_type, slug, title, excerpt, content_blocks, key_takeaways, faqs,
      primary_keyword, search_intent, audience, seo_title, meta_description,
      og_title, og_description, featured_image_asset_id, featured_image_alt,
      author_id, direct_answer, emergency_guidance_relevant, featured,
      noindex, noindex_reason, scheduled_for, created_by, updated_by, status
    )
    values (
      'blog_post', target_slug,
      btrim(coalesce(payload->>'title', '')),
      btrim(coalesce(payload->>'excerpt', '')),
      blocks, takeaways, faq_list,
      nullif(btrim(payload->>'primaryKeyword'), ''),
      coalesce(nullif(btrim(payload->>'searchIntent'), ''), ''),
      coalesce(nullif(btrim(payload->>'audience'), ''), ''),
      coalesce(nullif(btrim(payload->>'seoTitle'), ''), ''),
      coalesce(nullif(btrim(payload->>'metaDescription'), ''), ''),
      nullif(btrim(payload->>'ogTitle'), ''),
      nullif(btrim(payload->>'ogDescription'), ''),
      target_asset, nullif(image_alt, ''),
      target_author,
      coalesce(nullif(btrim(payload->>'directAnswer'), ''), ''),
      coalesce((payload->>'emergencyGuidanceRelevant')::boolean, false),
      coalesce((payload->>'featured')::boolean, false),
      coalesce((payload->>'noindex')::boolean, false),
      nullif(btrim(payload->>'noindexReason'), ''),
      nullif(payload->>'scheduledFor', '')::timestamptz,
      actor, actor, 'draft'
    )
    returning id into item_id;
  else
    update public.content_items ci set
      title = coalesce(nullif(btrim(payload->>'title'), ''), ci.title),
      excerpt = coalesce(nullif(btrim(payload->>'excerpt'), ''), ci.excerpt),
      content_blocks = case when jsonb_array_length(blocks) > 0 then blocks else ci.content_blocks end,
      key_takeaways = case when payload ? 'keyTakeaways' then takeaways else ci.key_takeaways end,
      faqs = case when payload ? 'faqs' then faq_list else ci.faqs end,
      primary_keyword = coalesce(nullif(btrim(payload->>'primaryKeyword'), ''), ci.primary_keyword),
      search_intent = coalesce(nullif(btrim(payload->>'searchIntent'), ''), ci.search_intent),
      audience = coalesce(nullif(btrim(payload->>'audience'), ''), ci.audience),
      seo_title = coalesce(nullif(btrim(payload->>'seoTitle'), ''), ci.seo_title),
      meta_description = coalesce(nullif(btrim(payload->>'metaDescription'), ''), ci.meta_description),
      og_title = coalesce(nullif(btrim(payload->>'ogTitle'), ''), ci.og_title),
      og_description = coalesce(nullif(btrim(payload->>'ogDescription'), ''), ci.og_description),
      featured_image_asset_id = coalesce(target_asset, ci.featured_image_asset_id),
      featured_image_alt = coalesce(nullif(image_alt, ''), ci.featured_image_alt),
      author_id = target_author,
      direct_answer = coalesce(nullif(btrim(payload->>'directAnswer'), ''), ci.direct_answer),
      emergency_guidance_relevant = coalesce(
        (payload->>'emergencyGuidanceRelevant')::boolean, ci.emergency_guidance_relevant),
      featured = coalesce((payload->>'featured')::boolean, ci.featured),
      noindex = coalesce((payload->>'noindex')::boolean, ci.noindex),
      noindex_reason = case
        when coalesce((payload->>'noindex')::boolean, ci.noindex) then
          coalesce(nullif(btrim(payload->>'noindexReason'), ''), ci.noindex_reason)
        else null end,
      scheduled_for = coalesce(nullif(payload->>'scheduledFor', '')::timestamptz, ci.scheduled_for),
      updated_by = actor,
      version = ci.version + 1
    where ci.id = item_id;
  end if;

  -- Citations. Replaced wholesale when the key is present so a re-upload is
  -- idempotent; untouched when it is absent.
  if jsonb_typeof(payload->'sources') = 'array' then
    delete from public.content_sources where content_id = item_id;
    for source_entry in select value from jsonb_array_elements(payload->'sources') loop
      select s.id into resolved_source from public.sources s where s.url = source_entry->>'url';
      if resolved_source is null then
        insert into public.sources (
          title, publisher, url, source_type, publication_date, accessed_date,
          geography, primary_source, verification_status, created_by
        )
        values (
          btrim(coalesce(source_entry->>'title', 'Untitled source')),
          btrim(coalesce(source_entry->>'publisher', 'Unknown publisher')),
          source_entry->>'url',
          coalesce(nullif(btrim(source_entry->>'sourceType'), ''), 'reference'),
          nullif(source_entry->>'publicationDate', '')::date,
          coalesce(nullif(source_entry->>'accessedDate', '')::date, current_date),
          nullif(btrim(source_entry->>'geography'), ''),
          coalesce((source_entry->>'primarySource')::boolean, false),
          case when coalesce((source_entry->>'verified')::boolean, true)
            then 'verified'::public.source_verification
            else 'pending'::public.source_verification end,
          actor
        )
        returning id into resolved_source;
      elsif coalesce((source_entry->>'verified')::boolean, true) then
        update public.sources set verification_status = 'verified', updated_at = now()
        where id = resolved_source and verification_status <> 'verified';
      end if;
      insert into public.content_sources (content_id, source_id, block_id, claim_supported)
      values (
        item_id, resolved_source, nullif(btrim(source_entry->>'blockId'), ''),
        coalesce(nullif(btrim(source_entry->>'claimSupported'), ''), 'Supports statements in this article.')
      )
      on conflict do nothing;
    end loop;
  end if;

  if jsonb_typeof(payload->'categories') = 'array' then
    delete from public.content_categories where content_id = item_id;
    for taxonomy_slug in select value from jsonb_array_elements_text(payload->'categories') loop
      taxonomy_slug := lower(btrim(taxonomy_slug));
      continue when taxonomy_slug = '';
      select c.id into taxonomy_id from public.categories c where c.slug = taxonomy_slug;
      if taxonomy_id is null then
        insert into public.categories (slug, name, description)
        values (taxonomy_slug, initcap(replace(taxonomy_slug, '-', ' ')), '')
        returning id into taxonomy_id;
      end if;
      insert into public.content_categories (content_id, category_id)
      values (item_id, taxonomy_id) on conflict do nothing;
    end loop;
  end if;

  if jsonb_typeof(payload->'tags') = 'array' then
    delete from public.content_tags where content_id = item_id;
    for taxonomy_slug in select value from jsonb_array_elements_text(payload->'tags') loop
      taxonomy_slug := lower(btrim(taxonomy_slug));
      continue when taxonomy_slug = '';
      select t.id into taxonomy_id from public.tags t where t.slug = taxonomy_slug;
      if taxonomy_id is null then
        insert into public.tags (slug, name) values (taxonomy_slug, initcap(replace(taxonomy_slug, '-', ' ')))
        returning id into taxonomy_id;
      end if;
      insert into public.content_tags (content_id, tag_id) values (item_id, taxonomy_id) on conflict do nothing;
    end loop;
  end if;

  if jsonb_typeof(payload->'relatedSlugs') = 'array' then
    delete from public.content_relations where source_content_id = item_id;
    for taxonomy_slug in select value from jsonb_array_elements_text(payload->'relatedSlugs') loop
      select ci.id into related_id from public.content_items ci where ci.slug = lower(btrim(taxonomy_slug));
      if related_id is not null and related_id <> item_id then
        related_order := related_order + 1;
        insert into public.content_relations (source_content_id, target_content_id, relation_type, sort_order)
        values (item_id, related_id, 'article', related_order) on conflict do nothing;
      end if;
    end loop;
  end if;

  -- Sources/relations landed after the item, so re-run the gate: this is the
  -- call that actually publishes a post whose only outstanding blocker was its
  -- citations.
  perform public.refresh_content_publication(item_id);

  return (
    select jsonb_build_object(
      'id', ci.id,
      'slug', ci.slug::text,
      'status', ci.status,
      'publiclyVisible', public.is_public_content(ci),
      'url', case when public.is_public_content(ci) then '/blog/' || ci.slug::text else null end,
      'gate', ci.gate_result
    )
    from public.content_items ci where ci.id = item_id
  );
end;
$$;

revoke all on function public.publish_blog_post(jsonb) from public;
grant execute on function public.publish_blog_post(jsonb) to authenticated;
revoke all on function public.blog_blocks_from_markdown(text) from public;
grant execute on function public.blog_blocks_from_markdown(text) to authenticated;

-- ---------------------------------------------------------------------------
-- Part 2: telling the live site
-- ---------------------------------------------------------------------------

create table if not exists public.content_revalidation_config (
  id boolean primary key default true check (id),
  endpoint_url text,
  secret text,
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

comment on table public.content_revalidation_config is
  'Single row. endpoint_url is the deployed site''s /api/internal/content-revalidate URL and secret must equal CONTENT_REVALIDATION_SECRET in the app environment. Left empty, direct table writes simply wait out the page cache TTL instead of revalidating immediately.';

insert into public.content_revalidation_config (id) values (true) on conflict (id) do nothing;

-- No policies: the row holds a shared secret, so only the service role and the
-- security-definer trigger below can read it. Editors never need to.
alter table public.content_revalidation_config enable row level security;

/** Posts the changed post's slug to the app so it can drop the matching cache
 * tags. Fires for any change to a blog post that is (or just stopped being)
 * public — an edit to a live post matters as much as a first publish.
 *
 * Failure is never allowed to roll back the write: pg_net queues the request
 * outside the transaction, and everything here is wrapped so a missing
 * extension or a bad URL degrades to the page cache's own TTL. */
create or replace function public.content_notify_revalidation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  config public.content_revalidation_config;
  became_public boolean;
  was_public boolean;
begin
  if new.content_type <> 'blog_post' then return new; end if;

  select * into config from public.content_revalidation_config where id;
  if config.endpoint_url is null or btrim(config.endpoint_url) = '' or not config.enabled then
    return new;
  end if;
  if to_regnamespace('net') is null then return new; end if;

  became_public := public.is_public_content(new);
  was_public := case when tg_op = 'UPDATE' then public.is_public_content(old) else false end;
  if not became_public and not was_public then return new; end if;

  begin
    execute format(
      'select net.http_post(url => %L, headers => %L::jsonb, body => %L::jsonb)',
      config.endpoint_url,
      jsonb_build_object(
        'Content-Type', 'application/json',
        'x-revalidate-secret', coalesce(config.secret, '')
      )::text,
      jsonb_build_object(
        'id', new.id,
        'slug', new.slug::text,
        'contentType', 'blog_post',
        'status', new.status
      )::text
    );
  exception when others then
    -- Deliberately swallowed. A revalidation that didn't go out costs the site
    -- one cache TTL; a raised exception here would lose the post.
    null;
  end;
  return new;
end;
$$;

drop trigger if exists content_items_notify_revalidation on public.content_items;
create trigger content_items_notify_revalidation
  after insert or update on public.content_items
  for each row execute function public.content_notify_revalidation();
