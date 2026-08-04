import { afterEach, describe, expect, it, vi } from "vitest";

import { isProduction } from "@/content/site";

describe("isProduction", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('is true only when VERCEL_ENV is exactly "production"', () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(isProduction()).toBe(true);
  });

  it("is false for preview deploys", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(isProduction()).toBe(false);
  });

  it("is false when VERCEL_ENV is unset (local dev, CI)", () => {
    vi.stubEnv("VERCEL_ENV", undefined);
    expect(isProduction()).toBe(false);
  });
});
