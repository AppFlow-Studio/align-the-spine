export type ContentType = "blog_post" | "service_area";
export type ContentStatus =
  "draft" | "in_review" | "approved" | "scheduled" | "published" | "archived";

export type EditorialRole = "admin" | "editor" | "clinician_reviewer" | "lead_manager";

export type ContentBlock =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "heading"; level: 2 | 3 | 4; text: string }
  | { id: string; type: "list"; style: "ordered" | "unordered"; items: string[] }
  | { id: string; type: "quote"; text: string; attribution?: string }
  | {
      id: string;
      type: "callout";
      tone: "answer" | "info" | "warning" | "emergency";
      title: string;
      text: string;
    }
  | {
      id: string;
      type: "image";
      assetId: string;
      alt: string;
      caption?: string;
      decorative?: boolean;
    }
  | { id: string; type: "table"; caption: string; headers: string[]; rows: string[][] };

export interface ContentSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  sourceType: "statute" | "government" | "clinical" | "practice" | "other";
  publicationDate?: string;
  updatedDate?: string;
  accessedDate: string;
  geography?: string;
  statisticPeriod?: string;
  claimSupported: string;
  classification: "primary" | "secondary";
  verificationStatus: "pending" | "verified" | "expired";
  recheckDate?: string;
  blockId?: string;
}

export interface ContentAuthor {
  id: string;
  slug: string;
  name: string;
  credentials?: string;
  shortBio: string;
  portraitUrl?: string;
  profileUrl: string;
  active: boolean;
}

export interface ContentAsset {
  id: string;
  url: string;
  provider: "local" | "bunny_cdn" | "approved_external";
  mimeType: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  attribution?: string;
  approvalState: "pending" | "approved" | "rejected";
  focalX?: number;
  focalY?: number;
}

export interface ServiceAreaEvidence {
  communityName: string;
  county: string;
  state: "FL";
  postalCodes: string[];
  relationship:
    "office_city" | "adjacent_in_office_catchment" | "extended_accident_catchment" | "not_approved";
  inOfficeServiceVerified: boolean;
  homeVisitEligibilityVerified: boolean;
  homeVisitEligibilityNote?: string;
  homeVisitReviewedAt?: string;
  operationalEvidence: string[];
  uniqueLocalProofPoints: string[];
  localSourceIds: string[];
  uniquenessScore: number;
  similarityScore: number;
}

export interface PublicationGateResult {
  passed: boolean;
  blockers: string[];
  recommendations: string[];
  checkedAt: string;
}

/** One row of the article's Q&A accordion. Structurally a superset of
 * content/faqs.ts's `FAQ` ({question, answer}) so it can be passed directly
 * to the existing FaqAccordion/FaqJsonLd without an adapter — `id` is just
 * along for the ride as a stable React key / admin-editor row key. */
export interface ContentFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ContentItem {
  id: string;
  contentType: ContentType;
  slug: string;
  title: string;
  excerpt: string;
  blocks: ContentBlock[];
  status: ContentStatus;
  featured: boolean;
  primaryKeyword?: string;
  searchIntent: string;
  audience: string;
  seoTitle: string;
  metaDescription: string;
  canonicalOverride?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageAssetId?: string;
  featuredImageAssetId?: string;
  featuredImageAlt?: string;
  featuredImageDecorative?: boolean;
  authorId: string;
  clinicianReviewerId?: string;
  clinicianReviewerName?: string;
  clinicianReviewedAt?: string;
  medicalReviewRequired: boolean;
  publishedAt?: string;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
  lastSubstantiveReviewAt?: string;
  noindex: boolean;
  noindexReason?: string;
  version: number;
  directAnswer: string;
  /** Scannable bullet summary shown alongside directAnswer — directAnswer
   * stays the single snippet-style sentence/paragraph search engines quote,
   * these are the "read in 10 seconds" bullets under it. */
  keyTakeaways: string[];
  faqs: ContentFaqItem[];
  emergencyGuidanceRelevant: boolean;
  categorySlugs: string[];
  tagSlugs: string[];
  relatedContentIds: string[];
  sources: ContentSource[];
  gateResult: PublicationGateResult;
  serviceArea?: ServiceAreaEvidence;
  author?: ContentAuthor;
  featuredImage?: ContentAsset;
}

export interface PublicContentItem extends Omit<
  ContentItem,
  | "primaryKeyword"
  | "searchIntent"
  | "audience"
  | "canonicalOverride"
  | "version"
  | "author"
  | "featuredImage"
> {
  author: ContentAuthor;
  featuredImage?: ContentAsset;
  estimatedReadingMinutes: number;
}

export interface ContentListResult {
  items: PublicContentItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
