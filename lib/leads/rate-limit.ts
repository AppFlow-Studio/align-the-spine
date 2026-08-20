import { createSupabaseServiceClient } from "@/lib/supabase/server";

const fixtureWindows = new Map<string, number>();

export async function consumeLeadRateLimit(fingerprint: string) {
  const limit = Number(process.env.LEAD_RATE_LIMIT_PER_HOUR ?? "10");
  const mode = process.env.LEAD_REPOSITORY_MODE ?? process.env.CONTENT_REPOSITORY_MODE ?? "fixture";
  if (mode === "fixture" && process.env.NODE_ENV !== "production") {
    const hour = new Date().toISOString().slice(0, 13);
    const key = `${hour}:${fingerprint}`;
    const count = (fixtureWindows.get(key) ?? 0) + 1;
    fixtureWindows.set(key, count);
    return count <= limit;
  }
  const { data, error } = await createSupabaseServiceClient().rpc("consume_lead_rate_limit", {
    rate_fingerprint: fingerprint,
    rate_limit: limit,
  });
  if (error) throw new Error("rate_limit_unavailable");
  return data === true;
}
