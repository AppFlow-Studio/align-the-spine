import { unstable_cache } from "next/cache";

import { getContentRepository } from "./index";
import type { PublicListOptions } from "./repository";
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
