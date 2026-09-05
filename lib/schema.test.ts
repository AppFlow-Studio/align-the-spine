import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

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
  buildWebPage,
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

  it("includes openingHoursSpecification once client-confirmed hours are verified", () => {
    expect(siteConfig.hoursVerified).toBe(true);
    expect(buildMedicalBusiness().openingHoursSpecification).toEqual(
      siteConfig.hours.map((hours) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: hours.day,
        opens: to24Hour(hours.open),
        closes: to24Hour(hours.close),
      })),
    );
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

describe("buildWebPage", () => {
  it("builds a WebPage keyed by #webpage under the page's own URL", () => {
    const page = buildWebPage({
      path: "/es/servicios",
      name: "Servicios",
      description: "Descripción.",
      inLanguage: "es-US",
    });
    expect(page["@type"]).toBe("WebPage");
    expect(page.url).toBe(`${siteConfig.siteUrl}/es/servicios`);
    expect(page["@id"]).toBe(`${page.url}#webpage`);
  });

  it("links to the shared WebSite and MedicalBusiness entities, not a new per-locale one", () => {
    const page = buildWebPage({
      path: "/pt/servicos",
      name: "Serviços",
      description: "Descrição.",
      inLanguage: "pt-BR",
    });
    expect(page.isPartOf).toEqual({ "@id": WEBSITE_ID });
    expect(page.about).toEqual({ "@id": MEDICAL_BUSINESS_ID });
  });

  it("passes through the caller's own inLanguage rather than assuming en-US", () => {
    expect(
      buildWebPage({ path: "/ht/sevis", name: "N", description: "D", inLanguage: "ht" }).inLanguage,
    ).toBe("ht");
  });
});

/** ATS-SEO-141: "preserve one stable underlying ATS practice entity/@id
 * where the current graph supports it; locale pages should not imply four
 * separate practices" — and the negative constraints ("do not blindly
 * attach availableLanguage", "no fabricated review/credential/service
 * data") stated as regression tests, not just prose. */
describe("ATS-SEO-141: one coherent entity graph across locales", () => {
  it("buildOrganization/buildWebSite/buildMedicalBusiness/buildPerson take no locale argument — there is structurally only one of each", () => {
    // Verified by construction (arity), not by calling with fake locale
    // arguments that don't exist: a builder that accepted a "locale" param
    // would be exactly how a second, per-language business entity could
    // get minted by accident.
    expect(buildOrganization.length).toBe(0);
    expect(buildWebSite.length).toBe(0);
    expect(buildMedicalBusiness.length).toBe(0);
    expect(buildPerson.length).toBe(0);
  });

  it("every WebPage entity built for any locale references the SAME MedicalBusiness and WebSite @id, never a locale-derived one", () => {
    const locales: { path: string; inLanguage: string }[] = [
      { path: "/services", inLanguage: "en-US" },
      { path: "/es/servicios", inLanguage: "es-US" },
      { path: "/pt/servicos", inLanguage: "pt-BR" },
      { path: "/ht/sevis", inLanguage: "ht" },
    ];
    const pages = locales.map((l) =>
      buildWebPage({ path: l.path, name: "N", description: "D", inLanguage: l.inLanguage }),
    );
    for (const page of pages) {
      expect(page.about).toEqual({ "@id": MEDICAL_BUSINESS_ID });
      expect(page.isPartOf).toEqual({ "@id": WEBSITE_ID });
    }
    // Not just equal in value — every call must resolve to the literal
    // same constant, so there is no code path that could derive a
    // different id per locale even by typo.
    expect(new Set(pages.map((p) => p.about["@id"])).size).toBe(1);
  });

  it("buildMedicalBusiness()/buildOrganization()/buildPerson() are idempotent — calling them again (as every locale page does) never drifts the @id", () => {
    expect(buildMedicalBusiness()["@id"]).toBe(buildMedicalBusiness()["@id"]);
    expect(buildOrganization()["@id"]).toBe(buildOrganization()["@id"]);
    expect(buildPerson()["@id"]).toBe(buildPerson()["@id"]);
  });

  it("never emits availableLanguage on any built schema object", () => {
    // ATS-SEO-140/141: a translated website alone is not proof of
    // staff/phone support in that language — content/site.ts's
    // bilingualCare is verified for EN/ES only, not PT/HT, and no
    // ContactPoint/ServiceChannel with verified availability exists in
    // this codebase to hang a real availableLanguage claim off of. This
    // walks every builder's actual output rather than grepping source, so
    // it also catches a future builder that constructs the field
    // dynamically instead of typing it literally.
    function assertNoAvailableLanguage(value: unknown, path = "$"): void {
      if (Array.isArray(value)) {
        value.forEach((item, index) => assertNoAvailableLanguage(item, `${path}[${index}]`));
        return;
      }
      if (value && typeof value === "object") {
        for (const [key, nested] of Object.entries(value)) {
          expect(key, `unexpected availableLanguage at ${path}`).not.toBe("availableLanguage");
          assertNoAvailableLanguage(nested, `${path}.${key}`);
        }
      }
    }

    assertNoAvailableLanguage(buildOrganization());
    assertNoAvailableLanguage(buildWebSite());
    assertNoAvailableLanguage(buildMedicalBusiness());
    assertNoAvailableLanguage(buildPerson());
    assertNoAvailableLanguage(
      buildWebPage({ path: "/pt/servicos", name: "N", description: "D", inLanguage: "pt-BR" }),
    );
    assertNoAvailableLanguage(
      buildMedicalWebPage({
        path: "/service-areas/example",
        name: "N",
        description: "D",
        dateModified: "2026-08-18T00:00:00.000Z",
        aboutTopic: "Example",
      }),
    );
  });

  // ATS-SEO-141: "structured data must match visible content" — every
  // ES/PT/HT page.tsx passes buildWebPage's name/description straight from
  // its own route.title/route.description, the exact same object
  // buildEsRouteMetadata()/buildPtRouteMetadata()/buildHtRouteMetadata()
  // read for the <title>/<meta description>, so the two can't drift.
  // Source-scanning rather than importing every page module: these are
  // Next.js Server Components with no jsdom/testing-library setup in this
  // repo (same convention as content/route-registry-parity.test.ts).
  it("every localized page.tsx that calls buildWebPage feeds it the same route.title/route.description its metadata uses", () => {
    const appDir = join(__dirname, "..", "app");
    const offenders: string[] = [];

    function walk(dir: string) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.name === "page.tsx") {
          const source = readFileSync(fullPath, "utf8");
          if (!source.includes("buildWebPage(")) continue;
          const call = source.slice(
            source.indexOf("buildWebPage("),
            source.indexOf("buildWebPage(") + 300,
          );
          if (
            !call.includes("name: route.title") ||
            !call.includes("description: route.description")
          ) {
            offenders.push(fullPath);
          }
        }
      }
    }
    walk(appDir);

    expect(offenders).toEqual([]);
  });
});
