import { createHmac } from "node:crypto";
import { z } from "zod";

import { leadFormVariants } from "@/content/lead-forms";
import { classifyLeadPriority } from "@/lib/analytics";
import { sanitizeAttribution } from "@/lib/attribution";
import { buildLeadFormSchema } from "@/lib/lead-form-schema";

import {
  isLeadFormVariant,
  LEAD_CONSENT_VERSION,
  LEAD_CONSENT_WORDING,
  LEAD_FORM_VERSION,
  splitLeadFields,
} from "./contracts";
import { encryptLeadSensitiveFields } from "./crypto";
import type { LeadIngestionInput } from "./types";

const envelopeSchema = z
  .object({
    clientSubmissionId: z.string().uuid(),
    formId: z.unknown(),
    formVersion: z.literal(LEAD_FORM_VERSION),
    values: z.unknown(),
    website: z.string().max(200).default(""),
    // Shape-only here (any string, including ""), never verified against
    // Cloudflare until the route handler calls verifyTurnstileToken — that
    // keeps this function synchronous/no-network and dev-safe: a local
    // build with no Turnstile site key configured sends "" and still
    // validates, since the server-side check independently no-ops when
    // TURNSTILE_SECRET_KEY is unset (see lib/leads/turnstile.ts).
    turnstileToken: z.string().max(4096).default(""),
    attribution: z.unknown().optional(),
    sourcePagePath: z
      .string()
      .max(512)
      .regex(/^\/[^?#]*$/),
  })
  .strict();

export class LeadRequestError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    readonly issues?: { field: string; message: string }[],
  ) {
    super(code);
  }
}

export interface ParsedLeadRequest {
  lead: LeadIngestionInput;
  /** Not part of LeadIngestionInput — a verification credential for the
   * route handler to check via verifyTurnstileToken, not lead data, and
   * never persisted. */
  turnstileToken: string;
}

export function parseLeadRequest(
  input: unknown,
  rateFingerprint: string,
): ParsedLeadRequest | "honeypot" {
  const envelope = envelopeSchema.safeParse(input);
  if (!envelope.success) throw new LeadRequestError(400, "invalid_request");
  if (envelope.data.website.trim()) return "honeypot";
  if (!isLeadFormVariant(envelope.data.formId)) throw new LeadRequestError(400, "unknown_form");
  const parsed = buildLeadFormSchema(leadFormVariants[envelope.data.formId].fields).safeParse(
    envelope.data.values,
  );
  if (!parsed.success) {
    throw new LeadRequestError(
      422,
      "validation_failed",
      parsed.error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })),
    );
  }
  const normalized = normalizeLeadValues(parsed.data);
  const { contactFields, sensitiveFields } = splitLeadFields(normalized);
  const priority = classifyLeadPriority(envelope.data.formId, normalized);
  const accident = priority === "high";
  return {
    lead: {
      clientSubmissionId: envelope.data.clientSubmissionId,
      formId: envelope.data.formId,
      formVersion: envelope.data.formVersion,
      contactFields,
      attribution: sanitizeAttribution(envelope.data.attribution),
      consent: {
        version: LEAD_CONSENT_VERSION,
        wording: LEAD_CONSENT_WORDING,
        channel: "web_form",
        granted: true,
      },
      priority,
      intent: accident ? "car_accident" : "general",
      sourcePagePath: envelope.data.sourcePagePath,
      submittedAt: new Date().toISOString(),
      encrypted: encryptLeadSensitiveFields(sensitiveFields) ?? undefined,
      rateFingerprint,
    },
    turnstileToken: envelope.data.turnstileToken,
  };
}

export function normalizeLeadValues(values: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(values).map(([key, raw]) => {
      const value = raw.trim();
      if (key === "email") return [key, value.toLowerCase()];
      if (key === "phone") {
        const digits = value.replace(/\D/g, "");
        return [key, digits.length === 11 ? `+${digits}` : `+1${digits}`];
      }
      return [key, value];
    }),
  );
}

/** Shared by requestFingerprint (HMAC'd, never stored raw) and the
 * Turnstile siteverify call (sent to Cloudflare only, over TLS, exactly
 * like any anti-abuse check needs the real address to be effective). */
export function remoteAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export function requestFingerprint(request: Request) {
  const secret = process.env.LEAD_RATE_LIMIT_SECRET;
  if (!secret) throw new Error("Lead rate-limit environment is incomplete.");
  return createHmac("sha256", secret).update(remoteAddress(request)).digest("hex");
}

/** US-only gate for lead submissions, keyed off Vercel's own edge geo
 * header — no third-party IP lookup, no added latency, and nothing for a
 * legitimate US visitor to notice. x-vercel-ip-country is only present on
 * Vercel's production/preview edge network; local dev and any other
 * hosting never see it, so this allows everything there rather than
 * blocking every non-Vercel/local submission outright. */
export function isAllowedLeadGeo(request: Request) {
  const country = request.headers.get("x-vercel-ip-country");
  if (!country) return true;
  return country === "US";
}

export function isAllowedLeadOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const allowed = new Set([new URL(request.url).origin]);
  if (process.env.SITE_URL) allowed.add(new URL(process.env.SITE_URL).origin);
  for (const entry of (process.env.LEAD_ALLOWED_ORIGINS ?? "").split(",")) {
    if (entry.trim()) allowed.add(entry.trim());
  }
  return allowed.has(origin);
}
