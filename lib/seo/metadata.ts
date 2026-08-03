import type { Metadata } from "next";

import { siteConfig } from "@/content/site";

export interface BuildMetadataParams {
  title: string;
  description: string;
  /** Route path relative to siteConfig.siteUrl, e.g. "/about" (or "" for
   * the homepage) — used for the canonical URL and OpenGraph url. */
  path: string;
  /** OG image; omitted entirely from the result when not provided (e.g.
   * /privacy-policy has no representative photo). */
  image?: { src: string; alt: string };
  /** Passed straight through to Next's Metadata (e.g. { index: false } for
   * /thank-you, /404). */
  robots?: Metadata["robots"];
}

/** Shared per-page metadata builder: canonical URL + matching OpenGraph
 * title/description/url/image, built from siteConfig.siteUrl + path so
 * every page doesn't hand-roll its own alternates/openGraph block. */
export function buildMetadata({
  title,
  description,
  path,
  image,
  robots,
}: BuildMetadataParams): Metadata {
  const url = `${siteConfig.siteUrl}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      ...(image ? { images: [{ url: image.src, alt: image.alt }] } : {}),
    },
    ...(robots ? { robots } : {}),
  };
}
