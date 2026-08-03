import { describe, expect, it } from "vitest";

import { siteConfig } from "@/content/site";

import sitemap, { lastModifiedFor } from "./sitemap";

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

  it("includes the dynamic /conditions/whiplash and /conditions/sciatica routes with real, non-build-time dates", () => {
    const entries = sitemap();
    const whiplash = entries.find((entry) => entry.url.endsWith("/conditions/whiplash"));
    const sciatica = entries.find((entry) => entry.url.endsWith("/conditions/sciatica"));
    expect(whiplash?.lastModified).toBe("2026-07-29");
    expect(sciatica?.lastModified).toBe("2026-07-29");
  });

  it("gives every entry a truthy lastModified", () => {
    for (const entry of sitemap()) {
      expect(entry.lastModified).toBeTruthy();
    }
  });

  it("includes every static route from the registry exactly once", () => {
    const paths = sitemap().map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    expect(paths).toContain("/services");
    expect(paths).toContain("/auto-accidents");
    expect(paths).toContain("/conditions/back-pain");
  });

  it("throws for a condition slug with no configured lastModified date", () => {
    expect(() => lastModifiedFor("some-unconfigured-slug")).toThrow(/no lastModified configured/);
  });
});
