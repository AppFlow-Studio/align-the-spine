/**
 * Delivery worker: claims outbox rows atomically (claim_lead_deliveries), sends
 * each via its channel, and reports the outcome (complete_lead_delivery, which
 * applies retry/backoff/dead-letter). Concurrency-safe — the claim RPC's FOR
 * UPDATE SKIP LOCKED guarantees two workers never grab the same row, so the
 * same email is never sent twice. Invoked both after a lead POST (best-effort
 * immediate send) and on a cron schedule (retry safety net).
 */
import { resolveSiteUrl } from "@/content/site";

import { decryptSensitive } from "./crypto";
import { ResendSendError, sanitizeError, sendResendEmail } from "./deliver";
import { renderOfficeNotification } from "./email/office-notification";
import { renderPatientAcknowledgment } from "./email/patient-acknowledgment";
import { getLeadEmailConfig, includeSensitiveInEmail } from "./env";
import {
  attributionSummary,
  formatEastern,
  formatUtc,
  formLabel,
  leadDisplayName,
  shortSubmissionId,
} from "./present";
import { getServiceSupabase } from "./supabase";
import type { LeadRow, OutboxRow } from "./types";

export interface WorkerOptions {
  maxJobs?: number;
  workerId?: string;
}

export interface WorkerSummary {
  claimed: number;
  sent: number;
  failed: number;
}

function adminUrlFor(leadId: string): string {
  let base = "https://chirobackpain.com";
  try {
    base = resolveSiteUrl();
  } catch {
    /* prod-without-SITE_URL is handled elsewhere; use the real-domain default */
  }
  return `${base.replace(/\/$/, "")}/admin/leads/${leadId}`;
}

async function fetchLead(leadId: string): Promise<LeadRow | null> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase.from("leads").select("*").eq("id", leadId).single();
  if (error || !data) return null;
  return data as LeadRow;
}

/** Decodes the gated sensitive payload — best-effort: a decrypt failure logs a
 * sanitized note and returns null rather than failing the whole send. */
function decodeSensitive(lead: LeadRow): { message?: string; accidentDate?: string } | null {
  if (!includeSensitiveInEmail() || !lead.sensitive_present || !lead.sensitive_payload) {
    return null;
  }
  try {
    const decoded = decryptSensitive(lead.sensitive_payload) as Record<string, string>;
    return { message: decoded.message, accidentDate: decoded.accidentDate };
  } catch (error) {
    console.error("[worker] sensitive decrypt failed:", sanitizeError(String(error)));
    return null;
  }
}

/** Sends the email for one outbox row. Throws ResendSendError (classified) on
 * failure. */
async function dispatch(outbox: OutboxRow, lead: LeadRow): Promise<string | null> {
  const emailConfig = getLeadEmailConfig();

  if (outbox.destination === "google_sheets") {
    return dispatchGoogleSheets(lead);
  }

  if (outbox.delivery_purpose === "patient_acknowledgment") {
    if (!lead.email) {
      throw new ResendSendError("patient acknowledgment has no recipient email", true);
    }
    const doc = renderPatientAcknowledgment({ firstName: lead.first_name });
    const result = await sendResendEmail({
      to: lead.email,
      subject: doc.subject,
      html: doc.html,
      text: doc.text,
      idempotencyKey: outbox.idempotency_key ?? `ats/patient-ack/${outbox.id}`,
    });
    return result.externalId;
  }

  // office_notification
  const doc = renderOfficeNotification({
    shortSubmissionId: shortSubmissionId(lead.submission_id),
    formLabel: formLabel(lead.form_variant),
    formVersion: lead.form_version,
    priority: lead.priority,
    createdAtUtc: formatUtc(lead.created_at),
    createdAtLocal: formatEastern(lead.created_at),
    name: leadDisplayName(lead),
    phone: lead.phone,
    email: lead.email,
    zip: lead.zip,
    bestTime: lead.best_time,
    reason: lead.reason,
    carAccident: lead.car_accident,
    sourcePath: lead.source_path,
    attributionSummary: attributionSummary(lead.attribution),
    adminUrl: adminUrlFor(lead.id),
    sensitive: decodeSensitive(lead),
  });
  const result = await sendResendEmail({
    to: emailConfig.notificationTo,
    cc: emailConfig.notificationCc,
    // Reply straight to the patient when we have their email; otherwise the
    // monitored practice mailbox.
    replyTo: lead.email ?? emailConfig.replyTo,
    subject: doc.subject,
    html: doc.html,
    text: doc.text,
    idempotencyKey: outbox.idempotency_key ?? `ats/office-lead/${outbox.id}`,
  });
  return result.externalId;
}

