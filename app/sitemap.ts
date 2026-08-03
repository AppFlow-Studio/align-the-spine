import type { MetadataRoute } from "next";

import { conditionsBySlug } from "@/content/conditions";
import { routes } from "@/content/seo";
import { siteConfig } from "@/content/site";

/** Real (non-build-time) lastModified dates for the two remaining
 * conditions still served by the generic /conditions/[slug] template (see
 * content/conditions/index.ts). Bump the date here by hand when either
 * condition's content changes — content/seo.ts covers every other route. */
const dynamicConditionLastModified: Record<string, string> = {
  whiplash: "2026-07-29",
  sciatica: "2026-07-29",
};

export function lastModifiedFor(slug: string): string {
  const date = dynamicConditionLastModified[slug];
  if (!date) {
    throw new Error(`app/sitemap.ts: no lastModified configured for condition "${slug}"`);
  }
  return date;
}

/** Sitemap (ATS-131): sourced entirely from content/seo.ts's route registry
 * plus the dynamic /conditions/[slug] routes derived from conditionsBySlug,
 * so a new static page or condition doesn't also need a second, separate
 * sitemap entry. /thank-you, /404, /auto-accident, and API routes are
 * absent because they're not in the registry — see content/seo.ts. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteConfig.siteUrl}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const conditionEntries: MetadataRoute.Sitemap = Object.keys(conditionsBySlug).map((slug) => ({
    url: `${siteConfig.siteUrl}/conditions/${slug}`,
    lastModified: lastModifiedFor(slug),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...conditionEntries];
}
