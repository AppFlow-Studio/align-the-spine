# Lead pipeline operations

Last updated: 2026-08-19

There is no admin dashboard for leads. Supabase is the durable store (so a
submission is never lost even if a downstream delivery fails), and the
**Google Sheet is the interface the client actually uses** to see and monitor
form submissions. A copy of every submission is also emailed directly.

## Boundaries

Supabase is the lead system of record; Google Sheets and email are downstream
operational copies. Editorial CMS records remain separate. Nothing here stores
diagnoses, treatment details, claim numbers, or accident narratives. The
existing `contactUs.message` and `accidentEval.accidentDate` fields are
encrypted separately and never enter ordinary JSON, analytics, logs, URLs, or
Sheets.

## Staging setup

1. Rotate every privileged Supabase credential previously disclosed in chat.
2. Back up a disposable/staging database.
3. Apply migrations in order: 001, 002, 003, 004. Do not replace 001/002 and do
   not paste a standalone setup script over the schema.
4. Run `supabase/tests/content_rls_assertions.sql`,
   `supabase/tests/lead_crm_rls_assertions.sql`, and
   `supabase/tests/lead_workflow_assertions.sql`.
5. Generate independent random server secrets for `LEAD_ENCRYPTION_KEY`,
   `LEAD_RATE_LIMIT_SECRET`, `CRON_SECRET`, and
   `GOOGLE_SHEETS_WEBHOOK_SECRET`. The encryption key must be exactly 32 bytes
   before base64 encoding.
6. Set `LEAD_REPOSITORY_MODE=supabase` only in the approved staging environment.
7. Set `LEAD_TO_EMAIL` to the comma-separated monitoring inboxes
   (`chiromarketing27@gmail.com,info@chirobackpain.com`), `LEAD_FROM_EMAIL`
   to a real address on the Resend-verified sending domain
   (`info@chirobackpain.com`), and `RESEND_API_KEY` to a real key.
8. Exercise synthetic, non-patient test submissions before any real traffic.

## Google Sheets webhook

Step-by-step deployment (manual — this is a Google account action, not something
that can be automated from this repository):

1. Create a new Google Sheet (or open the approved one). Note its ID from the
   URL: `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`.
2. In that Sheet, open **Extensions → Apps Script**. This opens a bound script
   project.
3. Delete the default `Code.gs` contents and paste in the full contents of
   this repo's `integrations/google-sheets/Code.gs`.
4. In the Apps Script editor, open **Project Settings** (gear icon) → **Script
   Properties** → **Add script property**. Add two properties:
   - `ATS_WEBHOOK_SECRET` — a high-entropy random string, kept identical to
     this repo's `GOOGLE_SHEETS_WEBHOOK_SECRET` env var.
   - `ATS_SPREADSHEET_ID` — the spreadsheet ID from step 1.
5. Back in the editor, click **Deploy → New deployment**. Choose type **Web
   app**. Set "Execute as" to **Me**, and "Who has access" to **Anyone**
   (the endpoint is protected by the HMAC signature, not Google's access
   control — anonymous access is required for the server to call it, and the
   script itself rejects any request with a missing/invalid/stale signature).
6. Click **Deploy**, authorize the requested permissions (this script only
   touches the one bound spreadsheet), and copy the resulting web app URL
   (ends in `/exec`).
7. Set that URL as `GOOGLE_SHEETS_WEBHOOK_URL` and the same secret from step 4
   as `GOOGLE_SHEETS_WEBHOOK_SECRET` in the environment.
8. Send only a synthetic signed event to verify. A valid response is JSON with
   `ok: true`; HTTP 200 alone is not accepted. Re-sending the same `eventId`
   should return `{ ok: true, duplicate: true }` and must not add a second row.
9. Re-running step 5 as **New deployment** (not "Manage deployments → Edit")
   is required after any `Code.gs` change — Apps Script web app URLs are
   pinned to a specific deployed version.
10. Give the client (or whoever monitors submissions) edit/view access to the
    Sheet itself — that's the only interface they need.

