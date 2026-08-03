import { afterEach, describe, expect, it, vi } from "vitest";

import { siteConfig } from "@/content/site";

import { buildMetadata } from "./metadata";

describe("buildMetadata", () => {
  it("builds a canonical URL from siteConfig.siteUrl and the given path", () => {
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      path: "/services",
    });
    expect(metadata.alternates).toEqual({ canonical: `${siteConfig.siteUrl}/services` });
  });

  it("wraps title in { absolute } so the root layout's title.template can't double-suffix it", () => {
    const metadata = buildMetadata({
      title: "Book an Appointment | Align the Spine Chiropractic",
      description: "Description",
      path: "/book",
    });
    expect(metadata.title).toEqual({
      absolute: "Book an Appointment | Align the Spine Chiropractic",
    });
  });

  it("mirrors title/description/url into openGraph and twitter", () => {
    const metadata = buildMetadata({ title: "Title", description: "Description", path: "/book" });
    expect(metadata.openGraph).toMatchObject({
      title: "Title",
      description: "Description",
      url: `${siteConfig.siteUrl}/book`,
      siteName: siteConfig.business.name,
    });
    expect(metadata.twitter).toMatchObject({ title: "Title", description: "Description" });
  });

  it("includes an OG/Twitter image and upgrades the Twitter card when one is given", () => {
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      path: "/about",
      image: { src: "/figma-exports/dr-abe-neck.png", alt: "Dr. Abe Nasser" },
    });
    expect(metadata.openGraph?.images).toEqual([
      { url: "/figma-exports/dr-abe-neck.png", alt: "Dr. Abe Nasser" },
    ]);
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: ["/figma-exports/dr-abe-neck.png"],
    });
  });

  it("falls back to a text-only summary card when no image is given", () => {
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      path: "/privacy-policy",
    });
    expect(metadata.openGraph?.images).toBeUndefined();
    expect(metadata.twitter).toMatchObject({ card: "summary" });
  });
});

describe("buildMetadata production gating", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("forces noindex when VERCEL_ENV is not production, even if the caller didn't ask for it", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const metadata = buildMetadata({ title: "Title", description: "Description", path: "/about" });
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("clobbers permissive robots overrides in non-production", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      path: "/about",
      robots: { index: true, follow: true },
    });
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("respects the caller's robots value in production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      path: "/thank-you",
      robots: { index: false },
    });
    expect(metadata.robots).toEqual({ index: false });
  });

  it("omits robots in production when the caller didn't pass one", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const metadata = buildMetadata({ title: "Title", description: "Description", path: "/about" });
    expect(metadata.robots).toBeUndefined();
  });
});
