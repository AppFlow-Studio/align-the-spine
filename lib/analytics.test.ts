import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  classifyLeadPriority,
  isBookCtaLink,
  isPhoneLink,
  trackBookCtaClick,
  trackPageView,
  trackPhoneClick,
} from "./analytics";

describe("isPhoneLink", () => {
  it("matches tel: links", () => {
    expect(isPhoneLink("tel:+19545737192")).toBe(true);
  });

  it("rejects non-tel links", () => {
    expect(isPhoneLink("/book-an-appointment")).toBe(false);
    expect(isPhoneLink("mailto:abe@example.com")).toBe(false);
  });
});

describe("isBookCtaLink", () => {
  it("matches /book and /book with a query or hash", () => {
    expect(isBookCtaLink("/book-an-appointment")).toBe(true);
    expect(isBookCtaLink("/book-an-appointment?ref=nav")).toBe(true);
    expect(isBookCtaLink("/book-an-appointment#form")).toBe(true);
  });

  // ATS-SEO-143: the specific regression this ticket flags — clicking the
  // booking CTA on a non-English page must fire the same conversion event
  // an English click does. Was broken (only /book-an-appointment matched)
  // until this ticket's fix.
  it("matches every locale's own booking-CTA path", () => {
    expect(isBookCtaLink("/es/solicitar-cita")).toBe(true);
    expect(isBookCtaLink("/pt/solicitar-consulta")).toBe(true);
    expect(isBookCtaLink("/ht/mande-yon-randevou")).toBe(true);
  });

  it("matches a locale booking path with a query or hash", () => {
    expect(isBookCtaLink("/es/solicitar-cita?ref=nav")).toBe(true);
    expect(isBookCtaLink("/pt/solicitar-consulta#form")).toBe(true);
    expect(isBookCtaLink("/ht/mande-yon-randevou#form")).toBe(true);
  });

  it("rejects other paths, including /book-adjacent ones", () => {
    expect(isBookCtaLink("/booking")).toBe(false);
    expect(isBookCtaLink("/services")).toBe(false);
    expect(isBookCtaLink("/es/servicios")).toBe(false);
  });
});

describe("tracking helpers", () => {
  it("no-op safely without throwing when window/gtag isn't available", () => {
    expect(() => trackPhoneClick("/about")).not.toThrow();
    expect(() => trackBookCtaClick("/about")).not.toThrow();
    expect(() => trackPageView("/about")).not.toThrow();
  });

  // ATS-SEO-143: "locale may be measured with generic values such as en,
  // es, pt-BR, ht." Verifies the actual gtag payload, not just that the
  // call doesn't throw.
  describe("locale dimension on outbound events", () => {
    let calls: unknown[][];

    beforeEach(() => {
      calls = [];
      (globalThis as { window?: unknown }).window = {
        gtag: (...args: unknown[]) => {
          calls.push(args);
        },
      };
    });

    it("tags page_view with the bare locale derived from the path", () => {
      trackPageView("/es/servicios");
      expect(calls).toEqual([["event", "page_view", { page_path: "/es/servicios", locale: "es" }]]);
    });

    it("tags phone_click and book_cta_click with the locale of the page the click happened on", () => {
      trackPhoneClick("/pt/servicos");
      trackBookCtaClick("/ht/sevis");
      expect(calls).toEqual([
        ["event", "phone_click", { locale: "pt" }],
        ["event", "book_cta_click", { locale: "ht" }],
      ]);
    });

    it('tags English pages with locale "en", never a region-qualified code', () => {
      trackPageView("/services");
      expect(calls).toEqual([["event", "page_view", { page_path: "/services", locale: "en" }]]);
    });
  });
});

afterEach(() => {
  delete (globalThis as { window?: unknown }).window;
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
