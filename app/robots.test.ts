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

  it("allows crawling except /api/ and /thank-you in production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(robots().rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/thank-you"],
    });
  });

  it("always references the canonical sitemap URL", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(robots().sitemap).toBe(`${siteConfig.siteUrl}/sitemap.xml`);
  });
});
