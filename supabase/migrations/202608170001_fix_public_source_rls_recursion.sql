-- Corrective migration. Additive to 001-004; does not modify or replace them.
--
-- Bug: sources_public_read (on public.sources) joins public.content_sources
-- inside its USING clause, while content_sources_public_read (on
-- public.content_sources) joins public.sources inside its USING clause.
-- Anonymous reads of either table make Postgres evaluate the other table's
-- RLS policy as part of the same plan, which requires re-evaluating the
-- first table's policy again -> "infinite recursion detected in policy for
-- relation ..." (42P17). This was never caught locally because it only
-- surfaces against a real Postgres instance under the anon role, which the
-- prior local-only verification passes never exercised.
--
-- Fix: match the codebase's existing pattern (is_public_content,
-- current_editorial_role, current_crm_role, public_reviewer_name) of using a
-- SECURITY DEFINER helper function for any RLS check that needs to read a
-- second RLS-protected table. The function body executes with the owning
-- role's privileges, so it does not re-enter the caller's RLS evaluation
-- chain, breaking the cycle. Both policies keep the exact same visibility
-- rules as migration 001 -- only the recursion is fixed.

create or replace function public.source_is_publicly_cited(target_source_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.content_sources cs
    join public.content_items ci on ci.id = cs.content_id
    where cs.source_id = target_source_id and public.is_public_content(ci)
  );
$$;

revoke all on function public.source_is_publicly_cited(uuid) from public;
grant execute on function public.source_is_publicly_cited(uuid) to anon, authenticated;

drop policy if exists sources_public_read on public.sources;
create policy sources_public_read on public.sources for select to anon
  using (verification_status = 'verified' and public.source_is_publicly_cited(id));

create or replace function public.content_source_link_is_public(target_content_id uuid, target_source_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.content_items ci
    join public.sources s on s.id = target_source_id and s.verification_status = 'verified'
    where ci.id = target_content_id and public.is_public_content(ci)
  );
$$;

revoke all on function public.content_source_link_is_public(uuid, uuid) from public;
grant execute on function public.content_source_link_is_public(uuid, uuid) to anon, authenticated;

drop policy if exists content_sources_public_read on public.content_sources;
create policy content_sources_public_read on public.content_sources for select to anon
  using (public.content_source_link_is_public(content_id, source_id));
