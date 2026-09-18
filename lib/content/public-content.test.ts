import { describe, expect, it } from "vitest";

import { listAllPublicContent } from "./public-content";
import type { PublicContentItem } from "./types";

function fakeItem(slug: string): PublicContentItem {
  return { slug } as unknown as PublicContentItem;
}

/** Regression test for the sitemap's "24-item ceiling" bug (2026-09-17):
 * app/sitemap.ts used to call listPublicContent once with `pageSize: 24`
 * and treat that single page as the complete list, so a 25th published
 * blog post or service-area record would have silently never appeared in
 * the sitemap. listAllPublicContent must page through every result
 * regardless of how many pages that takes. Exercised against a fake
 * multi-page listFn (real fixture/Supabase data doesn't have 24+ published
 * rows to test this against), not the real content repository. */
describe("listAllPublicContent", () => {
  it("pages through every result instead of stopping at the first page", async () => {
    const pages = [
      { items: [fakeItem("a"), fakeItem("b")], page: 1, pageSize: 2, total: 5, totalPages: 3 },
      { items: [fakeItem("c"), fakeItem("d")], page: 2, pageSize: 2, total: 5, totalPages: 3 },
      { items: [fakeItem("e")], page: 3, pageSize: 2, total: 5, totalPages: 3 },
    ];
    const listFn = async ({ page }: { page?: number }) => pages[(page ?? 1) - 1];

    const items = await listAllPublicContent("blog_post", listFn);

    expect(items.map((item) => item.slug)).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("makes exactly one call when everything fits on the first page", async () => {
    let calls = 0;
    const listFn = async () => {
      calls++;
      return { items: [fakeItem("only")], page: 1, pageSize: 100, total: 1, totalPages: 1 };
    };

    const items = await listAllPublicContent("service_area", listFn);

    expect(items.map((item) => item.slug)).toEqual(["only"]);
    expect(calls).toBe(1);
  });

  it("returns an empty list without looping when there are zero results", async () => {
    let calls = 0;
    const listFn = async () => {
      calls++;
      return { items: [], page: 1, pageSize: 100, total: 0, totalPages: 1 };
    };

    expect(await listAllPublicContent("blog_post", listFn)).toEqual([]);
    expect(calls).toBe(1);
  });
});
