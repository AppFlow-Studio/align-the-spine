import { describe, expect, it } from "vitest";

import {
  classifyLeadPriority,
  isBookCtaLink,
  isPhoneLink,
  trackBookCtaClick,
  trackLeadConversion,
  trackPageView,
  trackPhoneClick,
} from "./analytics";

describe("isPhoneLink", () => {
  it("matches tel: links", () => {
    expect(isPhoneLink("tel:+19545737192")).toBe(true);
  });

  it("rejects non-tel links", () => {
    expect(isPhoneLink("/book")).toBe(false);
    expect(isPhoneLink("mailto:abe@example.com")).toBe(false);
  });
});

describe("isBookCtaLink", () => {
  it("matches /book and /book with a query or hash", () => {
    expect(isBookCtaLink("/book")).toBe(true);
    expect(isBookCtaLink("/book?ref=nav")).toBe(true);
    expect(isBookCtaLink("/book#form")).toBe(true);
  });

  it("rejects other paths, including /book-adjacent ones", () => {
    expect(isBookCtaLink("/booking")).toBe(false);
    expect(isBookCtaLink("/services")).toBe(false);
  });
});

describe("tracking helpers", () => {
  it("no-op safely without throwing when window/gtag isn't available", () => {
    expect(() => trackLeadConversion("heroEval")).not.toThrow();
    expect(() => trackLeadConversion("carAccident", { phone: "(954) 573-7192" })).not.toThrow();
    expect(() => trackPhoneClick()).not.toThrow();
    expect(() => trackBookCtaClick()).not.toThrow();
    expect(() => trackPageView("/about")).not.toThrow();
  });
});

describe("classifyLeadPriority", () => {
  it("trusts an explicit carAccident answer above everything else", () => {
    expect(classifyLeadPriority("heroEval", { carAccident: "yes" })).toBe("high");
    // Even on an accident-framed form, an explicit "no" overrides the
    // variant-based fallback — someone filling it out for an unrelated reason.
    expect(classifyLeadPriority("carAccident", { carAccident: "no" })).toBe("standard");
  });

  it("classifies /book's accident reason as high priority regardless of variant", () => {
    expect(classifyLeadPriority("booking", { reason: "accident" })).toBe("high");
  });

  it("falls back to accident-specific form variants when the field is left blank", () => {
    expect(classifyLeadPriority("carAccident", {})).toBe("high");
    expect(classifyLeadPriority("accidentEval", {})).toBe("high");
  });

  it("classifies everything else as standard priority", () => {
    expect(classifyLeadPriority("heroEval", {})).toBe("standard");
    expect(classifyLeadPriority("booking", { reason: "back-pain" })).toBe("standard");
    expect(classifyLeadPriority("contactUs", {})).toBe("standard");
  });
});
