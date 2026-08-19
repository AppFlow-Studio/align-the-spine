-- Run after migrations 001-004 in an isolated Supabase test database.
do $$
declare table_name text; rls_enabled boolean; function_source text; editorial_role_source text;
begin
  foreach table_name in array array[
    'form_definitions','lead_submissions','lead_attribution','lead_sensitive_payloads',
    'lead_consent_receipts','lead_status_events','lead_rate_limits',
    'lead_delivery_outbox','lead_delivery_attempts'
  ] loop
    select c.relrowsecurity into rls_enabled from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = table_name;
    if rls_enabled is distinct from true then raise exception 'RLS is required on public.%', table_name; end if;
    if has_table_privilege('anon', format('public.%I', table_name), 'select') then raise exception 'anon can read public.%', table_name; end if;
  end loop;
  if has_table_privilege('authenticated','public.lead_submissions','update') then raise exception 'authenticated must not update lead contact rows directly'; end if;
  if has_table_privilege('authenticated','public.lead_attribution','update') then raise exception 'authenticated must not update attribution'; end if;
  if has_table_privilege('authenticated','public.lead_sensitive_payloads','select') then raise exception 'sensitive payloads must be service-only'; end if;
  if has_function_privilege('anon','public.ingest_lead_submission(uuid,text,integer,jsonb,jsonb,jsonb,public.lead_priority,public.lead_intent,text,timestamptz,text,text,text,integer,text[],text,integer)','execute') then raise exception 'anon can execute ingestion'; end if;
  if has_function_privilege('anon','public.claim_lead_delivery_batch(uuid,integer,integer)','execute') then raise exception 'anon can claim deliveries'; end if;
  if has_function_privilege('anon','public.consume_lead_rate_limit(text,integer)','execute') then raise exception 'anon can consume rate limits directly'; end if;
  select pg_get_functiondef('public.claim_lead_delivery_batch(uuid,integer,integer)'::regprocedure) into function_source;
  if position('skip locked' in lower(function_source)) = 0 then raise exception 'delivery claim must use SKIP LOCKED'; end if;
  select pg_get_functiondef('public.current_editorial_role()'::regprocedure) into editorial_role_source;
  if position('clinician_reviewer' in editorial_role_source) = 0 or position('lead_manager' in editorial_role_source) > 0 then
    raise exception 'current_editorial_role must exclude lead_manager';
  end if;
  if exists (
    select 1 from pg_policies where schemaname='public' and tablename in
      ('content_items','categories','tags','content_categories','content_tags','sources','content_sources','content_relations','redirects','content_revisions','publication_events')
      and (coalesce(qual,'') ilike '%lead_manager%' or coalesce(with_check,'') ilike '%lead_manager%')
  ) then raise exception 'lead_manager was added to a CMS policy'; end if;
  if exists (
    select 1 from pg_policies where schemaname='public' and tablename in
      ('categories','tags','content_categories','content_tags','sources','content_sources','content_relations','redirects','content_revisions','publication_events')
      and replace(coalesce(qual,''),' ','') ilike '%current_editorial_role()isnotnull%'
  ) then raise exception 'A broad editorial policy would admit lead_manager'; end if;
end $$;
