import { siteConfig } from "@/content/site";

export interface DoctorProfileContent {
  eyebrow: string;
  name: string;
  bio: string;
  cta: { label: string; href: string };
  rating: { value: number; count: number; location: string };
  portrait: { src: string; alt: string };
}

/** DoctorProfile copy per condition-page-spec §B6. Short and long variants
 * share this same content today — the profile block is pixel-identical
 * between the Home and About-page Figma instances; only the History +
 * HOW HE PRACTICES cards that follow it on the About page differ, and
 * those are tracked separately under ATS-091. */
export const doctorProfileContent: DoctorProfileContent = {
  eyebrow: "THE DOCTOR BEHIND YOUR CARE",
  name: "Dr. Abe Nasser",
  bio: "Dr. Abe is pleased to serve the Deerfield and surrounding areas. Dr. Abe began his chiropractic career serving the Broward county and Palm Beach County area working with many different patients from pre and post pregnancy, post-surgical, geriatric, and athletes.",
  cta: { label: "Book with Dr. Abe", href: siteConfig.bookingCta.href },
  rating: { value: 5, count: 152, location: "Deerfield Beach, Florida" },
  portrait: { src: "/figma-exports/portrait.png", alt: "Dr. Abe Nasser" },
};
