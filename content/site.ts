import type { ComponentType, SVGProps } from "react";

import { ActivityIcon } from "@/components/ui/icons/activity";
import { ExpandVerticalIcon } from "@/components/ui/icons/expand-vertical";
import { HandIcon } from "@/components/ui/icons/hand";
import { RingsIcon } from "@/components/ui/icons/rings";
import { WavesIcon } from "@/components/ui/icons/waves";
import { ZapIcon } from "@/components/ui/icons/zap";

export interface Address {
  line1: string;
  suite: string;
  city: string;
  state: string;
  zip: string;
}

export interface DayHours {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  open: string;
  close: string;
}

export interface NavMenuItem {
  label: string;
  href: string;
  description: string;
  /** Preview photo shown in the dropdown's image panel while this item is
   * hovered/focused — reuses each page's own existing hero photo rather
   * than a new asset. */
  image: { src: string; alt: string };
  /** Icon shown in the mega-menu row next to the label. */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface NavLink {
  label: string;
  href: string;
  /** Optional mega-menu items — when present, Navbar renders this link as
   * a hover-triggered dropdown (desktop) or expandable accordion (mobile)
   * instead of a plain link. `href` itself still navigates on click (it's
   * the group's closest "view all" destination), the dropdown/accordion
   * is purely an additional way in. */
  menu?: NavMenuItem[];
}

export interface SocialLink {
  platform: string;
  url: string;
  /** True only once marketing has confirmed this is the correct, live GBP/
   * social URL for the practice. lib/schema.ts's buildOrganization() omits
   * unverified entries from `sameAs` entirely rather than publish a guess. */
  verified: boolean;
}

export interface Stat {
  label: string;
  value: string;
}

export interface Geo {
  latitude: number;
  longitude: number;
}

export interface SiteConfig {
  /** Canonical production origin (no trailing slash) — used for the
   * sitemap, robots.txt, metadataBase, and JSON-LD `url` fields. */
  siteUrl: string;
  business: {
    name: string;
    phone: string;
    phoneHref: string;
    email: string;
    address: Address;
    /** Rooftop geocode for 811 SE 8th Ave Suite #101, Deerfield Beach, FL
     * 33441, via OpenStreetMap Nominatim. Re-verify against the Google
     * Business Profile listing if precision ever matters (e.g. a map embed). */
    geo: Geo;
  };
  hours: DayHours[];
  /** True only once the client has confirmed these are the practice's
   * actual, current hours. lib/schema.ts's buildMedicalBusiness() omits
   * openingHoursSpecification entirely while this is false. */
  hoursVerified: boolean;
  nav: NavLink[];
  bookingCta: NavLink;
  footer: {
    tagline: string;
    links: NavLink[];
    copyrightName: string;
  };
  /** ATS-E4 (4.6): home-visit coverage area — was asserted as fixed fact
   * (6 named cities) with no confirmation it's actually accurate/current.
   * Gated until approved; ServiceAreas renders nothing meanwhile. */
  serviceAreas: string[];
  /** True only once the client has confirmed the service-areas list is
   * accurate/current. ServiceAreas and lib/seo/local-business.ts's
   * areaServed both omit this data entirely while this is false. */
  serviceAreasVerified: boolean;
  /** ATS-E4 (4.8): no real social URLs exist yet (both were "#"
   * placeholders). Nothing currently renders this field, but it's typed
   * as gated so a future renderer can't accidentally ship placeholder
   * links. */
  social: SocialLink[];
  /** ATS-E4 (4.3/4.4/4.5/4.7): the "Reviews 152 / Visits Same-day / When it
   * applies Home visits / Bilingual care EN/ES / Insurance $0 with PIP"
   * stat row was five unverified claims in one array — review count,
   * same-day availability, and $0/PIP insurance billing all need client
   * approval; TopStatsBar/StatChipRow render nothing until this is set. */
  stats: Stat[];
  /** True only once the client has confirmed every value in `stats` above.
   * TopStatsBar and StatChipRow both render nothing while this is false. */
  statsVerified: boolean;
}

const businessHours: DayHours[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
].map((day) => ({ day: day as DayHours["day"], open: "9:00 AM", close: "7:00 PM" }));

/** True only for actual Vercel production deploys. Local dev, CI, and
 * Vercel preview builds are all treated as non-production so metadata/
 * robots default to noindex — fail closed rather than risk a preview
 * leaking into search. */
export function isProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}

