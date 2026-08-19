import { describe, expect, it } from "vitest";

import { isTurnstileSuccess } from "./turnstile";

describe("isTurnstileSuccess", () => {
  it("accepts a genuine success response", () => {
    expect(isTurnstileSuccess({ success: true })).toBe(true);
  });

  it("rejects a failure response", () => {
    expect(isTurnstileSuccess({ success: false, "error-codes": ["invalid-input-response"] })).toBe(
      false,
    );
  });

  it("rejects malformed or unexpected shapes", () => {
    expect(isTurnstileSuccess(null)).toBe(false);
    expect(isTurnstileSuccess(undefined)).toBe(false);
    expect(isTurnstileSuccess("success")).toBe(false);
    expect(isTurnstileSuccess({ success: "true" })).toBe(false);
    expect(isTurnstileSuccess({})).toBe(false);
  });
});
