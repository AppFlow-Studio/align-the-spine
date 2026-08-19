import { fixtureAssets, fixtureAuthors, fixtureContent } from "./fixtures";
import type { ContentRepository, PublicCategorySummary, PublicListOptions } from "./repository";
import { estimatedReadingMinutes } from "./schemas";
import type { ContentItem, PublicContentItem } from "./types";

function toPublic(item: ContentItem): PublicContentItem {
  const author = fixtureAuthors.find((entry) => entry.id === item.authorId);
  if (!author) throw new Error(`Fixture content ${item.id} has no valid author.`);
  const featuredImage = fixtureAssets.find((entry) => entry.id === item.featuredImageAssetId);
  const {
    primaryKeyword: _primaryKeyword,
    searchIntent: _searchIntent,
    audience: _audience,
    canonicalOverride: _canonicalOverride,
    version: _version,
    ...publicFields
  } = item;
  void [_primaryKeyword, _searchIntent, _audience, _canonicalOverride, _version];
  return {
    ...publicFields,
    author,
    ...(featuredImage ? { featuredImage } : {}),
    estimatedReadingMinutes: estimatedReadingMinutes(item.blocks),
  };
}

function isPublic(item: ContentItem, now = new Date()): boolean {
  return (
    item.status === "published" &&
    !item.noindex &&
    item.gateResult.passed &&
    Boolean(item.publishedAt && new Date(item.publishedAt) <= now)
  );
}

export class FixtureContentRepository implements ContentRepository {
  async listPublic(options: PublicListOptions) {
    const page = Math.max(1, options.page ?? 1);
    const pageSize = Math.min(24, Math.max(1, options.pageSize ?? 9));
    const query = options.query?.trim().toLowerCase();
    const filtered = fixtureContent
      .filter((item) => item.contentType === options.contentType && isPublic(item))
      .filter((item) => !options.category || item.categorySlugs.includes(options.category))
      .filter((item) => !options.tag || item.tagSlugs.includes(options.tag))
      .filter(
        (item) =>
          !query ||
          item.title.toLowerCase().includes(query) ||
          item.excerpt.toLowerCase().includes(query),
      )
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
    const offset = (page - 1) * pageSize;
    return {
      items: filtered.slice(offset, offset + pageSize).map(toPublic),
      page,
      pageSize,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    };
  }

  async getPublicBySlug(contentType: ContentItem["contentType"], slug: string) {
    const item = fixtureContent.find(
      (entry) => entry.contentType === contentType && entry.slug === slug && isPublic(entry),
    );
    return item ? toPublic(item) : null;
  }

  async listPublicCategories(
    contentType: ContentItem["contentType"],
  ): Promise<PublicCategorySummary[]> {
    const counts = new Map<string, number>();
    for (const item of fixtureContent) {
      if (item.contentType !== contentType || !isPublic(item)) continue;
      for (const slug of item.categorySlugs) counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([slug, count]) => ({ slug, name: slug.replaceAll("-", " "), count }))
      .sort((a, b) => b.count - a.count);
  }

  async listPublicByIds(ids: string[]) {
    if (!ids.length) return [];
    const set = new Set(ids);
    return fixtureContent.filter((entry) => set.has(entry.id) && isPublic(entry)).map(toPublic);
  }

  async listEditorial() {
    return structuredClone(fixtureContent);
  }

  async getEditorialById(id: string) {
    const item = fixtureContent.find((entry) => entry.id === id);
    return item ? structuredClone(item) : null;
  }
}
