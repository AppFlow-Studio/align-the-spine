import { createHash } from "node:crypto";

import type { Attribution } from "@/lib/attribution";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/** ATS-E5: durable first-party lead persistence. A lead exists here before
 * app/api/lead/route.ts ever returns success — notification delivery
 * (lib/lead-delivery.ts) is layered on top afterward and is never the
 * source of truth for whether a lead was captured. */

export type DeliveryStatus = "pending" | "delivered" | "failed";

export interface LeadRecord {
  id: string;
  idempotencyKey: string;
  variant: string;
  fields: Record<string, string>;
  attribution: Attribution;
  priority: string;
  deliveryStatus: DeliveryStatus;
  providerResponseId: string | null;
  providerResponseBody: string | null;
  retryCount: number;
  finalFailureState: boolean;
  deliveredAt: string | null;
  createdAt: string;
}

export interface PersistLeadInput {
  variant: string;
  values: Record<string, string>;
  attribution: Attribution;
  priority: string;
}

export interface PersistLeadResult {
  lead: LeadRecord;
  /** True when this submission's idempotency key already existed — the
   * returned `lead` is the ORIGINAL record (its original attribution is
   * preserved, 5.7), not a new row. */
  isDuplicate: boolean;
}

/** 10-minute buckets: two submissions with identical variant+values within
 * the same window dedupe as one lead; the same content submitted again
 * later (a legitimate repeat booking, not a double-click/retry) gets its
 * own new record instead of being dropped forever. */
const DEDUPE_WINDOW_MS = 10 * 60 * 1000;

/** Deterministic per the submission's own content + time bucket — NOT
 * random — so a client retry (network blip, double-click) of the exact same
 * submission always lands on the exact same key and safely no-ops against
 * the table's UNIQUE constraint, rather than depending on the client to
 * remember and resend an id from its first attempt. */
export function buildIdempotencyKey(variant: string, values: Record<string, string>): string {
  const sortedEntries = Object.entries(values)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const bucket = Math.floor(Date.now() / DEDUPE_WINDOW_MS);
  return createHash("sha256").update(`${variant}|${sortedEntries}|${bucket}`).digest("hex");
}

interface LeadRow {
  id: string;
  idempotency_key: string;
  variant: string;
  fields: Record<string, string>;
  attribution: Attribution;
  priority: string;
  delivery_status: DeliveryStatus;
  provider_response_id: string | null;
  provider_response_body: string | null;
  retry_count: number;
  final_failure_state: boolean;
  delivered_at: string | null;
  created_at: string;
}

function rowToRecord(row: LeadRow): LeadRecord {
  return {
    id: row.id,
    idempotencyKey: row.idempotency_key,
    variant: row.variant,
    fields: row.fields,
    attribution: row.attribution,
    priority: row.priority,
    deliveryStatus: row.delivery_status,
    providerResponseId: row.provider_response_id,
    providerResponseBody: row.provider_response_body,
    retryCount: row.retry_count,
    finalFailureState: row.final_failure_state,
    deliveredAt: row.delivered_at,
    createdAt: row.created_at,
  };
}

/** Persists a lead durably. Resolves once the row is confirmed written (or
 * confirmed already present via idempotency) — callers must not report
 * success to the visitor before this resolves, and must treat a rejection
 * as "the lead was not captured," not fall back to pretending it was. */
export async function persistLead(input: PersistLeadInput): Promise<PersistLeadResult> {
  const idempotencyKey = buildIdempotencyKey(input.variant, input.values);
  const supabase = getSupabaseAdmin();

  const { data: inserted, error: insertError } = await supabase
    .from("leads")
    .insert({
      idempotency_key: idempotencyKey,
      variant: input.variant,
      fields: input.values,
      attribution: input.attribution,
      priority: input.priority,
    })
    .select()
    .maybeSingle();

  if (!insertError && inserted) {
    return { lead: rowToRecord(inserted as LeadRow), isDuplicate: false };
  }

  // 23505 = unique_violation (Postgres) — the only error we treat as
  // "already persisted" rather than "persistence failed". Anything else
  // (network error, RLS misconfiguration, connection failure) propagates so
  // the caller correctly refuses to report success.
  const isConflict =
    insertError !== null &&
    typeof insertError === "object" &&
    "code" in insertError &&
    insertError.code === "23505";
  if (!isConflict) {
    throw new Error(
      `lib/lead-store.ts: persist failed — ${insertError?.message ?? "no row returned"}`,
    );
  }

  const { data: existing, error: selectError } = await supabase
    .from("leads")
    .select()
    .eq("idempotency_key", idempotencyKey)
    .single();
  if (selectError || !existing) {
    throw new Error(
      `lib/lead-store.ts: duplicate detected but original row not found — ${selectError?.message}`,
    );
  }

  return { lead: rowToRecord(existing as LeadRow), isDuplicate: true };
}

export interface DeliveryUpdate {
  deliveryStatus: DeliveryStatus;
  providerResponseId?: string | null;
  providerResponseBody?: string | null;
  retryCount: number;
  finalFailureState: boolean;
}

/** Records delivery outcome on an already-durable lead (5.5) — called only
 * from lib/lead-delivery.ts, after persistLead has already resolved. */
export async function recordDeliveryOutcome(leadId: string, update: DeliveryUpdate): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("leads")
    .update({
      delivery_status: update.deliveryStatus,
      provider_response_id: update.providerResponseId ?? null,
      provider_response_body: update.providerResponseBody ?? null,
      retry_count: update.retryCount,
      final_failure_state: update.finalFailureState,
      delivered_at: update.deliveryStatus === "delivered" ? new Date().toISOString() : null,
    })
    .eq("id", leadId);

  if (error) {
    // The lead itself is already durably persisted regardless of this
    // write's outcome — losing a delivery-status update is a visibility gap
    // for operators, not a lost lead, so this logs rather than throwing.
    console.error(`[lead-store] failed to record delivery outcome for ${leadId}:`, error.message);
  }
}
