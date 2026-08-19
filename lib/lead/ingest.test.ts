import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ingestLead } from "./ingest";

const { rpcMock } = vi.hoisted(() => ({ rpcMock: vi.fn() }));

vi.mock("./supabase", () => ({
  getServiceSupabase: () => ({ rpc: rpcMock }),
}));

describe("ingestLead", () => {
  beforeEach(() => {
    rpcMock.mockReset();
    rpcMock.mockResolvedValue({ data: { lead_id: "lead-1", is_new: true }, error: null });
    process.env.LEAD_ENCRYPTION_KEY = Buffer.alloc(32, 9).toString("base64");
  });
  afterEach(() => {
    delete process.env.LEAD_ENCRYPTION_KEY;
  });

  function paramsOf() {
    return rpcMock.mock.calls[0][1] as Record<string, unknown>;
  }

  it("splits sensitive fields out of raw_fields and encrypts them", async () => {
    await ingestLead(
      "11111111-1111-1111-1111-111111111111",
      "contactUs",
      { name: "Jane", phone: "9545550100", email: "jane@example.com", message: "secret text" },
      {},
      {},
    );
    const params = paramsOf();
    expect(params.p_sensitive_present).toBe(true);
    expect((params.p_raw_fields as Record<string, string>).message).toBeUndefined();
    expect((params.p_raw_fields as Record<string, string>).name).toBe("Jane");
    expect(params.p_full_name).toBe("Jane");
    // The plaintext message must not appear anywhere in the RPC params.
    expect(JSON.stringify(params)).not.toContain("secret text");
  });

  it("enqueues the patient acknowledgment only when a valid email exists", async () => {
    await ingestLead(
      "22222222-2222-2222-2222-222222222222",
      "contactUs",
      { name: "Jane", phone: "9545550100", email: "jane@example.com" },
      {},
      {},
    );
    expect(paramsOf().p_create_patient_ack).toBe(true);

    rpcMock.mockClear();
    await ingestLead(
      "33333333-3333-3333-3333-333333333333",
      "eligibility",
      { firstName: "A", lastName: "B", phone: "9545550100", zip: "33441" },
      {},
      {},
    );
    expect(paramsOf().p_create_patient_ack).toBe(false);
  });

  it("records the variant version and classified priority", async () => {
    await ingestLead(
      "44444444-4444-4444-4444-444444444444",
      "eligibility",
      {
        firstName: "A",
        lastName: "B",
        phone: "9545550100",
        email: "a@b.com",
        zip: "33441",
        carAccident: "yes",
      },
      {},
      {},
    );
    const params = paramsOf();
    expect(params.p_form_version).toBe(2); // eligibility is v2 (adds email)
    expect(params.p_priority).toBe("high"); // carAccident=yes
  });

  it("returns the lead id and newness from the RPC", async () => {
    const result = await ingestLead(
      "55555555-5555-5555-5555-555555555555",
      "heroEval",
      { firstName: "A", lastName: "B", phone: "9545550100", email: "a@b.com" },
      {},
      {},
    );
    expect(result).toEqual({ leadId: "lead-1", isNew: true, patientAckQueued: true });
  });

  it("throws when the RPC returns an error", async () => {
    rpcMock.mockResolvedValue({ data: null, error: { message: "boom" } });
    await expect(
      ingestLead("66666666-6666-6666-6666-666666666666", "heroEval", { email: "a@b.com" }, {}, {}),
    ).rejects.toThrow(/ingestion failed/);
  });
});
