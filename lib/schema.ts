import { doctorCredentials, doctorProfileContent } from "@/content/doctor-profile";
import { siteConfig } from "@/content/site";

/** Stable @id anchors reused across every builder in this file and every
 * page that references another entity (e.g. Person.worksFor, WebSite.
 * publisher) — per ATS schema ticket §2.8, these must never be re-derived
 * ad hoc at a call site. */
export const ORGANIZATION_ID = `${siteConfig.siteUrl}/#organization`;
export const MEDICAL_BUSINESS_ID = `${siteConfig.siteUrl}/#business`;
export const WEBSITE_ID = `${siteConfig.siteUrl}/#website`;
export const DR_ABE_PERSON_ID = `${siteConfig.siteUrl}/about#dr-abe`;

export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  "@id": string;
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
}

/** Organization entity (ATS schema ticket §2.2/§2.3) — the brand-level
 * presence, distinct from the MedicalBusiness clinic entity below. `sameAs`
 * only includes social links marketing has confirmed (SocialLink.verified,
 * content/site.ts) — every current entry is an unconfirmed "#" placeholder,
 * so it's omitted entirely today rather than publish a guess. */
export function buildOrganization(): OrganizationSchema {
  const sameAs = siteConfig.social.filter((social) => social.verified).map((social) => social.url);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.business.name,
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/figma-exports/logo_blue.png`,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  "@id": string;
  name: string;
  url: string;
  publisher: { "@id": string };
}

/** WebSite entity (ATS schema ticket §2.2/§2.3). No `potentialAction`
 * SearchAction — the site has no on-site search feature, and this ticket's
 * rule is to only render verified, real functionality. */
export function buildWebSite(): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.business.name,
    url: siteConfig.siteUrl,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** "9:00 AM" / "7:00 PM" -> "09:00" / "19:00", per schema.org's
 * openingHoursSpecification time format. Lifted from the retired
 * lib/seo/local-business.ts. */
function to24Hour(time: string): string {
  const [, hourStr, minute, meridiem] = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i) ?? [];
  let hour = Number(hourStr) % 12;
  if (meridiem?.toUpperCase() === "PM") hour += 12;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

export interface OpeningHoursSpec {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string;
  opens: string;
  closes: string;
}

export interface MedicalBusinessSchema {
  "@context": "https://schema.org";
  "@type": "MedicalBusiness";
  "@id": string;
  name: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: { "@type": "GeoCoordinates"; latitude: number; longitude: number };
  areaServed: { "@type": "City"; name: string }[];
  openingHoursSpecification?: OpeningHoursSpec[];
}

/** MedicalBusiness entity for the practice (ATS schema ticket §2.2/§2.3) —
 * "MedicalBusiness" is the required @type per the ticket's vocabulary rule
 * (never "Chiropractic", which is a medicine-system enum, not a business
 * type). Replaces the old lib/seo/local-business.ts's
 * `["MedicalClinic", "LocalBusiness"]` type array. `openingHoursSpecification`
 * only renders once siteConfig.hoursVerified is true (§2.9) — every day is
 * currently the same untouched 9-7 placeholder, unconfirmed by the client. */
export function buildMedicalBusiness(): MedicalBusinessSchema {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": MEDICAL_BUSINESS_ID,
    name: siteConfig.business.name,
    url: siteConfig.siteUrl,
    telephone: siteConfig.business.phone,
    email: siteConfig.business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.business.address.line1}, ${siteConfig.business.address.suite}`,
      addressLocality: siteConfig.business.address.city,
      addressRegion: siteConfig.business.address.state,
      postalCode: siteConfig.business.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.business.geo.latitude,
      longitude: siteConfig.business.geo.longitude,
    },
    areaServed: siteConfig.serviceAreas.map((city) => ({ "@type": "City", name: city })),
    ...(siteConfig.hoursVerified
      ? {
          openingHoursSpecification: siteConfig.hours.map((hours) => ({
            "@type": "OpeningHoursSpecification" as const,
            dayOfWeek: hours.day,
            opens: to24Hour(hours.open),
            closes: to24Hour(hours.close),
          })),
        }
      : {}),
  };
}

export interface PersonSchema {
  "@context": "https://schema.org";
  "@type": "Person";
  "@id": string;
  name: string;
  url: string;
  image: string;
  jobTitle: string;
  worksFor: { "@id": string };
  alumniOf?: string[];
  hasCredential?: string[];
}

/** Person entity for Dr. Abe (ATS schema ticket §2.2/§2.4) — "Person", never
 * "Physician" (that requires explicit owner confirmation this codebase
 * doesn't have; "jobTitle: Chiropractor" is plain-text copy the site already
 * publishes everywhere, not a licensure @type claim). alumniOf/hasCredential
 * only render once doctorCredentials.verified is true — Dr. Abe hasn't
 * confirmed his degree/school/license yet, so today's output omits both
 * fields rather than publish an unverified claim. */
export function buildPerson(): PersonSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": DR_ABE_PERSON_ID,
    name: doctorProfileContent.name,
    url: `${siteConfig.siteUrl}/about`,
    image: `${siteConfig.siteUrl}${doctorProfileContent.portrait.src}`,
    jobTitle: "Chiropractor",
    worksFor: { "@id": MEDICAL_BUSINESS_ID },
    ...(doctorCredentials.verified
      ? {
          ...(doctorCredentials.alumniOf ? { alumniOf: doctorCredentials.alumniOf } : {}),
          ...(doctorCredentials.hasCredential
            ? { hasCredential: doctorCredentials.hasCredential }
            : {}),
        }
      : {}),
  };
}

export interface BreadcrumbItemInput {
  /** Visible crumb label, e.g. "Services". */
  name: string;
  /** Route path from the site root, e.g. "/services". Use "" for Home. */
  path: string;
}

export interface BreadcrumbListSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: { "@type": "ListItem"; position: number; name: string; item: string }[];
}

/** BreadcrumbList entity (ATS schema ticket §2.2/§2.6). `items` must mirror
 * the page's actual navigable path — e.g. a condition page passes
 * `[{ name: "Home", path: "" }, { name: condition.name, path: "/conditions/x" }]`,
 * not a fabricated intermediate "Conditions" hub (no such page exists in
 * this site). */
export function buildBreadcrumbList(items: BreadcrumbItemInput[]): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      item: `${siteConfig.siteUrl}${item.path}`,
    })),
  };
}
