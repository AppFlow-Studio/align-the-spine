-- Corrective migration. Additive to 001-004 + 202608190001; does not
-- replace them. Owner direction 2026-08-19: every lead form on the site
-- collects the same core field set (first name, last name, phone, email,
-- car-accident) and the car-accident question is required everywhere, no
-- exceptions. Client-side field config already updated in
-- content/lead-forms.ts; this brings the database's form_definitions
-- contract (which /api/lead validates against) in line with it. Safe as a
-- straight UPDATE (not a new form_version): no real lead has ever been
-- submitted against qaaptlxxwfvxzgyzjhub, only synthetic test rows that
-- were already deleted — same reasoning 202608180001 used for the booking
-- form's own corrective update.

update public.form_definitions
set field_contract = '[{"name":"firstName","type":"text","required":true},{"name":"lastName","type":"text","required":true},{"name":"phone","type":"tel","required":true},{"name":"email","type":"email","required":true},{"name":"carAccident","type":"select","required":true,"options":["yes","no"]}]'::jsonb,
    updated_at = now()
where form_id in ('heroEval', 'carAccident', 'reviewsEval', 'booking') and version = 1;

update public.form_definitions
set field_contract = '[{"name":"firstName","type":"text","required":true},{"name":"lastName","type":"text","required":true},{"name":"phone","type":"tel","required":true},{"name":"email","type":"email","required":true},{"name":"accidentDate","type":"date","required":true,"sensitive":true},{"name":"carAccident","type":"select","required":true,"options":["yes","no"]}]'::jsonb,
    updated_at = now()
where form_id = 'accidentEval' and version = 1;

update public.form_definitions
set field_contract = '[{"name":"firstName","type":"text","required":true},{"name":"lastName","type":"text","required":true},{"name":"phone","type":"tel","required":true},{"name":"email","type":"email","required":true},{"name":"carAccident","type":"select","required":true,"options":["yes","no"]},{"name":"message","type":"textarea","required":true,"sensitive":true}]'::jsonb,
    updated_at = now()
where form_id = 'contactUs' and version = 1;

update public.form_definitions
set field_contract = '[{"name":"firstName","type":"text","required":true},{"name":"lastName","type":"text","required":true},{"name":"email","type":"email","required":true},{"name":"phone","type":"tel","required":true},{"name":"zip","type":"zip","required":true},{"name":"carAccident","type":"select","required":true,"options":["yes","no"]},{"name":"bestTime","type":"text","required":false}]'::jsonb,
    updated_at = now()
where form_id = 'contact' and version = 1;

update public.form_definitions
set field_contract = '[{"name":"firstName","type":"text","required":true},{"name":"lastName","type":"text","required":true},{"name":"phone","type":"tel","required":true},{"name":"email","type":"email","required":true},{"name":"zip","type":"zip","required":true},{"name":"carAccident","type":"select","required":true,"options":["yes","no"]}]'::jsonb,
    updated_at = now()
where form_id = 'eligibility' and version = 1;
