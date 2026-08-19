-- ===========================================================================
-- Lead delivery outbox + attempt auditing + Resend webhook events
-- ---------------------------------------------------------------------------
-- Additive. Turns each accepted lead into one independently-retryable delivery
-- per (destination, purpose): the office notification always, the patient
-- acknowledgment when a valid email was collected, and (optionally) a Google
-- Sheets row. Each delivery has its own id, attempt history, retry/backoff,
-- dead-letter lifecycle, and stable Resend idempotency key.
--
-- The worker claims work atomically via claim_lead_deliveries() (FOR UPDATE
-- SKIP LOCKED) so concurrent workers can never double-send, and reports the
-- result via complete_lead_delivery() which applies jittered exponential
-- backoff for transient failures and dead-letters permanent ones / exhausted
-- retries. Webhooks (Resend delivery/bounce/complaint) land in
-- resend_webhook_events (idempotent) and update the outbox delivery_state.
-- ===========================================================================

-- --- Enums ------------------------------------------------------------------

do $$ begin
  create type delivery_purpose as enum
    ('office_notification', 'patient_acknowledgment', 'google_sheets');
exception when duplicate_object then null; end $$;

do $$ begin
  create type delivery_destination as enum ('resend_email', 'google_sheets');
exception when duplicate_object then null; end $$;

do $$ begin
  -- Send lifecycle only. Webhook-reported DELIVERY status is tracked
  -- separately in delivery_state so "provider accepted" and "actually
  -- delivered" never collapse into one another.
  create type outbox_status as enum
    ('pending', 'processing', 'sent', 'dead_letter', 'suppressed', 'cancelled');
exception when duplicate_object then null; end $$;

-- --- Outbox -----------------------------------------------------------------

