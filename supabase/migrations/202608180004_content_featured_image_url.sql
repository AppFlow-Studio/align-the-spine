-- Additive to 202608180003. The editorial admin form now has a plain
-- "featured image URL" text field (owner direction 2026-08-18: "there will
-- be a field for a cdn link for the hero section to upload from the blog
-- CMS") — no asset-management/upload UI exists yet, so an editor pastes an
-- already-hosted CDN URL directly rather than uploading a file. When set,
-- save_content_draft either updates the item's existing linked asset row
-- (if one exists) or creates one and links it, so a re-save doesn't pile up
-- orphaned asset rows on every autosave tick.
--
-- width/height are placeholder values (1600x1000, this site's standard
-- hero aspect) rather than the image's real dimensions — there's no
-- upload pipeline here to read them from the actual file. Fine for a
-- v1 CDN-link field; a real asset-management UI would replace this.

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
