-- Rollback for 202608180001_lead_crm_core.sql
-- Manual/forward-only: Supabase's migration runner does not execute these
-- automatically. Apply by hand (psql) only in a disposable/staging project.
-- Order matters: children before parents.

drop table if exists public.lead_consent_receipts cascade;
drop table if exists public.leads cascade;               -- FK to lead_form_definitions
drop table if exists public.lead_form_definitions cascade;

drop function if exists public.set_updated_at() cascade;

drop type if exists lead_priority;

-- Extensions (citext, pgcrypto) are intentionally left installed — other
-- schema objects and Supabase internals may depend on them.
