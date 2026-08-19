-- First-party lead CRM and attribution. Additive to content migrations 001/002.
-- Patient leads never enter editorial content tables.

alter type public.editorial_role add value if not exists 'lead_manager';

create or replace function public.current_editorial_role()
returns public.editorial_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles
  where id = auth.uid() and active = true
    and role::text in ('admin','editor','clinician_reviewer');
$$;

-- Migration 001 used "role is not null" for several editorial read policies.
-- Once lead_manager exists that would unintentionally expose draft sources,
-- revisions, redirects, and audit events. Recreate only those read policies
-- with the original three editorial roles; existing editorial access is unchanged.
do $$
declare tbl text;
begin
  foreach tbl in array array['categories','tags','content_categories','content_tags','sources','content_sources','content_relations','redirects']
  loop
    execute format('drop policy if exists %I on public.%I', tbl || '_editor_read', tbl);
    execute format('create policy %I on public.%I for select to authenticated using (public.current_editorial_role()::text in (''admin'',''editor'',''clinician_reviewer''))', tbl || '_editor_read', tbl);
  end loop;
end $$;
drop policy if exists revisions_editor_read on public.content_revisions;
create policy revisions_editor_read on public.content_revisions for select to authenticated
  using (public.current_editorial_role()::text in ('admin','editor','clinician_reviewer'));
drop policy if exists revisions_append_only on public.content_revisions;
create policy revisions_append_only on public.content_revisions for insert to authenticated
  with check (public.current_editorial_role()::text in ('admin','editor','clinician_reviewer') and editor_id = auth.uid());
drop policy if exists events_editor_read on public.publication_events;
create policy events_editor_read on public.publication_events for select to authenticated
  using (public.current_editorial_role()::text in ('admin','editor','clinician_reviewer'));
drop policy if exists events_append_only on public.publication_events;
create policy events_append_only on public.publication_events for insert to authenticated
  with check (public.current_editorial_role()::text in ('admin','editor','clinician_reviewer') and actor_id = auth.uid());

create type public.lead_status as enum ('new', 'contacted', 'qualified', 'scheduled', 'closed', 'spam');
create type public.lead_priority as enum ('high', 'standard');
create type public.lead_intent as enum ('general', 'car_accident');

create table public.form_definitions (
  form_id text not null check (form_id ~ '^[A-Za-z][A-Za-z0-9]*$'),
  version integer not null check (version > 0),
  field_contract jsonb not null check (jsonb_typeof(field_contract) = 'array'),
  consent_version text not null,
  consent_wording text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (form_id, version)
);

create table public.lead_submissions (
  id uuid primary key default gen_random_uuid(),
  client_submission_id uuid not null unique,
  form_id text not null,
  form_version integer not null,
  contact_fields jsonb not null check (jsonb_typeof(contact_fields) = 'object'),
  status public.lead_status not null default 'new',
  priority public.lead_priority not null,
  intent public.lead_intent not null,
  source_page_path text not null check (source_page_path ~ '^/' and source_page_path !~ '[?#]'),
  delivery_status text not null default 'pending' check (delivery_status in ('pending', 'partial', 'delivered', 'failed')),
  submitted_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (form_id, form_version) references public.form_definitions(form_id, version)
);

create table public.lead_attribution (
  lead_id uuid primary key references public.lead_submissions(id) on delete cascade,
  initial_landing_path text check (initial_landing_path is null or (initial_landing_path ~ '^/' and initial_landing_path !~ '[?#]')),
  latest_landing_path text check (latest_landing_path is null or (latest_landing_path ~ '^/' and latest_landing_path !~ '[?#]')),
  referrer_host text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  utm_id text,
  gclid text,
  gbraid text,
  wbraid text,
  dclid text,
  msclkid text,
  fbclid text,
  fbc text,
  fbp text,
  ttclid text,
  li_fat_id text,
  ga_client_id text,
  ga_session_id text,
  ga_session_number integer check (ga_session_number is null or ga_session_number >= 0),
  created_at timestamptz not null default now()
);

