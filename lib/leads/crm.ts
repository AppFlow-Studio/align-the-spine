import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface LeadFilters {
  query?: string;
  from?: string;
  to?: string;
  form?: string;
  status?: string;
  priority?: string;
  intent?: string;
  source?: string;
  medium?: string;
  campaign?: string;
}

export async function listCrmLeads(filters: LeadFilters) {
  if (
    (process.env.LEAD_REPOSITORY_MODE ?? process.env.CONTENT_REPOSITORY_MODE ?? "fixture") ===
    "fixture"
  )
    return [];
  const client = await createSupabaseServerClient();
  let query = client
    .from("lead_submissions")
    .select("*,lead_attribution(*),lead_delivery_outbox(id,state,destination)")
    .order("created_at", { ascending: false })
    .limit(250);
  if (filters.from) query = query.gte("created_at", `${filters.from}T00:00:00.000Z`);
  if (filters.to) query = query.lte("created_at", `${filters.to}T23:59:59.999Z`);
  if (filters.form) query = query.eq("form_id", filters.form);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.priority) query = query.eq("priority", filters.priority);
  if (filters.intent) query = query.eq("intent", filters.intent);
  const { data, error } = await query;
  if (error) throw new Error("Unable to load leads.");
  const needle = filters.query?.trim().toLowerCase();
  return (data ?? []).filter((row) => {
    const fields = row.contact_fields as Record<string, string>;
    const attribution = Array.isArray(row.lead_attribution)
      ? row.lead_attribution[0]
      : row.lead_attribution;
    if (needle && !Object.values(fields).some((value) => value.toLowerCase().includes(needle)))
      return false;
    if (filters.source && attribution?.utm_source !== filters.source) return false;
    if (filters.medium && attribution?.utm_medium !== filters.medium) return false;
    if (filters.campaign && attribution?.utm_campaign !== filters.campaign) return false;
    return true;
  });
}

export async function getCrmLead(id: string) {
  if (
    (process.env.LEAD_REPOSITORY_MODE ?? process.env.CONTENT_REPOSITORY_MODE ?? "fixture") ===
    "fixture"
  )
    return null;
  const client = await createSupabaseServerClient();
  const { data, error } = await client
    .from("lead_submissions")
    .select(
      "*,lead_attribution(*),lead_consent_receipts(*),lead_status_events(*),lead_delivery_outbox(*,lead_delivery_attempts(*))",
    )
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}
