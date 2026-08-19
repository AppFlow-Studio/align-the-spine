import type { ContentRepository, PublicCategorySummary, PublicListOptions } from "./repository";
import type { ContentType } from "./types";

/** Routes by ContentType to one of two underlying repositories — currently
 * `blog_post` (Supabase or fixture, so a non-technical editor can publish
 * without a deploy) and `service_area` (a static, code-reviewed data file;
 * see content/service-areas.ts for why). listPublicByIds/listEditorial span
 * both content types, so those two methods merge results from each. */
export class CompositeContentRepository implements ContentRepository {
  constructor(
    private readonly blogRepository: ContentRepository,
    private readonly serviceAreaRepository: ContentRepository,
  ) {}

  private repositoryFor(contentType: ContentType): ContentRepository {
    return contentType === "service_area" ? this.serviceAreaRepository : this.blogRepository;
  }

  listPublic(options: PublicListOptions) {
    return this.repositoryFor(options.contentType).listPublic(options);
  }

  getPublicBySlug(contentType: ContentType, slug: string) {
    return this.repositoryFor(contentType).getPublicBySlug(contentType, slug);
  }

  listPublicCategories(contentType: ContentType): Promise<PublicCategorySummary[]> {
    return this.repositoryFor(contentType).listPublicCategories(contentType);
  }

  async listPublicByIds(ids: string[]) {
    if (!ids.length) return [];
    // Split by id shape before querying either repository — Supabase's
    // blog repo does `.in("id", ids)` against a uuid column, so handing it
    // a static service-area id (e.g. "service-area-lighthouse-point")
    // throws a Postgres invalid-UUID error instead of just finding nothing.
    const serviceAreaIds = ids.filter((id) => id.startsWith("service-area-"));
    const blogIds = ids.filter((id) => !id.startsWith("service-area-"));
    const [blog, serviceArea] = await Promise.all([
      blogIds.length ? this.blogRepository.listPublicByIds(blogIds) : Promise.resolve([]),
      serviceAreaIds.length
        ? this.serviceAreaRepository.listPublicByIds(serviceAreaIds)
        : Promise.resolve([]),
    ]);
    return [...blog, ...serviceArea];
  }

  async listEditorial() {
    const [blog, serviceArea] = await Promise.all([
      this.blogRepository.listEditorial(),
      this.serviceAreaRepository.listEditorial(),
    ]);
    return [...blog, ...serviceArea];
  }

  async getEditorialById(id: string) {
    // Same reasoning as listPublicByIds: don't hand a non-uuid static id to
    // the Supabase blog repo's `.eq("id", ...)` against a uuid column.
    if (id.startsWith("service-area-")) return this.serviceAreaRepository.getEditorialById(id);
    return this.blogRepository.getEditorialById(id);
  }
}
