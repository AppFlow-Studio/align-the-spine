-- Reliable downstream delivery. Supabase remains the source of truth.

create type public.lead_delivery_destination as enum ('resend', 'google_sheets');
create type public.lead_delivery_state as enum ('pending', 'processing', 'retry', 'delivered', 'dead_letter');

create table public.lead_delivery_outbox (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.lead_submissions(id) on delete cascade,
  destination public.lead_delivery_destination not null,
  state public.lead_delivery_state not null default 'pending',
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  max_attempts integer not null default 8 check (max_attempts between 1 and 20),
  available_at timestamptz not null default now(),
  locked_at timestamptz,
  locked_by uuid,
  delivered_at timestamptz,
  last_error_code text,
  last_error_detail text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lead_id, destination)
);

create table public.lead_delivery_attempts (
  id uuid primary key default gen_random_uuid(),
  outbox_id uuid not null references public.lead_delivery_outbox(id) on delete cascade,
  worker_id uuid not null,
  attempt_number integer not null check (attempt_number > 0),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  outcome text check (outcome is null or outcome in ('delivered', 'retry', 'dead_letter')),
  provider_event_id text,
  http_status integer,
  error_code text,
  error_detail text,
  unique (outbox_id, attempt_number)
);

create index lead_delivery_claim_idx on public.lead_delivery_outbox (state, available_at, created_at);
create index lead_delivery_lead_idx on public.lead_delivery_outbox (lead_id, destination);
create index lead_delivery_attempts_event_idx on public.lead_delivery_attempts (outbox_id, started_at desc);

create or replace function public.enqueue_lead_delivery()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.lead_delivery_outbox(lead_id, destination, payload)
  values
    (new.id, 'resend', jsonb_build_object('leadId', new.id, 'formId', new.form_id, 'formVersion', new.form_version)),
    (new.id, 'google_sheets', jsonb_build_object('leadId', new.id, 'formId', new.form_id, 'formVersion', new.form_version));
  return new;
end;
$$;

create trigger lead_delivery_enqueue_after_insert
after insert on public.lead_submissions
for each row execute function public.enqueue_lead_delivery();

create or replace function public.claim_lead_delivery_batch(
  worker uuid,
  batch_size integer default 10,
  stale_after_seconds integer default 300
)
returns table (
  event_id uuid,
  attempt_id uuid,
  lead_id uuid,
  destination public.lead_delivery_destination,
  payload jsonb,
  attempt_number integer
)
language plpgsql
security definer
set search_path = public
as $$
declare item public.lead_delivery_outbox%rowtype; created_attempt uuid; exhausted public.lead_delivery_outbox%rowtype;
begin
  if auth.role() <> 'service_role' then raise exception 'service_role_required' using errcode = '42501'; end if;
  if batch_size < 1 or batch_size > 50 then raise exception 'invalid_batch_size'; end if;
  -- A worker may die after claiming its final permitted attempt. Recover that
  -- stale lock into an explicit dead letter rather than leaving it processing forever.
  for exhausted in
    select * from public.lead_delivery_outbox
    where state='processing' and locked_at < now() - make_interval(secs => stale_after_seconds)
      and attempt_count >= max_attempts
    for update skip locked
  loop
    update public.lead_delivery_attempts set completed_at=now(), outcome='dead_letter',
      error_code='stale_lock_exhausted', error_detail='Worker lock expired on the final permitted attempt.'
    where outbox_id=exhausted.id and completed_at is null;
    update public.lead_delivery_outbox set state='dead_letter', locked_at=null, locked_by=null,
      last_error_code='stale_lock_exhausted', last_error_detail='Worker lock expired on the final permitted attempt.', updated_at=now()
    where id=exhausted.id;
    perform public.refresh_lead_delivery_status(exhausted.lead_id);
  end loop;
  for item in
    select * from public.lead_delivery_outbox
    where (
      (state in ('pending','retry') and available_at <= now())
      or (state = 'processing' and locked_at < now() - make_interval(secs => stale_after_seconds))
    ) and attempt_count < max_attempts
    order by available_at, created_at
    for update skip locked
    limit batch_size
  loop
    if item.state = 'processing' then
      update public.lead_delivery_attempts set completed_at=now(), outcome='retry',
        error_code='stale_lock_recovered', error_detail='Previous worker lock expired before completion.'
      where outbox_id=item.id and completed_at is null;
    end if;
    update public.lead_delivery_outbox set
      state = 'processing', locked_at = now(), locked_by = worker,
      attempt_count = attempt_count + 1, updated_at = now()
    where id = item.id
    returning attempt_count into item.attempt_count;
    insert into public.lead_delivery_attempts(outbox_id, worker_id, attempt_number)
    values (item.id, worker, item.attempt_count) returning id into created_attempt;
    event_id := item.id; attempt_id := created_attempt; lead_id := item.lead_id;
    destination := item.destination; payload := item.payload; attempt_number := item.attempt_count;
    return next;
  end loop;
end;
$$;

