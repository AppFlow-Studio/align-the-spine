import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { captureAttribution, getStoredAttribution, sanitizeAttribution } from "./attribution";

/** No jsdom in this project (vitest.config.ts runs a plain node
 * environment) — these two functions only touch `window.location.search`
 * and `window.sessionStorage`, so a minimal mock covers them without
 * pulling in a browser DOM implementation for one test file. `store` lives
 * outside `navigateTo` so it persists across calls within a test, the same
 * way real sessionStorage persists across page navigations in one tab. */
let store: Map<string, string>;

function navigateTo(search: string) {
  (globalThis as { window?: unknown }).window = {
    location: { search },
    sessionStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    },
  };
}

describe("attribution capture", () => {
  beforeEach(() => {
    store = new Map();
    navigateTo("");
  });

  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
  });

  it("captures gclid from the URL", () => {
    navigateTo("?gclid=abc123");
    captureAttribution();
    expect(getStoredAttribution()).toEqual({ gclid: "abc123" });
  });

  it("captures every known attribution param present, ignoring unknown ones", () => {
    navigateTo("?gclid=abc123&utm_source=google&utm_campaign=accident-lp&irrelevant=1");
    captureAttribution();
    expect(getStoredAttribution()).toEqual({
      gclid: "abc123",
      utm_source: "google",
      utm_campaign: "accident-lp",
    });
  });

  it("does nothing when the URL carries no attribution params", () => {
    navigateTo("?ref=nav");
    captureAttribution();
    expect(getStoredAttribution()).toEqual({});
  });

  it("merges a later page's params without dropping an earlier gclid", () => {
    navigateTo("?gclid=abc123");
    captureAttribution();

    navigateTo(""); // visitor navigates to a page with no query params
    captureAttribution();

    expect(getStoredAttribution()).toEqual({ gclid: "abc123" });
  });

  it("returns an empty object when nothing has been captured yet", () => {
    expect(getStoredAttribution()).toEqual({});
  });
});

describe("sanitizeAttribution (server-side, untrusted input)", () => {
  it("keeps only known keys with string values", () => {
    expect(sanitizeAttribution({ gclid: "abc123", evil: "<script>", nested: { a: 1 } })).toEqual({
      gclid: "abc123",
    });
  });

  it("drops non-string values for known keys instead of coercing them", () => {
    expect(sanitizeAttribution({ gclid: 12345 })).toEqual({});
    expect(sanitizeAttribution({ gclid: null })).toEqual({});
    expect(sanitizeAttribution({ gclid: ["abc"] })).toEqual({});
  });

  it("caps an absurdly long value instead of rejecting the whole payload", () => {
    const result = sanitizeAttribution({ gclid: "a".repeat(1000) });
    expect(result.gclid).toHaveLength(512);
  });

  it("returns an empty object for non-object input", () => {
    expect(sanitizeAttribution(null)).toEqual({});
    expect(sanitizeAttribution("not an object")).toEqual({});
    expect(sanitizeAttribution(undefined)).toEqual({});
  });
});
