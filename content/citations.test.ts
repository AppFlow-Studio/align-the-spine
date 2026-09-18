import { describe, expect, it } from "vitest";

import { CITATIONS } from "@/content/citations";

describe("CITATIONS registry", () => {
  const entries = Object.values(CITATIONS);

  it("is not empty", () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it("every entry has non-empty required fields and an https source URL", () => {
    for (const citation of entries) {
      expect(citation.id).toBeTruthy();
      expect(citation.label).toBeTruthy();
      expect(citation.sourceTitle).toBeTruthy();
      expect(citation.sourceOrg).toBeTruthy();
      expect(citation.url).toMatch(/^https:\/\//);
    }
  });

  it("every registry key matches its citation's own id", () => {
    for (const [key, citation] of Object.entries(CITATIONS)) {
      expect(citation.id).toBe(key);
    }
  });

  it("has no duplicate source URLs", () => {
    const urls = entries.map((c) => c.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
