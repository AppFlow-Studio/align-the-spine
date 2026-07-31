import type { MetadataRoute } from "next";

import { siteConfig } from "@/content/site";

/** Static route sitemap (ATS-131). /thank-you is excluded — it's a
 * post-conversion confirmation page marked `robots: { index: false }`
 * (see app/thank-you/page.tsx). Add the remaining condition-page routes
 * here as they ship (back-pain, neck-pain, sciatica, whiplash — see
 * content/conditions); auto-accidents (ATS-141) is the first one live. */
type Route = Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority"> & { path: string };

const routes: Route[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/book", changeFrequency: "monthly", priority: 0.9 },
  { path: "/auto-accidents", changeFrequency: "monthly", priority: 0.9 },
  { path: "/home-visits", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${siteConfig.siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
