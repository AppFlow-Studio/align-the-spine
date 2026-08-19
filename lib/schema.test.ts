import { describe, expect, it } from "vitest";

import { servicesGrid } from "@/content/services-grid";
import { siteConfig } from "@/content/site";
import { isVerified } from "@/content/verified-value";

import {
  buildBreadcrumbList,
  buildFAQPage,
  buildMedicalBusiness,
  buildMedicalWebPage,
  buildOrganization,
  buildPerson,
  buildService,
  buildWebSite,
  DR_ABE_PERSON_ID,
  MEDICAL_BUSINESS_ID,
  ORGANIZATION_ID,
  to24Hour,
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
      streetAddress: "811 SE 8th Ave, Ste 101",
      addressLocality: "Deerfield Beach",
      addressRegion: "FL",
      postalCode: "33441",
      addressCountry: "US",
    });
    expect(business.geo).toEqual({
      "@type": "GeoCoordinates",
      latitude: 26.3067873,
      longitude: -80.0944778,
    });
  });

  it("omits openingHoursSpecification while public sources conflict", () => {
    expect(siteConfig.hoursVerified).toBe(false);
    expect(buildMedicalBusiness().openingHoursSpecification).toBeUndefined();
  });

  it("includes service areas once client-confirmed, omits them otherwise", () => {
    expect(siteConfig.serviceAreasVerified).toBe(true);
    expect(buildMedicalBusiness().areaServed).toEqual(
      siteConfig.serviceAreas.map((city) => ({ "@type": "City", name: city })),
    );
  });

  it("links back to the Organization entity via parentOrganization", () => {
    expect(buildMedicalBusiness().parentOrganization).toEqual({ "@id": ORGANIZATION_ID });
  });

  it("includes aggregateRating once the client-confirmed rating is verified", () => {
    expect(isVerified(siteConfig.reviewsRating)).toBe(true);
    if (!isVerified(siteConfig.reviewsRating)) throw new Error("unreachable");
    expect(buildMedicalBusiness().aggregateRating).toEqual({
      "@type": "AggregateRating",
      ratingValue: siteConfig.reviewsRating.value.rating,
      reviewCount: siteConfig.reviewsRating.value.count,
    });
  });
});

describe("to24Hour", () => {
  it("converts a morning AM time to 24-hour format", () => {
    expect(to24Hour("9:00 AM")).toBe("09:00");
  });

  it("converts an evening PM time to 24-hour format", () => {
    expect(to24Hour("7:00 PM")).toBe("19:00");
  });

  it("keeps 12:00 PM (noon) as 12:00, the classic 12-hour boundary case", () => {
    expect(to24Hour("12:00 PM")).toBe("12:00");
  });

  it("converts 12:00 AM (midnight) to 00:00", () => {
    expect(to24Hour("12:00 AM")).toBe("00:00");
  });

  it("throws on an unparseable time string instead of returning NaN:undefined", () => {
    expect(() => to24Hour("not a time")).toThrow(/unparseable time string/);
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

describe("buildMedicalWebPage", () => {
  it("links to the shared author/publisher entities and the page's own url", () => {
    const page = buildMedicalWebPage({
      path: "/service-areas/example",
      name: "Example page",
      description: "Example description.",
      dateModified: "2026-08-18T00:00:00.000Z",
      aboutTopic: "Chiropractic care after a motor vehicle accident",
    });
    expect(page["@type"]).toBe("MedicalWebPage");
    expect(page.url).toBe(`${siteConfig.siteUrl}/service-areas/example`);
    expect(page.mainEntityOfPage).toBe(page.url);
    expect(page.author).toEqual({ "@id": DR_ABE_PERSON_ID });
    expect(page.publisher).toEqual({ "@id": ORGANIZATION_ID });
  });

  it("never asserts a clinical review — the site discloses one hasn't happened", () => {
    // reviewedBy/lastReviewed would contradict GATE_RESULT's disclosed
    // recommendation in static-service-area-repository.ts that medical
    // review has NOT been performed for this content.
    const page = buildMedicalWebPage({
      path: "/blog/example",
      name: "Example post",
      description: "Example description.",
      dateModified: "2026-08-18T00:00:00.000Z",
      aboutTopic: "Example topic",
    });
    expect(page).not.toHaveProperty("reviewedBy");
    expect(page).not.toHaveProperty("lastReviewed");
  });

  it("omits datePublished when not given rather than fabricating one", () => {
    const page = buildMedicalWebPage({
      path: "/blog/example",
      name: "Example post",
      description: "Example description.",
      dateModified: "2026-08-18T00:00:00.000Z",
      aboutTopic: "Example topic",
    });
    expect(page).not.toHaveProperty("datePublished");
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
