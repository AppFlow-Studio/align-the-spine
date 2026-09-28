import { contentBlocksSchema, countWords, slugSchema } from "./schemas";
import type { ContentItem, PublicationGateResult } from "./types";

/** Hosts `next/image` is configured to optimize (next.config.ts's
 * `images.remotePatterns`). A featured image anywhere else doesn't degrade — it
 * throws at render and takes the whole article page down — so a post pointing at
 * one must not be publishable. Body images are unaffected: they're proxied
 * same-origin through /api/content-assets/[id].
 *
 * next.config.test.ts asserts this list and the Next config agree. */
export const RENDERABLE_IMAGE_HOSTS = ["align-the-spine.b-cdn.net"];

export function isRenderableImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && RENDERABLE_IMAGE_HOSTS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

const objectiveClaimPattern =
  /\b(?:statute|percent|percentage|study|research|crash(?:es)?|fatalit(?:y|ies)|days?|coverage|insurance|PIP|diagnos(?:is|e)|treatment|recover(?:y|ies))\b/i;

/** The publication gate. Mirrored in SQL by `public.content_gate_result()`
 * (supabase/migrations/202609270002_blog_gate_autopublish.sql), which is what
 * runs for a post written straight to the table — the two must be changed
 * together or the same post will pass in one path and fail in the other. */
export function evaluatePublicationGates(
  item: ContentItem,
  now = new Date(),
): PublicationGateResult {
  const blockers: string[] = [];
  const recommendations: string[] = [];
  const blockResult = contentBlocksSchema.safeParse(item.blocks);

  if (!slugSchema.safeParse(item.slug).success) blockers.push("Slug is invalid.");
  if (item.title.trim().length < 12) blockers.push("Title is too short to be useful and unique.");
  if (item.seoTitle.trim().length < 12) blockers.push("SEO title is required.");
  if (item.metaDescription.trim().length < 70)
    blockers.push("Meta description must clearly summarize the page.");
  if (!blockResult.success) blockers.push("Content blocks or heading hierarchy are invalid.");
  if (countWords(item.blocks) < 350) blockers.push("Content is too thin for publication review.");
  if (!item.authorId) blockers.push("A valid author is required.");
  if (!item.directAnswer.trim())
    blockers.push("A direct answer or key-takeaway summary is required.");
  if (item.contentType === "blog_post") {
    // Bullets are a recommendation, not a blocker: the article's "Key takeaways"
    // box already renders `directAnswer`, which is required above, so a post
    // without bullets is complete — just less scannable. Downgraded when
    // publication stopped requiring a second person (202609270002), because a
    // blocker no human reviewer is waiting on is just a stalled post.
    if (item.keyTakeaways.filter((line) => line.trim()).length === 0) {
      recommendations.push("Add key-takeaway bullets so the summary box is scannable.");
    }
    // FAQs stay a blocker: they render on the page and emit FAQPage structured
    // data, which is a large share of this site's rich-result and AI-citation
    // surface.
    if (item.faqs.length === 0) {
      blockers.push("At least one FAQ is required for blog posts.");
    }
  }
  if (
    !item.featuredImageDecorative &&
    (!item.featuredImageAssetId || !item.featuredImageAlt?.trim())
  ) {
    blockers.push(
      "A featured image with useful alt text, or a documented decorative choice, is required.",
    );
  }
  // Advisory here, authoritative in SQL: the admin save path can't see the URL
  // of an image it is about to link, so the trigger recomputes this server-side
  // after the asset row exists.
  if (item.featuredImage?.url && !isRenderableImageUrl(item.featuredImage.url)) {
    blockers.push(
      "Featured image must be hosted on align-the-spine.b-cdn.net so the site can render it.",
    );
  }
  if (item.noindex && !item.noindexReason?.trim()) blockers.push("Noindex requires a reason.");

  const combinedText = JSON.stringify(item.blocks);
  if (objectiveClaimPattern.test(combinedText) && item.sources.length === 0) {
    blockers.push("Objective medical, legal, insurance, or statistical claims require sources.");
  }
  if (
    item.emergencyGuidanceRelevant &&
    !item.blocks.some((block) => block.type === "callout" && block.tone === "emergency")
  ) {
    blockers.push("Relevant emergency/red-flag guidance is missing.");
  }
  if (item.status === "scheduled" && (!item.scheduledFor || new Date(item.scheduledFor) <= now)) {
    blockers.push("Scheduled content requires a future schedule time.");
  }

  if (item.relatedContentIds.length === 0)
    recommendations.push("Add genuinely useful related content.");
  if (item.sources.some((source) => source.verificationStatus !== "verified")) {
    blockers.push("Every cited source must be verified before publication.");
  }

  if (item.contentType === "service_area") {
    const evidence = item.serviceArea;
    if (!evidence) blockers.push("Service-area evidence is required.");
    else {
      if (evidence.relationship === "not_approved")
        blockers.push("Area is not operationally approved.");
      if (evidence.operationalEvidence.length === 0)
        blockers.push("Operational evidence is required.");
      if (evidence.uniqueLocalProofPoints.length < 3)
        blockers.push("At least three materially unique local proof points are required.");
      if (evidence.uniquenessScore < 70)
        blockers.push("City-page uniqueness score must be at least 70.");
      if (evidence.similarityScore > 40)
        blockers.push("Page is too similar to another service-area page.");
      if (evidence.relationship !== "office_city" && !evidence.inOfficeServiceVerified) {
        blockers.push("In-office relevance for this community is not verified.");
      }
      if (/home visit/i.test(combinedText) && !evidence.homeVisitEligibilityVerified) {
        blockers.push("Home-visit eligibility is not verified for this area.");
      }
    }
  }

  return { passed: blockers.length === 0, blockers, recommendations, checkedAt: now.toISOString() };
}
