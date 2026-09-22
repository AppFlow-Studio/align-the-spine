import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { buildMedicalBusiness } from "@/lib/schema";

/** ATS-A07 regression coverage.
 *
 * `buildMedicalBusiness()` used to attach `aggregateRating` automatically
 * whenever siteConfig.reviewsRating was verified, so every call site inherited
 * it — including four service-area hub pages that render no review content at
 * all. Marking up a 5.0/164 rating on a page showing zero reviews is
 * self-serving rating markup under Google's structured-data policy.
 *
 * The rating is now opt-in. These tests keep it that way. */
describe("MedicalBusiness aggregateRating", () => {
  it("is omitted by default", () => {
    expect(buildMedicalBusiness()).not.toHaveProperty("aggregateRating");
  });

  it("is omitted when a caller explicitly opts out", () => {
    expect(buildMedicalBusiness({ includeAggregateRating: false })).not.toHaveProperty(
      "aggregateRating",
    );
  });

  it("is included only when a caller explicitly opts in", () => {
    const schema = buildMedicalBusiness({ includeAggregateRating: true });

    expect(schema.aggregateRating).toMatchObject({ "@type": "AggregateRating" });
    expect(schema.aggregateRating?.reviewCount).toBeGreaterThan(0);
    expect(schema.aggregateRating?.ratingValue).toBeGreaterThan(0);
  });

  it("still carries the rest of the business identity when the rating is omitted", () => {
    const schema = buildMedicalBusiness();

    expect(schema["@type"]).toBe("MedicalBusiness");
    expect(schema.telephone).toBe("954-282-1801");
    expect(schema.address.addressLocality).toBe("Deerfield Beach");
  });
});

/** The four service-area hub pages are the ones that regressed. Asserting on
 * their source keeps a future edit from quietly re-adding the opt-in without
 * also adding the review content that would justify it. */
describe("service-area hubs never opt into aggregateRating", () => {
  const hubs = [
    "app/(en)/service-areas/page.tsx",
    "app/(es)/es/areas-de-servicio/page.tsx",
    "app/(pt)/pt/areas-de-atendimento/page.tsx",
    "app/(ht)/ht/zon-nou-sevi/page.tsx",
  ];

  for (const hub of hubs) {
    it(`${hub} calls buildMedicalBusiness without the rating`, () => {
      const source = readFileSync(hub, "utf8");

      expect(source).toContain("buildMedicalBusiness");
      expect(source).not.toContain("includeAggregateRating");
    });
  }
});
