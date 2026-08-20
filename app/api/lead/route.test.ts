import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/lead", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://localhost",
      "x-forwarded-for": "127.0.0.1",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function payload(id: string) {
  return {
    clientSubmissionId: id,
    formId: "booking",
    formVersion: 1,
    values: {
      firstName: "Test",
      lastName: "Lead",
      phone: "9545737192",
      email: "test@example.com",
      carAccident: "no",
    },
    website: "",
    attribution: { utm_source: "test" },
    sourcePagePath: "/book-an-appointment",
  };
}

describe("POST /api/lead", () => {
  beforeEach(() => {
    process.env.LEAD_REPOSITORY_MODE = "fixture";
    process.env.LEAD_RATE_LIMIT_SECRET = "test-rate-limit-secret";
    process.env.LEAD_ENCRYPTION_KEY = Buffer.alloc(32, 4).toString("base64");
  });

  it("returns success only after fixture persistence and deduplicates retries", async () => {
    const id = "77777777-7777-4777-8777-777777777777";
    const first = await POST(request(payload(id)));
    const second = await POST(request(payload(id)));
    expect(first.status).toBe(201);
    expect(second.status).toBe(200);
    expect(await second.json()).toMatchObject({ ok: true, created: false, submissionId: id });
  });

  it("rejects cross-origin, oversized, and unexpected-field requests", async () => {
    expect(
      (await POST(request(payload(crypto.randomUUID()), { origin: "https://evil.test" }))).status,
    ).toBe(403);
    expect(
      (await POST(request(payload(crypto.randomUUID()), { "content-length": "20000" }))).status,
    ).toBe(413);
    const invalid = payload(crypto.randomUUID());
    invalid.values = { ...invalid.values, diagnosis: "forbidden" } as typeof invalid.values;
    expect((await POST(request(invalid))).status).toBe(422);
  });

  it("returns indistinguishable success for a filled honeypot without storing", async () => {
    const response = await POST(request({ ...payload(crypto.randomUUID()), website: "spam" }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  it("rejects a non-US request loudly, without storing", async () => {
    const response = await POST(
      request(payload(crypto.randomUUID()), { "x-vercel-ip-country": "CA" }),
    );
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ ok: false, error: "region_not_supported" });
  });

  it("allows a request with no geo header, same as local dev/non-Vercel hosting", async () => {
    const id = crypto.randomUUID();
    const response = await POST(request(payload(id)));
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ ok: true, created: true, submissionId: id });
  });

  describe("with a Turnstile secret configured", () => {
    beforeEach(() => {
      process.env.TURNSTILE_SECRET_KEY = "test-turnstile-secret";
    });
    afterEach(() => {
      delete process.env.TURNSTILE_SECRET_KEY;
      vi.unstubAllGlobals();
    });

    it("stores the lead when Turnstile verification succeeds", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }))),
      );
      const id = crypto.randomUUID();
      const response = await POST(request({ ...payload(id), turnstileToken: "real-token" }));
      expect(response.status).toBe(201);
      expect(await response.json()).toMatchObject({ ok: true, created: true, submissionId: id });
    });

    it("rejects loudly, without storing, when Turnstile verification fails", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false }))),
      );
      const response = await POST(
        request({ ...payload(crypto.randomUUID()), turnstileToken: "bad-token" }),
      );
      expect(response.status).toBe(403);
      expect(await response.json()).toEqual({ ok: false, error: "bot_check_failed" });
    });
  });
});
