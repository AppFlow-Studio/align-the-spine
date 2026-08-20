-- Additive to 202608160004. Adds a second, patient-facing Resend email.
-- Renames the original 'resend' destination to 'resend_office' for clarity
-- now that there are two. Owner direction 2026-08-19: send a well-designed
-- acknowledgment email to the lead themselves, not just an office
-- notification — see lib/leads/email/patient-acknowledgment.ts.

alter type public.lead_delivery_destination rename value 'resend' to 'resend_office';
alter type public.lead_delivery_destination add value if not exists 'resend_patient';

create or replace function public.enqueue_lead_delivery()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.lead_delivery_outbox(lead_id, destination, payload)
  values
    (new.id, 'resend_office', jsonb_build_object('leadId', new.id, 'formId', new.form_id, 'formVersion', new.form_version)),
    (new.id, 'google_sheets', jsonb_build_object('leadId', new.id, 'formId', new.form_id, 'formVersion', new.form_version));
  -- Patient acknowledgment only when the lead actually gave us an email
  -- address — some forms (e.g. the home-visit eligibility check) never
  -- collect one.
  if coalesce(trim(new.contact_fields->>'email'), '') <> '' then
    insert into public.lead_delivery_outbox(lead_id, destination, payload)
    values (new.id, 'resend_patient', jsonb_build_object('leadId', new.id, 'formId', new.form_id, 'formVersion', new.form_version));
  end if;
  return new;
end;
$$;