create table if not exists public.lead_delivery_outbox (
  id                uuid primary key default gen_random_uuid(),
  lead_id           uuid not null references public.leads(id) on delete cascade,
  -- Denormalized from the lead so the uniqueness guard below does not need a
  -- join and survives even if lead columns change.
  submission_id     uuid not null,

  destination       delivery_destination not null,
  delivery_purpose  delivery_purpose not null,

  status            outbox_status not null default 'pending',
  attempts          integer not null default 0,
  max_attempts      integer not null default 8,
  next_attempt_at   timestamptz not null default now(),

  -- Atomic-claim bookkeeping (stale-lock recovery reads these).
  locked_at         timestamptz,
  locked_by         text,

  -- Provider record id (Resend email id) once accepted.
  external_id       text,
  -- Stable, deterministic idempotency key (ats/office-lead/{id} etc.).
  idempotency_key   text,

  -- Webhook-reported delivery status, kept distinct from `status`.
  delivery_state    text
    check (delivery_state is null or delivery_state in
      ('accepted','delivered','delayed','bounced','failed','complained','suppressed')),
  -- Timestamp of the webhook event that set delivery_state — used to ignore
  -- out-of-order webhook arrivals.
  delivery_state_at timestamptz,

  -- Non-sensitive render snapshot (template props). NEVER contains message or
  -- accidentDate; the worker re-derives sensitive content only when the gate
  -- is on, never from here.
  payload           jsonb not null default '{}'::jsonb,

  last_error        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- One delivery per submission per destination per purpose. This is the
  -- long-term duplicate-send guard (Resend's own idempotency window is short).
  constraint lead_delivery_outbox_unique
    unique (submission_id, destination, delivery_purpose)
);

create index if not exists lead_delivery_outbox_lead_idx
  on public.lead_delivery_outbox (lead_id);
-- Drives the claim query: cheap lookup of claimable work.
create index if not exists lead_delivery_outbox_claimable_idx
  on public.lead_delivery_outbox (status, next_attempt_at);
create index if not exists lead_delivery_outbox_external_idx
  on public.lead_delivery_outbox (external_id);

drop trigger if exists lead_delivery_outbox_set_updated_at on public.lead_delivery_outbox;
create trigger lead_delivery_outbox_set_updated_at
  before update on public.lead_delivery_outbox
  for each row execute function public.set_updated_at();

-- --- Attempt audit ----------------------------------------------------------

create table if not exists public.lead_delivery_attempts (
  id              uuid primary key default gen_random_uuid(),
  outbox_id       uuid not null references public.lead_delivery_outbox(id) on delete cascade,
  attempt_number  integer not null,
  started_at      timestamptz not null default now(),
  finished_at     timestamptz not null default now(),
  outcome         text not null
    check (outcome in ('sent','transient_error','permanent_error')),
  provider_status integer,
  external_id     text,
  -- Sanitized error string only. Never a raw provider response with PII.
  error           text
);

create index if not exists lead_delivery_attempts_outbox_idx
  on public.lead_delivery_attempts (outbox_id, attempt_number);

-- --- Resend webhook events (idempotent) ------------------------------------

create table if not exists public.resend_webhook_events (
  id           uuid primary key default gen_random_uuid(),
  -- svix message id — UNIQUE so duplicate webhook deliveries are ignored.
  event_id     text not null unique,
  event_type   text not null,
  email_id     text,
  outbox_id    uuid references public.lead_delivery_outbox(id) on delete set null,
  -- Event's own timestamp (webhook arrival order is not guaranteed).
  occurred_at  timestamptz,
  received_at  timestamptz not null default now(),
  -- Trimmed, sanitized payload (no recipient address / no PII).
  payload      jsonb not null default '{}'::jsonb
);

create index if not exists resend_webhook_events_email_idx
  on public.resend_webhook_events (email_id);

-- --- RLS: default-deny -------------------------------------------------------

alter table public.lead_delivery_outbox   enable row level security;
alter table public.lead_delivery_attempts enable row level security;
alter table public.resend_webhook_events  enable row level security;

-- ===========================================================================
-- RPC: claim_lead_deliveries
-- Atomically claims up to p_limit claimable deliveries for one worker. A row is
-- claimable when it is pending and due, OR processing but stale-locked (a
-- worker died mid-send). FOR UPDATE SKIP LOCKED lets concurrent workers claim
-- disjoint sets without blocking. Increments attempts at claim time so a worker
-- that dies after claiming still consumes a retry (bounded, not infinite).
-- ===========================================================================

create or replace function public.claim_lead_deliveries(
  p_worker_id      text,
  p_limit          integer default 20,
  p_stale_seconds  integer default 300
)
returns setof public.lead_delivery_outbox
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  return query
  with claimable as (
    select o.id
    from public.lead_delivery_outbox o
    where (o.status = 'pending' and o.next_attempt_at <= now())
       or (o.status = 'processing'
           and o.locked_at is not null
           and o.locked_at < now() - make_interval(secs => p_stale_seconds))
    order by o.next_attempt_at
    limit greatest(p_limit, 0)
    for update skip locked
  )
  update public.lead_delivery_outbox o
  set status    = 'processing',
      locked_at = now(),
      locked_by = p_worker_id,
      attempts  = o.attempts + 1
  from claimable c
  where o.id = c.id
  returning o.*;
end;
$$;

-- ===========================================================================
-- RPC: complete_lead_delivery
-- Reports the outcome of one send attempt and records it in the attempt audit.
--  * success            -> status 'sent', external_id stored, lock cleared
--  * permanent failure  -> status 'dead_letter'
--  * transient failure   -> back to 'pending' with jittered exponential backoff,
--                          unless attempts have hit max_attempts (dead_letter)
-- ===========================================================================

create or replace function public.complete_lead_delivery(
  p_outbox_id       uuid,
  p_success         boolean,
  p_external_id     text default null,
  p_error           text default null,
  p_permanent       boolean default false,
  p_provider_status integer default null
)
returns public.lead_delivery_outbox
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_row     public.lead_delivery_outbox;
  v_backoff interval;
  v_outcome text;
begin
  select * into v_row from public.lead_delivery_outbox where id = p_outbox_id for update;
  if not found then
    raise exception 'outbox row % not found', p_outbox_id;
  end if;

  if p_success then
    v_outcome := 'sent';
    update public.lead_delivery_outbox
      set status          = 'sent',
          external_id     = coalesce(p_external_id, external_id),
          last_error      = null,
          locked_at       = null,
          locked_by       = null,
          next_attempt_at = now()
      where id = p_outbox_id
      returning * into v_row;
  elsif p_permanent or v_row.attempts >= v_row.max_attempts then
    v_outcome := 'permanent_error';
    update public.lead_delivery_outbox
      set status     = 'dead_letter',
          last_error = left(coalesce(p_error, 'unknown error'), 1000),
          locked_at  = null,
          locked_by  = null
      where id = p_outbox_id
      returning * into v_row;
  else
    v_outcome := 'transient_error';
    -- Exponential backoff (2^attempts sec, capped at 512s) with 0.5x–1.5x jitter.
    v_backoff := (least(power(2, v_row.attempts)::int, 512) * (0.5 + random()))
                 * interval '1 second';
    update public.lead_delivery_outbox
      set status          = 'pending',
          last_error      = left(coalesce(p_error, 'unknown error'), 1000),
          locked_at       = null,
          locked_by       = null,
          next_attempt_at = now() + v_backoff
      where id = p_outbox_id
      returning * into v_row;
  end if;

  insert into public.lead_delivery_attempts
    (outbox_id, attempt_number, outcome, provider_status, external_id, error)
  values
    (p_outbox_id, v_row.attempts, v_outcome, p_provider_status, p_external_id,
     left(nullif(p_error, ''), 1000));

  return v_row;
end;
$$;

-- Lock these RPCs down: only the service role (server) may execute them.
revoke all on function public.claim_lead_deliveries(text, integer, integer) from public;
revoke all on function public.complete_lead_delivery(uuid, boolean, text, text, boolean, integer) from public;
