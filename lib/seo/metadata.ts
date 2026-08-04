import type { Metadata } from "next";

import { isPublished, type RouteMeta } from "@/content/seo";
import { isProduction, siteConfig } from "@/content/site";

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
 * route, so each page only supplies its own copy. Image `src` may be relative —
 * `metadataBase` on the root layout (app/layout.tsx) resolves it to an absolute URL
 * for OG/Twitter. `title` is wrapped in `{ absolute }` because every caller already
 * bakes the full "X | Align the Spine Chiropractic" string into `title` themselves —
 * `{ absolute }` opts out of the root layout's `title.template` so it doesn't get
 * suffixed a second time. Forces noindex outside production (see
 * content/site.ts's isProduction()) regardless of what a page passes in, so a
 * preview deploy can never ship an indexable page by omission. */
export function buildMetadata({
  title,
  description,
  path,
  image,
  robots,
}: BuildMetadataInput): Metadata {
  const url = `${siteConfig.siteUrl}${path}`;
  const effectiveRobots: Metadata["robots"] = isProduction()
    ? robots
    : { index: false, follow: false };

  return {
    title: { absolute: title },
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
    ...(effectiveRobots ? { robots: effectiveRobots } : {}),
  };
}

/** ATS-E4 (4.12/4.14): wraps buildMetadata() for a content/seo.ts route
 * entry, forcing noindex whenever the route isn't `status: "published"` —
 * on top of (not instead of) buildMetadata's own outside-production
 * noindex gate. Use this instead of `buildMetadata(getRoute(path))`
 * directly for any route that can be draft (currently the 4 condition
 * pages, pending clinician review). */
export function buildRouteMetadata(route: RouteMeta): Metadata {
  return buildMetadata({
    title: route.title,
    description: route.description,
    path: route.path,
    image: route.image,
    robots: isPublished(route) ? undefined : { index: false, follow: false },
  });
}
