import { describe, expect, it } from "vitest";

import { siteConfig } from "@/content/site";

import {
  buildBreadcrumbList,
  buildFAQPage,
  buildMedicalBusiness,
  buildOrganization,
  buildPerson,
  buildService,
  buildWebSite,
  DR_ABE_PERSON_ID,
  MEDICAL_BUSINESS_ID,
  ORGANIZATION_ID,
  WEBSITE_ID,
} from "./schema";

describe("buildOrganization", () => {
  it("uses the stable #organization @id", () => {
    expect(buildOrganization()["@id"]).toBe(`${siteConfig.siteUrl}/#organization`);
    expect(ORGANIZATION_ID).toBe(`${siteConfig.siteUrl}/#organization`);
  });

  it("has no sameAs when no social link is verified", () => {
    expect(buildOrganization().sameAs).toBeUndefined();
  });

  it("references the real, already-shipping logo asset", () => {
    expect(buildOrganization().logo).toBe(`${siteConfig.siteUrl}/figma-exports/logo_blue.png`);
  });
});

describe("buildWebSite", () => {
  it("uses the stable #website @id and publishes to the Organization @id", () => {
    const site = buildWebSite();
    expect(site["@id"]).toBe(WEBSITE_ID);
    expect(site.publisher).toEqual({ "@id": ORGANIZATION_ID });
  });
});

describe("buildMedicalBusiness", () => {
  it("uses MedicalBusiness as the sole @type — never Chiropractic or LocalBusiness", () => {
    expect(buildMedicalBusiness()["@type"]).toBe("MedicalBusiness");
  });

  it("uses the stable #business @id", () => {
    expect(buildMedicalBusiness()["@id"]).toBe(MEDICAL_BUSINESS_ID);
  });

  it("includes verified NAP and geo", () => {
    const business = buildMedicalBusiness();
    expect(business.telephone).toBe(siteConfig.business.phone);
    expect(business.address).toEqual({
      "@type": "PostalAddress",
      streetAddress: "811 Southeast 8th Avenue, Suite #101",
      addressLocality: "Deerfield Beach",
      addressRegion: "FL",
      postalCode: "33441",
      addressCountry: "US",
    });
    expect(business.geo).toEqual({
      "@type": "GeoCoordinates",
      latitude: 26.3061477,
      longitude: -80.0940209,
    });
  });

  it("omits openingHoursSpecification while hours are unverified", () => {
    expect(siteConfig.hoursVerified).toBe(false);
    expect(buildMedicalBusiness().openingHoursSpecification).toBeUndefined();
  });
});

describe("buildPerson", () => {
  it("uses Person, never Physician, per the vocabulary rule", () => {
    expect(buildPerson()["@type"]).toBe("Person");
  });

  it("uses the stable /about#dr-abe @id", () => {
    expect(buildPerson()["@id"]).toBe(DR_ABE_PERSON_ID);
  });

  it("links to the practice via worksFor", () => {
    expect(buildPerson().worksFor).toEqual({ "@id": MEDICAL_BUSINESS_ID });
  });

  it("omits alumniOf/hasCredential while doctorCredentials is unverified", () => {
    const person = buildPerson();
    expect(person.alumniOf).toBeUndefined();
    expect(person.hasCredential).toBeUndefined();
  });
});

describe("buildBreadcrumbList", () => {
  it("builds a 1-indexed ListItem per entry with absolute item URLs", () => {
    const breadcrumb = buildBreadcrumbList([
      { name: "Home", path: "" },
      { name: "Services", path: "/services" },
    ]);
    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(breadcrumb.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${siteConfig.siteUrl}/services`,
      },
    ]);
  });
});

describe("buildService", () => {
  it("builds a Service entity keyed by #{slug}, provided by the practice", () => {
    const service = buildService({
      slug: "adjustment",
      name: "Adjustment",
      duration: "1 hr",
      summary: "Test summary.",
      image: { src: "/x.png", alt: "x" },
    });
    expect(service["@type"]).toBe("Service");
    expect(service["@id"]).toBe(`${siteConfig.siteUrl}/services#adjustment`);
    expect(service.provider).toEqual({ "@id": MEDICAL_BUSINESS_ID });
    expect(service.name).toBe("Adjustment");
    expect(service.description).toBe("Test summary.");
  });
});

describe("buildFAQPage", () => {
  it("builds one Question/Answer pair per FAQ item", () => {
    const faqPage = buildFAQPage([{ question: "Q1?", answer: "A1." }]);
    expect(faqPage["@type"]).toBe("FAQPage");
    expect(faqPage.mainEntity).toEqual([
      {
        "@type": "Question",
        name: "Q1?",
        acceptedAnswer: { "@type": "Answer", text: "A1." },
      },
    ]);
  });
});
