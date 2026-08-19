import { createHmac } from "node:crypto";

import { siteConfig } from "@/content/site";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

import { decryptLeadSensitiveFields, postgresByteaToBase64 } from "./crypto";

export interface ClaimedDelivery {
  event_id: string;
  attempt_id: string;
  lead_id: string;
  destination: "resend" | "google_sheets";
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

export function buildResendEmailLines(
  record: Awaited<ReturnType<typeof loadLead>>,
  includeSensitive: boolean,
) {
  const { lead, attribution, sensitive } = record;
  const fields = lead.contact_fields as Record<string, string>;
  return [
    `Lead ID: ${lead.id}`,
    `Form: ${lead.form_id} v${lead.form_version}`,
    `Priority: ${lead.priority}`,
    `Intent: ${lead.intent}`,
    ...Object.entries(fields).map(([key, value]) => `${key}: ${value}`),
    ...(includeSensitive
      ? Object.entries(sensitive).map(([key, value]) => `${key}: ${value}`)
      : []),
    `Source page: ${lead.source_page_path}`,
    `Campaign: ${attribution.utm_source ?? "—"} / ${attribution.utm_medium ?? "—"} / ${attribution.utm_campaign ?? "—"}`,
  ];
}

async function deliverResend(event: ClaimedDelivery) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("resend_not_configured");
  const includeSensitive = process.env.LEAD_EMAIL_INCLUDE_SENSITIVE === "true";
  const record = await loadLead(event.lead_id, includeSensitive);
  const { lead } = record;
  const fields = lead.contact_fields as Record<string, string>;
  const lines = buildResendEmailLines(record, includeSensitive);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": event.event_id,
    },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL ?? "Align the Spine Website <onboarding@resend.dev>",
      to: [process.env.LEAD_TO_EMAIL ?? siteConfig.business.email],
      reply_to: fields.email || undefined,
      subject: `${lead.priority === "high" ? "[PRIORITY] " : ""}New website request — ${lead.form_id}`,
      text: lines.join("\n"),
    }),
  });
  const body = (await response.json().catch(() => null)) as {
    id?: string;
    message?: string;
  } | null;
  if (!response.ok) throw new Error(`resend_http_${response.status}`);
  return { providerId: body?.id, httpStatus: response.status };
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
        event.destination === "resend"
          ? await deliverResend(event)
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
