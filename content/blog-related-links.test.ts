import { describe, expect, it } from "vitest";

import { buildBlogRelatedPageLinks } from "@/content/blog-related-links";

describe("buildBlogRelatedPageLinks", () => {
  it("resolves real, published links for a known category", () => {
    const links = buildBlogRelatedPageLinks(["car-accident-care"], {
      currentPath: "/blog/some-article",
    });
    expect(links.length).toBeGreaterThan(0);
    expect(links.map((link) => link.href)).toContain("/car-accident-chiropractor");
  });

  it("returns an empty array for a category with no mapping (no crash)", () => {
    expect(buildBlogRelatedPageLinks(["office-city"], { currentPath: "/blog/x" })).toEqual([]);
  });

  it("returns an empty array when no categories are passed", () => {
    expect(buildBlogRelatedPageLinks([], { currentPath: "/blog/x" })).toEqual([]);
  });

  it("de-duplicates paths shared across multiple mapped categories", () => {
    const links = buildBlogRelatedPageLinks(["car-accident-care", "car-accident-care"], {
      currentPath: "/blog/x",
    });
    const hrefs = links.map((link) => link.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("honors highlightPath", () => {
    const links = buildBlogRelatedPageLinks(["car-accident-care"], {
      currentPath: "/blog/x",
      highlightPath: "/car-accident-chiropractor",
    });
    const highlighted = links.find((link) => link.href === "/car-accident-chiropractor");
    expect(highlighted?.highlighted).toBe(true);
  });
});
