-- Destructive workflow rollback. Run before 202608160001_content_platform.down.sql
-- and only after a backup plus explicit production approval.
drop function if exists public.save_content_draft(uuid, integer, jsonb, text, jsonb);
drop function if exists public.complete_publication_event(uuid, text, jsonb, text, text);
drop function if exists public.transition_content(uuid, integer, public.content_status, text);
