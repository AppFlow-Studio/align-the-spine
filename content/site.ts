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

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
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
  hoursNote: string;
  nav: NavLink[];
  bookingCta: NavLink;
  footer: {
    tagline: string;
    links: NavLink[];
    copyrightName: string;
  };
  serviceAreas: string[];
  social: SocialLink[];
  stats: Stat[];
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
  hoursNote: "Priority for emergency cases",
  nav: [
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Reviews", href: "/reviews" },
    { label: "Auto Accidents", href: "/auto-accidents" },
  ],
  bookingCta: { label: "Book Appointment", href: "/book" },
  footer: {
    tagline:
      "Premium chiropractic care delivered with medical excellence and patient-first convenience across South Florida.",
    links: [
      { label: "Accident Care", href: "/auto-accidents" },
      { label: "About Dr. Abe", href: "/about" },
      { label: "Reviews", href: "/reviews" },
      { label: "Contact Us", href: "/contact-us" },
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
  social: [
    { platform: "Facebook", url: "#" },
    { platform: "Instagram", url: "#" },
  ],
  stats: [
    { label: "Reviews", value: "152" },
    { label: "Visits", value: "Same-day" },
    { label: "When it applies", value: "Home visits" },
    { label: "Bilingual care", value: "EN/ES" },
    { label: "Insurance", value: "$0 with PIP" },
  ],
};
