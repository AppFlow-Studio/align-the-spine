import { describe, expect, it } from "vitest";

import { siteConfig } from "@/content/site";

import { buildDirectionsUrl, buildMapEmbedSrc } from "./maps";

describe("buildMapEmbedSrc", () => {
  it("builds a keyless embed URL containing the practice's real address", () => {
    const src = buildMapEmbedSrc();
    expect(src).toContain("https://www.google.com/maps?q=");
    expect(src).toContain("output=embed");
    expect(decodeURIComponent(src)).toContain(siteConfig.business.address.city);
  });
});

describe("buildDirectionsUrl", () => {
  it("builds a keyless Google Maps Directions URL to the practice's real address", () => {
    const url = buildDirectionsUrl();
    expect(url).toContain("https://www.google.com/maps/dir/?api=1&destination=");
    expect(decodeURIComponent(url)).toContain(siteConfig.business.address.line1);
    expect(decodeURIComponent(url)).toContain(siteConfig.business.address.zip);
  });

  it("never requires a Maps API key (no `key=` param)", () => {
    expect(buildDirectionsUrl()).not.toContain("key=");
  });
});
