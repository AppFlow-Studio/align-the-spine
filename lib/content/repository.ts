import type { ContentItem, ContentListResult, ContentType, PublicContentItem } from "./types";

export class ContentRepositoryUnavailableError extends Error {
  constructor(message = "The editorial content service is temporarily unavailable.") {
    super(message);
    this.name = "ContentRepositoryUnavailableError";
  }
}

/** Hard upper bound every repository clamps `PublicListOptions.pageSize` to.
 *
 * This is the ceiling that caused the sitemap bug (ATS-A02/2026-09-17): a
 * caller asking for `pageSize: 24` — or, just as misleadingly, asking for 100
 * and being silently given 24 — and then treating that single page as the
 * complete dataset. The value is exported so that "give me everything"
 * callers page with the real limit instead of a hardcoded guess that the
 * repositories quietly override. Raising it here raises it everywhere,
 * consistently, and `listAllPublicContent` keeps working untouched.
 *
 * Never read a single `listPublic()` page as a full dataset. Use
 * `listAllPublicContent()` (lib/content/public-content.ts) for that. */
export const MAX_PUBLIC_PAGE_SIZE = 24;

/** Page size used when a caller doesn't specify one. */
export const DEFAULT_PUBLIC_PAGE_SIZE = 9;

/** Clamps a requested page size into the range every repository honours, so
 * the three implementations can't drift apart on the boundary. */
export function clampPageSize(requested: number | undefined): number {
  return Math.min(MAX_PUBLIC_PAGE_SIZE, Math.max(1, requested ?? DEFAULT_PUBLIC_PAGE_SIZE));
}

export interface PublicListOptions {
  contentType: ContentType;
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  query?: string;
}

export interface PublicCategorySummary {
  slug: string;
  name: string;
  count: number;
}

export interface ContentRepository {
  listPublic(options: PublicListOptions): Promise<ContentListResult>;
  getPublicBySlug(contentType: ContentType, slug: string): Promise<PublicContentItem | null>;
  listPublicCategories(contentType: ContentType): Promise<PublicCategorySummary[]>;
  listPublicByIds(ids: string[]): Promise<PublicContentItem[]>;
  listEditorial(): Promise<ContentItem[]>;
  getEditorialById(id: string): Promise<ContentItem | null>;
}
