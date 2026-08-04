import { describe, expect, it } from "vitest";

import { doctorCredentials } from "@/content/doctor-profile";

describe("doctorCredentials", () => {
  it("defaults to unverified until Dr. Abe confirms his degree/education/license", () => {
    expect(doctorCredentials.verified).toBe(false);
  });

  it("has no alumniOf/hasCredential claims while unverified", () => {
    expect(doctorCredentials.alumniOf).toBeUndefined();
    expect(doctorCredentials.hasCredential).toBeUndefined();
  });
});
