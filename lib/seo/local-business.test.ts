import { describe, expect, it } from "vitest";

import { localBusinessJsonLd, to24Hour } from "./local-business";

describe("to24Hour", () => {
  it("converts 12-hour business hours to schema.org 24-hour time", () => {
    expect(to24Hour("9:00 AM")).toBe("09:00");
    expect(to24Hour("7:00 PM")).toBe("19:00");
    expect(to24Hour("12:00 PM")).toBe("12:00");
    expect(to24Hour("12:00 AM")).toBe("00:00");
  });
});

describe("localBusinessJsonLd", () => {
  it("includes a MedicalClinic/LocalBusiness type with geo coordinates", () => {
    expect(localBusinessJsonLd["@type"]).toEqual(["MedicalClinic", "LocalBusiness"]);
    expect(localBusinessJsonLd.geo).toEqual({
      "@type": "GeoCoordinates",
      latitude: 26.3061477,
      longitude: -80.0940209,
    });
  });

  // ATS-E4 (4.2/4.6): hours and service areas are unverified claims as of
  // this ticket — content/site.ts's `hours`/`serviceAreas` default to
  // needs-confirmation, so the schema must omit these fields entirely
  // rather than assert unconfirmed data. If this test starts failing
  // because the fields are present, confirm content/site.ts was
  // deliberately marked verified() first.
  it("omits openingHoursSpecification and areaServed while hours/serviceAreas are unverified", () => {
    expect(localBusinessJsonLd).not.toHaveProperty("openingHoursSpecification");
    expect(localBusinessJsonLd).not.toHaveProperty("areaServed");
  });
});
