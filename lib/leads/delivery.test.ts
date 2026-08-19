import { afterEach, describe, expect, it } from "vitest";

import {
  buildSheetsPayload,
  buildSignedSheetsRequest,
  isSuccessfulSheetsResponse,
  protectSpreadsheetCell,
  resendFromAddress,
  resendToAddresses,
  sanitizeDeliveryError,
} from "./delivery";
import { renderOfficeNotification } from "./email/office-notification";
import { renderPatientAcknowledgment } from "./email/patient-acknowledgment";

describe("lead delivery safety", () => {
  afterEach(() => {
    delete process.env.LEAD_FROM_EMAIL;
    delete process.env.LEAD_TO_EMAIL;
  });

  it("falls back to the sandbox from-address when LEAD_FROM_EMAIL is blank, not just unset", () => {
    process.env.LEAD_FROM_EMAIL = "";
    expect(resendFromAddress()).toBe("Align the Spine Website <onboarding@resend.dev>");
    process.env.LEAD_FROM_EMAIL = "Office <appointments@chirobackpain.com>";
    expect(resendFromAddress()).toBe("Office <appointments@chirobackpain.com>");
  });

  it("falls back to siteConfig's business email when LEAD_TO_EMAIL is blank, not just unset", () => {
    process.env.LEAD_TO_EMAIL = "";
    expect(resendToAddresses()).not.toEqual([]);
    process.env.LEAD_TO_EMAIL = "office@example.com";
    expect(resendToAddresses()).toEqual(["office@example.com"]);
  });

  it("splits LEAD_TO_EMAIL on commas so an office notification can reach more than one inbox", () => {
    process.env.LEAD_TO_EMAIL = "chiromarketing27@gmail.com, info@chirobackpain.com";
    expect(resendToAddresses()).toEqual(["chiromarketing27@gmail.com", "info@chirobackpain.com"]);
  });

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

  it("excludes sensitive fields from the office notification email unless explicitly included", () => {
    const baseProps = {
      shortSubmissionId: "lead-1",
      formId: "contactUs",
      formVersion: 1,
      intent: "general" as const,
      priority: "standard" as const,
      createdAtLocal: "Aug 16, 2026, 12:00 AM",
      name: "A",
    };
    const excluded = renderOfficeNotification({ ...baseProps, sensitive: null });
    expect(excluded.html).not.toContain("private");
    expect(excluded.text).not.toContain("private");
    const included = renderOfficeNotification({
      ...baseProps,
      sensitive: { message: "private", accidentDate: "2026-01-01" },
    });
    expect(included.html).toContain("private");
    expect(included.text).toContain("private");
    expect(included.text).toContain("2026-01-01");
  });

  it("never includes an internal dashboard/CRM link in either lead email", () => {
    const office = renderOfficeNotification({
      shortSubmissionId: "lead-1",
      formId: "contactUs",
      formVersion: 1,
      intent: "general",
      priority: "standard",
      createdAtLocal: "Aug 16, 2026, 12:00 AM",
      name: "A",
    });
    expect(office.html.toLowerCase()).not.toContain("admin");
    expect(office.html.toLowerCase()).not.toContain("/crm");
    const patient = renderPatientAcknowledgment({ firstName: "A", intent: "general" });
    expect(patient.html.toLowerCase()).not.toContain("admin");
    expect(patient.html.toLowerCase()).not.toContain("/crm");
  });

  it("varies patient-acknowledgment copy by intent without asserting specifics", () => {
    const general = renderPatientAcknowledgment({ firstName: "Jane", intent: "general" });
    const accident = renderPatientAcknowledgment({ firstName: "Jane", intent: "car_accident" });
    expect(general.subject).not.toBe(accident.subject);
    expect(accident.html).toContain("14 days");
    expect(general.html).not.toContain("14 days");
    // Tells the lead we'll follow up, regardless of intent.
    expect(general.html).toContain("confirm your appointment");
    expect(accident.html).toContain("confirm your appointment");
  });

  it("escapes HTML-significant characters in office notification field values", () => {
    const doc = renderOfficeNotification({
      shortSubmissionId: "lead-1",
      formId: "contactUs",
      formVersion: 1,
      intent: "general",
      priority: "standard",
      createdAtLocal: "Aug 16, 2026, 12:00 AM",
      name: `<script>alert(1)</script>`,
    });
    expect(doc.html).not.toContain("<script>alert(1)</script>");
    expect(doc.html).toContain("&lt;script&gt;");
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
