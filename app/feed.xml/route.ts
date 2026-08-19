import { siteConfig } from "@/content/site";
import { listPublicContent } from "@/lib/content/public-content";

function xml(value: string) {
  return value.replace(
    /[<>&'\"]/g,
    (character) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '\"': "&quot;" })[character] ??
      character,
  );
}

export async function GET() {
  const { items } = await listPublicContent({ contentType: "blog_post", pageSize: 24 });
  const body = `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>${xml("Align the Spine Chiropractic Resources")}</title><id>${siteConfig.siteUrl}/blog</id><link href="${siteConfig.siteUrl}/feed.xml" rel="self"/><link href="${siteConfig.siteUrl}/blog"/><updated>${items[0]?.updatedAt ?? "2026-08-16T00:00:00.000Z"}</updated>${items.map((item) => `<entry><title>${xml(item.title)}</title><id>${siteConfig.siteUrl}/blog/${item.slug}</id><link href="${siteConfig.siteUrl}/blog/${item.slug}"/><updated>${item.updatedAt}</updated><published>${item.publishedAt}</published><summary>${xml(item.excerpt)}</summary><author><name>${xml(item.author.name)}</name></author></entry>`).join("")}</feed>`;
  return new Response(body, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
