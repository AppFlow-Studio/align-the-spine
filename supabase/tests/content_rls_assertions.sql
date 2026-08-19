-- Run after migrations in an isolated Supabase test/staging database.
-- This script is read-only and aborts if a content table loses RLS or if the
-- public DTO view is missing its security-invoker boundary.
do $$
declare
  table_name text;
  rls_enabled boolean;
  view_options text[];
begin
  foreach table_name in array array[
    'profiles', 'authors', 'assets', 'content_items', 'categories', 'tags',
    'content_categories', 'content_tags', 'sources', 'content_sources',
    'content_relations', 'content_revisions', 'redirects', 'publication_events'
  ]
  loop
    select c.relrowsecurity into rls_enabled
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = table_name;

    if rls_enabled is distinct from true then
      raise exception 'RLS assertion failed for public.%', table_name;
    end if;
  end loop;

  select c.reloptions into view_options
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relname = 'public_content_items';

  if view_options is null or not ('security_invoker=true' = any(view_options)) then
    raise exception 'public_content_items must remain security_invoker=true';
  end if;

  if has_table_privilege('anon', 'public.profiles', 'select') then
    raise exception 'anon must not receive direct profile-table access';
  end if;

  if not has_table_privilege('anon', 'public.public_content_items', 'select') then
    raise exception 'anon requires read access to the filtered public DTO view';
  end if;
end $$;
