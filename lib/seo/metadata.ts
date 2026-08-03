import type { Metadata } from "next";

import { siteConfig } from "@/content/site";

export interface BuildMetadataInput {
  /** Full page title, e.g. "Book an Appointment | Align the Spine Chiropractic". */
  title: string;
  description: string;
  /** Route path from the site root, e.g. "/services". Use "" for the home page. */
  path: string;
  /** Social preview image. Omit for routes with no natural hero image (e.g. /privacy-policy) —
   * OpenGraph/Twitter degrade gracefully to a text-only card. */
  image?: { src: string; alt: string };
  robots?: Metadata["robots"];
}

/** Builds the title/description/canonical/OpenGraph/Twitter metadata shared by every
 * route (EPIC 12: per-route metadata scaffolding), so each page only supplies its own
 * copy. Image `src` may be relative — `metadataBase` on the root layout
 * (app/layout.tsx) resolves it to an absolute URL for OG/Twitter. */
export function buildMetadata({
  title,
  description,
  path,
  image,
  robots,
}: BuildMetadataInput): Metadata {
  const url = `${siteConfig.siteUrl}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.business.name,
      type: "website",
      images: image ? [{ url: image.src, alt: image.alt }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image.src] : undefined,
    },
    ...(robots ? { robots } : {}),
  };
}