async function dispatchGoogleSheets(lead: LeadRow): Promise<string | null> {
  const url = process.env.LEAD_GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) {
    throw new ResendSendError("google sheets webhook not configured", true);
  }
  // Non-sensitive payload only — mirrors the office email's visible fields.
  const payload = {
    submission_id: lead.submission_id,
    created_at: lead.created_at,
    form: lead.form_variant,
    version: lead.form_version,
    priority: lead.priority,
    name: leadDisplayName(lead),
    phone: lead.phone,
    email: lead.email,
    zip: lead.zip,
    reason: lead.reason,
    car_accident: lead.car_accident,
    source_path: lead.source_path,
  };
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new ResendSendError(sanitizeError(String(error)), false);
  }
  if (!response.ok) {
    throw new ResendSendError(`sheets ${response.status}`, response.status < 500);
  }
  return null;
}

export async function runDeliveryWorker(options: WorkerOptions = {}): Promise<WorkerSummary> {
  const maxJobs = options.maxJobs ?? 20;
  const workerId = options.workerId ?? "cron";
  const supabase = getServiceSupabase();

  const { data: claimed, error } = await supabase.rpc("claim_lead_deliveries", {
    p_worker_id: workerId,
    p_limit: maxJobs,
  });
  if (error) {
    throw new Error(`claim failed: ${error.message}`);
  }

  const rows = (claimed ?? []) as OutboxRow[];
  const summary: WorkerSummary = { claimed: rows.length, sent: 0, failed: 0 };

  for (const outbox of rows) {
    try {
      // Defensive: never resend to a terminal-negative delivery state.
      if (
        outbox.delivery_state &&
        ["bounced", "complained", "suppressed"].includes(outbox.delivery_state)
      ) {
        await complete(outbox.id, false, null, "recipient suppressed", true);
        summary.failed += 1;
        continue;
      }

      const lead = await fetchLead(outbox.lead_id);
      if (!lead) {
        await complete(outbox.id, false, null, "lead not found", true);
        summary.failed += 1;
        continue;
      }

      const externalId = await dispatch(outbox, lead);
      await complete(outbox.id, true, externalId, null, false);
      summary.sent += 1;
    } catch (error) {
      const permanent = error instanceof ResendSendError ? error.permanent : false;
      const status = error instanceof ResendSendError ? error.status : undefined;
      const message =
        error instanceof Error ? sanitizeError(error.message) : "unknown delivery error";
      await complete(outbox.id, false, null, message, permanent, status);
      summary.failed += 1;
    }
  }

  return summary;
}

async function complete(
  outboxId: string,
  success: boolean,
  externalId: string | null,
  error: string | null,
  permanent: boolean,
  providerStatus?: number,
): Promise<void> {
  const supabase = getServiceSupabase();
  const { error: rpcError } = await supabase.rpc("complete_lead_delivery", {
    p_outbox_id: outboxId,
    p_success: success,
    p_external_id: externalId,
    p_error: error,
    p_permanent: permanent,
    p_provider_status: providerStatus ?? null,
  });
  if (rpcError) {
    console.error("[worker] complete_lead_delivery failed:", sanitizeError(rpcError.message));
  }
}
