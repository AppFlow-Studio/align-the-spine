-- Reverts 202609220001_content_medical_review_default.sql: restores the
-- two-person approval requirement.
--
-- The backfill is reversible because `medical_review_required` had never been
-- set to false by anything before that migration — the column default was
-- `true` from 202608160001 and no code path writes it. Every false value on a
-- non-terminal row therefore originated in that backfill, so flipping the same
-- rows back to true restores the prior state exactly.

update public.content_items
set medical_review_required = true
where status in ('draft', 'in_review', 'approved', 'scheduled')
  and medical_review_required = false;

alter table public.content_items
  alter column medical_review_required set default true;
