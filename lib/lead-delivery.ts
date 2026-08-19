import { leadFormVariants, type LeadFormVariant } from "@/content/lead-forms";
import { isProduction, siteConfig } from "@/content/site";
import type { Attribution } from "@/lib/attribution";
import { recordDeliveryOutcome, type LeadRecord } from "@/lib/lead-store";

/** ATS-E5 5.4/5.6: notification-provider abstraction, layered on top of an
 * already-durably-persisted lead (lib/lead-store.ts). Delivery failing here
 * never means the lead was lost — it only ever affects `delivery_status` on
 * a row that already exists. Called from app/api/lead/route.ts's `after()`,
 * i.e. strictly after persistLead() has resolved (5.11). */

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = [250, 750];
/** Response bodies are stored for operator debugging — capped so a
 * pathological provider response can't bloat the leads table. */
const MAX_RESPONSE_BODY_LENGTH = 2000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatAttributionLines(attribution: Attribution): string[] {
  const entries = Object.entries(attribution).filter(([, value]) => value);
  if (entries.length === 0) return [];
  return ["", "Attribution:", ...entries.map(([key, value]) => `  ${key}: ${value}`)];
}

interface EmailResult {
  providerResponseId: string | null;
  providerResponseBody: string;
}

/** One send attempt — throws on any non-2xx response or network failure so
 * the retry loop in deliverLead() can catch it uniformly. Mirrors the email
 * shape the old app/api/lead/route.ts built inline, just moved here. */
async function sendLeadEmail(lead: LeadRecord): Promise<EmailResult> {
  const config = leadFormVariants[lead.variant as LeadFormVariant];
  const lines = config.fields.map((field) => `${field.label}: ${lead.fields[field.name] || "—"}`);
  const attributionLines = formatAttributionLines(lead.attribution);
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Local/dev fallback so forms stay demoable before the key is
    // provisioned — matches the pre-ATS-E5 behavior. The lead itself is
    // already durably persisted regardless (that's the whole point of this
    // ticket), so this no longer risks losing anything. The payload dump is
    // gated to non-production: if this key is ever simply unset in a real
    // deploy, that must NOT put patient name/phone/email into Vercel's
    // server logs (5.6's "no sensitive payload" principle isn't only about
    // the operator-alert email — plain server logs aren't a safe place for
    // it either, especially on a healthcare site).
    console.warn(
      `[lead-delivery] RESEND_API_KEY not set — logging lead ${lead.id} instead of emailing.`,
    );
    if (!isProduction()) {
      console.warn(
        `[lead-delivery] ${lead.variant} (${lead.priority})\n${[...lines, ...attributionLines].join("\n")}`,
      );
    }
    throw new Error("RESEND_API_KEY not set");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL ?? "Align the Spine Website <onboarding@resend.dev>",
      to: [process.env.LEAD_TO_EMAIL ?? siteConfig.business.email],
      reply_to: lead.fields.email || undefined,
      subject: `${lead.priority === "high" ? "[PRIORITY] " : ""}New lead — ${config.submitLabel}`,
      text: `New "${lead.variant}" lead from the website (priority: ${lead.priority}, leadId: ${lead.id}):\n\n${[...lines, ...attributionLines].join("\n")}`,
    }),
  });

  const bodyText = (await response.text()).slice(0, MAX_RESPONSE_BODY_LENGTH);
  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${bodyText}`);
  }

  let providerResponseId: string | null = null;
  try {
    const parsed: unknown = JSON.parse(bodyText);
    if (parsed && typeof parsed === "object" && "id" in parsed && typeof parsed.id === "string") {
      providerResponseId = parsed.id;
    }
  } catch {
    // Non-JSON success body — keep providerResponseBody, leave the id null.
  }

  return { providerResponseId, providerResponseBody: bodyText };
}

/** 5.6: alerts operators by referencing `leadId` ONLY — the sensitive
 * payload (name, phone, injury details, etc.) never appears in this email,
 * only in the leads table an operator with dashboard access can query.
 * Sent via the same Resend key as normal delivery; if that key itself is
 * what's missing, this degrades to a console.error the same way
 * sendLeadEmail's dev fallback does — the lead's `delivery_status: failed`
 * row remains the durable signal either way. */
async function alertOperatorsOfFailedDelivery(leadId: string, cause: unknown): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const reason = cause instanceof Error ? cause.message : String(cause);

  if (!apiKey) {
    console.error(`[lead-delivery] ALERT: delivery failed for leadId=${leadId} — ${reason}`);
    return;
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL ?? "Align the Spine Website <onboarding@resend.dev>",
        // Defaults to the same inbox leads already go to — set
        // LEAD_ALERT_EMAIL to route delivery-failure alerts somewhere else
        // (e.g. a developer/ops address) instead.
        to: [
          process.env.LEAD_ALERT_EMAIL ?? process.env.LEAD_TO_EMAIL ?? siteConfig.business.email,
        ],
        subject: `[Lead delivery failed] leadId=${leadId}`,
        text: `A lead failed to deliver after ${MAX_ATTEMPTS} attempts and needs manual follow-up.\n\nleadId: ${leadId}\nReason: ${reason}\n\nThe lead itself is safely stored — look it up by leadId in the leads table. This alert intentionally omits the submitted form contents.`,
      }),
    });
  } catch (error) {
    console.error(`[lead-delivery] ALERT delivery itself failed for leadId=${leadId}:`, error);
  }
}

/** Attempts delivery up to MAX_ATTEMPTS times, records the outcome on the
 * lead either way, and alerts operators (without the payload) on final
 * failure. Never throws — a delivery failure is fully handled here so it
 * can't propagate back into the request/response cycle that already
 * completed by the time this runs (see route.ts's after()). */
export async function deliverLead(lead: LeadRecord): Promise<void> {
  // A missing key is a config state, not a transient failure — retrying
  // can't fix it, so this skips straight to recording "failed" instead of
  // burning ~1s of artificial retry delay for nothing on every submission.
  // Still routes through alertOperatorsOfFailedDelivery so there's ONE
  // consistent "ALERT: ..." log line an operator/monitor can watch for,
  // whether delivery failed because the key is missing (this branch) or
  // because Resend itself rejected every attempt (below) — a missing key in
  // a real deploy is exactly the kind of misconfiguration 5.6 exists to
  // surface, not something to go quiet about.
  if (!process.env.RESEND_API_KEY) {
    await sendLeadEmail(lead).catch(() => undefined);
    await recordDeliveryOutcome(lead.id, {
      deliveryStatus: "failed",
      retryCount: 0,
      finalFailureState: true,
    });
    await alertOperatorsOfFailedDelivery(lead.id, new Error("RESEND_API_KEY not set"));
    return;
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const result = await sendLeadEmail(lead);
      await recordDeliveryOutcome(lead.id, {
        deliveryStatus: "delivered",
        providerResponseId: result.providerResponseId,
        providerResponseBody: result.providerResponseBody,
        retryCount: attempt - 1,
        finalFailureState: false,
      });
      return;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS[attempt - 1] ?? 1000);
    }
  }

  await recordDeliveryOutcome(lead.id, {
    deliveryStatus: "failed",
    retryCount: MAX_ATTEMPTS - 1,
    finalFailureState: true,
  });
  await alertOperatorsOfFailedDelivery(lead.id, lastError);
}
