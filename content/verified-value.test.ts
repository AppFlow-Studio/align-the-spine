import { describe, expect, it } from "vitest";

import { isVerified, unverified, verified } from "@/content/verified-value";

describe("isVerified", () => {
  it("is false for the default unverified() state", () => {
    expect(isVerified(unverified<string>())).toBe(false);
  });

  it("is false when status is verified but value is null", () => {
    expect(isVerified({ value: null, status: "verified" })).toBe(false);
  });

  it("is false when value is set but status is needs-confirmation", () => {
    expect(isVerified({ value: "152", status: "needs-confirmation" })).toBe(false);
  });

  it("is true only when status is verified and value is non-null", () => {
    expect(isVerified(verified("152", "Client email", "2026-08-10"))).toBe(true);
  });
});
