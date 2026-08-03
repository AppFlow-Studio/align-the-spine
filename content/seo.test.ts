import { describe, expect, it } from "vitest";

import { getRoute, routes } from "@/content/seo";

describe("routes registry", () => {
  it("has no duplicate paths", () => {
    const paths = routes.map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("gives every route a non-empty title and description", () => {
    for (const route of routes) {
      expect(route.title.length).toBeGreaterThan(0);
      expect(route.description.length).toBeGreaterThan(0);
    }
  });

  it("keeps every priority within Next's valid 0-1 range", () => {
    for (const route of routes) {
      expect(route.priority).toBeGreaterThanOrEqual(0);
      expect(route.priority).toBeLessThanOrEqual(1);
    }
  });

  it("gives every route an ISO lastModified date, not a runtime Date", () => {
    for (const route of routes) {
      expect(route.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("excludes /thank-you, /404, and API routes", () => {
    const paths = routes.map((route) => route.path);
    expect(paths).not.toContain("/thank-you");
    expect(paths).not.toContain("/404");
    expect(paths.some((path) => path.startsWith("/api"))).toBe(false);
  });

  it("excludes the legacy /auto-accident route", () => {
    expect(routes.map((route) => route.path)).not.toContain("/auto-accident");
  });
});

describe("getRoute", () => {
  it("returns the matching route", () => {
    expect(getRoute("/services").path).toBe("/services");
  });

  it("throws for an unregistered path instead of silently returning nothing", () => {
    expect(() => getRoute("/does-not-exist")).toThrow(/no route registered/);
  });
});
