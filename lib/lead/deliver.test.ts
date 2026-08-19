import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ResendSendError, sanitizeError, sendResendEmail } from "./deliver";

describe("sanitizeError", () => {
  it("redacts email addresses", () => {
    expect(sanitizeError("bounced for jane.doe@example.com hard")).toBe("bounced for [email] hard");
  });
});

describe("sendResendEmail", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.LEAD_EMAIL_FROM = "ATS <appointments@chirobackpain.com>";
    process.env.LEAD_EMAIL_REPLY_TO = "appointments@chirobackpain.com";
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.RESEND_API_KEY;
    delete process.env.LEAD_EMAIL_FROM;
    delete process.env.LEAD_EMAIL_REPLY_TO;
  });

  const input = {
    to: "jane@example.com",
    subject: "s",
    html: "<p>h</p>",
    text: "t",
    idempotencyKey: "ats/patient-ack/abc",
  };

  it("sends with the stable idempotency key and returns the external id", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ id: "re_123" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendResendEmail(input);
    expect(result.externalId).toBe("re_123");

    const [, init] = fetchMock.mock.calls[0];
    expect((init.headers as Record<string, string>)["Idempotency-Key"]).toBe("ats/patient-ack/abc");
  });

  it("classifies a 422 as permanent", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("invalid to", { status: 422 })));
    await expect(sendResendEmail(input)).rejects.toMatchObject({ permanent: true });
  });

  it("classifies a 500 as transient", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("boom", { status: 500 })));
    await expect(sendResendEmail(input)).rejects.toMatchObject({ permanent: false });
  });

  it("classifies a network error as transient", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNRESET")));
    await expect(sendResendEmail(input)).rejects.toBeInstanceOf(ResendSendError);
  });
});
