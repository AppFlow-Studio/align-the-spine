import { buildRelatedLinks, type BuildRelatedLinksOptions } from "@/content/related-links";

/** ATS-SEO-062: blog articles had no mechanism to link into the site's
 * commercial/condition architecture — content/content-blocks.tsx's
 * `paragraph` block is plain text (no inline-link support), and
 * `relatedContentIds` only points at other CMS content items (other blog
 * posts / service-area pages), never at the static /conditions, /services,
 * or /car-accident-chiropractor routes.
 *
 * Deliberately code-maintained (not an editable CMS field): adding a new
 * editorial field would mean extending editorialUpdateSchema, the Supabase
 * column mapping, and whatever RPC the editor UI writes through — none of
 * which can be verified against the live Supabase schema from here. This
 * mapping is a safe, additive, read-only lookup that needs no database
 * change and degrades to "render nothing" for any category not listed
 * below, so an unmapped category is a missed opportunity, never a bug.
 *
 * Every path here already exists in content/related-links.ts's
 * RELATED_LINK_LABELS and is resolved through buildRelatedLinks(), so a
 * page still `status: "draft"` is silently skipped rather than linked to,
 * same LINK-01 guarantee every other related-links row on the site has. */
const CATEGORY_RELATED_PATHS: Record<string, string[]> = {
  "car-accident-care": [
    "/car-accident-chiropractor",
    "/conditions/whiplash",
    "/conditions/back-pain",
  ],
  "everyday-mobility": ["/services", "/conditions/neck-pain"],
};

export function buildBlogRelatedPageLinks(
  categorySlugs: string[],
  options: Omit<BuildRelatedLinksOptions, "paths">,
) {
  const paths = [...new Set(categorySlugs.flatMap((slug) => CATEGORY_RELATED_PATHS[slug] ?? []))];
  if (paths.length === 0) return [];
  return buildRelatedLinks({ ...options, paths });
}
