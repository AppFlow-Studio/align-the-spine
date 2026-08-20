import { randomUUID, timingSafeEqual } from "node:crypto";

import { processLeadDeliveryBatch } from "@/lib/leads/delivery";

function authorized(request: Request) {
  const expected = process.env.CRON_SECRET;
  const received = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !received) return false;
  const expectedBytes = Buffer.from(expected);
  const receivedBytes = Buffer.from(received);
  if (expectedBytes.byteLength !== receivedBytes.byteLength) return false;
  return timingSafeEqual(expectedBytes, receivedBytes);
}

async function run(request: Request) {
  if (!authorized(request)) return new Response(null, { status: 401 });
  try {
    const result = await processLeadDeliveryBatch(randomUUID());
    return Response.json({ ok: true, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { ok: false, error: "Delivery worker unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

// GET, not just POST: Vercel Cron Jobs (vercel.json's `crons`) invoke their
// target path with GET and, when a CRON_SECRET env var exists on the
// project, automatically attach `Authorization: Bearer $CRON_SECRET`
// themselves — no extra Vercel-side config needed. POST stays for any
// manual/external trigger (a different scheduler, an on-call run).
export async function GET(request: Request) {
  return run(request);
}

export async function POST(request: Request) {
  return run(request);
}
