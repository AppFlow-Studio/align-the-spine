import type { MetadataRoute } from "next";

import { isPublished, routes } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { listPublicContent } from "@/lib/content/public-content";

/** Sitemap (ATS-131): sourced entirely from content/seo.ts's route
 * registry, so a new static or condition page doesn't also need a second,
 * separate sitemap entry. /thank-you, /404, /auto-accident, and API
 * routes are absent because they're not in the registry — see
 * content/seo.ts. As of ATS-137, every /conditions/* route is a static
 * page registered there directly — there's no more dynamic [slug] route
 * to append separately. ATS-E4 (4.12): routes marked `status: "draft"`
 * (currently all 4 condition pages, pending clinician review — see
 * content/seo.ts) are excluded here too. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = routes.filter(isPublished).map((route) => ({
    url: `${siteConfig.siteUrl}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
  const [posts, areas] = await Promise.all([
    listPublicContent({ contentType: "blog_post", pageSize: 24 }),
    listPublicContent({ contentType: "service_area", pageSize: 24 }),
  ]);
  const dynamicEntries: MetadataRoute.Sitemap = [
    ...posts.items.map((item) => ({
      url: `${siteConfig.siteUrl}/blog/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...areas.items.map((item) => ({
      url: `${siteConfig.siteUrl}/service-areas/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
  return [...staticEntries, ...dynamicEntries];
}
