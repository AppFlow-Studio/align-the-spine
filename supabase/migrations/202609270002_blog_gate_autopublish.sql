-- A blog post publishes itself the moment it is good enough, no matter how it
-- arrived: the admin form, the Supabase table editor, the SQL editor, or a
-- client-library insert.
--
-- Before this, `gate_result` was computed only in TypeScript
-- (lib/content/publication-gates.ts) and written by `save_content_draft`. A row
-- inserted directly into the table therefore kept the column default
-- (`{"passed": false, "blockers": ["Not checked"]}`), so `is_public_content()`
-- hid it forever and `transition_content` refused to publish it. Direct writes
-- were effectively write-only.
--
-- This migration moves the gate into the database as the authority:
--
--   1. `content_gate_result(content_items)` is a SQL mirror of
--      `evaluatePublicationGates()`. The two must be kept in step — the header
--      comment in lib/content/publication-gates.ts says the same thing.
--   2. A BEFORE trigger fills the fields that are pure restatements of what the
--      writer already supplied (`seo_title` <- title, `meta_description` <-
--      excerpt, `direct_answer` <- first paragraph), recomputes `gate_result`,
--      and promotes a passing blog post straight to `published`.
--   3. Sources arrive in a separate INSERT after the item, so
--      `content_sources` and `sources` triggers re-run the gate for the parent
--      item — otherwise a post whose only blocker was "needs sources" would
--      stay unpublished after its sources landed.
--
-- Nothing here invents content. An image, its alt text, FAQs, and sources are
-- never fabricated to force a pass; those stay real blockers, and
-- `content_publication_readiness` (bottom of this file) names exactly which
-- ones a given post is still missing.
--
-- Deliberately NOT gated on human review of any kind — see
-- 202609270001_blog_writer_self_publish.sql. Auto-publish respects exactly two
-- holds: `noindex = true` (the writer is saying "not for the public index") and
-- `status = 'archived'` (deliberately retired). A future `scheduled_for` sends
-- the post to `scheduled` rather than `published`.

-- ---------------------------------------------------------------------------
-- Column defaults, so a direct INSERT can name only the fields a writer
-- actually knows.
-- ---------------------------------------------------------------------------

/** The acting editorial profile for a write that carries no JWT. `auth.uid()`
 * is null in the SQL editor and for service-role connections, but
 * `created_by`/`updated_by` are NOT NULL, so a direct insert would otherwise
 * fail on a column the writer has no reason to care about.
 *
 * Falls back to the longest-standing active editorial account, preferring an
 * admin but accepting an editor or clinician reviewer. Deliberately not
 * admin-only: this database's sole active profile is an `editor`, so an
 * admin-only fallback would return null and make every direct insert fail on a
 * NOT NULL violation — the exact path this migration exists to open. */
create or replace function public.default_editorial_actor()
returns uuid
language sql
stable
set search_path = public
as $$
  select coalesce(
    auth.uid(),
    (
      select id from public.profiles
      where active and role in ('admin', 'editor', 'clinician_reviewer')
      order by case role when 'admin' then 0 when 'editor' then 1 else 2 end, created_at
      limit 1
    )
  );
$$;

/** The house author for a post that doesn't name one. Prefers the practice's
 * own profile, then any active author. */
create or replace function public.default_content_author()
returns uuid
language sql
stable
set search_path = public
as $$
  select coalesce(
    (select id from public.authors where active and slug = 'dr-abe-nasser'),
    (select id from public.authors where active order by created_at limit 1)
  );
$$;

alter table public.content_items
  alter column noindex set default false,
  alter column search_intent set default '',
  alter column audience set default '',
  alter column seo_title set default '',
  alter column meta_description set default '',
  alter column created_by set default public.default_editorial_actor(),
  alter column updated_by set default public.default_editorial_actor(),
  alter column author_id set default public.default_content_author();

-- ---------------------------------------------------------------------------
-- The gate, in SQL.
-- ---------------------------------------------------------------------------