create or replace function public.refresh_lead_delivery_status(target_lead_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare total_count integer; delivered_count integer; dead_count integer;
begin
  select count(*), count(*) filter (where state = 'delivered'), count(*) filter (where state = 'dead_letter')
  into total_count, delivered_count, dead_count from public.lead_delivery_outbox where lead_id = target_lead_id;
  update public.lead_submissions set delivery_status = case
    when total_count > 0 and delivered_count = total_count then 'delivered'
    when dead_count > 0 and delivered_count = 0 then 'failed'
    when delivered_count > 0 or dead_count > 0 then 'partial'
    else 'pending' end,
    updated_at = now()
  where id = target_lead_id;
end;
$$;

create or replace function public.complete_lead_delivery_attempt(
  target_attempt_id uuid,
  worker uuid,
  succeeded boolean,
  provider_id text default null,
  response_status integer default null,
  failure_code text default null,
  failure_detail text default null
)
returns public.lead_delivery_state
language plpgsql
security definer
set search_path = public
as $$
declare event public.lead_delivery_outbox%rowtype; attempt public.lead_delivery_attempts%rowtype; next_state public.lead_delivery_state; delay_seconds numeric;
begin
  if auth.role() <> 'service_role' then raise exception 'service_role_required' using errcode = '42501'; end if;
  select * into attempt from public.lead_delivery_attempts where id = target_attempt_id and worker_id = worker for update;
  if not found or attempt.completed_at is not null then raise exception 'attempt_not_owned_or_complete' using errcode = '42501'; end if;
  select * into event from public.lead_delivery_outbox where id = attempt.outbox_id and locked_by = worker and state = 'processing' for update;
  if not found then raise exception 'event_not_owned' using errcode = '42501'; end if;
  if succeeded then next_state := 'delivered';
  elsif event.attempt_count >= event.max_attempts then next_state := 'dead_letter';
  else next_state := 'retry'; end if;
  delay_seconds := least(86400, power(2, greatest(event.attempt_count - 1, 0)) * 30) * (0.75 + random() * 0.5);
  update public.lead_delivery_attempts set completed_at = now(),
    outcome = case next_state when 'delivered' then 'delivered' when 'dead_letter' then 'dead_letter' else 'retry' end,
    provider_event_id = left(provider_id, 255), http_status = response_status,
    error_code = left(failure_code, 80), error_detail = left(failure_detail, 500)
  where id = target_attempt_id;
  update public.lead_delivery_outbox set state = next_state,
    delivered_at = case when next_state = 'delivered' then now() else null end,
    available_at = case when next_state = 'retry' then now() + make_interval(secs => delay_seconds::integer) else available_at end,
    locked_at = null, locked_by = null,
    last_error_code = case when succeeded then null else left(failure_code, 80) end,
    last_error_detail = case when succeeded then null else left(failure_detail, 500) end,
    updated_at = now()
  where id = event.id;
  perform public.refresh_lead_delivery_status(event.lead_id);
  return next_state;
end;
$$;

create or replace function public.retry_lead_delivery(target_event_id uuid, retry_reason text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare target_lead uuid;
begin
  if public.current_crm_role() not in ('admin','lead_manager') then raise exception 'crm_role_required' using errcode = '42501'; end if;
  if nullif(trim(retry_reason), '') is null then raise exception 'reason_required'; end if;
  update public.lead_delivery_outbox set state = 'retry', available_at = now(), locked_at = null, locked_by = null,
    max_attempts = greatest(max_attempts, attempt_count + 1),
    last_error_code = 'manual_retry', last_error_detail = left(trim(retry_reason), 500), updated_at = now()
  where id = target_event_id and state in ('retry','dead_letter') returning lead_id into target_lead;
  if target_lead is null then raise exception 'delivery_not_retryable' using errcode = '22023'; end if;
  perform public.refresh_lead_delivery_status(target_lead);
end;
$$;

revoke all on function public.enqueue_lead_delivery() from public;
revoke all on function public.claim_lead_delivery_batch(uuid,integer,integer) from public;
revoke all on function public.refresh_lead_delivery_status(uuid) from public;
revoke all on function public.complete_lead_delivery_attempt(uuid,uuid,boolean,text,integer,text,text) from public;
revoke all on function public.retry_lead_delivery(uuid,text) from public;
grant execute on function public.claim_lead_delivery_batch(uuid,integer,integer) to service_role;
grant execute on function public.complete_lead_delivery_attempt(uuid,uuid,boolean,text,integer,text,text) to service_role;
grant execute on function public.retry_lead_delivery(uuid,text) to authenticated;

alter table public.lead_delivery_outbox enable row level security;
alter table public.lead_delivery_attempts enable row level security;
create policy delivery_outbox_crm_read on public.lead_delivery_outbox for select to authenticated using (public.current_crm_role() in ('admin','lead_manager'));
create policy delivery_attempts_crm_read on public.lead_delivery_attempts for select to authenticated using (public.current_crm_role() in ('admin','lead_manager'));
revoke all on public.lead_delivery_outbox, public.lead_delivery_attempts from anon, authenticated;
grant select on public.lead_delivery_outbox, public.lead_delivery_attempts to authenticated;
grant all on public.lead_delivery_outbox, public.lead_delivery_attempts to service_role;
