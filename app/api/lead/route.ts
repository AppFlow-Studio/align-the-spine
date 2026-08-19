import { after, NextResponse } from "next/server";

import { leadFormVariants, type LeadFormVariant } from "@/content/lead-forms";
import { classifyLeadPriority } from "@/lib/analytics";
import { sanitizeAttribution } from "@/lib/attribution";
import { deliverLead } from "@/lib/lead-delivery";
import { buildLeadFormSchema } from "@/lib/lead-form-schema";
import { persistLead } from "@/lib/lead-store";

interface LeadPayload {
  variant?: unknown;
  values?: unknown;
  /** Honeypot field — humans never fill it. */
  website?: unknown;
  /** gclid/utm_* captured client-side (lib/attribution.ts) — re-validated
   * here since it never passes through the zod lead schema. */
  attribution?: unknown;
}

function isVariant(value: unknown): value is LeadFormVariant {
  return typeof value === "string" && value in leadFormVariants;
}

/** Receives LeadForm submissions (ATS-031, rewritten under ATS-E5).
 * Re-validates with the same zod schema the client used and enforces the
 * honeypot server-side, so direct POSTs can't bypass the client-side
 * guards.
 *
 * Required lifecycle (ATS-E5 §"Required submission lifecycle"): validate →
 * persist durably (lib/lead-store.ts) → return success ONLY once
 * persistence has resolved → queue notification delivery
 * (lib/lead-delivery.ts) after the response via `after()`. The previous
 * version returned success right after validation and ran email delivery
 * in `after()` as the *only* record of the lead — a missing API key or a
 * Resend outage meant a visitor saw "success" for a lead that was never
 * captured anywhere. `after()` here exists solely for delivery, never for
 * storage (5.11). */
export async function POST(request: Request) {
  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Spam guard: pretend success so bots learn nothing. Deliberately never
  // persisted — this is bot traffic, not a lead.
  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (!isVariant(payload.variant)) {
    return NextResponse.json({ ok: false, error: "Unknown form variant" }, { status: 400 });
  }

  const schema = buildLeadFormSchema(leadFormVariants[payload.variant].fields);
  const parsed = schema.safeParse(payload.values);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: formatIssues(parsed.error) },
      { status: 422 },
    );
  }

  const variant = payload.variant;
  const attribution = sanitizeAttribution(payload.attribution);
  const priority = classifyLeadPriority(variant, parsed.data);

  let lead: Awaited<ReturnType<typeof persistLead>>["lead"];
  try {
    // Awaited — the response below must never precede this resolving
    // (ATS-E5 5.10, the ticket's explicit acceptance point). A rejection
    // here means the lead was NOT captured anywhere, so it must not be
    // reported as a success.
    ({ lead } = await persistLead({ variant, values: parsed.data, attribution, priority }));
  } catch (error) {
    console.error("[lead] persistence failed — lead was NOT captured:", error);
    return NextResponse.json(
      { ok: false, error: "Could not save your request. Please call us instead." },
      { status: 503 },
    );
  }

  // Scheduling delivery is deliberately OUTSIDE the try/catch above — the
  // lead is already durably persisted at this point, so a failure to even
  // schedule the after() callback must never turn into a false "not
  // captured" response to the visitor. Delivery's own failure handling
  // lives entirely inside lib/lead-delivery.ts.
  try {
    after(async () => {
      await deliverLead(lead);
    });
  } catch (error) {
    console.error(
      `[lead] failed to schedule delivery for already-persisted lead ${lead.id}:`,
      error,
    );
  }

  return NextResponse.json({ ok: true, leadId: lead.id });
}

function formatIssues(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  return error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }));
}
