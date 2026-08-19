import { createHmac } from "node:crypto";

import { siteConfig } from "@/content/site";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

import { decryptLeadSensitiveFields, postgresByteaToBase64 } from "./crypto";
import { renderOfficeNotification } from "./email/office-notification";
import { renderPatientAcknowledgment } from "./email/patient-acknowledgment";

export interface ClaimedDelivery {
  event_id: string;
  attempt_id: string;
  lead_id: string;
  destination: "resend_office" | "resend_patient" | "google_sheets";
  payload: Record<string, unknown>;
  attempt_number: number;
}

export function protectSpreadsheetCell(value: unknown) {
  const text =
    value == null
      ? ""
      : String(value)
          .replace(/[\r\n\t]+/g, " ")
          .slice(0, 1000);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

export function sanitizeDeliveryError(error: unknown) {
  const message = error instanceof Error ? error.message : "delivery_failed";
  return message
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[\w.+-]+@[\w.-]+/g, "[email]")
    .slice(0, 500);
}

export function buildSignedSheetsRequest(
  eventId: string,
  payload: Record<string, unknown>,
  secret: string,
  now = Date.now(),
) {
  const timestamp = Math.floor(now / 1000).toString();
  const signedBody = JSON.stringify({ timestamp, eventId, payload });
  const signature = createHmac("sha256", secret).update(signedBody).digest("hex");
  return { timestamp, body: JSON.stringify({ timestamp, eventId, payload, signature }) };
}

export function isSuccessfulSheetsResponse(responseOk: boolean, result: unknown) {
  return (
    responseOk &&
    typeof result === "object" &&
    result !== null &&
    (result as { ok?: unknown }).ok === true
  );
}

async function loadLead(leadId: string, includeSensitive = false) {
  const client = createSupabaseServiceClient();
  const [leadResult, attributionResult, sensitiveResult] = await Promise.all([
    client.from("lead_submissions").select("*").eq("id", leadId).single(),
    client.from("lead_attribution").select("*").eq("lead_id", leadId).maybeSingle(),
    includeSensitive
      ? client.from("lead_sensitive_payloads").select("*").eq("lead_id", leadId).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  if (leadResult.error || !leadResult.data) throw new Error("lead_record_unavailable");
  let sensitive: Record<string, string> = {};
  const encrypted = sensitiveResult.data;
  if (encrypted) {
    sensitive = decryptLeadSensitiveFields({
      ciphertext: postgresByteaToBase64(encrypted.ciphertext as string),
      iv: postgresByteaToBase64(encrypted.iv as string),
      authTag: postgresByteaToBase64(encrypted.auth_tag as string),
      keyVersion: encrypted.key_version as number,
      fieldNames: encrypted.field_names as string[],
    });
  }
  return { lead: leadResult.data, attribution: attributionResult.data ?? {}, sensitive };
}

export async function claimLeadDeliveries(workerId: string, batchSize = 10) {
  const { data, error } = await createSupabaseServiceClient().rpc("claim_lead_delivery_batch", {
    worker: workerId,
    batch_size: batchSize,
    stale_after_seconds: Number(process.env.LEAD_OUTBOX_STALE_SECONDS ?? "300"),
  });
  if (error) throw new Error("delivery_claim_failed");
  return (data ?? []) as ClaimedDelivery[];
}

// `||`, not `??`: an explicitly-blank LEAD_FROM_EMAIL/LEAD_TO_EMAIL (the
// documented "leave blank until configured" state in .env.example) is an
// empty string, not undefined/null, so `??` would silently send `from: ""`
// to Resend instead of falling back — Resend rejects that with a 422
// "domain is invalid" that looks unrelated to the real cause.
export function resendFromAddress() {
  return process.env.LEAD_FROM_EMAIL || "Align the Spine Website <onboarding@resend.dev>";
}

// Comma-separated so office notifications can go to more than one inbox at
// once (owner direction 2026-08-19: the client's Gmail AND the new
// info@chirobackpain.com workspace inbox, both, not either/or). Falls back
// to siteConfig.business.email — same blank-string reasoning as
// resendFromAddress above.
export function resendToAddresses(): string[] {
  const raw = process.env.LEAD_TO_EMAIL || siteConfig.business.email;
  return raw
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

function leadDisplayName(fields: Record<string, string>) {
  if (fields.firstName || fields.lastName)
    return [fields.firstName, fields.lastName].filter(Boolean).join(" ");
  return fields.name || null;
}

function attributionSummary(attribution: Record<string, unknown>) {
  const source = attribution.utm_source as string | undefined;
  const medium = attribution.utm_medium as string | undefined;
  const campaign = attribution.utm_campaign as string | undefined;
  if (!source && !medium && !campaign) return null;
  return `${source ?? "—"} / ${medium ?? "—"} / ${campaign ?? "—"}`;
}

async function sendResendEmail(options: {
  eventId: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("resend_not_configured");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": options.eventId,
    },
    body: JSON.stringify({
      from: resendFromAddress(),
      to: Array.isArray(options.to) ? options.to : [options.to],
      reply_to: options.replyTo || undefined,
      subject: options.subject,
      html: options.html,
      text: options.text,
    }),
  });
  const body = (await response.json().catch(() => null)) as {
    id?: string;
    message?: string;
  } | null;
  if (!response.ok) throw new Error(`resend_http_${response.status}`);
  return { providerId: body?.id, httpStatus: response.status };
}

async function deliverResendOffice(event: ClaimedDelivery) {
  const includeSensitive = process.env.LEAD_EMAIL_INCLUDE_SENSITIVE === "true";
  const record = await loadLead(event.lead_id, includeSensitive);
  const { lead, attribution, sensitive } = record;
  const fields = lead.contact_fields as Record<string, string>;
  const doc = renderOfficeNotification({
    shortSubmissionId: lead.id.slice(0, 8),
    formId: lead.form_id,
    formVersion: lead.form_version,
    intent: lead.intent,
    priority: lead.priority,
    createdAtLocal: new Date(lead.submitted_at).toLocaleString("en-US", {
      timeZone: "America/New_York",
      dateStyle: "medium",
      timeStyle: "short",
    }),
    name: leadDisplayName(fields),
    phone: fields.phone ?? null,
    email: fields.email ?? null,
    zip: fields.zip ?? null,
    bestTime: fields.bestTime ?? null,
    carAccident: fields.carAccident ?? null,
    sourcePath: lead.source_page_path,
    attributionSummary: attributionSummary(attribution),
    sensitive: includeSensitive ? sensitive : null,
  });
  return sendResendEmail({
    eventId: event.event_id,
    to: resendToAddresses(),
    replyTo: fields.email,
    subject: doc.subject,
    html: doc.html,
    text: doc.text,
  });
}

async function deliverResendPatient(event: ClaimedDelivery) {
  const record = await loadLead(event.lead_id, false);
  const { lead } = record;
  const fields = lead.contact_fields as Record<string, string>;
  if (!fields.email) throw new Error("patient_email_missing");
  const doc = renderPatientAcknowledgment({
    firstName: fields.firstName ?? null,
    intent: lead.intent,
  });
  return sendResendEmail({
    eventId: event.event_id,
    to: fields.email,
    subject: doc.subject,
    html: doc.html,
    text: doc.text,
  });
}

export function buildSheetsPayload(eventId: string, record: Awaited<ReturnType<typeof loadLead>>) {
  const { lead, attribution } = record;
  const fields = lead.contact_fields as Record<string, string>;
  const payload = {
    eventId,
    leadId: lead.id,
    submittedAt: lead.submitted_at,
    formId: lead.form_id,
    formVersion: lead.form_version,
    status: lead.status,
    priority: lead.priority,
    intent: lead.intent,
    sourcePagePath: lead.source_page_path,
    firstName: protectSpreadsheetCell(fields.firstName ?? fields.name),
    lastName: protectSpreadsheetCell(fields.lastName),
    phone: protectSpreadsheetCell(fields.phone),
    email: protectSpreadsheetCell(fields.email),
    zip: protectSpreadsheetCell(fields.zip),
    reason: protectSpreadsheetCell(fields.reason),
    bestTime: protectSpreadsheetCell(fields.bestTime),
    carAccident: protectSpreadsheetCell(fields.carAccident),
    initialLandingPath: attribution.initial_landing_path,
    latestLandingPath: attribution.latest_landing_path,
    referrerHost: attribution.referrer_host,
    utmSource: attribution.utm_source,
    utmMedium: attribution.utm_medium,
    utmCampaign: attribution.utm_campaign,
    utmTerm: attribution.utm_term,
    utmContent: attribution.utm_content,
    utmId: attribution.utm_id,
    gclid: attribution.gclid,
    gbraid: attribution.gbraid,
    wbraid: attribution.wbraid,
    dclid: attribution.dclid,
    msclkid: attribution.msclkid,
    fbclid: attribution.fbclid,
    fbc: attribution.fbc,
    fbp: attribution.fbp,
    ttclid: attribution.ttclid,
    liFatId: attribution.li_fat_id,
    gaClientId: attribution.ga_client_id,
    gaSessionId: attribution.ga_session_id,
    gaSessionNumber: attribution.ga_session_number,
  };
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key,
      typeof value === "string" ? protectSpreadsheetCell(value) : value,
    ]),
  );
}