create table public.lead_sensitive_payloads (
  lead_id uuid primary key references public.lead_submissions(id) on delete cascade,
  ciphertext bytea not null,
  iv bytea not null check (octet_length(iv) = 12),
  auth_tag bytea not null check (octet_length(auth_tag) = 16),
  key_version integer not null check (key_version > 0),
  field_names text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.lead_consent_receipts (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.lead_submissions(id) on delete cascade,
  consent_version text not null,
  wording text not null,
  channel text not null check (channel in ('web_form', 'phone', 'administrative')),
  granted boolean not null,
  recorded_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.lead_status_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.lead_submissions(id) on delete cascade,
  from_status public.lead_status,
  to_status public.lead_status not null,
  actor_id uuid references public.profiles(id),
  reason text not null check (char_length(reason) between 2 and 500),
  created_at timestamptz not null default now()
);

-- HMAC-derived request fingerprints only; never raw IP addresses.
create table public.lead_rate_limits (
  fingerprint text not null,
  window_started_at timestamptz not null,
  request_count integer not null default 1 check (request_count > 0),
  primary key (fingerprint, window_started_at)
);

create index lead_submissions_created_idx on public.lead_submissions (created_at desc);
create index lead_submissions_filters_idx on public.lead_submissions (status, priority, intent, form_id, created_at desc);
create index lead_attribution_campaign_idx on public.lead_attribution (utm_source, utm_medium, utm_campaign);
create index lead_status_events_timeline_idx on public.lead_status_events (lead_id, created_at desc);
create index lead_consent_receipts_lead_idx on public.lead_consent_receipts (lead_id, recorded_at desc);

insert into public.form_definitions (form_id, version, field_contract, consent_version, consent_wording)
values
('heroEval', 1, '[{"name":"firstName","type":"text","required":true},{"name":"lastName","type":"text","required":true},{"name":"phone","type":"tel","required":true},{"name":"email","type":"email","required":true},{"name":"carAccident","type":"select","required":false,"options":["yes","no"]}]', 'web-lead-v1', 'By submitting this form, you agree that Align the Spine Chiropractic may contact you about your request. Do not include urgent or highly sensitive medical information.'),
('accidentEval', 1, '[{"name":"firstName","type":"text","required":true},{"name":"lastName","type":"text","required":true},{"name":"phone","type":"tel","required":true},{"name":"email","type":"email","required":true},{"name":"accidentDate","type":"date","required":true,"sensitive":true}]', 'web-lead-v1', 'By submitting this form, you agree that Align the Spine Chiropractic may contact you about your request. Do not include urgent or highly sensitive medical information.'),
('contactUs', 1, '[{"name":"name","type":"text","required":true},{"name":"phone","type":"tel","required":true},{"name":"email","type":"email","required":true},{"name":"carAccident","type":"select","required":false,"options":["yes","no"]},{"name":"message","type":"textarea","required":true,"sensitive":true}]', 'web-lead-v1', 'By submitting this form, you agree that Align the Spine Chiropractic may contact you about your request. Do not include urgent or highly sensitive medical information.'),
('carAccident', 1, '[{"name":"firstName","type":"text","required":true},{"name":"lastName","type":"text","required":true},{"name":"phone","type":"tel","required":true},{"name":"email","type":"email","required":true},{"name":"carAccident","type":"select","required":false,"options":["yes","no"]}]', 'web-lead-v1', 'By submitting this form, you agree that Align the Spine Chiropractic may contact you about your request. Do not include urgent or highly sensitive medical information.'),
('reviewsEval', 1, '[{"name":"firstName","type":"text","required":true},{"name":"lastName","type":"text","required":true},{"name":"phone","type":"tel","required":true},{"name":"email","type":"email","required":true},{"name":"carAccident","type":"select","required":false,"options":["yes","no"]}]', 'web-lead-v1', 'By submitting this form, you agree that Align the Spine Chiropractic may contact you about your request. Do not include urgent or highly sensitive medical information.'),
('contact', 1, '[{"name":"firstName","type":"text","required":true},{"name":"lastName","type":"text","required":true},{"name":"email","type":"email","required":true},{"name":"phone","type":"tel","required":true},{"name":"zip","type":"zip","required":true},{"name":"carAccident","type":"select","required":false,"options":["yes","no"]},{"name":"bestTime","type":"text","required":false}]', 'web-lead-v1', 'By submitting this form, you agree that Align the Spine Chiropractic may contact you about your request. Do not include urgent or highly sensitive medical information.'),
('eligibility', 1, '[{"name":"firstName","type":"text","required":true},{"name":"lastName","type":"text","required":true},{"name":"phone","type":"tel","required":true},{"name":"zip","type":"zip","required":true},{"name":"carAccident","type":"select","required":false,"options":["yes","no"]}]', 'web-lead-v1', 'By submitting this form, you agree that Align the Spine Chiropractic may contact you about your request. Do not include urgent or highly sensitive medical information.'),
('booking', 1, '[{"name":"firstName","type":"text","required":true},{"name":"phone","type":"tel","required":true},{"name":"lastName","type":"text","required":true},{"name":"reason","type":"select","required":true,"options":["back-pain","neck-pain","sciatica","accident","home-visit","other"]}]', 'web-lead-v1', 'By submitting this form, you agree that Align the Spine Chiropractic may contact you about your request. Do not include urgent or highly sensitive medical information.');

create or replace function public.current_crm_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role::text from public.profiles where id = auth.uid() and active = true;
$$;

revoke all on function public.current_crm_role() from public;
grant execute on function public.current_crm_role() to authenticated;

create or replace function public.consume_lead_rate_limit(rate_fingerprint text, rate_limit integer default 10)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare current_count integer; current_window timestamptz := date_trunc('hour', now());
begin
  if auth.role() <> 'service_role' then raise exception 'service_role_required' using errcode = '42501'; end if;
  if nullif(rate_fingerprint,'') is null or rate_limit < 1 then raise exception 'invalid_rate_limit'; end if;
  insert into public.lead_rate_limits(fingerprint, window_started_at, request_count)
  values (rate_fingerprint, current_window, 1)
  on conflict (fingerprint, window_started_at) do update set request_count=public.lead_rate_limits.request_count+1
  returning request_count into current_count;
  return current_count <= rate_limit;
end;
$$;

create or replace function public.ingest_lead_submission(
  submission_id uuid,
  submitted_form_id text,
  submitted_form_version integer,
  submitted_contact_fields jsonb,
  submitted_attribution jsonb,
  submitted_consent jsonb,
  submitted_priority public.lead_priority,
  submitted_intent public.lead_intent,
  submitted_source_path text,
  submitted_at timestamptz,
  encrypted_payload text default null,
  encryption_iv text default null,
  encryption_auth_tag text default null,
  encryption_key_version integer default null,
  sensitive_field_names text[] default '{}',
  rate_fingerprint text default null,
  rate_limit integer default 10
)
returns table (lead_id uuid, created boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_id uuid;
  definition public.form_definitions%rowtype;
  created_id uuid;
  current_window timestamptz := date_trunc('hour', now());
  current_count integer;
  invalid_key text;
begin
  if auth.role() <> 'service_role' then raise exception 'service_role_required' using errcode = '42501'; end if;
  select id into existing_id from public.lead_submissions where client_submission_id = submission_id;
  if existing_id is not null then return query select existing_id, false; return; end if;
  if submitted_source_path !~ '^/' or submitted_source_path ~ '[?#]' then raise exception 'invalid_source_path'; end if;
  select * into definition from public.form_definitions where form_id = submitted_form_id and version = submitted_form_version and active = true;
  if not found then raise exception 'invalid_form_version' using errcode = '22023'; end if;
  if submitted_consent->>'version' <> definition.consent_version
    or submitted_consent->>'wording' <> definition.consent_wording
    or submitted_consent->>'channel' <> 'web_form'
    or coalesce((submitted_consent->>'granted')::boolean, false) = false
  then raise exception 'invalid_consent_receipt' using errcode = '22023'; end if;
  if jsonb_typeof(submitted_contact_fields) <> 'object' then raise exception 'invalid_contact_fields'; end if;
  select k.key into invalid_key from jsonb_object_keys(submitted_contact_fields) as k(key)
  where not exists (
    select 1 from jsonb_array_elements(definition.field_contract) field
    where field->>'name' = k.key and coalesce((field->>'sensitive')::boolean, false) = false
  ) limit 1;
  if invalid_key is not null then raise exception 'unexpected_field:%', invalid_key using errcode = '22023'; end if;
  if exists (
    select 1 from jsonb_array_elements(definition.field_contract) field
    where coalesce((field->>'required')::boolean, true)
      and coalesce((field->>'sensitive')::boolean, false) = false
      and nullif(trim(submitted_contact_fields->>(field->>'name')), '') is null
  ) then raise exception 'required_field_missing' using errcode = '22023'; end if;
  if exists (
    select 1 from unnest(sensitive_field_names) name
    where not exists (
      select 1 from jsonb_array_elements(definition.field_contract) field
      where field->>'name'=name and coalesce((field->>'sensitive')::boolean,false)=true
    )
  ) then
    raise exception 'invalid_sensitive_field' using errcode = '22023';
  end if;
  if exists (
    select 1 from jsonb_array_elements(definition.field_contract) field
    where coalesce((field->>'required')::boolean,true)=true
      and coalesce((field->>'sensitive')::boolean,false)=true
      and not ((field->>'name') = any(sensitive_field_names))
  ) then raise exception 'required_sensitive_field_missing' using errcode = '22023'; end if;
  if cardinality(sensitive_field_names) > 0 and (encrypted_payload is null or encryption_iv is null or encryption_auth_tag is null or encryption_key_version is null) then
    raise exception 'sensitive_encryption_required' using errcode = '22023';
  end if;
  if rate_fingerprint is not null then
    insert into public.lead_rate_limits(fingerprint, window_started_at, request_count)
    values (rate_fingerprint, current_window, 1)
    on conflict (fingerprint, window_started_at) do update set request_count = public.lead_rate_limits.request_count + 1
    returning request_count into current_count;
    if current_count > rate_limit then raise exception 'rate_limit_exceeded' using errcode = 'P0001'; end if;
  end if;

  insert into public.lead_submissions(client_submission_id, form_id, form_version, contact_fields, priority, intent, source_page_path, submitted_at)
  values (submission_id, submitted_form_id, submitted_form_version, submitted_contact_fields, submitted_priority, submitted_intent, submitted_source_path, submitted_at)
  returning id into created_id;

  insert into public.lead_attribution(lead_id, initial_landing_path, latest_landing_path, referrer_host, utm_source, utm_medium, utm_campaign, utm_term, utm_content, utm_id, gclid, gbraid, wbraid, dclid, msclkid, fbclid, fbc, fbp, ttclid, li_fat_id, ga_client_id, ga_session_id, ga_session_number)
  values (created_id, submitted_attribution->>'initialLandingPath', submitted_attribution->>'latestLandingPath', submitted_attribution->>'referrerHost', submitted_attribution->>'utm_source', submitted_attribution->>'utm_medium', submitted_attribution->>'utm_campaign', submitted_attribution->>'utm_term', submitted_attribution->>'utm_content', submitted_attribution->>'utm_id', submitted_attribution->>'gclid', submitted_attribution->>'gbraid', submitted_attribution->>'wbraid', submitted_attribution->>'dclid', submitted_attribution->>'msclkid', submitted_attribution->>'fbclid', submitted_attribution->>'fbc', submitted_attribution->>'fbp', submitted_attribution->>'ttclid', submitted_attribution->>'li_fat_id', submitted_attribution->>'gaClientId', submitted_attribution->>'gaSessionId', nullif(submitted_attribution->>'gaSessionNumber','')::integer);

  if cardinality(sensitive_field_names) > 0 then
    insert into public.lead_sensitive_payloads(lead_id, ciphertext, iv, auth_tag, key_version, field_names)
    values (created_id, decode(encrypted_payload, 'base64'), decode(encryption_iv, 'base64'), decode(encryption_auth_tag, 'base64'), encryption_key_version, sensitive_field_names);
  end if;
  insert into public.lead_consent_receipts(lead_id, consent_version, wording, channel, granted, recorded_at)
  values (created_id, submitted_consent->>'version', submitted_consent->>'wording', submitted_consent->>'channel', coalesce((submitted_consent->>'granted')::boolean, false), submitted_at);
  insert into public.lead_status_events(lead_id, to_status, reason) values (created_id, 'new', 'Lead received through validated website form.');
  return query select created_id, true;
end;
$$;

create or replace function public.update_lead_status(target_lead_id uuid, target_status public.lead_status, change_reason text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare old_status public.lead_status; actor_role text := public.current_crm_role();
begin
  if actor_role not in ('admin', 'lead_manager') then raise exception 'crm_role_required' using errcode = '42501'; end if;
  if nullif(trim(change_reason), '') is null then raise exception 'reason_required'; end if;
  select status into old_status from public.lead_submissions where id = target_lead_id for update;
  if not found then raise exception 'lead_not_found' using errcode = 'P0002'; end if;
  update public.lead_submissions set status = target_status, updated_at = now() where id = target_lead_id;
  insert into public.lead_status_events(lead_id, from_status, to_status, actor_id, reason)
  values (target_lead_id, old_status, target_status, auth.uid(), left(trim(change_reason), 500));
end;
$$;

revoke all on function public.ingest_lead_submission(uuid,text,integer,jsonb,jsonb,jsonb,public.lead_priority,public.lead_intent,text,timestamptz,text,text,text,integer,text[],text,integer) from public;
revoke all on function public.consume_lead_rate_limit(text,integer) from public;
revoke all on function public.update_lead_status(uuid,public.lead_status,text) from public;
grant execute on function public.ingest_lead_submission(uuid,text,integer,jsonb,jsonb,jsonb,public.lead_priority,public.lead_intent,text,timestamptz,text,text,text,integer,text[],text,integer) to service_role;
grant execute on function public.consume_lead_rate_limit(text,integer) to service_role;
grant execute on function public.update_lead_status(uuid,public.lead_status,text) to authenticated;

alter table public.form_definitions enable row level security;
alter table public.lead_submissions enable row level security;
alter table public.lead_attribution enable row level security;
alter table public.lead_sensitive_payloads enable row level security;
alter table public.lead_consent_receipts enable row level security;
alter table public.lead_status_events enable row level security;
alter table public.lead_rate_limits enable row level security;

create policy form_definitions_crm_read on public.form_definitions for select to authenticated using (public.current_crm_role() in ('admin','lead_manager'));
create policy form_definitions_admin_write on public.form_definitions for all to authenticated using (public.current_crm_role() = 'admin') with check (public.current_crm_role() = 'admin');
create policy leads_crm_read on public.lead_submissions for select to authenticated using (public.current_crm_role() in ('admin','lead_manager'));
create policy attribution_crm_read on public.lead_attribution for select to authenticated using (public.current_crm_role() in ('admin','lead_manager'));
create policy consent_crm_read on public.lead_consent_receipts for select to authenticated using (public.current_crm_role() in ('admin','lead_manager'));
create policy status_events_crm_read on public.lead_status_events for select to authenticated using (public.current_crm_role() in ('admin','lead_manager'));

revoke all on public.form_definitions, public.lead_submissions, public.lead_attribution, public.lead_sensitive_payloads, public.lead_consent_receipts, public.lead_status_events, public.lead_rate_limits from anon, authenticated;
grant select on public.form_definitions, public.lead_submissions, public.lead_attribution, public.lead_consent_receipts, public.lead_status_events to authenticated;
grant insert, update, delete on public.form_definitions to authenticated;
grant all on public.form_definitions, public.lead_submissions, public.lead_attribution, public.lead_sensitive_payloads, public.lead_consent_receipts, public.lead_status_events, public.lead_rate_limits to service_role;
