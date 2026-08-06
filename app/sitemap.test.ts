import { describe, expect, it } from "vitest";

import { isPublished, routes } from "@/content/seo";
import { siteConfig } from "@/content/site";

import sitemap from "./sitemap";

describe("sitemap", () => {
  it("returns absolute URLs under siteConfig.siteUrl for every entry", () => {
    for (const entry of sitemap()) {
      expect(entry.url.startsWith(siteConfig.siteUrl)).toBe(true);
    }
  });

  it("excludes /thank-you and the legacy /auto-accident route", () => {
    const paths = sitemap().map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    expect(paths).not.toContain("/thank-you");
    expect(paths).not.toContain("/auto-accident");
  });

  it("gives every entry a truthy lastModified", () => {
    for (const entry of sitemap()) {
      expect(entry.lastModified).toBeTruthy();
    }
  });

  it("includes every published registry route exactly once", () => {
    const paths = sitemap().map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    expect(paths).toEqual(routes.filter(isPublished).map((route) => route.path));
  });

  // ATS-E4 (4.12/4.14) / ATS-E3 (3.2/3.7): these routes are draft (noindex,
  // out of the sitemap) until their respective approvals land — condition
  // pages need a clinician reviewer, /reviews needs real published
  // reviews, /home-visits needs verified service-area/availability data.
  // See content/seo.ts. This test intentionally fails once any of them
  // flips to "published" without also being removed from this list, as a
  // reminder to update the assertion deliberately rather than let it
  // silently pass.
  it("excludes routes still pending approval", () => {
    const paths = sitemap().map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    for (const path of [
      "/conditions/back-pain",
      "/conditions/neck-pain",
      "/conditions/sciatica",
      "/conditions/whiplash",
      "/reviews",
      "/home-visits",
      "/services/chiropractic-adjustments",
      "/services/spinal-decompression",
    ]) {
      expect(paths).not.toContain(path);
    }
  });
});
