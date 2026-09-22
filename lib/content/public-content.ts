import { unstable_cache } from "next/cache";

import { getContentRepository } from "./index";
import { MAX_PUBLIC_PAGE_SIZE, type PublicListOptions } from "./repository";
import type { ContentType } from "./types";

export async function listPublicContent(options: PublicListOptions) {
  if (process.env.NODE_ENV === "test") {
    return (await getContentRepository()).listPublic(options);
  }
  const cacheKey = JSON.stringify({
    contentType: options.contentType,
    page: options.page ?? 1,
    pageSize: options.pageSize ?? 12,
    category: options.category ?? "",
    tag: options.tag ?? "",
    query: options.query ?? "",
  });

  return unstable_cache(
    async () => (await getContentRepository()).listPublic(options),
    ["public-content-list", cacheKey],
    {
      tags: ["content:published", `content:${options.contentType}`],
      revalidate: 3600,
    },
  )();
}

/** Every published item of `contentType`, paging through listPublicContent
 * until `totalPages` is exhausted instead of trusting a single
 * hardcoded page size — the bug this fixes: app/sitemap.ts used to call
 * listPublicContent with `pageSize: 24` and take that one page as the
 * whole list, so a 25th published blog post or service-area record would
 * have silently never appeared in the sitemap. Callers that only need a
 * bounded page (e.g. a paginated /blog listing page) should keep calling
 * listPublicContent directly — this is specifically for "give me
 * everything," which the sitemap is the one caller that actually needs. */
export async function listAllPublicContent(
  contentType: ContentType,
  // Injectable only for lib/content/public-content.test.ts, which needs to
  // exercise the multi-page loop against a fake multi-page result without
  // seeding 24+ real fixture/Supabase rows just to prove the loop works.
  listFn: typeof listPublicContent = listPublicContent,
) {
  // Page with the repositories' real ceiling, not a larger number they would
  // silently clamp. This previously asked for 100 and was handed 24 — the loop
  // still worked (totalPages is derived from the clamped size, so offsets stayed
  // consistent), but the request was dead intent that read like configuration,
  // and any future reader could reasonably assume 100 rows per round trip.
  const pageSize = MAX_PUBLIC_PAGE_SIZE;
  const first = await listFn({ contentType, page: 1, pageSize });
  const items = [...first.items];

  for (let page = 2; page <= first.totalPages; page++) {
    const next = await listFn({ contentType, page, pageSize });
    items.push(...next.items);
  }

  return items;
}

export async function getPublicContentBySlug(contentType: ContentType, slug: string) {
  if (process.env.NODE_ENV === "test") {
    return (await getContentRepository()).getPublicBySlug(contentType, slug);
  }
  return unstable_cache(
    async () => (await getContentRepository()).getPublicBySlug(contentType, slug),
    ["public-content-item", contentType, slug],
    {
      tags: ["content:published", `content:${contentType}`, `content:slug:${slug}`],
      revalidate: 3600,
    },
  )();
}

export async function listPublicCategories(contentType: ContentType) {
  if (process.env.NODE_ENV === "test") {
    return (await getContentRepository()).listPublicCategories(contentType);
  }
  return unstable_cache(
    async () => (await getContentRepository()).listPublicCategories(contentType),
    ["public-content-categories", contentType],
    { tags: ["content:published", `content:${contentType}`], revalidate: 3600 },
  )();
}

export async function listPublicContentByIds(ids: string[]) {
  if (!ids.length) return [];
  if (process.env.NODE_ENV === "test") {
    return (await getContentRepository()).listPublicByIds(ids);
  }
  return unstable_cache(
    async () => (await getContentRepository()).listPublicByIds(ids),
    ["public-content-by-ids", ...[...ids].sort()],
    { tags: ["content:published"], revalidate: 3600 },
  )();
}
