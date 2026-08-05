import { unverified, type VerifiedValue } from "@/content/verified-value";

export type ReviewPublicationStatus = "draft" | "published";

export interface Review {
  /** Where this review was left, e.g. "Google", "Facebook". */
  source: string;
  /** Link to the original review — required so an excerpt is always
   * traceable back to its source. */
  sourceUrl: string;
  /** ISO date (YYYY-MM-DD) the review was left. */
  date: string;
  /** 1–5. */
  rating: number;
  /** Approved excerpt — never the full review verbatim unless the
   * reviewer/platform explicitly allows it. */
  excerpt: string;
  publicationStatus: ReviewPublicationStatus;
}

/** ATS-E3 (3.2): typed review model for /reviews. Empty — no real,
 * client-approved reviews exist yet. Deliberately NOT backfilled with the
 * placeholder "Maria G." testimonials purged in ATS-E4; add real reviews
 * here (each with a real sourceUrl) once available, then flip
 * content/seo.ts's "/reviews" entry to status: "published". */
export const reviews: Review[] = [];

/** Link to a verified, real review profile (e.g. the practice's actual
 * Google Business listing) shown on /reviews while there are no
 * published excerpts yet. Unverified until a real URL is confirmed —
 * the page shows a neutral empty state with no link meanwhile. */
export const externalReviewProfile: VerifiedValue<{ label: string; url: string }> = unverified();