async function deliverGoogleSheets(event: ClaimedDelivery) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
  if (!url || !secret) throw new Error("sheets_not_configured");
  if (new URL(url).protocol !== "https:") throw new Error("sheets_url_not_https");
  const payload = buildSheetsPayload(event.event_id, await loadLead(event.lead_id, false));
  const { timestamp, body } = buildSignedSheetsRequest(event.event_id, payload, secret);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-ATS-Timestamp": timestamp,
    },
    body,
  });
  const result = (await response.json().catch(() => null)) as {
    ok?: boolean;
    duplicate?: boolean;
  } | null;
  if (!isSuccessfulSheetsResponse(response.ok, result))
    throw new Error(`sheets_invalid_response_${response.status}`);
  return { providerId: event.event_id, httpStatus: response.status };
}

export async function processLeadDeliveryBatch(workerId: string, batchSize = 10) {
  const client = createSupabaseServiceClient();
  const claimed = await claimLeadDeliveries(workerId, batchSize);
  for (const event of claimed) {
    try {
      const result =
        event.destination === "resend_office"
          ? await deliverResendOffice(event)
          : event.destination === "resend_patient"
            ? await deliverResendPatient(event)
            : await deliverGoogleSheets(event);
      const { error } = await client.rpc("complete_lead_delivery_attempt", {
        target_attempt_id: event.attempt_id,
        worker: workerId,
        succeeded: true,
        provider_id: result.providerId ?? null,
        response_status: result.httpStatus,
      });
      if (error) throw new Error("delivery_completion_failed");
    } catch (error) {
      await client.rpc("complete_lead_delivery_attempt", {
        target_attempt_id: event.attempt_id,
        worker: workerId,
        succeeded: false,
        failure_code:
          error instanceof Error ? error.message.split(":")[0].slice(0, 80) : "delivery_failed",
        failure_detail: sanitizeDeliveryError(error),
      });
    }
  }
  return { claimed: claimed.length };
}