export const siteConfig: SiteConfig = {
  siteUrl: process.env.SITE_URL ?? "https://alignthespinechiropractic.com",
  business: {
    name: "Align the Spine Chiropractic",
    phone: "(954) 573-7192",
    phoneHref: "tel:+19545737192",
    email: "abenasser@alignthespinechiropractic.com",
    address: {
      line1: "811 Southeast 8th Avenue",
      suite: "Suite #101",
      city: "Deerfield Beach",
      state: "FL",
      zip: "33441",
    },
    geo: { latitude: 26.3061477, longitude: -80.0940209 },
  },
  hours: businessHours,
  hoursVerified: false,
  nav: [
    {
      label: "Services",
      href: "/services",
      menu: [
        {
          label: "Chiropractic Adjustments",
          href: "/services/chiropractic-adjustments",
          description: "Restoring the motion a collision took away.",
          icon: ActivityIcon,
          image: {
            src: "/figma-exports/adjustments-hero.png",
            alt: "Dr. Abe performing a chiropractic adjustment",
          },
        },
        {
          label: "Spinal Decompression",
          href: "/services/spinal-decompression",
          description: "Gentle traction to relieve pressure on discs and nerves.",
          icon: ExpandVerticalIcon,
          image: {
            src: "/figma-exports/spinal-decompression-hero.png",
            alt: "Spinal decompression treatment",
          },
        },
        {
          label: "Massage / Soft-Tissue",
          href: "/services/massage-soft-tissue",
          description: "Targeted therapy for muscle tension and scar tissue.",
          icon: HandIcon,
          image: {
            src: "/figma-exports/massage-soft-tissue-hero.png",
            alt: "Massage and soft-tissue therapy session",
          },
        },
      ],
    },
    {
      label: "Conditions",
      href: "/auto-accidents",
      menu: [
        {
          label: "Lower Back Pain",
          href: "/conditions/back-pain",
          description: "Disc, muscle, and nerve pain after an accident.",
          icon: ActivityIcon,
          image: {
            src: "/figma-exports/drabe-backpain-front.png",
            alt: "Dr. Abe examining a patient's lower back",
          },
        },
        {
          label: "Neck Pain",
          href: "/conditions/neck-pain",
          description: "Stiffness and tension radiating into the shoulders.",
          icon: WavesIcon,
          image: {
            src: "/figma-exports/dr-abe-neck.png",
            alt: "Dr. Abe examining a patient's neck",
          },
        },
        {
          label: "Whiplash",
          href: "/conditions/whiplash",
          description: "The sudden-impact neck injury most accidents cause.",
          icon: ZapIcon,
          image: {
            src: "/figma-exports/drabe-whiplash-man.png",
            alt: "Dr. Abe treating a patient for whiplash",
          },
        },
        {
          label: "Sciatica",
          href: "/conditions/sciatica",
          description: "Radiating nerve pain down the leg.",
          icon: ZapIcon,
          image: {
            src: "/figma-exports/drabe-backpain-front.png",
            alt: "Dr. Abe examining a patient for sciatica",
          },
        },
        {
          label: "Concussion",
          href: "/conditions/concussion",
          description: "Brain injury that can happen without hitting your head.",
          icon: RingsIcon,
          image: {
            src: "/figma-exports/drabe-headache.png",
            alt: "Dr. Abe examining a patient after a car accident",
          },
        },
        {
          label: "Cervicogenic Headache",
          href: "/conditions/cervicogenic-headache",
          description: "Headaches that actually start in the neck.",
          icon: WavesIcon,
          image: {
            src: "/figma-exports/drabe-headache.png",
            alt: "Dr. Abe examining a patient for headache-related neck tension",
          },
        },
        {
          label: "TMJ / Jaw Pain",
          href: "/conditions/tmj-jaw-pain",
          description: "Jaw trauma the same impact that causes whiplash.",
          icon: RingsIcon,
          image: {
            src: "/figma-exports/drabe-headache.png",
            alt: "Dr. Abe examining a patient's jaw",
          },
        },
      ],
    },
    { label: "About", href: "/about" },
    { label: "Reviews", href: "/reviews" },
    { label: "Auto Accidents", href: "/auto-accidents" },
  ],
  // ATS-E3 (3.4): "Request" not "Book" — nothing auto-confirms a slot.
  bookingCta: { label: "Book Appointment", href: "/book" },
  footer: {
    tagline:
      "Premium chiropractic care delivered with medical excellence and patient-first convenience across South Florida.",
    links: [
      { label: "Accident Care", href: "/auto-accidents" },
      { label: "About Dr. Abe", href: "/about" },
      { label: "Reviews", href: "/reviews" },
      // { label: "Contact Us", href: "/contact-us" },
    ],
    copyrightName: "Align the Spine Chiropractic",
  },
  serviceAreas: [
    "Deerfield Beach",
    "Boca Raton",
    "Boynton Beach",
    "Fort Lauderdale",
    "Aventura",
    "North Miami",
  ],
  serviceAreasVerified: false,
  social: [
    { platform: "Facebook", url: "#", verified: false },
    { platform: "Instagram", url: "#", verified: false },
  ],
  /** PLACEHOLDER — not verified. Swap for real, client-confirmed numbers
   * before launch. */
  stats: [
    { label: "Reviews", value: "152" },
    { label: "Visits", value: "Same-day" },
    { label: "When it applies", value: "Home visits" },
    { label: "Bilingual care", value: "EN/ES" },
    { label: "Insurance", value: "$0 with PIP" },
  ],
  statsVerified: true,
};
