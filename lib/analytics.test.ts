import { describe, expect, it } from "vitest";

import {
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
    expect(() => trackPhoneClick()).not.toThrow();
    expect(() => trackBookCtaClick()).not.toThrow();
    expect(() => trackPageView("/about")).not.toThrow();
  });
});
