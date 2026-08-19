-- Corrective migration. Additive to 001-004; does not modify or replace them.
--
-- /book-an-appointment was a two-step form (first name + phone, then a
-- free-text "reason for visit" select) per the original Book-appt artboard.
-- Owner direction 2026-08-18: make it a single-step form matching every
-- other full lead form's field set (first name, last name, phone, email,
-- car-accident yes/no) instead of the reason select. Client-side field
-- config already updated in content/lead-forms.ts; this brings the
-- database's form_definitions contract (which /api/lead validates against)
-- in line with it, so real submissions aren't rejected as "unexpected field".

update public.form_definitions
set field_contract = '[{"name":"firstName","type":"text","required":true},{"name":"lastName","type":"text","required":true},{"name":"phone","type":"tel","required":true},{"name":"email","type":"email","required":true},{"name":"carAccident","type":"select","required":false,"options":["yes","no"]}]'::jsonb,
    updated_at = now()
where form_id = 'booking' and version = 1;
