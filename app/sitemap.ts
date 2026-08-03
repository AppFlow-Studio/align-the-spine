import type { MetadataRoute } from "next";

import { routes } from "@/content/seo";
import { siteConfig } from "@/content/site";

/** Sitemap (ATS-131): sourced entirely from content/seo.ts's route
 * registry, so a new static or condition page doesn't also need a second,
 * separate sitemap entry. /thank-you, /404, /auto-accident, and API
 * routes are absent because they're not in the registry — see
 * content/seo.ts. As of ATS-137, every /conditions/* route is a static
 * page registered there directly — there's no more dynamic [slug] route
 * to append separately. */
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.siteUrl}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
