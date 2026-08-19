import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { getResendWebhookSecret, isSupabaseConfigured } from "@/lib/lead/env";
import { getServiceSupabase } from "@/lib/lead/supabase";
import { mapResendEvent } from "@/lib/lead/webhook";

export const dynamic = "force-dynamic";

interface ResendWebhookPayload {
  type?: string;
  created_at?: string;
  data?: { email_id?: string; created_at?: string };
}

/**
 * Resend delivery webhook. Verifies the svix signature with the server-only
 * signing secret, records each event idempotently (svix message id is the
 * unique key, so retries/duplicates are ignored), and advances the outbox
 * delivery_state — ignoring out-of-order arrivals via event timestamps and
 * suppressing rows on bounce/complaint/suppression so they're never resent.
 * Returns quickly and NEVER triggers a second email.
 */
export async function POST(request: Request) {
  let secret: string;
  try {
    secret = getResendWebhookSecret();
  } catch {
    return NextResponse.json({ ok: false, error: "webhook not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ ok: false, error: "missing signature" }, { status: 400 });
  }

  let event: ResendWebhookPayload;
  try {
    event = new Webhook(secret).verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ResendWebhookPayload;
  } catch {
    // Invalid signature — reject.
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    // Can't record it; ask Resend to retry later rather than dropping silently.
    return NextResponse.json({ ok: false, error: "store unavailable" }, { status: 503 });
  }

  const eventType = event.type ?? "unknown";
  const emailId = event.data?.email_id ?? null;
  const occurredAt = event.created_at ?? event.data?.created_at ?? new Date().toISOString();
  const supabase = getServiceSupabase();

  // Correlate to the outbox row this Resend email id belongs to (may be null if
  // the event is for an email we didn't send / haven't recorded yet).
  let outboxId: string | null = null;
  let currentStateAt: string | null = null;
  if (emailId) {
    const { data: outbox } = await supabase
      .from("lead_delivery_outbox")
      .select("id, delivery_state_at")
      .eq("external_id", emailId)
      .maybeSingle();
    if (outbox) {
      outboxId = outbox.id as string;
      currentStateAt = (outbox.delivery_state_at as string | null) ?? null;
    }
  }

  // Idempotent event record (svix id is unique). A duplicate delivery collides
  // here and we short-circuit — the state update never runs twice.
  const { error: insertError } = await supabase.from("resend_webhook_events").insert({
    event_id: svixId,
    event_type: eventType,
    email_id: emailId,
    outbox_id: outboxId,
    occurred_at: occurredAt,
    // Sanitized: type + email id only, never the recipient address.
    payload: { type: eventType, email_id: emailId },
  });
  if (insertError) {
    // 23505 = unique violation = already processed. Any insert error is safe to
    // treat as "already handled / will retry" — do not mutate state again.
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const mapping = mapResendEvent(eventType);
  if (mapping && outboxId) {
    // Only apply if this event is newer than the last one we recorded
    // (webhook arrival order is not guaranteed).
    if (!currentStateAt || new Date(occurredAt) >= new Date(currentStateAt)) {
      const update: Record<string, unknown> = {
        delivery_state: mapping.deliveryState,
        delivery_state_at: occurredAt,
      };
      if (mapping.suppress) update.status = "suppressed";
      await supabase.from("lead_delivery_outbox").update(update).eq("id", outboxId);
    }
  }

  return NextResponse.json({ ok: true });
}
