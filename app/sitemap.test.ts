import { describe, expect, it } from "vitest";

import { routes } from "@/content/seo";
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

  it("includes /conditions/whiplash with a real, non-build-time date", () => {
    const entries = sitemap();
    const whiplash = entries.find((entry) => entry.url.endsWith("/conditions/whiplash"));
    expect(whiplash?.lastModified).toBeTruthy();
  });

  it("gives every entry a truthy lastModified", () => {
    for (const entry of sitemap()) {
      expect(entry.lastModified).toBeTruthy();
    }
  });

  it("includes every static route from the registry exactly once", () => {
    const paths = sitemap().map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    expect(paths).toEqual(routes.map((route) => route.path));
  });
});
