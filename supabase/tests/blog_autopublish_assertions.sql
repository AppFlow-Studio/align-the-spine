-- Acceptance test for the self-publishing blog pipeline
-- (202609270001 / 202609270002 / 202609270003).
--
-- Run this in the Supabase SQL editor immediately after applying those three
-- migrations. It exercises the real tables and triggers, then rolls everything
-- back, so it is safe against a database with live content: no row it creates
-- survives, and it never touches a row it did not create.
--
-- Success looks like a single `assertions_passed` row. Any failure raises with
-- a message naming the exact behavior that broke.
--
-- It deliberately tests behavior, not source text: every assertion inserts or
-- updates a row and checks what the database did with it.

begin;

do $$
declare
  editor_id uuid;
  author uuid;
  cdn_asset uuid;
  offsite_asset uuid;
  item_id uuid;
  other_id uuid;
  blocks jsonb;
  result jsonb;
  row_status public.content_status;
  row_visible boolean;
  row_gate jsonb;
  row_blockers text[];
  seo text;
  meta text;
  answer text;
  event_count integer;
  filler text := repeat('alpha beta gamma delta epsilon zeta eta theta ', 50);
begin
  -- ---------------------------------------------------------------------
  -- 0. Preconditions
  -- ---------------------------------------------------------------------
  editor_id := public.default_editorial_actor();
  if editor_id is null then
    raise exception 'FAIL 0a: default_editorial_actor() is null — no active admin/editor/clinician_reviewer profile exists, so direct inserts cannot resolve created_by';
  end if;
  author := public.default_content_author();
  if author is null then
    raise exception 'FAIL 0b: default_content_author() is null — no active row in public.authors';
  end if;

  insert into public.assets (url, provider, mime_type, width, height, alt, approval_state, created_by)
  values ('https://align-the-spine.b-cdn.net/images/zzz-assertion-fixture.jpg', 'bunny_cdn',
          'image/jpeg', 1600, 1000, 'Assertion fixture image', 'approved', editor_id)
  returning id into cdn_asset;

  insert into public.assets (url, provider, mime_type, width, height, alt, approval_state, created_by)
  values ('https://images.example.com/zzz-assertion-offsite.jpg', 'approved_external',
          'image/jpeg', 1600, 1000, 'Offsite fixture image', 'approved', editor_id)
  returning id into offsite_asset;

  -- ---------------------------------------------------------------------
  -- 1. Markdown conversion produces blocks the app's schema accepts
  -- ---------------------------------------------------------------------
  blocks := public.blog_blocks_from_markdown(
    'Opening paragraph of the article.' || E'\n\n' ||
    '## A section heading' || E'\n\n' ||
    '- first bullet' || E'\n' || '- second bullet' || E'\n\n' ||
    '> A quoted line.' || E'\n\n' ||
    'Closing paragraph.'
  );
  if jsonb_array_length(blocks) <> 5 then
    raise exception 'FAIL 1a: markdown produced % blocks, expected 5', jsonb_array_length(blocks);
  end if;
  if (blocks->0->>'type') <> 'paragraph' or (blocks->1->>'type') <> 'heading'
    or (blocks->2->>'type') <> 'list' or (blocks->3->>'type') <> 'quote'
    or (blocks->4->>'type') <> 'paragraph' then
    raise exception 'FAIL 1b: markdown block types wrong: %', blocks;
  end if;
  if (blocks->1->>'level')::int <> 2 then
    raise exception 'FAIL 1c: "## " should be heading level 2, got %', blocks->1->>'level';
  end if;
  if jsonb_array_length(blocks->2->'items') <> 2 then
    raise exception 'FAIL 1d: bullet list should hold 2 items, got %', blocks->2->'items';
  end if;
  -- Block ids must satisfy ^[a-z0-9][a-z0-9_-]{2,63}$ — a 2-character id is
  -- rejected by the app and would fail the gate as "blocks are invalid".
  if (blocks->0->>'id') !~ '^[a-zA-Z0-9][a-zA-Z0-9_-]{2,63}$' then
    raise exception 'FAIL 1e: generated block id "%" is not a legal block id', blocks->0->>'id';
  end if;

  -- ---------------------------------------------------------------------
  -- 2. A complete post inserted directly publishes itself
  -- ---------------------------------------------------------------------
  insert into public.content_items (
    content_type, slug, title, excerpt, content_blocks, faqs,
    featured_image_asset_id, featured_image_alt
  ) values (
    'blog_post', 'zzz-assertion-complete-post',
    'A complete assertion post about posture habits',
    'A summary long enough to double as a meta description, which needs at least seventy characters to pass the gate.',
    jsonb_build_array(
      jsonb_build_object('id', 'intro', 'type', 'paragraph', 'text', 'The opening paragraph becomes the direct answer. ' || filler)
    ),
    jsonb_build_array(jsonb_build_object('id', 'faq1', 'question', 'Is this a question?', 'answer', 'Yes.')),
    cdn_asset, 'Assertion fixture image'
  ) returning id into item_id;

  select ci.status, public.is_public_content(ci), ci.seo_title, ci.meta_description, ci.direct_answer
  into row_status, row_visible, seo, meta, answer
  from public.content_items ci where ci.id = item_id;

  if row_status <> 'published' then
    raise exception 'FAIL 2a: a complete post should auto-publish, got status %; gate = %',
      row_status, (select gate_result from public.content_items where id = item_id);
  end if;
  if not row_visible then
    raise exception 'FAIL 2b: a published complete post should satisfy is_public_content()';
  end if;
  if seo <> 'A complete assertion post about posture habits' then
    raise exception 'FAIL 2c: seo_title should default to the title, got "%"', seo;
  end if;
  if meta not like 'A summary long enough%' then
    raise exception 'FAIL 2d: meta_description should default to the excerpt, got "%"', meta;
  end if;
  if answer not like 'The opening paragraph becomes the direct answer.%' then
    raise exception 'FAIL 2e: direct_answer should default to the first paragraph, got "%"', left(answer, 60);
  end if;
  if (select published_at from public.content_items where id = item_id) is null then
    raise exception 'FAIL 2f: published_at must be set when the trigger publishes';
  end if;

  -- The audit trail records a publication the app never asked for.
  select count(*) into event_count from public.publication_events
  where content_id = item_id and to_status = 'published';
  if event_count <> 1 then
    raise exception 'FAIL 2g: expected exactly 1 publication_event, found %', event_count;
  end if;

  -- The readiness view explains a live post.
  if (select publicly_visible from public.content_publication_readiness where id = item_id) is not true then
    raise exception 'FAIL 2h: content_publication_readiness disagrees that the post is live';
  end if;

  -- ---------------------------------------------------------------------
  -- 3. An incomplete post stays unpublished and says why
  -- ---------------------------------------------------------------------
  insert into public.content_items (content_type, slug, title, excerpt, content_blocks)
  values (
    'blog_post', 'zzz-assertion-thin-post',
    'A thin assertion post that should not publish',
    'This excerpt is long enough to clear the forty character minimum on the column itself.',
    jsonb_build_array(jsonb_build_object('id', 'only', 'type', 'paragraph', 'text', 'Too short.'))
  ) returning id into other_id;

  select ci.status, ci.gate_result into row_status, row_gate
  from public.content_items ci where ci.id = other_id;
  if row_status <> 'draft' then
    raise exception 'FAIL 3a: a thin post must stay draft, got %', row_status;
  end if;
  if (row_gate->>'passed')::boolean then
    raise exception 'FAIL 3b: a thin post must not pass the gate';
  end if;
  select blockers into row_blockers from public.content_publication_readiness where id = other_id;
  if not (row_blockers @> array['Content is too thin for publication review.']) then
    raise exception 'FAIL 3c: expected the thin-content blocker, got %', row_blockers;
  end if;
  if not (row_blockers @> array['At least one FAQ is required for blog posts.']) then
    raise exception 'FAIL 3d: expected the missing-FAQ blocker, got %', row_blockers;
  end if;
  -- Key-takeaway bullets are a recommendation, never a blocker.
  if exists (select 1 from unnest(row_blockers) as b(value) where b.value ilike '%key takeaway%') then
    raise exception 'FAIL 3e: key takeaways must not block publication, got %', row_blockers;
  end if;

  -- ---------------------------------------------------------------------
  -- 4. Citations arriving later release the post
  -- ---------------------------------------------------------------------
  insert into public.content_items (
    content_type, slug, title, excerpt, content_blocks, faqs,
    featured_image_asset_id, featured_image_alt
  ) values (
    'blog_post', 'zzz-assertion-needs-sources',
    'An assertion post that makes an objective claim',
    'A summary long enough to double as a meta description, which needs at least seventy characters to pass the gate.',
    jsonb_build_array(
      jsonb_build_object('id', 'intro', 'type', 'paragraph',
        'text', 'This paragraph mentions treatment and insurance coverage, so it needs a source. ' || filler)
    ),
    jsonb_build_array(jsonb_build_object('id', 'faq1', 'question', 'Does this need a source?', 'answer', 'Yes.')),
    cdn_asset, 'Assertion fixture image'
  ) returning id into other_id;

  if (select status from public.content_items where id = other_id) <> 'draft' then
    raise exception 'FAIL 4a: an unsourced objective claim must block publication';
  end if;

  declare
    new_source uuid;
  begin
    insert into public.sources (title, publisher, url, source_type, accessed_date, primary_source, verification_status, created_by)
    values ('Assertion source', 'Assertion publisher', 'https://example.gov/zzz-assertion',
            'government', current_date, true, 'verified', editor_id)
    returning id into new_source;
    insert into public.content_sources (content_id, source_id, claim_supported)
    values (other_id, new_source, 'Supports the assertion claim.');
  end;

  if (select status from public.content_items where id = other_id) <> 'published' then
    raise exception 'FAIL 4b: attaching a verified source must re-run the gate and publish the post, got %; blockers = %',
      (select status from public.content_items where id = other_id),
      (select blockers from public.content_publication_readiness where id = other_id);
  end if;

  -- ---------------------------------------------------------------------
  -- 5. Deliberate holds are respected
  -- ---------------------------------------------------------------------
  insert into public.content_items (
    content_type, slug, title, excerpt, content_blocks, faqs,
    featured_image_asset_id, featured_image_alt, noindex, noindex_reason
  ) values (
    'blog_post', 'zzz-assertion-held-back',
    'An assertion post held back on purpose',
    'A summary long enough to double as a meta description, which needs at least seventy characters to pass the gate.',
    jsonb_build_array(jsonb_build_object('id', 'intro', 'type', 'paragraph', 'text', 'Held back. ' || filler)),
    jsonb_build_array(jsonb_build_object('id', 'faq1', 'question', 'Held?', 'answer', 'Yes.')),
    cdn_asset, 'Assertion fixture image', true, 'Held back by the assertion suite.'
  ) returning id into other_id;

  if (select status from public.content_items where id = other_id) <> 'draft' then
    raise exception 'FAIL 5a: noindex must hold a post back from auto-publication';
  end if;

  -- ---------------------------------------------------------------------
  -- 6. An image next/image cannot render blocks publication
  -- ---------------------------------------------------------------------
  insert into public.content_items (
    content_type, slug, title, excerpt, content_blocks, faqs,
    featured_image_asset_id, featured_image_alt
  ) values (
    'blog_post', 'zzz-assertion-offsite-image',
    'An assertion post with an offsite hero image',
    'A summary long enough to double as a meta description, which needs at least seventy characters to pass the gate.',
    jsonb_build_array(jsonb_build_object('id', 'intro', 'type', 'paragraph', 'text', 'Offsite image. ' || filler)),
    jsonb_build_array(jsonb_build_object('id', 'faq1', 'question', 'Offsite?', 'answer', 'Yes.')),
    offsite_asset, 'Offsite fixture image'
  ) returning id into other_id;

  select blockers into row_blockers from public.content_publication_readiness where id = other_id;
  if not (row_blockers @> array['Featured image must be hosted on align-the-spine.b-cdn.net so the site can render it.']) then
    raise exception 'FAIL 6a: an off-CDN featured image must block publication, got %', row_blockers;
  end if;

  -- ---------------------------------------------------------------------
  -- 7. publish_blog_post() does the whole job in one call
  -- ---------------------------------------------------------------------
  result := public.publish_blog_post(jsonb_build_object(
    'slug', 'zzz-assertion-rpc-post',
    'title', 'An assertion post created through the RPC',
    'excerpt', 'A summary long enough to double as a meta description, which needs at least seventy characters to pass.',
    'markdown', 'Opening paragraph for the RPC post. ' || filler || E'\n\n## A heading\n\n- one\n- two',
    'imageUrl', 'https://align-the-spine.b-cdn.net/images/zzz-assertion-fixture.jpg',
    'imageAlt', 'Assertion fixture image',
    'faqs', jsonb_build_array(jsonb_build_object('question', 'Did it publish?', 'answer', 'Yes.')),
    'keyTakeaways', jsonb_build_array('A takeaway.'),
    'categories', jsonb_build_array('zzz-assertion-category'),
    'tags', jsonb_build_array('zzz-assertion-tag')
  ));

  if (result->>'publiclyVisible')::boolean is not true then
    raise exception 'FAIL 7a: publish_blog_post should have gone live, got %', result;
  end if;
  if result->>'url' <> '/blog/zzz-assertion-rpc-post' then
    raise exception 'FAIL 7b: unexpected url %', result->>'url';
  end if;
  if not exists (select 1 from public.categories where slug = 'zzz-assertion-category') then
    raise exception 'FAIL 7c: publish_blog_post should create a missing category on demand';
  end if;
  if not exists (
    select 1 from public.content_tags ct join public.tags t on t.id = ct.tag_id
    where ct.content_id = (result->>'id')::uuid and t.slug = 'zzz-assertion-tag'
  ) then
    raise exception 'FAIL 7d: publish_blog_post should link the tag it was given';
  end if;

  -- Re-running the same slug edits that post instead of creating a second one.
  result := public.publish_blog_post(jsonb_build_object(
    'slug', 'zzz-assertion-rpc-post',
    'title', 'An assertion post edited through the RPC'
  ));
  if (select count(*) from public.content_items where slug = 'zzz-assertion-rpc-post') <> 1 then
    raise exception 'FAIL 7e: publish_blog_post must be idempotent on slug, found % rows',
      (select count(*) from public.content_items where slug = 'zzz-assertion-rpc-post');
  end if;
  if (select title from public.content_items where slug = 'zzz-assertion-rpc-post')
     <> 'An assertion post edited through the RPC' then
    raise exception 'FAIL 7f: the second call should have updated the title';
  end if;
  if (result->>'publiclyVisible')::boolean is not true then
    raise exception 'FAIL 7g: an edit must not knock a live post offline, got %', result;
  end if;

  -- ---------------------------------------------------------------------
  -- 8. Service areas keep their own workflow
  -- ---------------------------------------------------------------------
  insert into public.content_items (
    content_type, slug, title, excerpt, content_blocks, search_intent, audience,
    seo_title, meta_description, author_id, created_by, updated_by, service_area_evidence
  ) values (
    'service_area', 'zzz-assertion-service-area',
    'An assertion service area page',
    'A summary long enough to clear the forty character minimum on the excerpt column itself.',
    jsonb_build_array(jsonb_build_object('id', 'intro', 'type', 'paragraph', 'text', filler)),
    '', '', 'An assertion service area page',
    'A meta description long enough to clear the seventy character minimum that the gate enforces.',
    author, editor_id, editor_id, '{}'::jsonb
  ) returning id into other_id;

  if (select status from public.content_items where id = other_id) <> 'draft' then
    raise exception 'FAIL 8a: the auto-publish trigger must never touch a service_area row';
  end if;
  -- Left at the column default rather than recomputed: the service-area gate
  -- lives in lib/content/static-service-area-repository.ts, not in SQL.
  if (select gate_result->'blockers'->>0 from public.content_items where id = other_id)
     is distinct from 'Not checked' then
    raise exception 'FAIL 8b: service_area gate_result should be left at the column default, got %',
      (select gate_result from public.content_items where id = other_id);
  end if;

  raise notice 'All blog auto-publish assertions passed.';
end $$;

select 'assertions_passed' as result;

-- Nothing above survives: every row created here is discarded.
rollback;
