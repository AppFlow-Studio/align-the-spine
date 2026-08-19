/**
 * Server-only read/queries for the /admin/leads CRM view. Runs with the service
 * role behind the /admin Basic-auth gate (proxy.ts). Never exposes secrets or
 * decrypted sensitive payloads.
 */
import { getServiceSupabase } from "./supabase";
import type { LeadRow, OutboxRow } from "./types";

export interface LeadDeliverySummary {
  office?: OutboxRow;
  patient?: OutboxRow;
  sheets?: OutboxRow;
}

export interface LeadListItem {
  lead: LeadRow;
  delivery: LeadDeliverySummary;
}

function summarize(rows: OutboxRow[]): LeadDeliverySummary {
  const summary: LeadDeliverySummary = {};
  for (const row of rows) {
    if (row.delivery_purpose === "office_notification") summary.office = row;
    else if (row.delivery_purpose === "patient_acknowledgment") summary.patient = row;
    else if (row.delivery_purpose === "google_sheets") summary.sheets = row;
  }
  return summary;
}

export async function listLeadsWithDelivery(limit = 100): Promise<LeadListItem[]> {
  const supabase = getServiceSupabase();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  const leadRows = (leads ?? []) as LeadRow[];
  if (leadRows.length === 0) return [];

  const ids = leadRows.map((lead) => lead.id);
  const { data: outbox } = await supabase
    .from("lead_delivery_outbox")
    .select("*")
    .in("lead_id", ids);

  const byLead = new Map<string, OutboxRow[]>();
  for (const row of (outbox ?? []) as OutboxRow[]) {
    const list = byLead.get(row.lead_id) ?? [];
    list.push(row);
    byLead.set(row.lead_id, list);
  }

  return leadRows.map((lead) => ({
    lead,
    delivery: summarize(byLead.get(lead.id) ?? []),
  }));
}

export interface LeadDetail {
  lead: LeadRow;
  outbox: OutboxRow[];
}

export async function getLeadDetail(id: string): Promise<LeadDetail | null> {
  const supabase = getServiceSupabase();
  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (!lead) return null;
  const { data: outbox } = await supabase
    .from("lead_delivery_outbox")
    .select("*")
    .eq("lead_id", id)
    .order("delivery_purpose");
  return { lead: lead as LeadRow, outbox: (outbox ?? []) as OutboxRow[] };
}

/**
 * Manual, SAFE requeue: only a dead-lettered row may be re-sent. Suppressed rows
 * (bounce/complaint/suppression) are intentionally NOT requeueable here — that
 * would resend to an address the provider already rejected.
 */
export async function requeueDelivery(outboxId: string): Promise<boolean> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("lead_delivery_outbox")
    .update({
      status: "pending",
      attempts: 0,
      next_attempt_at: new Date().toISOString(),
      last_error: null,
    })
    .eq("id", outboxId)
    .eq("status", "dead_letter")
    .select("id");
  return Boolean(data && data.length > 0);
}
