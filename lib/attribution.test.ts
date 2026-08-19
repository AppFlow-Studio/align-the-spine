import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { captureAttribution, getStoredAttribution, sanitizeAttribution } from "./attribution";

let store: Map<string, string>;

function navigateTo(search: string, pathname = "/landing") {
  (globalThis as { window?: unknown }).window = {
    location: {
      search,
      pathname,
      origin: "https://example.test",
      href: `https://example.test${pathname}${search}`,
    },
    sessionStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
    },
  };
  (globalThis as { document?: unknown }).document = {
    referrer: "https://google.com/search?q=private-query",
    cookie: "_ga=GA1.1.123.456; _fbp=fb.1.abc",
  };
}

describe("attribution capture", () => {
  beforeEach(() => {
    store = new Map();
    navigateTo("");
  });
  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
    delete (globalThis as { document?: unknown }).document;
  });

  it("captures allowlisted click/campaign values plus first-party context", () => {
    navigateTo("?gclid=abc123&utm_source=google&utm_id=campaign-1&irrelevant=private");
    captureAttribution();
    expect(getStoredAttribution()).toMatchObject({
      gclid: "abc123",
      utm_source: "google",
      utm_id: "campaign-1",
      initialLandingPath: "/landing",
      latestLandingPath: "/landing",
      referrerHost: "google.com",
      gaClientId: "123.456",
      fbp: "fb.1.abc",
    });
    expect(JSON.stringify(getStoredAttribution())).not.toContain("private-query");
    expect(JSON.stringify(getStoredAttribution())).not.toContain("irrelevant");
  });

  it("preserves the initial landing and updates only the latest path", () => {
    captureAttribution();
    navigateTo("", "/contact-us");
    captureAttribution();
    expect(getStoredAttribution()).toMatchObject({
      initialLandingPath: "/landing",
      latestLandingPath: "/contact-us",
    });
  });
});

describe("sanitizeAttribution", () => {
  it("keeps only allowlisted typed values and path-only landing data", () => {
    expect(
      sanitizeAttribution({
        gclid: "abc123",
        initialLandingPath: "/safe",
        latestLandingPath: "/unsafe?secret=1",
        gaSessionNumber: 3,
        evil: "<script>",
      }),
    ).toEqual({ gclid: "abc123", initialLandingPath: "/safe", gaSessionNumber: 3 });
  });

  it("caps values and rejects malformed input", () => {
    expect(sanitizeAttribution({ gclid: "a".repeat(1000) }).gclid).toHaveLength(512);
    expect(sanitizeAttribution(null)).toEqual({});
    expect(sanitizeAttribution({ gaSessionNumber: "3" })).toEqual({});
  });
});
