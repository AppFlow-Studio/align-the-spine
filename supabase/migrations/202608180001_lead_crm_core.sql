-- ===========================================================================
-- Lead CRM core schema (durable lead storage)
-- ---------------------------------------------------------------------------
-- Additive. Establishes the durable record of every valid website lead so a
-- lead can never be lost merely because downstream email is delayed or
-- unavailable. Delivery (outbox/attempts/webhooks) lives in migration
-- 202608180002; the transactional ingestion RPC in 202608180003.
--
-- Sensitive free-text fields (`message`) and the accident date are NEVER
-- stored in plaintext here — the application encrypts them with AES-256-GCM
-- (lib/lead/crypto.ts) and passes only base64 ciphertext, so a database
-- compromise alone does not reveal them. That is why this schema does not use
-- pgcrypto for field encryption: the key never enters the database.
--
-- RLS: every table has RLS enabled with NO anon/authenticated policies, so it
-- is default-deny to every client. Only the server's Supabase service-role key
-- (which bypasses RLS) can read or write. There is no browser-reachable path
-- to this data.
-- ===========================================================================

create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists citext;      -- case-insensitive email

-- --- Enums ------------------------------------------------------------------

do $$ begin
  create type lead_priority as enum ('high', 'standard');
exception when duplicate_object then null; end $$;

-- --- updated_at trigger helper ---------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- --- Form definitions (historical, versioned contracts) --------------------
-- One row per (variant, version). Seeded from migrations; kept append-only so
-- a lead's form_version always points at the exact contract it was collected
-- under, even after the live form advances to a newer version. v1 rows are
-- never mutated — see 202608180004 for the eligibility/booking v2 additions.

create table if not exists public.lead_form_definitions (
  variant        text not null,
  version        integer not null,
  fields         jsonb not null,
  collects_email boolean not null default false,
  created_at     timestamptz not null default now(),
  primary key (variant, version)
);

comment on table public.lead_form_definitions is
  'Versioned, historical record of every lead-form contract. Append-only; v1 rows are immutable history.';

-- --- Leads ------------------------------------------------------------------

create table if not exists public.leads (
  id               uuid primary key default gen_random_uuid(),
  -- Client-generated per-submission idempotency key. UNIQUE so a retried POST
  -- (double-click, network retry) collapses to one lead, one set of deliveries.
  submission_id    uuid not null unique,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  form_variant     text not null,
  form_version     integer not null default 1,
  priority         lead_priority not null default 'standard',

  -- Typed contact columns for querying/triage. All nullable: forms are
  -- heterogeneous (contactUs uses a single `full_name`; eligibility/booking v1
  -- collect no email).
  first_name       text,
  last_name        text,
  full_name        text,
  email            citext,
  phone            text,
  zip              text,
  best_time        text,
  reason           text,
  car_accident     text,

  -- Complete non-sensitive submission, verbatim, for audit/rendering. Sensitive
  -- keys (message, accidentDate) are stripped before this is written.
  raw_fields       jsonb not null default '{}'::jsonb,

  -- Ad-click / campaign attribution (gclid, gbraid, wbraid, utm_*). Non-PII.
  attribution      jsonb not null default '{}'::jsonb,

  -- Page path the form was submitted from, WITHOUT query string.
  source_path      text,

  -- AES-256-GCM ciphertext (base64) of { message, accidentDate }. NULL when the
  -- form collected neither. Decryptable only by the app holding LEAD_ENCRYPTION_KEY.
  sensitive_payload text,
  sensitive_present boolean not null default false,

  -- CRM lifecycle for staff follow-up (independent of email delivery state).
  status           text not null default 'new',

  constraint leads_form_definition_fk
    foreign key (form_variant, form_version)
    references public.lead_form_definitions (variant, version)
);

comment on column public.leads.submission_id is
  'Client-generated idempotency key; UNIQUE so retried submissions collapse to one lead.';
comment on column public.leads.sensitive_payload is
  'AES-256-GCM ciphertext (base64) of sensitive fields. Never logged, never emailed unless LEAD_EMAIL_INCLUDE_SENSITIVE=true.';

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_priority_idx   on public.leads (priority);
create index if not exists leads_email_idx       on public.leads (email);

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- --- Consent receipts (append-only audit) ----------------------------------
-- A durable receipt that a person submitted this form (implied consent to be
-- contacted), capturing WHEN, the disclosure text version they saw, and a
-- SALTED HASH of their IP (never the raw IP) plus user agent — enough to
-- evidence the submission without storing a raw network identifier.

create table if not exists public.lead_consent_receipts (
  id                  uuid primary key default gen_random_uuid(),
  lead_id             uuid not null references public.leads(id) on delete cascade,
  received_at         timestamptz not null default now(),
  disclosure_version  text not null,
  ip_hash             text,
  user_agent          text,
  source_path         text
);

create index if not exists lead_consent_receipts_lead_idx
  on public.lead_consent_receipts (lead_id);

-- --- RLS: default-deny everywhere ------------------------------------------

alter table public.leads                  enable row level security;
alter table public.lead_consent_receipts  enable row level security;
alter table public.lead_form_definitions  enable row level security;

-- Intentionally NO policies for anon/authenticated. Only the service-role key
-- (server-side) may access these tables. This is the least-privilege posture:
-- there is no client-reachable read/write path to lead data.
