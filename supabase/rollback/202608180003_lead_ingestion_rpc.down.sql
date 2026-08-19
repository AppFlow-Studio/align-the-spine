-- Rollback for 202608180003_lead_ingestion_rpc.sql (manual/forward-only).

drop function if exists public.ingest_lead(
  uuid, text, integer, text, text, text, text, text, text, text, text, text, text,
  jsonb, jsonb, text, text, boolean, text, text, text, boolean, boolean
);
