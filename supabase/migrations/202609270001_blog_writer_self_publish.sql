-- Blog writers own their own posts end to end: no clinician review step, no
-- second approver, no admin handoff.
--
-- 202609220001 flipped `medical_review_required` to false so the two reviewer
-- checks inside `transition_content` short-circuit, but three separate blocks
-- still forced a blog post through other people's accounts:
--
--   * `draft` could only go to `in_review` — the review handoff itself;
--   * `approved` required role `admin` or `clinician_reviewer`;
--   * `scheduled`/`published`/`archived` required role `admin`.
--
-- Owner direction 2026-09-27: the blog writers are coworkers with full
-- ownership of blog content, so this replaces `transition_content`
-- (202608160002) with a version where any active editorial account may carry
-- its own `blog_post` from draft straight to published — regardless of
-- `medical_review_required`, which blog posts no longer read at all.
--
-- `content_type = 'service_area'` keeps the original rules verbatim: those
-- rows carry the local-evidence gate documented in
-- lib/content/static-service-area-repository.ts and are not what this change
-- is about.
--
-- The SEO/quality gate is untouched. `gate_result->>'passed'` and
-- `noindex = false` are still enforced here and by `is_public_content()`, so a
-- thin, unsourced, or image-less post remains unpublishable and publicly
-- unreachable. Only the human review handoff is gone.
--
-- One deliberate behavior change beyond the role checks: approving a
-- `blog_post` no longer stamps `clinician_reviewer_id`/`clinician_reviewed_at`
-- with the acting account. That stamp is what
-- components/content/blog-article-hero.tsx renders as "Clinically reviewed
-- by <name>", and a writer approving their own post must not publish that
-- claim about it. Service-area rows keep the stamp.

create or replace function public.transition_content(
  target_id uuid,
  expected_version integer,
  target_status public.content_status,
  transition_reason text
)
returns table (event_id uuid, content_type public.content_type, slug text, old_slug text, from_status public.content_status, to_status public.content_status)
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
  actor_role public.editorial_role;
  item public.content_items%rowtype;
  writer_owned boolean;
  allowed boolean := false;
  created_event uuid;
begin
  if actor is null then raise exception 'authentication_required' using errcode = '42501'; end if;
  select role into actor_role from public.profiles where id = actor and active = true;
  if actor_role is null then raise exception 'inactive_editor' using errcode = '42501'; end if;
  if nullif(trim(transition_reason), '') is null then raise exception 'reason_required'; end if;

  select * into item from public.content_items where id = target_id for update;
  if not found then raise exception 'content_not_found' using errcode = 'P0002'; end if;
  if item.version <> expected_version then raise exception 'version_conflict' using errcode = '40001'; end if;

  writer_owned := item.content_type = 'blog_post';

  if writer_owned then
    -- `in_review` and `approved` stay reachable for anyone who wants to use
    -- them, but nothing forces a post through either one.
    allowed := case item.status
      when 'draft' then target_status in ('in_review', 'approved', 'scheduled', 'published')
      when 'in_review' then target_status in ('draft', 'approved', 'scheduled', 'published')
      when 'approved' then target_status in ('draft', 'scheduled', 'published')
      when 'scheduled' then target_status in ('draft', 'approved', 'published')
      when 'published' then target_status = 'archived'
      when 'archived' then target_status = 'draft'
      else false end;
  else
    allowed := case item.status
      when 'draft' then target_status = 'in_review'
      when 'in_review' then target_status in ('draft', 'approved')
      when 'approved' then target_status in ('draft', 'scheduled', 'published')
      when 'scheduled' then target_status in ('approved', 'published')
      when 'published' then target_status = 'archived'
      when 'archived' then target_status = 'draft'
      else false end;
  end if;
  if not allowed then raise exception 'illegal_transition'; end if;

  if writer_owned then
    -- The same roles that may write a post may publish it. `lead_manager` is
    -- CRM-only and still has no editorial power.
    if actor_role not in ('admin', 'editor', 'clinician_reviewer') then
      raise exception 'editor_required' using errcode = '42501';
    end if;
  else
    if target_status = 'approved' then
      if actor_role not in ('admin', 'clinician_reviewer') then raise exception 'reviewer_required' using errcode = '42501'; end if;
      if item.medical_review_required and item.updated_by = actor then raise exception 'self_approval_forbidden' using errcode = '42501'; end if;
    end if;
    if target_status in ('scheduled', 'published', 'archived') and actor_role <> 'admin' then
      raise exception 'admin_required' using errcode = '42501';
    end if;
  end if;

  if target_status in ('scheduled', 'published') then
    if coalesce((item.gate_result->>'passed')::boolean, false) = false then raise exception 'publication_gates_failed'; end if;
    if item.noindex then raise exception 'index_decision_blocked'; end if;
    if not writer_owned and item.medical_review_required and (item.clinician_reviewer_id is null or item.clinician_reviewed_at is null) then
      raise exception 'clinical_review_required';
    end if;
  end if;

  insert into public.content_revisions(content_id, source_version, snapshot, editor_id, change_note)
  values (item.id, item.version, to_jsonb(item), actor, transition_reason);

  update public.content_items set
    status = target_status,
    clinician_reviewer_id = case when target_status = 'approved' and not writer_owned then actor else clinician_reviewer_id end,
    clinician_reviewed_at = case when target_status = 'approved' and not writer_owned then now() else clinician_reviewed_at end,
    published_at = case when target_status = 'published' then coalesce(published_at, now()) else published_at end,
    noindex = case when target_status = 'archived' then true else noindex end,
    noindex_reason = case when target_status = 'archived' then 'Archived by an administrator.' else noindex_reason end,
    updated_by = actor,
    version = version + 1,
    updated_at = now()
  where id = item.id;

  insert into public.publication_events(content_id, actor_id, from_status, to_status, reason, resulting_path, revalidation_status)
  values (item.id, actor, item.status, target_status, transition_reason,
    case item.content_type when 'blog_post' then '/blog/' || item.slug::text else '/service-areas/' || item.slug::text end,
    case when target_status in ('published', 'archived') then 'pending' else 'not_required' end)
  returning id into created_event;

  return query select created_event, item.content_type, item.slug::text, item.slug::text, item.status, target_status;
