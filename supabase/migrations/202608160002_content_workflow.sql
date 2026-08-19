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

create or replace function public.complete_publication_event(
  target_event_id uuid,
  result_status text,
  targets jsonb,
  result_error_code text default null,
  result_error_detail text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if result_status not in ('succeeded', 'failed') then raise exception 'invalid_revalidation_status'; end if;
  update public.publication_events set
    revalidation_status = result_status,
    revalidation_targets = targets,
    error_code = result_error_code,
    error_detail = left(result_error_detail, 500)
  where id = target_event_id and actor_id = auth.uid() and revalidation_status = 'pending';
  if not found then raise exception 'event_not_found_or_not_owned' using errcode = '42501'; end if;
end;
$$;

revoke all on function public.transition_content(uuid, integer, public.content_status, text) from public;
revoke all on function public.complete_publication_event(uuid, text, jsonb, text, text) from public;
grant execute on function public.transition_content(uuid, integer, public.content_status, text) to authenticated;
grant execute on function public.complete_publication_event(uuid, text, jsonb, text, text) to authenticated;

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

  saved_version := item.version + 1;
  update public.content_items set
    title = patch->>'title',
    excerpt = patch->>'excerpt',
    direct_answer = patch->>'directAnswer',
    content_blocks = patch->'blocks',
    seo_title = patch->>'seoTitle',
    meta_description = patch->>'metaDescription',
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

