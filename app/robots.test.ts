import { afterEach, describe, expect, it, vi } from "vitest";

import { siteConfig } from "@/content/site";

import robots from "./robots";

describe("robots", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("disallows everything when not production", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("disallows everything when VERCEL_ENV is unset", () => {
    vi.stubEnv("VERCEL_ENV", undefined);
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("allows crawling except /api/ and the thank-you pages in production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(robots().rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/preview/", "/thank-you", "/es/gracias"],
    });
  });

  // Guards the single most damaging way this file could break the Spanish
  // layer: a disallow rule broad enough to swallow /es. Every Spanish page
  // is primary content, not a duplicate of its English counterpart, so
  // nothing under /es may be blocked apart from the post-conversion page.
  it("never blocks the /es subtree in production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const rules = robots().rules as { disallow?: string[] };
    for (const rule of rules.disallow ?? []) {
      expect(rule === "/es" || rule === "/es/").toBe(false);
    }
    expect(rules.disallow).toContain("/es/gracias");
  });

  // ATS-SEO-139: identical guarantee for Portuguese and Haitian Creole —
  // both are primary content under content/pt/ and content/ht/
  // (ATS-SEO-135/136), not duplicates, so neither subtree may be blocked.
  // Unlike Spanish, /pt and /ht have no post-conversion page of their own
  // to exclude (ATS-SEO-135/136 deliberately built no /pt/gracias or
  // /ht/gracias — their forms redirect to the English /thank-you instead,
  // see components/ui/lead-form.tsx's FORM_COPY), so there is nothing to
  // assert is present in `disallow` for them, only that nothing blocks them.
  it("never blocks the /pt or /ht subtrees in production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const rules = robots().rules as { disallow?: string[] };
    for (const rule of rules.disallow ?? []) {
      expect(rule === "/pt" || rule === "/pt/").toBe(false);
      expect(rule === "/ht" || rule === "/ht/").toBe(false);
    }
  });

  it("always references the canonical sitemap URL", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(robots().sitemap).toBe(`${siteConfig.siteUrl}/sitemap.xml`);
  });
});
