import { siteConfig } from "@/content/site";

export interface DoctorProfileContent {
  eyebrow: string;
  name: string;
  bio: string;
  cta: { label: string; href: string };
  rating: { value: number; count: number; location: string };
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
  body: "Dr. Abe began his chiropractic career serving the Broward County and Palm Beach County area, treating patients across every stage of recovery — pre- and post-pregnancy, post-surgical, geriatric, and athletes. Somewhere along the way, he noticed the same pattern everywhere: patients bounced between whichever provider was available that day, never quite building the continuity that actually speeds up recovery. Align the Spine was built around the opposite idea. One doctor, every visit. Transparent pricing instead of a maze of codes. A $50 new-patient exam because the first visit shouldn't be the expensive gamble that keeps people from getting checked out in the first place. He's bilingual — English and Spanish — and sees that as part of the job, not an add-on. If a patient is more comfortable explaining what hurts in Spanish, that's the conversation they should get to have.",
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
  rating: { value: 5, count: 152, location: "Deerfield Beach, Florida" },
  portrait: { src: "/figma-exports/portrait.png", alt: "Dr. Abe Nasser" },
};

export interface DoctorCredentials {
  /** True only once Dr. Abe has confirmed these fields himself. Until then
   * lib/schema.ts's buildPerson() omits alumniOf/hasCredential entirely
   * rather than publish an unverified degree/license claim (ATS schema
   * ticket §2.4). */
  verified: boolean;
  alumniOf?: string[];
  hasCredential?: string[];
}

export const doctorCredentials: DoctorCredentials = {
  verified: false,
};
