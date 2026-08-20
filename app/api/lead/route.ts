import { randomUUID } from "node:crypto";
import { after, NextResponse } from "next/server";

import { processLeadDeliveryBatch } from "@/lib/leads/delivery";
import { consumeLeadRateLimit } from "@/lib/leads/rate-limit";
import { getLeadRepository } from "@/lib/leads/repository";
import {
  isAllowedLeadGeo,
  isAllowedLeadOrigin,
  LeadRequestError,
  parseLeadRequest,
  remoteAddress,
  requestFingerprint,
} from "@/lib/leads/request";
import { verifyTurnstileToken } from "@/lib/leads/turnstile";

const MAX_REQUEST_BYTES = 16 * 1024;

// Mirrors getLeadRepository()'s own mode check (lib/leads/repository.ts) —
// processLeadDeliveryBatch talks to the real Supabase outbox tables, which
// don't exist in fixture mode (local/test runs without a connected
// Supabase project). Triggering it there would throw against a
// misconfigured client for no reason; fixture-mode leads have nowhere to
// be delivered anyway.
function deliveryEnabled() {
  return (process.env.LEAD_REPOSITORY_MODE ?? process.env.CONTENT_REPOSITORY_MODE) === "supabase";
}

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!isAllowedLeadOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "Request not allowed." },
      { status: 403, headers },
    );
  }
  // A real error, not the honeypot's fake-success — unlike a filled
  // honeypot (which no genuine visitor can ever trigger), a geo mismatch
  // CAN hit a real person (traveling, a VPN, a misreported edge region),
  // so they see an actual rejection instead of a false "we got it" that
  // silently went nowhere (owner direction: fail loudly). Checked before
  // content-type/size/rate-limit so a blocked request costs nothing beyond
  // one header read.
  if (!isAllowedLeadGeo(request)) {
    return NextResponse.json(
      { ok: false, error: "region_not_supported" },
      { status: 403, headers },
    );
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json(
      { ok: false, error: "Unsupported content type." },
      { status: 415, headers },
    );
  }
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ ok: false, error: "Request too large." }, { status: 413, headers });
  }

  try {
    const fingerprint = requestFingerprint(request);
    if (!(await consumeLeadRateLimit(fingerprint))) {
      return NextResponse.json(
        { ok: false, error: "Too many requests." },
        { status: 429, headers },
      );
    }
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > MAX_REQUEST_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Request too large." },
        { status: 413, headers },
      );
    }
    const parsed = parseLeadRequest(JSON.parse(text), "");
    // Deliberately indistinguishable success response for honeypot traffic.
    if (parsed === "honeypot") return NextResponse.json({ ok: true }, { headers });
    // A real error here too (see the geo check above): an invisible
    // Turnstile challenge that a real browser almost never fails, but
    // "almost never" isn't "never" — a blocked/failed script load (an
    // aggressive ad-blocker, a slow connection) can hit a genuine visitor,
    // and they need to actually see that before assuming their request
    // went through (owner direction: fail loudly).
    const humanVerified = await verifyTurnstileToken(parsed.turnstileToken, remoteAddress(request));
    if (!humanVerified) {
      return NextResponse.json({ ok: false, error: "bot_check_failed" }, { status: 403, headers });
    }
    const result = await getLeadRepository().ingest(parsed.lead);
    // Delivers the just-created outbox rows (Sheets/Resend) right after
    // this response is sent — via Next's after(), so it never adds to the
    // visitor's own wait — instead of leaving every lead to sit until a
    // periodic worker call eventually picks it up. Only for a genuinely
    // new lead (not an idempotent resubmit, which has nothing new to
    // deliver) and only in Supabase mode (see deliveryEnabled() above).
    // Errors are swallowed here on purpose: a delivery failure already
    // lands the outbox row in its own retry state for the next worker run
    // to pick up — see docs/lead-pipeline-operations.md's "Worker schedule and
    // delivery" for that periodic run, which stays in place as the safety
    // net for whatever this immediate attempt doesn't catch.
    if (result.created && deliveryEnabled()) {
      after(() => processLeadDeliveryBatch(randomUUID()).catch(() => {}));
    }
    return NextResponse.json(
      { ok: true, submissionId: parsed.lead.clientSubmissionId, created: result.created },
      { status: result.created ? 201 : 200, headers },
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400, headers });
    }
    if (error instanceof LeadRequestError) {
      return NextResponse.json(
        { ok: false, error: error.code, ...(error.issues ? { issues: error.issues } : {}) },
        { status: error.status, headers },
      );
    }
    const status = error instanceof Error && error.message === "rate_limit_exceeded" ? 429 : 503;
    return NextResponse.json(
      { ok: false, error: status === 429 ? "Too many requests." : "Unable to save request." },
      { status, headers },
    );
  }
}
