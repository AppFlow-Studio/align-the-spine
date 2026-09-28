-- Reverts 202609270002_blog_gate_autopublish.sql: the database stops computing
-- publication gates and stops publishing anything on its own. `gate_result`
-- goes back to being whatever `save_content_draft` last wrote, which means a
-- row inserted directly into the table is once again invisible to the public
-- site until the app saves over it.
--
-- Two things this does NOT undo, both on purpose:
--
--   * Posts that auto-published stay published. They are real, live pages that
--     may have been linked and indexed; silently retracting them would be worse
--     than leaving them up. Archive any you don't want through the editor.
--   * `gate_result` values already computed stay on their rows. They are
--     accurate as of their `checkedAt`, and blanking them back to
--     `{"passed": false, "blockers": ["Not checked"]}` would hide published
--     pages that are genuinely fine.
--
-- The `noindex` flip IS reversed exactly: 202609270002 cleared the flag but
-- deliberately kept each row's `noindex_reason`, so the same reason match
-- identifies precisely the rows it touched.

drop trigger if exists content_items_prepare_publication on public.content_items;
drop trigger if exists content_items_log_autopublication on public.content_items;
drop trigger if exists content_sources_refresh_parent on public.content_sources;
drop trigger if exists sources_refresh_citing_content on public.sources;

drop view if exists public.content_publication_readiness;

drop function if exists public.content_prepare_for_publication();
drop function if exists public.content_log_autopublication();
drop function if exists public.content_sources_refresh_parent();
drop function if exists public.sources_refresh_citing_content();
drop function if exists public.refresh_content_publication(uuid);
drop function if exists public.content_gate_result(public.content_items);

-- Column defaults. `noindex` went from true to false; the rest had no default
-- at all before this migration, so they are dropped rather than reset.
alter table public.content_items
  alter column noindex set default true,
  alter column search_intent drop default,
  alter column audience drop default,
  alter column seo_title drop default,
  alter column meta_description drop default,
  alter column created_by drop default,
  alter column updated_by drop default,
  alter column author_id drop default;

update public.content_items
set noindex = true
where content_type = 'blog_post'
  and not noindex
  and noindex_reason ~* '(clinical|clinician|medical)\s*(/\w+)?\s*(review|approval)';

-- Dropped last: the default expressions above referenced them.
drop function if exists public.default_editorial_actor();
drop function if exists public.default_content_author();
