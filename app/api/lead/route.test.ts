import { beforeEach, describe, expect, it, vi } from "vitest";

import { deliverLead } from "@/lib/lead-delivery";
import { persistLead } from "@/lib/lead-store";

vi.mock("@/lib/lead-store", () => ({ persistLead: vi.fn() }));
vi.mock("@/lib/lead-delivery", () => ({ deliverLead: vi.fn() }));

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validPayload = {
  variant: "heroEval",
  values: {
    firstName: "Jane",
    lastName: "Doe",
    phone: "5551234567",
    email: "jane@example.com",
    carAccident: "",
  },
  website: "",
  attribution: {},
};

describe("POST /api/lead — ATS-E5 5.10: success only after persistence", () => {
  beforeEach(() => {
    vi.mocked(persistLead).mockReset();
    vi.mocked(deliverLead).mockReset();
  });

  it("returns ok:true with a leadId only once persistLead resolves", async () => {
    vi.mocked(persistLead).mockResolvedValue({
      lead: { id: "lead-123" } as never,
      isDuplicate: false,
    });

    const { POST } = await import("@/app/api/lead/route");
    const response = await POST(makeRequest(validPayload));
    const body = (await response.json()) as { ok: boolean; leadId: string };

    expect(persistLead).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true, leadId: "lead-123" });
  });

  it("returns 503 and never claims success when persistence fails — never counted as captured", async () => {
    vi.mocked(persistLead).mockRejectedValue(new Error("connection refused"));

    const { POST } = await import("@/app/api/lead/route");
    const response = await POST(makeRequest(validPayload));
    const body = (await response.json()) as { ok: boolean };

    expect(response.status).toBe(503);
    expect(body.ok).toBe(false);
    // Delivery must never be attempted for a lead that was never persisted.
    expect(deliverLead).not.toHaveBeenCalled();
  });

  it("rejects an invalid payload before ever touching persistence", async () => {
    vi.mocked(persistLead).mockResolvedValue({ lead: { id: "x" } as never, isDuplicate: false });

    const { POST } = await import("@/app/api/lead/route");
    const response = await POST(makeRequest({ ...validPayload, values: { name: "" } }));

    expect(response.status).toBe(422);
    expect(persistLead).not.toHaveBeenCalled();
  });

  it("honeypot submissions short-circuit before persistence (bot traffic, not a lead)", async () => {
    vi.mocked(persistLead).mockResolvedValue({ lead: { id: "x" } as never, isDuplicate: false });

    const { POST } = await import("@/app/api/lead/route");
    const response = await POST(makeRequest({ ...validPayload, website: "http://spam.example" }));
    const body = (await response.json()) as { ok: boolean };

    expect(body.ok).toBe(true);
    expect(persistLead).not.toHaveBeenCalled();
  });
});
