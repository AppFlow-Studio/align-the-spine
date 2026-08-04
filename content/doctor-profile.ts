import { siteConfig } from "@/content/site";
import { unverified, type VerifiedValue } from "@/content/verified-value";

export interface DoctorRating {
  value: number;
  count: number;
  location: string;
}

export interface DoctorProfileContent {
  eyebrow: string;
  name: string;
  bio: string;
  cta: { label: string; href: string };
  /** ATS-E4 (4.3): star rating + review count — unverified, DoctorProfile
   * omits the rating badge entirely until this is approved. */
  rating: VerifiedValue<DoctorRating>;
  portrait: { src: string; alt: string };
}

export interface DoctorHistoryContent {
  eyebrow: string;
  heading: string;
  body: string;
}

/** "HISTORY" long-form bio per the about-drabe artboard (node 96:2575–96:2586,
 * ATS-090) — lifted verbatim per the ticket. Rendered into DoctorProfile's
 * `extended` slot (variant="long") on /about only. */
export const doctorHistoryContent: DoctorHistoryContent = {
  eyebrow: "HISTORY",
  heading: "Built on being the doctor who's actually there",
  body: "Dr. Abe began his chiropractic career serving the Broward County and Palm Beach County area, treating patients across every stage of recovery — pre- and post-pregnancy, post-surgical, geriatric, and athletes. Somewhere along the way, he noticed the same pattern everywhere: patients bounced between whichever provider was available that day, never quite building the continuity that actually speeds up recovery. Align the Spine was built around the opposite idea. One doctor, every visit. Transparent pricing instead of a maze of codes, explained clearly before any treatment begins.",
};

/** DoctorProfile copy per condition-page-spec §B6. Short and long variants
 * share this same content today — the profile block is pixel-identical
 * between the Home and About-page Figma instances; only the History +
 * HOW HE PRACTICES cards that follow it on the About page differ — see
 * doctorHistoryContent above and content/how-he-practices.ts (ATS-090/091,
 * built together since /about's acceptance criteria required both). */
export const doctorProfileContent: DoctorProfileContent = {
  eyebrow: "THE DOCTOR BEHIND YOUR CARE",
  name: "Dr. Abe Nasser",
  bio: "Dr. Abe is pleased to serve the Deerfield and surrounding areas. Dr. Abe began his chiropractic career serving the Broward county and Palm Beach County area working with many different patients from pre and post pregnancy, post-surgical, geriatric, and athletes.",
  cta: { label: "Book with Dr. Abe", href: siteConfig.bookingCta.href },
  rating: unverified<DoctorRating>(),
  portrait: { src: "/figma-exports/portrait.png", alt: "Dr. Abe Nasser" },
};
