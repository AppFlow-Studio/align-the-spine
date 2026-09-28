-- Editorial content no longer requires a second person to approve a post.
--
-- `medical_review_required` is the only thing forcing two accounts through
-- the publish flow. `transition_content` (202608160002) reads it twice:
--
--   * at `approved`  -> raises `self_approval_forbidden` when the approver is
--     also the row's `updated_by`, i.e. whoever last edited it;
--   * at `published` -> raises `clinical_review_required` unless
--     `clinician_reviewer_id` and `clinician_reviewed_at` are both set.
--
-- With the flag false both checks short-circuit, so a single `admin` can edit
-- and publish their own post. Owner direction 2026-09-22: no clinician review
-- step for this team.
--
-- This does NOT weaken the SEO/quality gate. `gate_result->>'passed'` and
-- `noindex = false` are still enforced by `transition_content` and by
-- `is_public_content()`, so a thin or unsourced post remains unpublishable and
-- publicly unreachable. Only the human review handoff is removed.
--
-- Note this column is shared with `content_type = 'service_area'` rows, which
-- are governed by their own evidence gate in `evaluatePublicationGates()` —
-- unaffected by this change.

alter table public.content_items
  alter column medical_review_required set default false;

-- Backfill work in progress so existing drafts are publishable solo too.
-- Deliberately excludes `published` and `archived`: those rows are a
-- historical record of content that did go through review, and rewriting the
-- flag on them would misrepresent that. They are unaffected in practice — the
-- flag is only read during a transition.
update public.content_items
set medical_review_required = false
where status in ('draft', 'in_review', 'approved', 'scheduled')
  and medical_review_required = true;
