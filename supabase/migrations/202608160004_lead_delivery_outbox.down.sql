-- Destructive rollback. Apply before 003 down and only after backup/approval.
drop trigger if exists lead_delivery_enqueue_after_insert on public.lead_submissions;
drop function if exists public.retry_lead_delivery(uuid,text);
drop function if exists public.complete_lead_delivery_attempt(uuid,uuid,boolean,text,integer,text,text);
drop function if exists public.claim_lead_delivery_batch(uuid,integer,integer);
drop function if exists public.refresh_lead_delivery_status(uuid);
drop function if exists public.enqueue_lead_delivery();
drop table if exists public.lead_delivery_attempts;
drop table if exists public.lead_delivery_outbox;
drop type if exists public.lead_delivery_state;
drop type if exists public.lead_delivery_destination;
