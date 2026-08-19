-- Additive to 202608160001/202608160002. Adds structured Key Takeaways
-- (bullet summary) and FAQs (Q&A accordion, mirrored into FAQPage JSON-LD)
-- to content_items, so both are real editable/publishable fields instead of
-- being folded into direct_answer or content_blocks. Owner direction
-- 2026-08-18: every blog post should carry both, enforced going forward via
-- evaluatePublicationGates (lib/content/publication-gates.ts) rather than
-- at the database layer, so existing published rows are unaffected until
-- they're next edited and re-saved through the editorial flow.

alter table public.content_items
  add column key_takeaways jsonb not null default '[]'::jsonb,
  add column faqs jsonb not null default '[]'::jsonb;

alter table public.content_items
  add constraint content_items_key_takeaways_is_array
    check (jsonb_typeof(key_takeaways) = 'array'),
  add constraint content_items_faqs_is_array
    check (jsonb_typeof(faqs) = 'array');

-- Re-create the public view to also expose the two new columns. Full body
-- copied from 202608160001_content_platform.sql with key_takeaways/faqs
-- inserted after direct_answer.
create or replace view public.public_content_items
with (security_invoker = true)
as
select
  ci.id,
  ci.content_type,
  ci.slug::text as slug,
  ci.title,
  ci.excerpt,
  ci.content_blocks as blocks,
  ci.status,
  ci.featured,
  ci.seo_title,
  ci.meta_description,
  ci.og_title,
  ci.og_description,
  ci.og_image_asset_id,
  ci.featured_image_asset_id,
  ci.featured_image_alt,
  ci.featured_image_decorative,
  ci.author_id,
  ci.clinician_reviewer_id,
  public.public_reviewer_name(ci.clinician_reviewer_id) as clinician_reviewer_name,
  ci.clinician_reviewed_at,
  ci.medical_review_required,
  ci.published_at,
  ci.created_at,
  ci.updated_at,
  ci.last_substantive_review_at,
  ci.noindex,
  ci.noindex_reason,
  ci.direct_answer,
  ci.emergency_guidance_relevant,
  ci.service_area_evidence as service_area,
  ci.gate_result,
  coalesce((
    select jsonb_agg(to_jsonb(s) || jsonb_build_object(
      'block_id', cs.block_id,
      'claim_supported', cs.claim_supported
    ) order by s.publisher, s.title)
    from public.content_sources cs
    join public.sources s on s.id = cs.source_id
    where cs.content_id = ci.id and s.verification_status = 'verified'
  ), '[]'::jsonb) as sources,
  coalesce((
    select array_agg(cr.target_content_id::text order by cr.sort_order)
    from public.content_relations cr
    join public.content_items target on target.id = cr.target_content_id
    where cr.source_content_id = ci.id and public.is_public_content(target)
  ), '{}') as related_content_ids,
  ci.search_document,
  coalesce(array_agg(distinct c.slug::text) filter (where c.slug is not null), '{}') as category_slugs,
  coalesce(array_agg(distinct t.slug::text) filter (where t.slug is not null), '{}') as tag_slugs,
  jsonb_build_object(
    'id', a.id, 'slug', a.slug::text, 'name', a.name, 'credentials', a.credentials,
    'shortBio', a.short_bio, 'portraitUrl', portrait.url, 'profileUrl', a.profile_url, 'active', a.active
  ) as author,
  case when featured.id is null then null else jsonb_build_object(
    'id', featured.id, 'url', featured.url, 'provider', featured.provider,
    'mimeType', featured.mime_type, 'width', featured.width, 'height', featured.height,
    'alt', featured.alt, 'caption', featured.caption, 'attribution', featured.attribution,
    'approvalState', featured.approval_state, 'focalX', featured.focal_x, 'focalY', featured.focal_y
  ) end as featured_image,
  ci.key_takeaways,
  ci.faqs
from public.content_items ci
join public.authors a on a.id = ci.author_id and a.active = true
left join public.assets portrait on portrait.id = a.portrait_asset_id
left join public.assets featured on featured.id = ci.featured_image_asset_id and featured.approval_state = 'approved'
left join public.content_categories cc on cc.content_id = ci.id
left join public.categories c on c.id = cc.category_id and c.active = true
left join public.content_tags ct on ct.content_id = ci.id
left join public.tags t on t.id = ct.tag_id and t.active = true
where public.is_public_content(ci)
group by ci.id, a.id, portrait.id, featured.id;

-- Re-create save_content_draft so editorial saves can persist the two new
-- fields. Body otherwise identical to 202608160002_content_workflow.sql.
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
    key_takeaways = coalesce(patch->'keyTakeaways', '[]'::jsonb),
    faqs = coalesce(patch->'faqs', '[]'::jsonb),
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
