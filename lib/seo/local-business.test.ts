import { describe, expect, it } from "vitest";

import { localBusinessJsonLd } from "./local-business";

describe("localBusinessJsonLd", () => {
  it("converts 12-hour business hours to schema.org 24-hour time", () => {
    const monday = localBusinessJsonLd.openingHoursSpecification.find(
      (spec) => spec.dayOfWeek === "Monday",
    );
    expect(monday?.opens).toBe("09:00");
    expect(monday?.closes).toBe("19:00");
  });

  it("has one opening-hours entry per day of the week", () => {
    expect(localBusinessJsonLd.openingHoursSpecification).toHaveLength(7);
  });

  it("includes a MedicalClinic/LocalBusiness type with geo coordinates", () => {
    expect(localBusinessJsonLd["@type"]).toEqual(["MedicalClinic", "LocalBusiness"]);
    expect(localBusinessJsonLd.geo).toEqual({
      "@type": "GeoCoordinates",
      latitude: 26.3061477,
      longitude: -80.0940209,
    });
  });
});
