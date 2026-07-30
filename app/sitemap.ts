import type { MetadataRoute } from "next";

import { conditionsBySlug } from "@/content/conditions";
import { siteConfig } from "@/content/site";

/** Static route sitemap (ATS-131). /thank-you is excluded — it's a
 * post-conversion confirmation page marked `robots: { index: false }`
 * (see app/thank-you/page.tsx). Condition-page routes (ATS-061) are appended
 * below from the same conditionsBySlug map the [slug] route itself uses, so
 * the sitemap can't drift out of sync with the routes that actually exist. */
type Route = Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority"> & { path: string };

const routes: Route[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/book", changeFrequency: "monthly", priority: 0.9 },
  { path: "/home-visits", changeFrequency: "monthly", priority: 0.8 },
  { path: "/auto-accident", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  ...Object.keys(conditionsBySlug).map((slug) => ({
    path: `/conditions/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${siteConfig.siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