The webhook rejects signatures outside a five-minute window, uses an exact
event-ID ledger under a script lock, and neutralizes spreadsheet formulas a
second time. The `_delivery_events` sheet is hidden but should remain protected.

## Email delivery

Two branded HTML emails (`lib/leads/email/`) send via Resend on every
submission, plain-text fallback included on both:

- **Office notification** — to every address in `LEAD_TO_EMAIL` (comma-
  separated; currently `chiromarketing27@gmail.com,info@chirobackpain.com`).
  Reply-To is the lead's own email, so replying reaches the patient directly.
  It never contains a link to any internal dashboard — there isn't one.
  `LEAD_EMAIL_INCLUDE_SENSITIVE` (default `false`) keeps the free-text
  `message`/`accidentDate` fields out of the email body entirely unless
  explicitly turned on.
- **Patient acknowledgment** — to the lead's own email, when the submitted
  form collected one. Confirms the request was received, never that an
  appointment is confirmed; copy varies only by the `general`/`car_accident`
  intent already computed server-side.

Both send from `LEAD_FROM_EMAIL` (a real address on the Resend-verified
`chirobackpain.com` sending domain — currently `info@chirobackpain.com`).

## Worker schedule and delivery

Two triggers call the same `processLeadDeliveryBatch` worker
(`lib/leads/delivery.ts`), never a duplicate implementation:

1. **Immediate, per-submission** (the normal path) — `app/api/lead/route.ts`
   calls it via Next's `after()` right after a genuinely new lead is
   ingested (Supabase mode only; a fixture-mode/idempotent-resubmit request
   never triggers it). `after()` runs once the response has already been
   sent to the visitor, so a slow or failing Sheets/Resend call never adds
   to their wait — this is what makes a lead land in the Sheet effectively
   in real time instead of waiting for the next scheduled run.
2. **Periodic safety net** — `vercel.json`'s `crons` entry calls
   `GET /api/internal/lead-delivery` once a day (Vercel's Hobby-plan
   ceiling; a paid plan allows a much tighter cadence, e.g. every minute,
   if a shorter safety-net window is wanted — Vercel auto-attaches
   `Authorization: Bearer $CRON_SECRET` to its own cron requests when that
   env var exists on the project, no extra config needed). This is what
   catches anything the immediate trigger above didn't — a request whose
   `after()` callback didn't finish, or an event already sitting in
   `retry` state from a prior failed attempt. The route also still accepts
   a manual `POST` with the same bearer token, for an on-call run or an
   external scheduler instead of Vercel Cron. Never place the token in a
   query string.

The worker atomically claims available events with `FOR UPDATE SKIP LOCKED`,
recovers stale locks, writes an attempt record, and completes each event as
delivered, retry, or dead-letter. Retry delay is exponential with jitter. The
default maximum is eight attempts; change the database column default before
production if a different value is needed.

## Investigating a problem

There is no UI for this — go straight to Supabase:

- `select * from lead_submissions order by created_at desc limit 50;` for
  recent submissions.
- `select * from lead_delivery_outbox where state in ('retry','dead_letter');`
  for anything stuck. `last_error_code`/`last_error_detail` are sanitized
  (no PII, no raw provider payloads).
- A dead-lettered event can be requeued by hand:
  `update lead_delivery_outbox set state='retry', available_at=now(),
max_attempts=max_attempts+1 where id='<event-id>';` — the next worker pass
  picks it up.

## Key rotation

Increment `LEAD_ENCRYPTION_KEY_VERSION` when rotating the AES key. Retain the
old key under a separately approved rotation process until affected ciphertext
has been decrypted and re-encrypted server-side. This repository intentionally
does not implement browser-visible sensitive payload access.

## Rollback

1. Set `LEAD_REPOSITORY_MODE=fixture` or remove public form traffic before a
   database rollback. Fixture mode is local/test only and must not accept real
   production leads.
2. Back up/export lead records and encrypted payloads.
3. Apply `202608160004_lead_delivery_outbox.down.sql`.
4. Apply `202608160003_lead_crm_attribution.down.sql`.
