-- Reverts 202609270001_blog_writer_self_publish.sql: restores the clinician
-- review handoff for blog posts.
--
-- Both functions below are the verbatim prior definitions —
-- `transition_content` from 202608160002_content_workflow.sql and
-- `save_content_draft` from 202608180004_content_featured_image_url.sql — plus
-- the original `content_editor_update_drafts` policy from
-- 202608160001_content_platform.sql. Nothing about the data is rewritten:
-- 202609270001 changed only function bodies and one policy, so restoring them
-- restores the prior behavior exactly.
--
-- Blog posts published solo while 202609270001 was live stay published. That is
-- intentional: they are a record of what actually happened. To unpublish one,
-- archive it through the editor. Note that reverting here also reinstates the
-- draft/in_review-only edit rule, so a published post becomes admin-only to
-- change again.

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

  allowed := case item.status
    when 'draft' then target_status = 'in_review'
    when 'in_review' then target_status in ('draft', 'approved')
    when 'approved' then target_status in ('draft', 'scheduled', 'published')
    when 'scheduled' then target_status in ('approved', 'published')
    when 'published' then target_status = 'archived'
    when 'archived' then target_status = 'draft'
    else false end;
  if not allowed then raise exception 'illegal_transition'; end if;

  if target_status = 'approved' then
    if actor_role not in ('admin', 'clinician_reviewer') then raise exception 'reviewer_required' using errcode = '42501'; end if;
    if item.medical_review_required and item.updated_by = actor then raise exception 'self_approval_forbidden' using errcode = '42501'; end if;
  end if;
  if target_status in ('scheduled', 'published', 'archived') and actor_role <> 'admin' then
    raise exception 'admin_required' using errcode = '42501';
  end if;
  if target_status in ('scheduled', 'published') then
    if coalesce((item.gate_result->>'passed')::boolean, false) = false then raise exception 'publication_gates_failed'; end if;
    if item.noindex then raise exception 'index_decision_blocked'; end if;
    if item.medical_review_required and (item.clinician_reviewer_id is null or item.clinician_reviewed_at is null) then raise exception 'clinical_review_required'; end if;
  end if;

  insert into public.content_revisions(content_id, source_version, snapshot, editor_id, change_note)
  values (item.id, item.version, to_jsonb(item), actor, transition_reason);

  update public.content_items set
    status = target_status,
    clinician_reviewer_id = case when target_status = 'approved' then actor else clinician_reviewer_id end,
    clinician_reviewed_at = case when target_status = 'approved' then now() else clinician_reviewed_at end,
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
  if item.status not in ('draft', 'in_review') then raise exception 'item_not_editable'; end if;

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

drop policy if exists content_editor_update_drafts on public.content_items;
create policy content_editor_update_drafts on public.content_items for update to authenticated
  using (public.current_editorial_role() in ('admin', 'editor') and status in ('draft', 'in_review'))
  with check (public.current_editorial_role() in ('admin', 'editor') and updated_by = auth.uid());
