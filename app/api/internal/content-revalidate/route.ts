import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

/** Cache invalidation for content that never passed through the admin API.
 *
 * `/api/admin/content/[id]/transition` already revalidates the tags it touches,
 * but a post written straight to Supabase (table editor, SQL editor,
 * `publish_blog_post()`, a client-library insert) has no such wrapper — the new
 * page would sit behind a cached `unstable_cache` entry until its TTL expired.
 * `content_notify_revalidation()`
 * (supabase/migrations/202609270003_blog_direct_upload.sql) posts here through
 * pg_net on every insert or update of a public blog post, and this route drops
 * exactly the tags that content is cached under (lib/content/public-content.ts).
 *
 * Fails closed: without CONTENT_REVALIDATION_SECRET set in the environment, no
 * request is accepted at all. Purging a cache is cheap but it is still a write
 * against the site's front door, so there is no "open when unconfigured" mode. */
const requestSchema = z.object({
  id: z.uuid().optional(),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  contentType: z.enum(["blog_post", "service_area"]).default("blog_post"),
  status: z.string().trim().max(40).optional(),
});

function isAuthorized(request: Request): boolean {
  const expected = process.env.CONTENT_REVALIDATION_SECRET;
  if (!expected) return false;
  const provided = request.headers.get("x-revalidate-secret") ?? "";
  // Compared as fixed-length digests so a mismatched length can't short-circuit
  // the comparison, and byte content can't be inferred from timing.
  const expectedBytes = Buffer.from(expected);
  const providedBytes = Buffer.from(provided);
  if (expectedBytes.length !== providedBytes.length) return false;
  return timingSafeEqual(expectedBytes, providedBytes);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }
  const { id, slug, contentType } = parsed.data;
  const itemPath = contentType === "blog_post" ? `/blog/${slug}` : `/service-areas/${slug}`;
  const hubPath = contentType === "blog_post" ? "/blog" : "/service-areas";
  const targets = [itemPath, hubPath, "/sitemap.xml", "/feed.xml"];

  if (id) revalidateTag(`content:${id}`, "max");
  revalidateTag(`content:slug:${slug}`, "max");
  revalidateTag(`content:${contentType}`, "max");
  revalidateTag("content:published", "max");
  targets.forEach((path) => revalidatePath(path));

  return NextResponse.json({ ok: true, revalidated: targets });
}
