import type { MetadataRoute } from "next";

import { conditionsBySlug } from "@/content/conditions";
import { siteConfig } from "@/content/site";

/** Static route sitemap (ATS-131). /thank-you is excluded — it's a
 * post-conversion confirmation page marked `robots: { index: false }`
 * (see app/thank-you/page.tsx). The 4 /conditions/[slug] routes (ATS-061,
 * ATS-137) are derived from conditionsBySlug so a new condition added there
 * doesn't also need a manual sitemap entry. */
type Route = Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority"> & { path: string };

const routes: Route[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/book", changeFrequency: "monthly", priority: 0.9 },
  { path: "/auto-accidents", changeFrequency: "monthly", priority: 0.9 },
  { path: "/home-visits", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact-us", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  ...Object.keys(conditionsBySlug).map((slug): Route => ({
    path: `/conditions/${slug}`,
    changeFrequency: "monthly",
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