/** Server-side mirror of `evaluatePublicationGates()`
 * (lib/content/publication-gates.ts). Returns the same
 * `{passed, blockers, recommendations, checkedAt}` shape that
 * `is_public_content()` and `transition_content` already read, so the two
 * implementations are interchangeable. Blog posts only — `service_area` rows
 * are gated on local evidence that lives in
 * lib/content/static-service-area-repository.ts, and this function is never
 * applied to them. */
create or replace function public.content_gate_result(item public.content_items)
returns jsonb
language plpgsql
stable
set search_path = public
as $$
declare
  blockers text[] := '{}';
  recommendations text[] := '{}';
  block jsonb;
  block_type text;
  block_id text;
  seen_ids text[] := '{}';
  heading_level integer;
  previous_heading integer := 1;
  structure_ok boolean := true;
  body_text text := '';
  word_count integer := 0;
  takeaway_count integer := 0;
  faq_count integer := 0;
  source_count integer := 0;
  unverified_count integer := 0;
  has_emergency_callout boolean := false;
  makes_objective_claims boolean := false;
  featured_image_url text;
begin
  if length(btrim(item.slug::text)) < 3 or item.slug::text !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    blockers := blockers || 'Slug is invalid.';
  end if;
  if length(btrim(item.title)) < 12 then
    blockers := blockers || 'Title is too short to be useful and unique.';
  end if;
  if length(btrim(coalesce(item.seo_title, ''))) < 12 then
    blockers := blockers || 'SEO title is required.';
  end if;
  if length(btrim(coalesce(item.meta_description, ''))) < 70 then
    blockers := blockers || 'Meta description must clearly summarize the page.';
  end if;

  -- Block structure: known types, unique ids, no skipped heading levels. A
  -- looser check than contentBlocksSchema's zod union (per-field length caps
  -- are left to the form), but it catches every shape the renderer cannot
  -- draw, which is what "invalid" has to mean here.
  if jsonb_typeof(item.content_blocks) <> 'array' or jsonb_array_length(item.content_blocks) = 0 then
    structure_ok := false;
  else
    for block in select value from jsonb_array_elements(item.content_blocks) loop
      block_type := block->>'type';
      block_id := coalesce(block->>'id', '');
      if block_id !~ '^[a-zA-Z0-9][a-zA-Z0-9_-]{2,63}$' or block_id = any(seen_ids) then
        structure_ok := false;
      end if;
      seen_ids := seen_ids || block_id;

      if block_type is null
        or block_type not in ('paragraph', 'heading', 'list', 'quote', 'callout', 'image', 'table')
      then
        structure_ok := false;
      elsif block_type = 'heading' then
        heading_level := nullif(block->>'level', '')::integer;
        if heading_level is null or heading_level < 2 or heading_level > 4
          or heading_level > previous_heading + 1
        then
          structure_ok := false;
        end if;
        previous_heading := coalesce(heading_level, previous_heading);
        body_text := body_text || ' ' || coalesce(block->>'text', '');
      elsif block_type = 'list' then
        if jsonb_typeof(block->'items') <> 'array' or jsonb_array_length(block->'items') = 0 then
          structure_ok := false;
        end if;
        body_text := body_text || ' ' || coalesce(
          (select string_agg(value, ' ') from jsonb_array_elements_text(coalesce(block->'items', '[]'::jsonb))),
          ''
        );
      elsif block_type = 'callout' then
        if btrim(coalesce(block->>'title', '')) = '' or btrim(coalesce(block->>'text', '')) = '' then
          structure_ok := false;
        end if;
        if block->>'tone' = 'emergency' then has_emergency_callout := true; end if;
        body_text := body_text || ' ' || coalesce(block->>'title', '') || ' ' || coalesce(block->>'text', '');
      elsif block_type = 'quote' then
        if btrim(coalesce(block->>'text', '')) = '' then structure_ok := false; end if;
        body_text := body_text || ' ' || coalesce(block->>'text', '') || ' ' || coalesce(block->>'attribution', '');
      elsif block_type = 'image' then
        -- Body images carry alt text or declare themselves decorative, same
        -- rule the featured image follows.
        if coalesce((block->>'decorative')::boolean, false) = (btrim(coalesce(block->>'alt', '')) <> '') then
          structure_ok := false;
        end if;
        body_text := body_text || ' ' || coalesce(block->>'caption', '');
      elsif block_type = 'table' then
        if jsonb_typeof(block->'headers') <> 'array' or jsonb_typeof(block->'rows') <> 'array' then
          structure_ok := false;
        end if;
        body_text := body_text || ' ' || coalesce(block->>'caption', '') || ' ' || coalesce(block->'headers', '[]'::jsonb)::text
          || ' ' || coalesce(block->'rows', '[]'::jsonb)::text;
      else
        if btrim(coalesce(block->>'text', '')) = '' then structure_ok := false; end if;
        body_text := body_text || ' ' || coalesce(block->>'text', '');
      end if;
    end loop;
  end if;

  if btrim(body_text) <> '' then
    word_count := coalesce(array_length(regexp_split_to_array(btrim(body_text), '\s+'), 1), 0);
  end if;

  if not structure_ok then
    blockers := blockers || 'Content blocks or heading hierarchy are invalid.';
  end if;
  if word_count < 350 then
    blockers := blockers || 'Content is too thin for publication review.';
  end if;
  if item.author_id is null then
    blockers := blockers || 'A valid author is required.';
  end if;
  if btrim(coalesce(item.direct_answer, '')) = '' then
    blockers := blockers || 'A direct answer or key-takeaway summary is required.';
  end if;

  select count(*) into takeaway_count
  from jsonb_array_elements_text(coalesce(item.key_takeaways, '[]'::jsonb)) as t(value)
  where btrim(t.value) <> '';
  faq_count := case
    when jsonb_typeof(coalesce(item.faqs, '[]'::jsonb)) = 'array' then jsonb_array_length(coalesce(item.faqs, '[]'::jsonb))
    else 0 end;

  if item.content_type = 'blog_post' then
    -- Key-takeaway bullets are a recommendation, not a blocker: the article's
    -- "Key takeaways" box already renders `direct_answer`, which is required
    -- above, so a post without bullets is complete — just less scannable.
    if takeaway_count = 0 then
      recommendations := recommendations || 'Add key-takeaway bullets so the summary box is scannable.';
    end if;
    -- FAQs stay required. They are rendered on the page and emitted as FAQPage
    -- structured data, which is a large share of this site's rich-result and
    -- AI-citation surface.
    if faq_count = 0 then
      blockers := blockers || 'At least one FAQ is required for blog posts.';
    end if;
  end if;

  if not item.featured_image_decorative
    and (item.featured_image_asset_id is null or btrim(coalesce(item.featured_image_alt, '')) = '')
  then
    blockers := blockers
      || 'A featured image with useful alt text, or a documented decorative choice, is required.';
  end if;
  -- next/image only optimizes the hosts in next.config.ts's remotePatterns; a
  -- featured image anywhere else throws at render and takes the article page
  -- with it. Mirrored by RENDERABLE_IMAGE_HOSTS in
  -- lib/content/publication-gates.ts.
  if item.featured_image_asset_id is not null then
    select a.url into featured_image_url from public.assets a where a.id = item.featured_image_asset_id;
    if featured_image_url is not null
      and featured_image_url !~* '^https://align-the-spine\.b-cdn\.net/'
    then
      blockers := blockers
        || 'Featured image must be hosted on align-the-spine.b-cdn.net so the site can render it.';
    end if;
  end if;
  if item.noindex and btrim(coalesce(item.noindex_reason, '')) = '' then
    blockers := blockers || 'Noindex requires a reason.';
  end if;

  makes_objective_claims := item.content_blocks::text ~*
    '\y(statute|percent|percentage|study|research|crash(es)?|fatalit(y|ies)|days?|coverage|insurance|PIP|diagnos(is|e)|treatment|recover(y|ies))\y';
  select count(*), count(*) filter (where s.verification_status <> 'verified')
    into source_count, unverified_count
  from public.content_sources cs
  join public.sources s on s.id = cs.source_id
  where cs.content_id = item.id;

  if makes_objective_claims and source_count = 0 then
    blockers := blockers || 'Objective medical, legal, insurance, or statistical claims require sources.';
  end if;
  if unverified_count > 0 then
    blockers := blockers || 'Every cited source must be verified before publication.';
  end if;
  if item.emergency_guidance_relevant and not has_emergency_callout then
    blockers := blockers || 'Relevant emergency/red-flag guidance is missing.';
  end if;
  if item.status = 'scheduled' and (item.scheduled_for is null or item.scheduled_for <= now()) then
    blockers := blockers || 'Scheduled content requires a future schedule time.';
  end if;
  if not exists (select 1 from public.content_relations where source_content_id = item.id) then
    recommendations := recommendations || 'Add genuinely useful related content.';
  end if;

  return jsonb_build_object(
    'passed', cardinality(blockers) = 0,
    'blockers', to_jsonb(blockers),
    'recommendations', to_jsonb(recommendations),
    'checkedAt', to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Derive, gate, publish.
-- ---------------------------------------------------------------------------

create or replace function public.content_prepare_for_publication()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  first_paragraph text;
begin
  if new.content_type <> 'blog_post' then
    return new;
  end if;

  -- Restatements of what the writer already wrote. Never inventions: each one
  -- is a copy of another field on the same row, so nothing here can put a
  -- claim on the page the writer didn't make.
  if btrim(coalesce(new.seo_title, '')) = '' then
    new.seo_title := new.title;
  end if;
  if btrim(coalesce(new.meta_description, '')) = '' then
    new.meta_description := new.excerpt;
  end if;
  if btrim(coalesce(new.direct_answer, '')) = '' then
    select left(btrim(b.value->>'text'), 1000) into first_paragraph
    from jsonb_array_elements(coalesce(new.content_blocks, '[]'::jsonb)) as b(value)
    where b.value->>'type' = 'paragraph' and btrim(coalesce(b.value->>'text', '')) <> ''
    limit 1;
    new.direct_answer := coalesce(first_paragraph, '');
  end if;

  new.gate_result := public.content_gate_result(new);

  -- Promote. `archived` is a deliberate retirement and `noindex` is a
  -- deliberate hold, so neither is ever overridden here.
  if coalesce((new.gate_result->>'passed')::boolean, false)
    and new.noindex = false
    and new.status in ('draft', 'in_review', 'approved', 'scheduled')
  then
    if new.scheduled_for is not null and new.scheduled_for > now() then
      new.status := 'scheduled';
    else
      new.status := 'published';
      new.published_at := coalesce(new.published_at, now());
    end if;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists content_items_prepare_publication on public.content_items;
create trigger content_items_prepare_publication
  before insert or update on public.content_items
  for each row execute function public.content_prepare_for_publication();

/** Re-runs the gate for one item. A no-op UPDATE is enough: the BEFORE trigger
 * above does the work. Used by the citation triggers below and by
 * `publish_blog_post()` (202609270003) after it has attached sources. */
create or replace function public.refresh_content_publication(target_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  refreshed jsonb;
begin
  update public.content_items set updated_at = now() where id = target_id
  returning gate_result into refreshed;
  return refreshed;
end;
$$;

revoke all on function public.refresh_content_publication(uuid) from public;
grant execute on function public.refresh_content_publication(uuid) to authenticated;

/** A citation landing (or a source finally being marked verified) can be the
 * last thing standing between a post and publication, so both re-run the
 * parent's gate. Without this, "Objective … claims require sources" would
 * stick after the sources were attached. */
create or replace function public.content_sources_refresh_parent()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    update public.content_items set updated_at = now() where id = old.content_id;
    return old;
  end if;
  update public.content_items set updated_at = now() where id = new.content_id;
  if tg_op = 'UPDATE' and old.content_id <> new.content_id then
    update public.content_items set updated_at = now() where id = old.content_id;
  end if;
  return new;
end;
$$;

drop trigger if exists content_sources_refresh_parent on public.content_sources;
create trigger content_sources_refresh_parent
  after insert or update or delete on public.content_sources
  for each row execute function public.content_sources_refresh_parent();

create or replace function public.sources_refresh_citing_content()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.verification_status is distinct from new.verification_status then
    update public.content_items set updated_at = now()
    where id in (select content_id from public.content_sources where source_id = new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists sources_refresh_citing_content on public.sources;
create trigger sources_refresh_citing_content
  after update on public.sources
  for each row execute function public.sources_refresh_citing_content();

-- ---------------------------------------------------------------------------
-- Audit trail for writes that never touched `transition_content`.
-- ---------------------------------------------------------------------------

/** Every status change gets a `publication_events` row, including the ones the
 * trigger makes on its own. `actor_id` is the row's `updated_by` rather than
 * `auth.uid()`, because a SQL-editor or service-role write has no JWT and the
 * column is NOT NULL. */
create or replace function public.content_log_autopublication()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  previous public.content_status := case when tg_op = 'UPDATE' then old.status else 'draft' end;
begin
  if new.content_type <> 'blog_post' then return new; end if;
  if tg_op = 'UPDATE' and old.status = new.status then return new; end if;
  if tg_op = 'INSERT' and new.status = 'draft' then return new; end if;

  insert into public.publication_events(
    content_id, actor_id, from_status, to_status, reason, resulting_path, revalidation_status
  )
  values (
    new.id, new.updated_by, previous, new.status,
    case
      when tg_op = 'INSERT' then 'Created directly at status ' || new.status || '; publication gates passed.'
      else 'Publication gates passed; published without a review handoff.'
    end,
    '/blog/' || new.slug::text,
    case when new.status in ('published', 'scheduled', 'archived') then 'pending' else 'not_required' end
  );
  return new;
end;
$$;

drop trigger if exists content_items_log_autopublication on public.content_items;
create trigger content_items_log_autopublication
  after insert or update on public.content_items
  for each row execute function public.content_log_autopublication();

-- ---------------------------------------------------------------------------
-- One place to answer "why isn't my post live yet?".
-- ---------------------------------------------------------------------------

/** Readable in the Supabase table editor by any editorial account (RLS on
 * `content_items` is respected via security_invoker). `blockers` is the exact
 * list the gate produced, so a writer never has to guess what is missing. */
create or replace view public.content_publication_readiness
with (security_invoker = true)
as
select
  ci.id,
  ci.slug::text as slug,
  ci.title,
  ci.status,
  coalesce((ci.gate_result->>'passed')::boolean, false) as gates_passed,
  ci.noindex,
  public.is_public_content(ci) as publicly_visible,
  case
    when public.is_public_content(ci) then 'Live at /blog/' || ci.slug::text
    when ci.status = 'archived' then 'Archived on purpose.'
    when ci.noindex then 'Held back: noindex is true.'
    when ci.status = 'scheduled' then 'Scheduled for ' || coalesce(ci.scheduled_for::text, 'an unset time') || '.'
    when coalesce((ci.gate_result->>'passed')::boolean, false) then 'Gates pass; waiting on publication.'
    else 'Blocked: see blockers.'
  end as explanation,
  coalesce(
    array(select t.value from jsonb_array_elements_text(ci.gate_result->'blockers') as t(value)),
    '{}'::text[]
  ) as blockers,
  coalesce(
    array(select t.value from jsonb_array_elements_text(ci.gate_result->'recommendations') as t(value)),
    '{}'::text[]
  ) as recommendations,
  ci.published_at,
  ci.updated_at
from public.content_items ci
where ci.content_type = 'blog_post';

grant select on public.content_publication_readiness to authenticated;

-- ---------------------------------------------------------------------------
-- Bring existing rows under the new rule: anything already good enough goes
-- live now, and everything else gets an honest blocker list instead of the
-- "Not checked" placeholder.
-- ---------------------------------------------------------------------------

-- Posts whose only hold was the review step that no longer exists. Matching on
-- the reason text keeps this narrow: a post noindexed for any other stated
-- reason (thin, duplicate, seasonal, legal) keeps its hold. `noindex_reason` is
-- deliberately left in place rather than cleared — it is never rendered
-- publicly, it records why the post was once held, and keeping it is what makes
-- this statement exactly reversible in the .down.sql.
update public.content_items
set noindex = false
where content_type = 'blog_post'
  and noindex
  and noindex_reason ~* '(clinical|clinician|medical)\s*(/\w+)?\s*(review|approval)';

-- Touch every blog row so the trigger above computes a real gate_result for it
-- and publishes whatever already qualifies.
update public.content_items set updated_at = now() where content_type = 'blog_post';
