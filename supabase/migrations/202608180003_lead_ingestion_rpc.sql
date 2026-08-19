-- ===========================================================================
-- RPC: ingest_lead  (single-transaction, durable-first lead ingestion)
-- ---------------------------------------------------------------------------
-- The one entry point /api/lead calls. In ONE transaction it:
--   1. inserts the lead (idempotent on submission_id),
--   2. writes the consent receipt,
--   3. enqueues the office notification (always),
--   4. enqueues the patient acknowledgment (only when p_create_patient_ack),
--   5. enqueues a Google Sheets row (only when p_create_google_sheets).
--
-- Either the lead and ALL its required deliveries commit together, or nothing
-- does — a patient-email row can never exist without its lead, and a lead is
-- never reported as accepted without its office delivery queued.
--
-- Idempotent: a retried submission_id returns the existing lead with is_new
-- =false and creates no duplicate deliveries (belt-and-braces ON CONFLICT on
-- the outbox uniqueness guard as well).
-- ===========================================================================

create or replace function public.ingest_lead(
  p_submission_id         uuid,
  p_form_variant          text,
  p_form_version          integer,
  p_priority              text,
  p_first_name            text default null,
  p_last_name             text default null,
  p_full_name             text default null,
  p_email                 text default null,
  p_phone                 text default null,
  p_zip                   text default null,
  p_best_time             text default null,
  p_reason                text default null,
  p_car_accident          text default null,
  p_raw_fields            jsonb default '{}'::jsonb,
  p_attribution           jsonb default '{}'::jsonb,
  p_source_path           text default null,
  p_sensitive_payload     text default null,
  p_sensitive_present     boolean default false,
  p_disclosure_version    text default 'v1',
  p_ip_hash               text default null,
  p_user_agent            text default null,
  p_create_patient_ack    boolean default false,
  p_create_google_sheets  boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_lead_id     uuid;
  v_is_new      boolean := true;
  v_office_id   uuid := gen_random_uuid();
  v_patient_id  uuid := gen_random_uuid();
  v_sheets_id   uuid := gen_random_uuid();
begin
  insert into public.leads (
    submission_id, form_variant, form_version, priority,
    first_name, last_name, full_name, email, phone, zip, best_time, reason, car_accident,
    raw_fields, attribution, source_path, sensitive_payload, sensitive_present
  ) values (
    p_submission_id, p_form_variant, p_form_version, p_priority::public.lead_priority,
    p_first_name, p_last_name, p_full_name, p_email, p_phone, p_zip, p_best_time, p_reason, p_car_accident,
    coalesce(p_raw_fields, '{}'::jsonb), coalesce(p_attribution, '{}'::jsonb),
    p_source_path, p_sensitive_payload, coalesce(p_sensitive_present, false)
  )
  on conflict (submission_id) do nothing
  returning id into v_lead_id;

  if v_lead_id is null then
    -- Already ingested — return the existing lead, create nothing new.
    select id into v_lead_id from public.leads where submission_id = p_submission_id;
    return jsonb_build_object('lead_id', v_lead_id, 'is_new', false);
  end if;

  insert into public.lead_consent_receipts
    (lead_id, disclosure_version, ip_hash, user_agent, source_path)
  values
    (v_lead_id, p_disclosure_version, p_ip_hash, p_user_agent, p_source_path);

  -- Office notification: ALWAYS.
  insert into public.lead_delivery_outbox
    (id, lead_id, submission_id, destination, delivery_purpose, idempotency_key)
  values
    (v_office_id, v_lead_id, p_submission_id, 'resend_email', 'office_notification',
     'ats/office-lead/' || v_office_id::text)
  on conflict (submission_id, destination, delivery_purpose) do nothing;

  -- Patient acknowledgment: only when a valid email was collected.
  if p_create_patient_ack then
    insert into public.lead_delivery_outbox
      (id, lead_id, submission_id, destination, delivery_purpose, idempotency_key)
    values
      (v_patient_id, v_lead_id, p_submission_id, 'resend_email', 'patient_acknowledgment',
       'ats/patient-ack/' || v_patient_id::text)
    on conflict (submission_id, destination, delivery_purpose) do nothing;
  end if;

  -- Google Sheets mirror: only when configured.
  if p_create_google_sheets then
    insert into public.lead_delivery_outbox
      (id, lead_id, submission_id, destination, delivery_purpose, idempotency_key)
    values
      (v_sheets_id, v_lead_id, p_submission_id, 'google_sheets', 'google_sheets',
       'ats/sheets/' || v_sheets_id::text)
    on conflict (submission_id, destination, delivery_purpose) do nothing;
  end if;

  return jsonb_build_object('lead_id', v_lead_id, 'is_new', v_is_new);
end;
$$;

revoke all on function public.ingest_lead(
  uuid, text, integer, text, text, text, text, text, text, text, text, text, text,
  jsonb, jsonb, text, text, boolean, text, text, text, boolean, boolean
) from public;
