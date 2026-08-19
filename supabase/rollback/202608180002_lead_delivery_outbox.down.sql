-- Rollback for 202608180002_lead_delivery_outbox.sql (manual/forward-only).

drop function if exists public.complete_lead_delivery(uuid, boolean, text, text, boolean, integer);
drop function if exists public.claim_lead_deliveries(text, integer, integer);

drop table if exists public.resend_webhook_events cascade;
drop table if exists public.lead_delivery_attempts cascade;
drop table if exists public.lead_delivery_outbox cascade;

drop type if exists outbox_status;
drop type if exists delivery_destination;
drop type if exists delivery_purpose;
