import { beforeEach, describe, expect, it } from "vitest";

import { decryptLeadSensitiveFields } from "./crypto";
import { FixtureLeadRepository } from "./repository";
import { isAllowedLeadGeo, LeadRequestError, parseLeadRequest } from "./request";

const base = {
  clientSubmissionId: "11111111-1111-4111-8111-111111111111",
  formId: "heroEval",
  formVersion: 1,
  values: {
    firstName: "  Abe ",
    lastName: "Nasser",
    phone: "(954) 573-7192",
    email: " TEST@EXAMPLE.COM ",
    carAccident: "no",
  },
  website: "",
  attribution: { utm_source: "google", rawQuery: "forbidden" },
  sourcePagePath: "/contact-us",
};

beforeEach(() => {
  process.env.LEAD_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
});

describe("lead request contracts", () => {
  it("normalizes contact values and strips unapproved attribution", () => {
    const parsed = parseLeadRequest(base, "fingerprint");
    expect(parsed).not.toBe("honeypot");
    if (parsed === "honeypot") return;
    expect(parsed.lead.contactFields).toMatchObject({
      firstName: "Abe",
      phone: "+19545737192",
      email: "test@example.com",
    });
    expect(parsed.lead.attribution).toEqual({ utm_source: "google" });
  });

  it("defaults a missing turnstileToken to empty string and accepts one when present", () => {
    const withoutToken = parseLeadRequest(base, "x");
    if (withoutToken === "honeypot") throw new Error("unexpected honeypot");
    expect(withoutToken.turnstileToken).toBe("");
    const withToken = parseLeadRequest({ ...base, turnstileToken: "a-real-token" }, "x");
    if (withToken === "honeypot") throw new Error("unexpected honeypot");
    expect(withToken.turnstileToken).toBe("a-real-token");
  });

  it("rejects unexpected fields, missing required fields, and invalid versions", () => {
    expect(() =>
      parseLeadRequest({ ...base, values: { ...base.values, diagnosis: "x" } }, "x"),
    ).toThrow(LeadRequestError);
    expect(() => parseLeadRequest({ ...base, values: { ...base.values, phone: "" } }, "x")).toThrow(
      LeadRequestError,
    );
    expect(() => parseLeadRequest({ ...base, formVersion: 2 }, "x")).toThrow(LeadRequestError);
  });

  it("encrypts message and accident date outside ordinary JSON", () => {
    const parsed = parseLeadRequest(
      {
        ...base,
        formId: "contactUs",
        values: {
          firstName: "Patient",
          lastName: "Example",
          phone: "9545737192",
          email: "patient@example.com",
          carAccident: "no",
          message: "Potentially sensitive message",
        },
      },
      "x",
    );
    if (parsed === "honeypot") throw new Error("unexpected honeypot");
    expect(parsed.lead.contactFields).not.toHaveProperty("message");
    expect(parsed.lead.encrypted?.fieldNames).toEqual(["message"]);
    expect(decryptLeadSensitiveFields(parsed.lead.encrypted!)).toEqual({
      message: "Potentially sensitive message",
    });
  });

  it("uses the client UUID as an idempotency key", async () => {
    const repository = new FixtureLeadRepository();
    const parsed = parseLeadRequest(base, "x");
    if (parsed === "honeypot") throw new Error("unexpected honeypot");
    expect((await repository.ingest(parsed.lead)).created).toBe(true);
    expect((await repository.ingest(parsed.lead)).created).toBe(false);
    expect(repository.snapshot()).toHaveLength(1);
  });
});

describe("isAllowedLeadGeo", () => {
  function requestWithCountry(country: string | null) {
    const headers = new Headers();
    if (country) headers.set("x-vercel-ip-country", country);
    return new Request("http://localhost/api/lead", { headers });
  }

  it("allows a US request", () => {
    expect(isAllowedLeadGeo(requestWithCountry("US"))).toBe(true);
  });

  it("blocks a non-US request", () => {
    expect(isAllowedLeadGeo(requestWithCountry("CA"))).toBe(false);
  });

  it("allows a request with no geo header (local dev, non-Vercel hosting)", () => {
    expect(isAllowedLeadGeo(requestWithCountry(null))).toBe(true);
  });
});
