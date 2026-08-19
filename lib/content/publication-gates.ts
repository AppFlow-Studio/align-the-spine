import { contentBlocksSchema, countWords, slugSchema } from "./schemas";
import type { ContentItem, PublicationGateResult } from "./types";

const objectiveClaimPattern =
  /\b(?:statute|percent|percentage|study|research|crash(?:es)?|fatalit(?:y|ies)|days?|coverage|insurance|PIP|diagnos(?:is|e)|treatment|recover(?:y|ies))\b/i;

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
    if (item.keyTakeaways.filter((line) => line.trim()).length === 0) {
      blockers.push("At least one key takeaway bullet is required for blog posts.");
    }
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
