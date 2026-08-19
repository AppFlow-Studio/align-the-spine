import type { ContentItem, ContentListResult, ContentType, PublicContentItem } from "./types";

export class ContentRepositoryUnavailableError extends Error {
  constructor(message = "The editorial content service is temporarily unavailable.") {
    super(message);
    this.name = "ContentRepositoryUnavailableError";
  }
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
