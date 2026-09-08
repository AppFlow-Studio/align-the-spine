import type { MetadataRoute } from "next";

import { isProduction, siteConfig } from "@/content/site";

/** robots.txt (ATS-131, extended ATS-SEO-139). Production allows crawling
 * site-wide except the lead API route and the post-conversion thank-you
 * pages (/thank-you and its Spanish counterpart /es/gracias). The whole
 * /es, /pt and /ht subtrees are otherwise deliberately crawlable — each is
 * primary-content locale, not a duplicate. /pt and /ht have no
 * post-conversion page of their own to disallow (ATS-SEO-135/136
 * deliberately built none — their forms redirect to the English
 * /thank-you instead), so there's nothing to add for them beyond staying
 * out of `disallow` entirely. Every nonproduction deploy (local dev, CI,
 * Vercel previews) disallows everything — robots.txt alone can't reliably
 * keep a preview out of search (a crawler can ignore it), so this is
 * paired with the per-page/layout noindex in lib/seo/metadata.ts and
 * app/layout.tsx. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: isProduction()
      ? {
          userAgent: "*",
          allow: "/",
          disallow: ["/api/", "/admin/", "/preview/", "/thank-you", "/es/gracias"],
        }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
