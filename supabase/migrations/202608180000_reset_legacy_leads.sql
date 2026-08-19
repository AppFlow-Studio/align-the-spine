-- ===========================================================================
-- One-time cleanup of a pre-existing, incompatible lead stub
-- ---------------------------------------------------------------------------
-- The target project was created with an earlier single-table lead design
-- (a `public.leads` table with idempotency_key/variant/fields/delivery_status/
-- provider_response_id/... and a `set_updated_at` function) that predates and
-- is incompatible with the normalized schema in 202608180001+. Because
-- `create table if not exists` silently skips an existing table, that stub
-- blocks migration 001 (its column comments fail).
--
-- This runs FIRST (filename sorts before 202608180001) and removes only that
-- legacy stub. It is fully idempotent and SAFE everywhere:
--   * on a fresh database both DROPs are no-ops (`if exists`);
--   * migrations run exactly once, so this never re-drops the real `leads`
--     table that 202608180001 creates immediately afterward.
-- ===========================================================================

drop table if exists public.leads cascade;
drop function if exists public.set_updated_at() cascade;
