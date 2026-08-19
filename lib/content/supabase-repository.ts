import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import {
  ContentRepositoryUnavailableError,
  type ContentRepository,
  type PublicCategorySummary,
  type PublicListOptions,
} from "./repository";
import { estimatedReadingMinutes } from "./schemas";
import type {
  ContentAsset,
  ContentAuthor,
  ContentFaqItem,
  ContentItem,
  ContentSource,
  PublicContentItem,
} from "./types";

export class SupabaseContentRepository implements ContentRepository {
  private constructor(private readonly client: SupabaseClient) {}

  static createFromEnvironment(): SupabaseContentRepository {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      throw new ContentRepositoryUnavailableError("Supabase content environment is incomplete.");
    }
    return new SupabaseContentRepository(
      createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }),
    );
  }

  static createAuthenticated(client: SupabaseClient): SupabaseContentRepository {
    return new SupabaseContentRepository(client);
  }

  async listPublic(options: PublicListOptions) {
    const page = Math.max(1, options.page ?? 1);
    const pageSize = Math.min(24, Math.max(1, options.pageSize ?? 9));
    const from = (page - 1) * pageSize;
    let query = this.client
      .from("public_content_items")
      .select("*", { count: "exact" })
      .eq("content_type", options.contentType)
      .order("published_at", { ascending: false })
      .range(from, from + pageSize - 1);
    if (options.category) query = query.contains("category_slugs", [options.category]);
    if (options.tag) query = query.contains("tag_slugs", [options.tag]);
    if (options.query)
      query = query.textSearch("search_document", options.query, { type: "websearch" });
    const { data, error, count } = await query;
    if (error) throw new ContentRepositoryUnavailableError();
    const items = (data ?? []).map((row) => this.mapPublicRow(row as Record<string, unknown>));
    return {
      items,
      page,
      pageSize,
      total: count ?? 0,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
    };
  }

  async getPublicBySlug(contentType: ContentItem["contentType"], slug: string) {
    const { data, error } = await this.client
      .from("public_content_items")
      .select("*")
      .eq("content_type", contentType)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new ContentRepositoryUnavailableError();
    return data ? this.mapPublicRow(data as Record<string, unknown>) : null;
  }

  async listPublicCategories(
    contentType: ContentItem["contentType"],
  ): Promise<PublicCategorySummary[]> {
    const [itemsResult, categoriesResult] = await Promise.all([
      this.client
        .from("public_content_items")
        .select("category_slugs")
        .eq("content_type", contentType),
      this.client.from("categories").select("slug,name").eq("active", true),
    ]);
    if (itemsResult.error) throw new ContentRepositoryUnavailableError();
    const nameBySlug = new Map(
      (categoriesResult.data ?? []).map((row) => [String(row.slug), String(row.name)]),
    );
    const counts = new Map<string, number>();
    for (const row of itemsResult.data ?? []) {
      for (const slug of stringArray((row as Record<string, unknown>).category_slugs)) {
        counts.set(slug, (counts.get(slug) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .map(([slug, count]) => ({
        slug,
        name: nameBySlug.get(slug) ?? slug.replaceAll("-", " "),
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }

  async listPublicByIds(ids: string[]): Promise<PublicContentItem[]> {
    if (!ids.length) return [];
    const { data, error } = await this.client
      .from("public_content_items")
      .select("*")
      .in("id", ids);
    if (error) throw new ContentRepositoryUnavailableError();
    return (data ?? []).map((row) => this.mapPublicRow(row as Record<string, unknown>));
  }

  async listEditorial(): Promise<ContentItem[]> {
    const { data, error } = await this.client
      .from("content_items")
      .select(
        "*, author:authors(*), featured_image:assets!content_items_featured_image_asset_id_fkey(*), reviewer:profiles!content_items_clinician_reviewer_id_fkey(display_name), content_categories(categories(slug)), content_tags(tags(slug)), content_sources(block_id,claim_supported,sources(*)), content_relations(target_content_id)",
      )
      .order("updated_at", { ascending: false });
    if (error) throw new ContentRepositoryUnavailableError();
    return (data ?? []).map((row) => this.mapEditorialRow(row as Record<string, unknown>));
  }

  async getEditorialById(id: string): Promise<ContentItem | null> {
    const { data, error } = await this.client
      .from("content_items")
      .select(
        "*, author:authors(*), featured_image:assets!content_items_featured_image_asset_id_fkey(*), reviewer:profiles!content_items_clinician_reviewer_id_fkey(display_name), content_categories(categories(slug)), content_tags(tags(slug)), content_sources(block_id,claim_supported,sources(*)), content_relations(target_content_id)",
      )
      .eq("id", id)
      .maybeSingle();
    if (error) throw new ContentRepositoryUnavailableError();
    return data ? this.mapEditorialRow(data as Record<string, unknown>) : null;
  }

  private mapPublicRow(row: Record<string, unknown>): PublicContentItem {
    const author = mapAuthor(record(row.author));
    const featuredImage = row.featured_image ? mapAsset(record(row.featured_image)) : undefined;
    const blocks = (row.blocks ?? []) as PublicContentItem["blocks"];
    return {
      id: String(row.id),
      contentType: row.content_type as PublicContentItem["contentType"],
      slug: String(row.slug),
      title: String(row.title),
      excerpt: String(row.excerpt),
      blocks,
      status: row.status as PublicContentItem["status"],
      featured: Boolean(row.featured),
      seoTitle: String(row.seo_title),
      metaDescription: String(row.meta_description),
      ogTitle: optionalString(row.og_title),
      ogDescription: optionalString(row.og_description),
      ogImageAssetId: optionalString(row.og_image_asset_id),
      featuredImageAssetId: optionalString(row.featured_image_asset_id),
      featuredImageAlt: optionalString(row.featured_image_alt),
      featuredImageDecorative: Boolean(row.featured_image_decorative),
      authorId: String(row.author_id),
      clinicianReviewerId: optionalString(row.clinician_reviewer_id),
      clinicianReviewerName: optionalString(row.clinician_reviewer_name),
      clinicianReviewedAt: optionalString(row.clinician_reviewed_at),
      medicalReviewRequired: Boolean(row.medical_review_required),
      publishedAt: optionalString(row.published_at),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
      lastSubstantiveReviewAt: optionalString(row.last_substantive_review_at),
      noindex: Boolean(row.noindex),
      noindexReason: optionalString(row.noindex_reason),
      directAnswer: String(row.direct_answer),
      keyTakeaways: stringArray(row.key_takeaways),
      faqs: Array.isArray(row.faqs) ? row.faqs.map((entry) => mapFaqItem(record(entry))) : [],
      emergencyGuidanceRelevant: Boolean(row.emergency_guidance_relevant),
      categorySlugs: stringArray(row.category_slugs),
      tagSlugs: stringArray(row.tag_slugs),
      relatedContentIds: stringArray(row.related_content_ids),
      sources: Array.isArray(row.sources)
        ? row.sources.map((source) => mapSource(record(source)))
        : [],
      gateResult: row.gate_result as PublicContentItem["gateResult"],
      serviceArea: (row.service_area ?? undefined) as PublicContentItem["serviceArea"],
      author,
      ...(featuredImage ? { featuredImage } : {}),
      estimatedReadingMinutes: estimatedReadingMinutes(blocks),
    };
  }

  private mapEditorialRow(row: Record<string, unknown>): ContentItem {
    const sourceJoins = Array.isArray(row.content_sources) ? row.content_sources : [];
    return {
      id: String(row.id),
      contentType: row.content_type as ContentItem["contentType"],
      slug: String(row.slug),
      title: String(row.title),
      excerpt: String(row.excerpt),
      blocks: (row.content_blocks ?? []) as ContentItem["blocks"],
      status: row.status as ContentItem["status"],
      featured: Boolean(row.featured),
      primaryKeyword: optionalString(row.primary_keyword),
      searchIntent: String(row.search_intent),
      audience: String(row.audience),
      seoTitle: String(row.seo_title),
      metaDescription: String(row.meta_description),
      canonicalOverride: optionalString(row.canonical_override),
      ogTitle: optionalString(row.og_title),
      ogDescription: optionalString(row.og_description),
      ogImageAssetId: optionalString(row.og_image_asset_id),
      featuredImageAssetId: optionalString(row.featured_image_asset_id),
      featuredImageAlt: optionalString(row.featured_image_alt),
      featuredImageDecorative: Boolean(row.featured_image_decorative),
      authorId: String(row.author_id),
      clinicianReviewerId: optionalString(row.clinician_reviewer_id),
      clinicianReviewerName: optionalString(record(row.reviewer).display_name),
      clinicianReviewedAt: optionalString(row.clinician_reviewed_at),
      medicalReviewRequired: Boolean(row.medical_review_required),
      publishedAt: optionalString(row.published_at),
      scheduledFor: optionalString(row.scheduled_for),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
      lastSubstantiveReviewAt: optionalString(row.last_substantive_review_at),
      noindex: Boolean(row.noindex),
      noindexReason: optionalString(row.noindex_reason),
      version: Number(row.version),
      directAnswer: String(row.direct_answer),
      keyTakeaways: stringArray(row.key_takeaways),
      faqs: Array.isArray(row.faqs) ? row.faqs.map((entry) => mapFaqItem(record(entry))) : [],
      emergencyGuidanceRelevant: Boolean(row.emergency_guidance_relevant),
      categorySlugs: nestedSlugs(row.content_categories, "categories"),
      tagSlugs: nestedSlugs(row.content_tags, "tags"),
      relatedContentIds: Array.isArray(row.content_relations)
        ? row.content_relations.map((relation) => String(record(relation).target_content_id))
        : [],
      sources: sourceJoins.map((join) => {
        const joinRow = record(join);
        return mapSource(record(joinRow.sources), joinRow);
      }),
      gateResult: row.gate_result as ContentItem["gateResult"],
      serviceArea: (row.service_area_evidence ?? undefined) as ContentItem["serviceArea"],
      author: mapAuthor(record(row.author)),
      featuredImage: row.featured_image ? mapAsset(record(row.featured_image)) : undefined,
    };
  }
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function nestedSlugs(value: unknown, key: string): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    const nested = record(record(entry)[key]);
    return nested.slug ? [String(nested.slug)] : [];
  });
}

function mapAuthor(row: Record<string, unknown>): ContentAuthor {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    credentials: optionalString(row.credentials),
    shortBio: String(row.shortBio ?? row.short_bio ?? ""),
    portraitUrl: optionalString(row.portraitUrl ?? row.portrait_url),
    profileUrl: String(row.profileUrl ?? row.profile_url ?? "/about"),
    active: row.active !== false,
  };
}

function mapAsset(row: Record<string, unknown>): ContentAsset {
  return {
    id: String(row.id),
    url: String(row.url),
    provider: row.provider as ContentAsset["provider"],
    mimeType: String(row.mimeType ?? row.mime_type),
    width: Number(row.width),
    height: Number(row.height),
    alt: String(row.alt ?? ""),
    caption: optionalString(row.caption),
    attribution: optionalString(row.attribution),
    approvalState: (row.approvalState ?? row.approval_state) as ContentAsset["approvalState"],
    focalX: row.focalX || row.focal_x ? Number(row.focalX ?? row.focal_x) : undefined,
    focalY: row.focalY || row.focal_y ? Number(row.focalY ?? row.focal_y) : undefined,
  };
}

function mapFaqItem(row: Record<string, unknown>): ContentFaqItem {
  return {
    id: String(row.id),
    question: String(row.question),
    answer: String(row.answer),
  };
}

function mapSource(
  row: Record<string, unknown>,
  join: Record<string, unknown> = {},
): ContentSource {
  return {
    id: String(row.id),
    title: String(row.title),
    publisher: String(row.publisher),
    url: String(row.url),
    sourceType: row.source_type as ContentSource["sourceType"],
    publicationDate: optionalString(row.publication_date),
    updatedDate: optionalString(row.updated_date),
    accessedDate: String(row.accessed_date),
    geography: optionalString(row.geography),
    statisticPeriod: optionalString(row.statistic_period),
    claimSupported: String(join.claim_supported ?? row.claim_supported ?? ""),
    classification: row.primary_source ? "primary" : "secondary",
    verificationStatus: row.verification_status as ContentSource["verificationStatus"],
    recheckDate: optionalString(row.recheck_date),
    blockId: optionalString(join.block_id ?? row.block_id),
  };
}
