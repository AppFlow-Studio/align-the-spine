import { siteConfig } from "@/content/site";
import { listAllPublicContent } from "@/lib/content/public-content";

/** How many entries the Atom feed carries.
 *
 * This is a deliberate editorial cap applied *after* every published post has
 * been retrieved — not a pagination limit. The distinction is the whole point
 * of ATS-A02: this route used to call `listPublicContent({ pageSize: 24 })` and
 * treat that single page as the complete archive, so the 25th published post
 * silently vanished from the feed forever. The sitemap was fixed for exactly
 * this bug in 2026-09-17; the feed was missed.
 *
 * Feeds legitimately cap — readers don't want the entire archive on every
 * poll. Cap on purpose, after a full fetch, and never by accidentally reading
 * one repository page as the whole dataset. */
export const FEED_MAX_ENTRIES = 50;

function xml(value: string) {
  return value.replace(
    /[<>&'\"]/g,
    (character) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '\"': "&quot;" })[character] ??
      character,
  );
}

export async function GET() {
  // Every published post, paged correctly, then sorted newest-first and
  // trimmed to the declared cap. `listAllPublicContent` is the same helper the
  // sitemap uses, so the two can't diverge on what "published" means again.
  const published = await listAllPublicContent("blog_post");
  const items = [...published]
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, FEED_MAX_ENTRIES);
  const body = `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>${xml("Align the Spine Chiropractic Resources")}</title><id>${siteConfig.siteUrl}/blog</id><link href="${siteConfig.siteUrl}/feed.xml" rel="self"/><link href="${siteConfig.siteUrl}/blog"/><updated>${items[0]?.updatedAt ?? "2026-08-16T00:00:00.000Z"}</updated>${items.map((item) => `<entry><title>${xml(item.title)}</title><id>${siteConfig.siteUrl}/blog/${item.slug}</id><link href="${siteConfig.siteUrl}/blog/${item.slug}"/><updated>${item.updatedAt}</updated><published>${item.publishedAt}</published><summary>${xml(item.excerpt)}</summary><author><name>${xml(item.author.name)}</name></author></entry>`).join("")}</feed>`;
  return new Response(body, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
