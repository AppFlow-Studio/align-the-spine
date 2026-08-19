/**
 * Server-only Supabase client for the lead CRM, authenticated with the
 * service-role key. The service role bypasses RLS, so this module must NEVER be
 * imported from client code — every table in the lead schema is default-deny to
 * anon/authenticated, and this key is the only thing that can reach it.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "./env";

let cached: SupabaseClient | null = null;

export function getServiceSupabase(): SupabaseClient {
  if (cached) return cached;
  const { url, serviceRoleKey } = getSupabaseConfig();
  cached = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "ats-lead-crm" } },
  });
  return cached;
}

/** Test seam: drops the memoized client so a test can swap env and re-init. */
export function resetServiceSupabase(): void {
  cached = null;
}
