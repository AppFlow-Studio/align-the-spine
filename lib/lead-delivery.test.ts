import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { LeadRecord } from "@/lib/lead-store";
import { recordDeliveryOutcome } from "@/lib/lead-store";

vi.mock("@/lib/lead-store", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/lead-store")>();
  return { ...actual, recordDeliveryOutcome: vi.fn() };
});

/** ATS-E5 5.9: "E2E test: forced email failure" — with delivery forced to
 * fail on every attempt, prove (a) the already-durable lead is untouched,
 * (b) the operator-visible delivery state ends up 'failed', and (c) the
 * lead is never marked 'delivered' (so nothing downstream can count it as
 * delivered). Persistence itself is exercised separately in
 * lib/lead-store.test.ts — this file only forces the delivery side. */
describe("lib/lead-delivery: forced failure path", () => {
  const originalFetch = global.fetch;
  const originalKey = process.env.RESEND_API_KEY;

  const lead: LeadRecord = {
    id: "lead-forced-failure",
    idempotencyKey: "irrelevant-for-this-test",
    variant: "heroEval",
    fields: { name: "Jane Doe", phone: "5551234567" },
    attribution: {},
    priority: "normal",
    deliveryStatus: "pending",
    providerResponseId: null,
    providerResponseBody: null,
    retryCount: 0,
    finalFailureState: false,
    deliveredAt: null,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    process.env.RESEND_API_KEY = "test-key";
    vi.mocked(recordDeliveryOutcome).mockClear();
    // Every call to the provider — all MAX_ATTEMPTS retries, plus the
    // operator-alert email — fails. This is the "forced failure" the ticket
    // asks for.
    global.fetch = vi
      .fn()
      .mockResolvedValue(
        new Response("simulated Resend outage", { status: 500 }),
      ) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.RESEND_API_KEY = originalKey;
  });

  it("(a)/(b) records a final failed delivery state on the already-durable lead, not a lost/silent one", async () => {
    const { deliverLead } = await import("@/lib/lead-delivery");
    await deliverLead(lead);

    expect(recordDeliveryOutcome).toHaveBeenCalledWith(
      lead.id,
      expect.objectContaining({ deliveryStatus: "failed", finalFailureState: true }),
    );
  });

  it("(c) never marks the lead 'delivered' when every attempt fails", async () => {
    const { deliverLead } = await import("@/lib/lead-delivery");
    await deliverLead(lead);

    const deliveredCalls = vi
      .mocked(recordDeliveryOutcome)
      .mock.calls.filter(([, update]) => update.deliveryStatus === "delivered");
    expect(deliveredCalls).toHaveLength(0);
  });

  it("retries before giving up, then alerts operators referencing only the leadId", async () => {
    const { deliverLead } = await import("@/lib/lead-delivery");
    await deliverLead(lead);

    const fetchMock = vi.mocked(global.fetch);
    // 3 delivery attempts + 1 operator-alert call.
    expect(fetchMock).toHaveBeenCalledTimes(4);

    const alertCall = fetchMock.mock.calls.at(-1);
    const alertBody = JSON.parse((alertCall?.[1]?.body as string) ?? "{}");
    expect(alertBody.text).toContain(lead.id);
    // The whole point of 5.6: no name/phone/etc. in the alert.
    expect(alertBody.text).not.toContain(lead.fields.name);
    expect(alertBody.text).not.toContain(lead.fields.phone);
  }, 10000);
});
