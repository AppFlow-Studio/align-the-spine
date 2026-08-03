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

  // ATS-E4 (4.12/4.14): condition pages are draft (noindex, out of the
  // sitemap) until a clinician reviewer signs off — see content/seo.ts.
  // This test intentionally fails once any of them flips to "published"
  // without also being removed from this list, as a reminder to update
  // the assertion deliberately rather than let it silently pass.
  it("excludes the still-unreviewed condition pages", () => {
    const paths = sitemap().map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    for (const path of [
      "/conditions/back-pain",
      "/conditions/neck-pain",
      "/conditions/sciatica",
      "/conditions/whiplash",
    ]) {
      expect(paths).not.toContain(path);
    }
  });
});
