-- Destructive rollback. Run 004 down first, then this file, after backup and approval.
-- Keep the explicit editorial-role read policies installed by 003. Because the
-- lead_manager enum value cannot be removed safely, restoring migration 001's
-- "role is not null" expressions would expose editorial revisions after rollback.
revoke all on function public.update_lead_status(uuid,public.lead_status,text) from public;
revoke all on function public.ingest_lead_submission(uuid,text,integer,jsonb,jsonb,jsonb,public.lead_priority,public.lead_intent,text,timestamptz,text,text,text,integer,text[],text,integer) from public;
revoke all on function public.consume_lead_rate_limit(text,integer) from public;
drop function if exists public.update_lead_status(uuid,public.lead_status,text);
drop function if exists public.ingest_lead_submission(uuid,text,integer,jsonb,jsonb,jsonb,public.lead_priority,public.lead_intent,text,timestamptz,text,text,text,integer,text[],text,integer);
drop function if exists public.consume_lead_rate_limit(text,integer);
drop table if exists public.lead_rate_limits;
drop table if exists public.lead_status_events;
drop table if exists public.lead_consent_receipts;
drop table if exists public.lead_sensitive_payloads;
drop table if exists public.lead_attribution;
drop table if exists public.lead_submissions;
drop table if exists public.form_definitions;
drop function if exists public.current_crm_role();
drop type if exists public.lead_intent;
drop type if exists public.lead_priority;
drop type if exists public.lead_status;
-- PostgreSQL cannot remove one enum value safely in place. The additive
-- editorial_role value 'lead_manager' intentionally remains unused after rollback.
