import { NextResponse } from "next/server";

import { getWorkerSecret, isSupabaseConfigured } from "@/lib/lead/env";
import { runDeliveryWorker } from "@/lib/lead/worker";

/** This route drains the delivery outbox. It must never run on the static edge
 * cache and must always execute server-side. */
export const dynamic = "force-dynamic";

/**
 * Internal delivery worker endpoint. Drains claimable outbox rows (send +
 * retry/backoff/dead-letter). Protected by a shared secret in the Authorization
 * header, so only the cron scheduler (Vercel Cron sends `Authorization: Bearer
 * <secret>`) or an authenticated internal caller can trigger it. GET is used by
 * cron; POST supports a manual/admin drain.
 */
async function handle(request: Request): Promise<NextResponse> {
  let expected: string;
  try {
    expected = getWorkerSecret();
  } catch {
    return NextResponse.json({ ok: false, error: "worker not configured" }, { status: 503 });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "store unavailable" }, { status: 503 });
  }

  try {
    const summary = await runDeliveryWorker({ maxJobs: 25, workerId: "cron" });
    return NextResponse.json({ ok: true, ...summary });
  } catch (error) {
    console.error("[deliver] worker run failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, error: "worker error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
