import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const { ingestLeadMock, runWorkerMock, envState } = vi.hoisted(() => ({
  ingestLeadMock: vi.fn(),
  runWorkerMock: vi.fn(),
  envState: { supabase: true },
}));

vi.mock("@/lib/lead/ingest", () => ({ ingestLead: ingestLeadMock }));
vi.mock("@/lib/lead/worker", () => ({ runDeliveryWorker: runWorkerMock }));
vi.mock("@/lib/lead/env", () => ({ isSupabaseConfigured: () => envState.supabase }));
// after() must be a no-op outside a real request scope.
vi.mock("next/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/server")>();
  return { ...actual, after: (fn: () => void) => fn };
});

function makeRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

// The client always submits every field (empty string for optionals), so the
// server schema expects each key present — mirror that here.
const validContactUs = {
  variant: "contactUs",
  values: {
    name: "Jane",
    phone: "9545550100",
    email: "jane@example.com",
    carAccident: "",
    message: "hello there",
  },
};

describe("POST /api/lead", () => {
  beforeEach(() => {
    ingestLeadMock.mockReset();
    ingestLeadMock.mockResolvedValue({ leadId: "x", isNew: true, patientAckQueued: true });
    runWorkerMock.mockReset();
    runWorkerMock.mockResolvedValue({ claimed: 0, sent: 0, failed: 0 });
    envState.supabase = true;
  });
  afterEach(() => vi.clearAllMocks());

  it("stores a valid lead and reports success", async () => {
    const res = await POST(makeRequest(validContactUs));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(ingestLeadMock).toHaveBeenCalledTimes(1);
  });

  it("silently accepts a honeypot hit without storing anything", async () => {
    const res = await POST(makeRequest({ ...validContactUs, website: "bot" }));
    expect(res.status).toBe(200);
    expect(ingestLeadMock).not.toHaveBeenCalled();
  });

  it("rejects an unknown variant without storing", async () => {
    const res = await POST(makeRequest({ variant: "nope", values: {} }));
    expect(res.status).toBe(400);
    expect(ingestLeadMock).not.toHaveBeenCalled();
  });

  it("rejects a schema failure without storing", async () => {
    const res = await POST(makeRequest({ variant: "contactUs", values: {} }));
    expect(res.status).toBe(422);
    expect(ingestLeadMock).not.toHaveBeenCalled();
  });

  it("fails closed (503) when the store is unavailable — no false success", async () => {
    envState.supabase = false;
    const res = await POST(makeRequest(validContactUs));
    expect(res.status).toBe(503);
    expect(ingestLeadMock).not.toHaveBeenCalled();
  });

  it("rejects an oversized payload before parsing", async () => {
    const res = await POST(makeRequest(validContactUs, { "content-length": "30000" }));
    expect(res.status).toBe(413);
    expect(ingestLeadMock).not.toHaveBeenCalled();
  });

  it("returns 503 (not false success) if ingestion throws", async () => {
    ingestLeadMock.mockRejectedValue(new Error("db down"));
    const res = await POST(makeRequest(validContactUs));
    expect(res.status).toBe(503);
  });
});
