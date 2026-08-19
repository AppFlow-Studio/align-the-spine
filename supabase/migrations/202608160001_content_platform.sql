-- Align the Spine editorial content platform.
-- Editorial data only: never store patient/lead/appointment/claim/diagnosis fields here.

create extension if not exists citext;
create extension if not exists pgcrypto;

create type public.editorial_role as enum ('admin', 'editor', 'clinician_reviewer');
create type public.content_type as enum ('blog_post', 'service_area');
create type public.content_status as enum ('draft', 'in_review', 'approved', 'scheduled', 'published', 'archived');
create type public.asset_provider as enum ('local', 'bunny_cdn', 'approved_external');
create type public.approval_state as enum ('pending', 'approved', 'rejected');
create type public.source_verification as enum ('pending', 'verified', 'expired');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 120),
  email citext not null unique,
  role public.editorial_role not null default 'editor',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.authors (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique check (slug::text ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  credentials text,
  short_bio text not null,
  full_bio text,
  portrait_asset_id uuid,
  profile_url text not null,
  external_urls jsonb not null default '[]'::jsonb check (jsonb_typeof(external_urls) = 'array'),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  url text not null unique check (url !~* '^javascript:'),
  provider public.asset_provider not null,
  mime_type text not null,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  duration_seconds numeric check (duration_seconds is null or duration_seconds >= 0),
  alt text not null default '',
  caption text,
  attribution text,
  approval_state public.approval_state not null default 'pending',
  focal_x numeric check (focal_x is null or focal_x between 0 and 1),
  focal_y numeric check (focal_y is null or focal_y between 0 and 1),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.authors
  add constraint authors_portrait_asset_fk foreign key (portrait_asset_id) references public.assets(id) on delete set null;

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  content_type public.content_type not null,
  slug citext not null unique check (slug::text ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 12 and 180),
  excerpt text not null check (char_length(excerpt) between 40 and 500),
  content_blocks jsonb not null default '[]'::jsonb check (jsonb_typeof(content_blocks) = 'array'),
  status public.content_status not null default 'draft',
  featured boolean not null default false,
  primary_keyword text,
  search_intent text not null,
  audience text not null,
  seo_title text not null,
  meta_description text not null,
  canonical_override text check (canonical_override is null or canonical_override ~ '^https://'),
  og_title text,
  og_description text,
  og_image_asset_id uuid references public.assets(id) on delete set null,
  featured_image_asset_id uuid references public.assets(id) on delete set null,
  featured_image_alt text,
  featured_image_decorative boolean not null default false,
  author_id uuid not null references public.authors(id),
  clinician_reviewer_id uuid references public.profiles(id),
  clinician_reviewed_at timestamptz,
  medical_review_required boolean not null default true,
  published_at timestamptz,
  scheduled_for timestamptz,
  last_substantive_review_at timestamptz,
  created_by uuid not null references public.profiles(id),
  updated_by uuid not null references public.profiles(id),
  noindex boolean not null default true,
  noindex_reason text,
  schema_overrides jsonb,
  direct_answer text not null default '',
  emergency_guidance_relevant boolean not null default false,
  toc_enabled boolean not null default true,
  series_name text,
  service_area_evidence jsonb,
  gate_result jsonb not null default '{"passed":false,"blockers":["Not checked"],"recommendations":[]}'::jsonb,
  version integer not null default 1 check (version > 0),
  search_document tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint noindex_reason_required check (not noindex or nullif(trim(noindex_reason), '') is not null),
  constraint schedule_time_required check (status <> 'scheduled' or scheduled_for is not null),
  constraint publish_time_required check (status <> 'published' or published_at is not null),
  constraint clinical_review_pair check (
    (clinician_reviewer_id is null and clinician_reviewed_at is null) or
    (clinician_reviewer_id is not null and clinician_reviewed_at is not null)
  ),
  constraint service_area_evidence_required check (content_type <> 'service_area' or service_area_evidence is not null)
);

create index content_items_public_idx on public.content_items (content_type, status, published_at desc);
create index content_items_updated_idx on public.content_items (updated_at desc);
create index content_items_author_idx on public.content_items (author_id);
create index content_items_search_idx on public.content_items using gin (search_document);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique check (slug::text ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name citext not null unique,
  description text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique check (slug::text ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name citext not null unique,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.content_categories (
  content_id uuid not null references public.content_items(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  primary key (content_id, category_id)
);

create table public.content_tags (
  content_id uuid not null references public.content_items(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete restrict,
  primary key (content_id, tag_id)
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  publisher text not null,
  url text not null check (url ~ '^https://'),
  source_type text not null,
  publication_date date,
  updated_date date,
  accessed_date date not null,
  geography text,
  statistic_period text,
  notes text,
  primary_source boolean not null,
  verification_status public.source_verification not null default 'pending',
  recheck_date date,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.content_sources (
  content_id uuid not null references public.content_items(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete restrict,
  block_id text,
  claim_supported text not null,
  primary key (content_id, source_id, claim_supported)
);

create table public.content_relations (
  source_content_id uuid not null references public.content_items(id) on delete cascade,
  target_content_id uuid not null references public.content_items(id) on delete cascade,
  relation_type text not null check (relation_type in ('article', 'service', 'condition', 'service_area')),
  sort_order integer not null default 0,
  primary key (source_content_id, target_content_id, relation_type),
  check (source_content_id <> target_content_id)
);

create table public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.content_items(id) on delete cascade,
  source_version integer not null,
  snapshot jsonb not null,
  editor_id uuid not null references public.profiles(id),
  change_note text not null,
  rollback_target_revision_id uuid references public.content_revisions(id),
  created_at timestamptz not null default now(),
  unique (content_id, source_version)
);

create table public.redirects (
  id uuid primary key default gen_random_uuid(),
  from_path citext not null unique check (from_path::text ~ '^/'),
  to_path text not null check (to_path ~ '^/'),
  status_code integer not null default 301 check (status_code in (301, 308)),
  content_id uuid references public.content_items(id) on delete set null,
  active boolean not null default true,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  check (from_path::text <> to_path)
);

create table public.publication_events (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.content_items(id) on delete cascade,
  actor_id uuid not null references public.profiles(id),
  from_status public.content_status not null,
  to_status public.content_status not null,
  reason text not null,
  resulting_path text,
  revalidation_status text not null default 'pending' check (revalidation_status in ('pending', 'succeeded', 'failed', 'not_required')),
  revalidation_targets jsonb not null default '[]'::jsonb,
  error_code text,
  error_detail text,
  created_at timestamptz not null default now()
);

create index revisions_content_idx on public.content_revisions (content_id, created_at desc);
create index publication_events_content_idx on public.publication_events (content_id, created_at desc);
create index content_categories_category_idx on public.content_categories (category_id, content_id);
create index content_tags_tag_idx on public.content_tags (tag_id, content_id);
create index content_sources_source_idx on public.content_sources (source_id, content_id);

create or replace function public.current_editorial_role()
returns public.editorial_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and active = true;
$$;

revoke all on function public.current_editorial_role() from public;
grant execute on function public.current_editorial_role() to authenticated;

-- Expose only the reviewer display name needed by published pages. Anonymous
-- readers never receive profile email addresses, roles, or other profile rows.
create or replace function public.public_reviewer_name(profile_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select display_name
  from public.profiles
  where id = profile_id and active = true
  limit 1;
$$;

revoke all on function public.public_reviewer_name(uuid) from public;
grant execute on function public.public_reviewer_name(uuid) to anon, authenticated;

create or replace function public.is_public_content(item public.content_items)
returns boolean
language sql
stable
as $$
  select item.status = 'published'
    and item.published_at <= now()
    and item.noindex = false
    and coalesce((item.gate_result->>'passed')::boolean, false) = true;
$$;

-- Public view excludes editorial planning, canonical overrides, actor IDs and version.
create view public.public_content_items
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
  ) end as featured_image
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

alter table public.profiles enable row level security;
alter table public.authors enable row level security;
alter table public.assets enable row level security;
alter table public.content_items enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.content_categories enable row level security;
alter table public.content_tags enable row level security;
alter table public.sources enable row level security;
alter table public.content_sources enable row level security;
alter table public.content_relations enable row level security;
alter table public.content_revisions enable row level security;
alter table public.redirects enable row level security;
alter table public.publication_events enable row level security;

create policy profiles_read_self_or_admin on public.profiles for select to authenticated
  using (id = auth.uid() or public.current_editorial_role() = 'admin');
create policy profiles_admin_all on public.profiles for all to authenticated
  using (public.current_editorial_role() = 'admin') with check (public.current_editorial_role() = 'admin');

create policy authors_public_read on public.authors for select to anon, authenticated using (active = true);
create policy authors_editor_write on public.authors for all to authenticated
  using (public.current_editorial_role() in ('admin', 'editor'))
  with check (public.current_editorial_role() in ('admin', 'editor'));

create policy assets_public_read on public.assets for select to anon, authenticated using (approval_state = 'approved');
create policy assets_editor_write on public.assets for all to authenticated
  using (public.current_editorial_role() in ('admin', 'editor'))
  with check (public.current_editorial_role() in ('admin', 'editor'));

create policy content_public_read on public.content_items for select to anon, authenticated
  using (public.is_public_content(content_items));
create policy content_editor_read on public.content_items for select to authenticated
  using (public.current_editorial_role() in ('admin', 'editor', 'clinician_reviewer'));
create policy content_editor_insert on public.content_items for insert to authenticated
  with check (public.current_editorial_role() in ('admin', 'editor') and created_by = auth.uid() and updated_by = auth.uid());
create policy content_editor_update_drafts on public.content_items for update to authenticated
  using (public.current_editorial_role() in ('admin', 'editor') and status in ('draft', 'in_review'))
  with check (public.current_editorial_role() in ('admin', 'editor') and updated_by = auth.uid());
create policy content_reviewer_update on public.content_items for update to authenticated
  using (public.current_editorial_role() in ('admin', 'clinician_reviewer'))
  with check (public.current_editorial_role() in ('admin', 'clinician_reviewer'));

-- These policies exist solely so the security-invoker public view can resolve
-- visible taxonomy, citation, and related-content data. They reveal nothing
-- attached only to drafts or scheduled-future content.
create policy categories_public_read on public.categories for select to anon
  using (active = true);
create policy tags_public_read on public.tags for select to anon
  using (active = true);
create policy content_categories_public_read on public.content_categories for select to anon
  using (exists (
    select 1 from public.content_items ci
    where ci.id = content_id and public.is_public_content(ci)
  ));
create policy content_tags_public_read on public.content_tags for select to anon
  using (exists (
    select 1 from public.content_items ci
    where ci.id = content_id and public.is_public_content(ci)
  ));
create policy sources_public_read on public.sources for select to anon
  using (verification_status = 'verified' and exists (
    select 1
    from public.content_sources cs
    join public.content_items ci on ci.id = cs.content_id
    where cs.source_id = sources.id and public.is_public_content(ci)
  ));
create policy content_sources_public_read on public.content_sources for select to anon
  using (exists (
    select 1
    from public.content_items ci
    join public.sources s on s.id = source_id and s.verification_status = 'verified'
    where ci.id = content_id and public.is_public_content(ci)
  ));
create policy content_relations_public_read on public.content_relations for select to anon
  using (
    exists (select 1 from public.content_items source where source.id = source_content_id and public.is_public_content(source))
    and exists (select 1 from public.content_items target where target.id = target_content_id and public.is_public_content(target))
  );

-- Supporting editorial tables: public receives no direct grants. Authenticated reads require an active role.
do $$
declare tbl text;
begin
  foreach tbl in array array['categories','tags','content_categories','content_tags','sources','content_sources','content_relations','redirects']
  loop
    execute format('create policy %I on public.%I for select to authenticated using (public.current_editorial_role() is not null)', tbl || '_editor_read', tbl);
    execute format('create policy %I on public.%I for all to authenticated using (public.current_editorial_role() in (''admin'', ''editor'')) with check (public.current_editorial_role() in (''admin'', ''editor''))', tbl || '_editor_write', tbl);
  end loop;
end $$;

create policy revisions_editor_read on public.content_revisions for select to authenticated
  using (public.current_editorial_role() is not null);
create policy revisions_append_only on public.content_revisions for insert to authenticated
  with check (public.current_editorial_role() is not null and editor_id = auth.uid());
create policy events_editor_read on public.publication_events for select to authenticated
  using (public.current_editorial_role() is not null);
create policy events_append_only on public.publication_events for insert to authenticated
  with check (public.current_editorial_role() is not null and actor_id = auth.uid());

revoke all on all tables in schema public from anon;
grant select on public.authors, public.assets, public.content_items, public.categories, public.tags,
  public.content_categories, public.content_tags, public.sources, public.content_sources,
  public.content_relations, public.public_content_items to anon;
grant select, insert, update on public.profiles, public.authors, public.assets, public.content_items,
  public.categories, public.tags, public.content_categories, public.content_tags, public.sources,
  public.content_sources, public.content_relations, public.redirects to authenticated;
grant select, insert on public.content_revisions, public.publication_events to authenticated;
grant select on public.public_content_items to authenticated;
