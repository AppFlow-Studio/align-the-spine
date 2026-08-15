import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { proxy } from "./proxy";

function request(path = "/"): NextRequest {
  return new NextRequest(new URL(path, "https://chirobackpain.com"));
}

describe("proxy X-Robots-Tag", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("sets X-Robots-Tag: noindex, nofollow outside production", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const response = proxy(request("/"));
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  });

  it("sets the header for non-page requests too (e.g. /_next/* assets)", () => {
    vi.stubEnv("VERCEL_ENV", undefined);
    const response = proxy(request("/_next/static/chunk.js"));
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  });

  it("omits the header in production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const response = proxy(request("/"));
    expect(response.headers.get("X-Robots-Tag")).toBeNull();
  });
});
