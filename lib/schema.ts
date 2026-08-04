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
