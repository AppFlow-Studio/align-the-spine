import { after, NextResponse } from "next/server";

import { leadFormVariants, type LeadFormVariant } from "@/content/lead-forms";
import { siteConfig } from "@/content/site";
import { buildLeadFormSchema } from "@/lib/lead-form-schema";

interface LeadPayload {
  variant?: unknown;
  values?: unknown;
  /** Honeypot field — humans never fill it. */
  website?: unknown;
}

function isVariant(value: unknown): value is LeadFormVariant {
  return typeof value === "string" && value in leadFormVariants;
}

async function deliverLead(variant: LeadFormVariant, values: Record<string, string>) {
  const config = leadFormVariants[variant];
  const lines = config.fields.map((field) => `${field.label}: ${values[field.name] || "—"}`);
  const apiKey = process.env.RESEND_API_KEY;

  // Local/dev fallback so forms stay demoable before the key is provisioned.
  if (!apiKey) {
    console.warn(`[lead] RESEND_API_KEY not set — logging lead instead of emailing.`);
    console.warn(`[lead] ${variant}\n${lines.join("\n")}`);
    return;
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
      reply_to: values.email || undefined,
      subject: `New lead — ${config.submitLabel}`,
      text: `New "${variant}" lead from the website:\n\n${lines.join("\n")}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}

/** Receives LeadForm submissions (ATS-031). Re-validates with the same
 * zod schema the client used and enforces the honeypot server-side, so
 * direct POSTs can't bypass the client-side guards. Responds as soon as
 * validation passes; email delivery runs lazily after the response, so the
 * visitor never waits on (or sees errors from) the email provider. */
export async function POST(request: Request) {
  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Spam guard: pretend success so bots learn nothing.
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
  after(async () => {
    try {
      await deliverLead(variant, parsed.data);
    } catch (error) {
      console.error("[lead] delivery failed:", error);
    }
  });

  return NextResponse.json({ ok: true });
}

function formatIssues(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  return error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }));
}
