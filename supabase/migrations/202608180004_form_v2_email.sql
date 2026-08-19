-- ===========================================================================
-- Form-definition history + eligibility/booking v2 (adds validated email)
-- ---------------------------------------------------------------------------
-- Additive & idempotent. Seeds the immutable v1 contract for every current
-- lead-form variant (the FK target for leads.form_variant/form_version) and
-- introduces v2 of `eligibility` and `booking` — identical to v1 plus a
-- required, validated email field so those two forms can also trigger the
-- patient acknowledgment. v1 rows are preserved untouched as historical record;
-- leads collected before the app switched to v2 keep pointing at v1.
--
-- `fields` is a faithful, compact snapshot of each contract (name/type/required)
-- mirroring content/lead-forms.ts — enough to evidence exactly what a lead of
-- that version was collected under.
-- ===========================================================================

insert into public.lead_form_definitions (variant, version, collects_email, fields) values
  ('heroEval', 1, true, '[
     {"name":"firstName","type":"text","required":true},
     {"name":"lastName","type":"text","required":true},
     {"name":"phone","type":"tel","required":true},
     {"name":"email","type":"email","required":true},
     {"name":"carAccident","type":"select","required":false}
   ]'::jsonb),
  ('accidentEval', 1, true, '[
     {"name":"firstName","type":"text","required":true},
     {"name":"lastName","type":"text","required":true},
     {"name":"phone","type":"tel","required":true},
     {"name":"email","type":"email","required":true},
     {"name":"accidentDate","type":"date","required":true}
   ]'::jsonb),
  ('contactUs', 1, true, '[
     {"name":"name","type":"text","required":true},
     {"name":"phone","type":"tel","required":true},
     {"name":"email","type":"email","required":true},
     {"name":"carAccident","type":"select","required":false},
     {"name":"message","type":"textarea","required":true}
   ]'::jsonb),
  ('carAccident', 1, true, '[
     {"name":"firstName","type":"text","required":true},
     {"name":"lastName","type":"text","required":true},
     {"name":"phone","type":"tel","required":true},
     {"name":"email","type":"email","required":true},
     {"name":"carAccident","type":"select","required":false}
   ]'::jsonb),
  ('reviewsEval', 1, true, '[
     {"name":"firstName","type":"text","required":true},
     {"name":"lastName","type":"text","required":true},
     {"name":"phone","type":"tel","required":true},
     {"name":"email","type":"email","required":true},
     {"name":"carAccident","type":"select","required":false}
   ]'::jsonb),
  ('contact', 1, true, '[
     {"name":"firstName","type":"text","required":true},
     {"name":"lastName","type":"text","required":true},
     {"name":"email","type":"email","required":true},
     {"name":"phone","type":"tel","required":true},
     {"name":"zip","type":"zip","required":true},
     {"name":"carAccident","type":"select","required":false},
     {"name":"bestTime","type":"text","required":false}
   ]'::jsonb),
  -- eligibility v1 / booking v1: NO email by design (historical record).
  ('eligibility', 1, false, '[
     {"name":"firstName","type":"text","required":true},
     {"name":"lastName","type":"text","required":true},
     {"name":"phone","type":"tel","required":true},
     {"name":"zip","type":"zip","required":true},
     {"name":"carAccident","type":"select","required":false}
   ]'::jsonb),
  ('booking', 1, false, '[
     {"name":"firstName","type":"text","required":true},
     {"name":"phone","type":"tel","required":true},
     {"name":"lastName","type":"text","required":true},
     {"name":"reason","type":"select","required":true}
   ]'::jsonb),
  -- v2: eligibility + booking gain a required, validated email so the patient
  -- acknowledgment can be sent from these forms too.
  ('eligibility', 2, true, '[
     {"name":"firstName","type":"text","required":true},
     {"name":"lastName","type":"text","required":true},
     {"name":"phone","type":"tel","required":true},
     {"name":"email","type":"email","required":true},
     {"name":"zip","type":"zip","required":true},
     {"name":"carAccident","type":"select","required":false}
   ]'::jsonb),
  ('booking', 2, true, '[
     {"name":"firstName","type":"text","required":true},
     {"name":"phone","type":"tel","required":true},
     {"name":"email","type":"email","required":true},
     {"name":"lastName","type":"text","required":true},
     {"name":"reason","type":"select","required":true}
   ]'::jsonb)
on conflict (variant, version) do nothing;
