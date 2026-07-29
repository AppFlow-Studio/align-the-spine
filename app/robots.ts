import type { MetadataRoute } from "next";

import { siteConfig } from "@/content/site";

/** robots.txt (ATS-131): allow crawling site-wide except the lead API route
 * and the post-conversion /thank-you page (already noindex'd in its own
 * metadata — disallowing it here also keeps it out of crawl budget). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/thank-you"],
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
