-- Reverts 202609270003_blog_direct_upload.sql: removes the one-call upload RPC
-- and stops notifying the site about direct table writes.
--
-- Posts created through `publish_blog_post()` are untouched — they are ordinary
-- `content_items` rows and stay exactly as they are. Only the entry point goes
-- away.
--
-- Dropping the config table discards the stored endpoint URL and secret; the
-- secret lives in the app environment too (CONTENT_REVALIDATION_SECRET), so
-- re-applying the migration means re-entering the URL, not regenerating
-- anything.

drop trigger if exists content_items_notify_revalidation on public.content_items;
drop function if exists public.content_notify_revalidation();
drop table if exists public.content_revalidation_config;

drop function if exists public.publish_blog_post(jsonb);
drop function if exists public.blog_blocks_from_markdown(text);
