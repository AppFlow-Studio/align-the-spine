import type { MetadataRoute } from "next";

import { isProduction, siteConfig } from "@/content/site";

/** robots.txt (ATS-131, extended ATS-SEO-139, fixed ATS-SEO-124). Production
 * allows crawling site-wide except the lead API route and the private
 * /admin and /preview paths. The post-conversion thank-you pages
 * (/thank-you and its Spanish counterpart /es/gracias) are deliberately
 * NOT disallowed here, even though both are noindex: a Disallow rule stops
 * Googlebot from ever fetching the page at all, which means it never sees
 * the page-level `robots: { index: false }` meta tag either — the URL can
 * still surface in search (as a bare link with no snippet, via other sites
 * linking to it) with no way for Google to confirm it should be excluded.
 * Letting crawlers fetch the page and read its own noindex is the correct,
 * documented way to keep a URL out of the index (robots.txt is for crawl
 * budget/access control, not indexing control — see Google's own guidance
 * against combining the two). The whole /es, /pt and /ht subtrees are
 * otherwise deliberately crawlable — each is primary-content locale, not a
 * duplicate. /pt and /ht have no post-conversion page of their own
 * (ATS-SEO-135/136 deliberately built none — their forms redirect to the
 * English /thank-you instead), so there's nothing to add for them. Every
 * nonproduction deploy (local dev, CI, Vercel previews) disallows
 * everything — robots.txt alone can't reliably keep a preview out of
 * search (a crawler can ignore it), so this is paired with the per-page/
 * layout noindex in lib/seo/metadata.ts and app/layout.tsx. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: isProduction()
      ? {
          userAgent: "*",
          allow: "/",
          disallow: ["/api/", "/admin/", "/preview/"],
        }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
