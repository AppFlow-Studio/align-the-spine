import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";
import { isRenderableImageUrl, RENDERABLE_IMAGE_HOSTS } from "./publication-gates";

/** The publication gate refuses a featured image on a host `next/image` cannot
 * optimize, because such an image throws at render instead of degrading — it
 * takes the whole article page down with it. That guarantee only holds while
 * the gate's allowlist and the Next config agree.
 *
 * They live in separate files for good reason: the gate cannot import the Next
 * config (it runs inside a Postgres-mirrored code path with no bundler
 * context), and the Next config should not import content code. This test is
 * the seam that keeps them honest — adding a CDN means changing both lists, and
 * this is the reminder. */
describe("renderable image hosts", () => {
  it("allowlists exactly the hosts next/image is configured to optimize", () => {
    const configured = (nextConfig.images?.remotePatterns ?? []).map((pattern) =>
      typeof pattern === "string" ? pattern : pattern.hostname,
    );
    expect([...configured].sort()).toEqual([...RENDERABLE_IMAGE_HOSTS].sort());
  });

  it("serves those hosts over https only", () => {
    for (const pattern of nextConfig.images?.remotePatterns ?? []) {
      if (typeof pattern !== "string") expect(pattern.protocol).toBe("https");
    }
  });

  it("accepts a hero image on the site's CDN", () => {
    expect(isRenderableImageUrl("https://align-the-spine.b-cdn.net/images/hero.jpg")).toBe(true);
  });

  it("rejects an image anywhere else, however plausible the host looks", () => {
    for (const url of [
      "https://images.unsplash.com/photo.jpg",
      "https://align-the-spine.b-cdn.net.evil.example/hero.jpg",
      "https://cdn.align-the-spine.com/hero.jpg",
    ]) {
      expect(isRenderableImageUrl(url), url).toBe(false);
    }
  });

  it("rejects a non-https URL on the right host", () => {
    expect(isRenderableImageUrl("http://align-the-spine.b-cdn.net/images/hero.jpg")).toBe(false);
  });

  it("rejects anything that is not a URL at all, rather than throwing", () => {
    for (const value of ["", "not a url", "/images/local.jpg"]) {
      expect(isRenderableImageUrl(value)).toBe(false);
    }
  });
});
