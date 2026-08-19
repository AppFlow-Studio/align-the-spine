-- Rollback for 202608180004_form_v2_email.sql (manual/forward-only).
-- Only removes the v2 rows; v1 history is retained because leads reference it.
-- (Removing any version still referenced by a lead will fail the FK — intended.)

delete from public.lead_form_definitions where variant in ('eligibility','booking') and version = 2;
