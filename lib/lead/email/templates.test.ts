import { describe, expect, it } from "vitest";

import { renderOfficeNotification } from "./office-notification";
import { renderPatientAcknowledgment } from "./patient-acknowledgment";

/** Phrases that would over-promise a medical/insurance/timing outcome — none may
 * appear in the patient acknowledgment. */
const BANNED_PHRASES = [
  "guarantee",
  "guaranteed",
  "same-day",
  "same day",
  "act now",
  "$0",
  "pip",
  "free",
  "covered",
];

describe("patient acknowledgment template", () => {
  it("uses the exact approved subject with no PII", () => {
    const { subject } = renderPatientAcknowledgment({ firstName: "Jane" });
    expect(subject).toBe("We received your appointment request | Align the Spine");
    expect(subject).not.toContain("Jane");
  });

  it("greets by first name, or neutrally when absent", () => {
    expect(renderPatientAcknowledgment({ firstName: "Jane" }).html).toContain("Thank you, Jane");
    expect(renderPatientAcknowledgment({ firstName: null }).html).toContain(
      "Thank you for contacting us",
    );
    expect(renderPatientAcknowledgment({}).text).toContain("Thank you for contacting us");
  });

  it("makes clear the appointment is not confirmed", () => {
    const doc = renderPatientAcknowledgment({ firstName: "Jane" });
    expect(doc.html).toContain("not confirmed until our office contacts you");
    expect(doc.text).toContain("not confirmed until our office contacts you");
  });

  it("uses the verified phone number in the CTA", () => {
    const doc = renderPatientAcknowledgment({ firstName: "Jane" });
    expect(doc.html).toContain("tel:+19545737192");
    expect(doc.html).toContain("Call (954) 573-7192");
    expect(doc.text).toContain("Call (954) 573-7192");
  });

  it("contains no over-promising medical/insurance/timing claims", () => {
    const doc = renderPatientAcknowledgment({ firstName: "Jane" });
    const haystack = `${doc.html} ${doc.text}`.toLowerCase();
    for (const phrase of BANNED_PHRASES) {
      expect(haystack).not.toContain(phrase);
    }
  });

  it("escapes HTML in the first name (no markup injection)", () => {
    const doc = renderPatientAcknowledgment({ firstName: "<script>alert(1)</script>" });
    expect(doc.html).not.toContain("<script>alert(1)</script>");
    expect(doc.html).toContain("&lt;script&gt;");
  });

  it("renders both HTML and plain text", () => {
    const doc = renderPatientAcknowledgment({ firstName: "Jane" });
    expect(doc.html).toContain("<!DOCTYPE html>");
    expect(doc.text.length).toBeGreaterThan(50);
  });
});

const officeProps = {
  shortSubmissionId: "a1b2c3d4",
  formLabel: "Accident evaluation",
  formVersion: 2,
  priority: "high" as const,
  createdAtUtc: "Aug 18, 2026, 20:00 UTC",
  createdAtLocal: "Aug 18, 2026, 04:00 PM ET",
  name: "Jane Patient",
  phone: "(954) 555-0100",
  email: "jane@example.com",
  zip: "33441",
  carAccident: "yes",
  sourcePath: "/car-accident-chiropractor",
  attributionSummary: "source=google; gclid present",
  adminUrl: "https://chirobackpain.com/admin/leads/11111111-2222-3333-4444-555555555555",
};

describe("office notification template", () => {
  it("keeps PII out of the subject", () => {
    const { subject } = renderOfficeNotification(officeProps);
    expect(subject).toBe("New website appointment request | Accident evaluation | a1b2c3d4");
    expect(subject).not.toContain("Jane");
    expect(subject).not.toContain("jane@example.com");
    expect(subject).not.toContain("954");
    expect(subject).not.toContain("33441");
  });

  it("does NOT include sensitive fields when they are not passed", () => {
    const doc = renderOfficeNotification(officeProps);
    expect(doc.html).not.toContain("accidentDate");
    expect(doc.html.toLowerCase()).not.toContain("i was rear-ended");
  });

  it("includes sensitive fields ONLY when explicitly passed (gate on)", () => {
    const doc = renderOfficeNotification({
      ...officeProps,
      sensitive: { message: "I was rear-ended", accidentDate: "2026-08-10" },
    });
    expect(doc.html).toContain("I was rear-ended");
    expect(doc.html).toContain("2026-08-10");
  });

  it("links to the CRM with an opaque id only (no PII in the URL)", () => {
    const doc = renderOfficeNotification(officeProps);
    expect(doc.html).toContain(officeProps.adminUrl);
    // The admin URL must not carry contact info.
    expect(officeProps.adminUrl).not.toContain("jane");
    expect(officeProps.adminUrl).not.toContain("954");
  });

  it("escapes HTML in operational values", () => {
    const doc = renderOfficeNotification({ ...officeProps, name: "<b>x</b>" });
    expect(doc.html).not.toContain("<b>x</b>");
    expect(doc.html).toContain("&lt;b&gt;x&lt;/b&gt;");
  });

  it("omits rows for missing optional fields", () => {
    const doc = renderOfficeNotification({ ...officeProps, zip: null, bestTime: null });
    expect(doc.html).not.toContain(">ZIP<");
  });
});
