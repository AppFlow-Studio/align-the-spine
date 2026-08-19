import { describe, expect, it } from "vitest";

import {
  buildResendEmailLines,
  buildSheetsPayload,
  buildSignedSheetsRequest,
  isSuccessfulSheetsResponse,
  protectSpreadsheetCell,
  sanitizeDeliveryError,
} from "./delivery";

describe("lead delivery safety", () => {
  it("neutralizes spreadsheet formulas and control characters", () => {
    expect(protectSpreadsheetCell("=IMPORTXML('x')")).toBe("'=IMPORTXML('x')");
    expect(protectSpreadsheetCell("+1\n2")).toBe("'+1 2");
    expect(protectSpreadsheetCell("Normal")).toBe("Normal");
  });

  it("omits sensitive message/date fields from Sheets payloads", () => {
    const payload = buildSheetsPayload("event-1", {
      lead: {
        id: "lead-1",
        submitted_at: "2026-08-16T00:00:00Z",
        form_id: "contactUs",
        form_version: 1,
        status: "new",
        priority: "standard",
        intent: "general",
        source_page_path: "/contact-us",
        contact_fields: { name: "A", phone: "123", email: "a@example.com" },
      },
      attribution: {},
      sensitive: { message: "private", accidentDate: "2026-01-01" },
    } as never);
    expect(JSON.stringify(payload)).not.toContain("private");
    expect(JSON.stringify(payload)).not.toContain("2026-01-01");
  });

  it("excludes sensitive fields from the Resend email body unless explicitly included", () => {
    const record = {
      lead: {
        id: "lead-1",
        form_id: "contactUs",
        form_version: 1,
        priority: "standard",
        intent: "general",
        source_page_path: "/contact-us",
        contact_fields: { name: "A", phone: "123", email: "a@example.com" },
      },
      attribution: {},
      sensitive: { message: "private", accidentDate: "2026-01-01" },
    } as never;
    const excluded = buildResendEmailLines(record, false).join("\n");
    expect(excluded).not.toContain("private");
    expect(excluded).not.toContain("2026-01-01");
    const included = buildResendEmailLines(record, true).join("\n");
    expect(included).toContain("private");
    expect(included).toContain("2026-01-01");
  });

  it("sanitizes errors before audit storage", () => {
    expect(sanitizeDeliveryError(new Error("failed for patient@example.com\nsecret"))).toBe(
      "failed for [email] secret",
    );
  });

  it("signs a timestamped deterministic envelope and requires JSON ok true", () => {
    const signed = buildSignedSheetsRequest(
      "event-1",
      { leadId: "lead-1" },
      "secret",
      1_700_000_000_000,
    );
    expect(signed.timestamp).toBe("1700000000");
    expect(JSON.parse(signed.body)).toMatchObject({
      timestamp: "1700000000",
      eventId: "event-1",
      payload: { leadId: "lead-1" },
      signature: expect.stringMatching(/^[a-f0-9]{64}$/),
    });
    expect(isSuccessfulSheetsResponse(true, { ok: true })).toBe(true);
    expect(isSuccessfulSheetsResponse(true, { ok: false })).toBe(false);
    expect(isSuccessfulSheetsResponse(true, "ok")).toBe(false);
    expect(isSuccessfulSheetsResponse(false, { ok: true })).toBe(false);
  });
});