end;
$$;

revoke all on function public.transition_content(uuid, integer, public.content_status, text) from public;
grant execute on function public.transition_content(uuid, integer, public.content_status, text) to authenticated;

-- A writer also has to be able to keep editing a post they already published,
-- otherwise "publish it yourself" ends at the first typo. `save_content_draft`
-- (202608180004) refused anything outside draft/in_review; blog posts are now
-- editable in any status. The quality gate is unchanged: the function still
-- recomputes `gate_result` on every save, and a published row whose gate stops
-- passing drops out of `is_public_content()` on its own.
create or replace function public.save_content_draft(
  target_id uuid,
  expected_version integer,
  patch jsonb,
  change_note text,
  next_gate_result jsonb
)
returns table (new_version integer, saved_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
  actor_role public.editorial_role;
  item public.content_items%rowtype;
  saved_version integer;
  saved_time timestamptz := now();
  image_url text := nullif(trim(patch->>'featuredImageUrl'), '');
  image_alt text := coalesce(nullif(trim(patch->>'featuredImageAlt'), ''), '');
  linked_asset_id uuid;
begin
  select role into actor_role from public.profiles where id = actor and active = true;
  if actor_role not in ('admin', 'editor') then raise exception 'editor_required' using errcode = '42501'; end if;
  if nullif(trim(change_note), '') is null then raise exception 'change_note_required'; end if;
  select * into item from public.content_items where id = target_id for update;
  if not found then raise exception 'content_not_found' using errcode = 'P0002'; end if;
  if item.version <> expected_version then raise exception 'version_conflict' using errcode = '40001'; end if;
  if item.content_type <> 'blog_post' and item.status not in ('draft', 'in_review') then
    raise exception 'item_not_editable';
  end if;

  insert into public.content_revisions(content_id, source_version, snapshot, editor_id, change_note)
  values (item.id, item.version, to_jsonb(item), actor, change_note);

  linked_asset_id := item.featured_image_asset_id;
  if image_url is not null then
    if linked_asset_id is not null then
      update public.assets set url = image_url, alt = image_alt, updated_at = saved_time
      where id = linked_asset_id;
    else
      insert into public.assets (url, provider, mime_type, width, height, alt, approval_state, created_by)
      values (image_url, 'bunny_cdn', 'image/jpeg', 1600, 1000, image_alt, 'approved', actor)
      returning id into linked_asset_id;
    end if;
  end if;

  saved_version := item.version + 1;
  update public.content_items set
    title = patch->>'title',
    excerpt = patch->>'excerpt',
    direct_answer = patch->>'directAnswer',
    key_takeaways = coalesce(patch->'keyTakeaways', '[]'::jsonb),
    faqs = coalesce(patch->'faqs', '[]'::jsonb),
    content_blocks = patch->'blocks',
    seo_title = patch->>'seoTitle',
    meta_description = patch->>'metaDescription',
    og_title = nullif(patch->>'ogTitle', ''),
    og_description = nullif(patch->>'ogDescription', ''),
    featured_image_asset_id = linked_asset_id,
    featured_image_alt = nullif(image_alt, ''),
    featured = coalesce((patch->>'featured')::boolean, item.featured),
    medical_review_required = coalesce((patch->>'medicalReviewRequired')::boolean, item.medical_review_required),
    noindex = coalesce((patch->>'noindex')::boolean, item.noindex),
    noindex_reason = nullif(patch->>'noindexReason', ''),
    gate_result = next_gate_result,
    updated_by = actor,
    updated_at = saved_time,
    version = saved_version
  where id = item.id;
  return query select saved_version, saved_time;
end;
$$;

revoke all on function public.save_content_draft(uuid, integer, jsonb, text, jsonb) from public;
grant execute on function public.save_content_draft(uuid, integer, jsonb, text, jsonb) to authenticated;

-- RLS caught up with the same rule. `content_editor_update_drafts`
-- (202608160001) only allowed direct UPDATEs on draft/in_review rows. Both RPCs
-- above are security definer so the policy never blocked them, but any
-- non-RPC write path (a future editor UI, a dashboard query) would hit it.
drop policy if exists content_editor_update_drafts on public.content_items;
create policy content_editor_update_drafts on public.content_items for update to authenticated
  using (
    public.current_editorial_role() in ('admin', 'editor')
    and (content_type = 'blog_post' or status in ('draft', 'in_review'))
  )
  with check (public.current_editorial_role() in ('admin', 'editor') and updated_by = auth.uid());
