-- Transactional workflow assertions; run in isolated staging after 001-004.
begin;
do $$
declare expected_forms integer; trigger_count integer;
begin
  select count(*) into expected_forms from public.form_definitions where version=1 and form_id in
    ('heroEval','accidentEval','contactUs','carAccident','reviewsEval','contact','eligibility','booking');
  if expected_forms <> 8 then raise exception 'Expected eight v1 form definitions, found %', expected_forms; end if;
  if exists (
    select 1 from public.form_definitions fd, jsonb_array_elements(fd.field_contract) field
    where field->>'name' in ('message','accidentDate') and coalesce((field->>'sensitive')::boolean,false) = false
  ) then raise exception 'Sensitive fields are not marked sensitive'; end if;
  select count(*) into trigger_count from pg_trigger where tgname='lead_delivery_enqueue_after_insert' and not tgisinternal;
  if trigger_count <> 1 then raise exception 'Delivery enqueue trigger missing'; end if;
  if not has_function_privilege('service_role','public.ingest_lead_submission(uuid,text,integer,jsonb,jsonb,jsonb,public.lead_priority,public.lead_intent,text,timestamptz,text,text,text,integer,text[],text,integer)','execute') then raise exception 'service role cannot ingest'; end if;
  if not has_function_privilege('service_role','public.complete_lead_delivery_attempt(uuid,uuid,boolean,text,integer,text,text)','execute') then raise exception 'service role cannot complete delivery'; end if;
end $$;

do $$
declare
  first_lead uuid;
  duplicate_lead uuid;
  was_created boolean;
  first_event uuid;
  first_attempt uuid;
  second_worker_same_event integer;
  delivery_state public.lead_delivery_state;
begin
  perform set_config('request.jwt.claim.role', 'service_role', true);
  if not public.consume_lead_rate_limit('workflow-test-fingerprint', 2) then raise exception 'First rate-limit request rejected'; end if;
  if not public.consume_lead_rate_limit('workflow-test-fingerprint', 2) then raise exception 'Second rate-limit request rejected'; end if;
  if public.consume_lead_rate_limit('workflow-test-fingerprint', 2) then raise exception 'Rate limit did not reject excess request'; end if;
  update public.lead_delivery_outbox set state='delivered';

  select lead_id, created into first_lead, was_created
  from public.ingest_lead_submission(
    '44444444-4444-4444-8444-444444444444', 'heroEval', 1,
    '{"firstName":"Test","lastName":"Lead","phone":"+19545550100","email":"test@example.invalid","carAccident":""}',
    '{"initialLandingPath":"/","latestLandingPath":"/contact-us","utm_source":"test"}',
    (select jsonb_build_object('version',consent_version,'wording',consent_wording,'channel','web_form','granted',true) from public.form_definitions where form_id='heroEval' and version=1),
    'standard', 'general', '/contact-us', now(), null, null, null, null, '{}', null, 10
  );
  if not was_created then raise exception 'First ingestion was not created'; end if;
  select lead_id, created into duplicate_lead, was_created
  from public.ingest_lead_submission(
    '44444444-4444-4444-8444-444444444444', 'heroEval', 1,
    '{"firstName":"Test","lastName":"Lead","phone":"+19545550100","email":"test@example.invalid","carAccident":""}',
    '{}', (select jsonb_build_object('version',consent_version,'wording',consent_wording,'channel','web_form','granted',true) from public.form_definitions where form_id='heroEval' and version=1),
    'standard', 'general', '/contact-us', now(), null, null, null, null, '{}', null, 10
  );
  if was_created or duplicate_lead <> first_lead then raise exception 'Idempotent ingestion failed'; end if;
  if (select count(*) from public.lead_submissions where id=first_lead) <> 1
    or (select count(*) from public.lead_attribution where lead_id=first_lead) <> 1
    or (select count(*) from public.lead_consent_receipts where lead_id=first_lead) <> 1
    or (select count(*) from public.lead_status_events where lead_id=first_lead) <> 1
    or (select count(*) from public.lead_delivery_outbox where lead_id=first_lead) <> 2
  then raise exception 'Transactional related-record creation failed'; end if;

  update public.lead_delivery_outbox set max_attempts=1 where lead_id=first_lead;
  select event_id, attempt_id into first_event, first_attempt
  from public.claim_lead_delivery_batch('55555555-5555-4555-8555-555555555555', 1, 300);
  select count(*) into second_worker_same_event
  from public.claim_lead_delivery_batch('66666666-6666-4666-8666-666666666666', 10, 300)
  where event_id=first_event;
  if second_worker_same_event <> 0 then raise exception 'Two workers claimed the same event'; end if;
  select public.complete_lead_delivery_attempt(first_attempt, '55555555-5555-4555-8555-555555555555', false, null, 503, 'test_failure', 'sanitized failure') into delivery_state;
  if delivery_state <> 'dead_letter' then raise exception 'Maximum-attempt delivery did not dead-letter'; end if;
  if not exists (select 1 from public.lead_submissions where id=first_lead) then raise exception 'Delivery failure removed the source lead'; end if;
end $$;

rollback;
