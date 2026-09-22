import { describe, expect, it } from "vitest";

import { listAllPublicContent } from "./public-content";
import { clampPageSize, MAX_PUBLIC_PAGE_SIZE, type PublicListOptions } from "./repository";
import type { ContentListResult, PublicContentItem } from "./types";

/** A real paginating repository over `count` seeded published posts.
 *
 * This deliberately reuses the production `clampPageSize()` and the same
 * offset arithmetic every shipped repository uses, rather than returning
 * hand-written page objects. The previous version of this file injected a fake
 * `listFn` returning literal `{items, totalPages}` shapes, which meant the one
 * behaviour that actually caused the bug — the repository silently clamping a
 * requested page size down to MAX_PUBLIC_PAGE_SIZE — was never exercised at
 * all. A test that can't fail when the clamp changes is not covering the clamp.
 */
function seededRepository(count: number) {
  const seeded: PublicContentItem[] = Array.from({ length: count }, (_, index) => {
    const n = index + 1;
    return {
      slug: `seeded-post-${String(n).padStart(2, "0")}`,
      // Descending publish dates so "newest first" ordering is observable.
      publishedAt: `2026-01-${String(count - index).padStart(2, "0")}T00:00:00.000Z`,
      updatedAt: `2026-01-${String(count - index).padStart(2, "0")}T00:00:00.000Z`,
    } as unknown as PublicContentItem;
  });

  const calls: { page: number; requestedPageSize?: number; servedPageSize: number }[] = [];

  async function listPublic(options: PublicListOptions): Promise<ContentListResult> {
    const page = Math.max(1, options.page ?? 1);
    const pageSize = clampPageSize(options.pageSize);
    calls.push({ page, requestedPageSize: options.pageSize, servedPageSize: pageSize });
    const offset = (page - 1) * pageSize;
    return {
      items: seeded.slice(offset, offset + pageSize),
      page,
      pageSize,
      total: seeded.length,
      totalPages: Math.max(1, Math.ceil(seeded.length / pageSize)),
    } as ContentListResult;
  }

  return { seeded, listPublic, calls };
}

const SEEDED = 25;

describe("repository pagination ceiling", () => {
  it("clamps any requested page size down to MAX_PUBLIC_PAGE_SIZE", () => {
    expect(clampPageSize(100)).toBe(MAX_PUBLIC_PAGE_SIZE);
    expect(clampPageSize(undefined)).toBeLessThanOrEqual(MAX_PUBLIC_PAGE_SIZE);
    expect(clampPageSize(0)).toBe(1);
    expect(clampPageSize(-5)).toBe(1);
  });

  /** ATS-A02 regression guard. This is the assertion that makes the original
   * bug impossible to reintroduce silently: no single listPublic() call can
   * ever return the whole dataset, so any caller treating one page as "all the
   * posts" is provably wrong regardless of what pageSize it asks for. */
  it("cannot return 25 published posts from a single page, whatever the caller asks for", async () => {
    const { listPublic } = seededRepository(SEEDED);

    for (const requested of [24, 25, 100, 1000, undefined]) {
      const result = await listPublic({ contentType: "blog_post", page: 1, pageSize: requested });
      expect(result.items.length).toBeLessThanOrEqual(MAX_PUBLIC_PAGE_SIZE);
      expect(result.items.length).toBeLessThan(SEEDED);
      expect(result.total).toBe(SEEDED);
      expect(result.totalPages).toBeGreaterThan(1);
    }
  });
});

describe("listAllPublicContent", () => {
  it("returns all 25 published posts through a real paginating repository", async () => {
    const { seeded, listPublic } = seededRepository(SEEDED);

    const items = await listAllPublicContent(
      "blog_post",
      listPublic as unknown as Parameters<typeof listAllPublicContent>[1],
    );

    expect(items).toHaveLength(SEEDED);
    expect(items.map((item) => item.slug)).toEqual(seeded.map((item) => item.slug));
  });

  it("actually traverses past page 1 instead of trusting one response", async () => {
    const { listPublic, calls } = seededRepository(SEEDED);

    await listAllPublicContent(
      "blog_post",
      listPublic as unknown as Parameters<typeof listAllPublicContent>[1],
    );

    expect(calls.length).toBeGreaterThan(1);
    expect(calls.map((call) => call.page)).toContain(2);
  });

  it("includes the 25th post specifically — the record the old ceiling dropped", async () => {
    const { listPublic } = seededRepository(SEEDED);

    const items = await listAllPublicContent(
      "blog_post",
      listPublic as unknown as Parameters<typeof listAllPublicContent>[1],
    );

    expect(items.map((item) => item.slug)).toContain("seeded-post-25");
  });

  it("never requests a page size the repositories would silently clamp", async () => {
    const { listPublic, calls } = seededRepository(SEEDED);

    await listAllPublicContent(
      "blog_post",
      listPublic as unknown as Parameters<typeof listAllPublicContent>[1],
    );

    for (const call of calls) {
      expect(call.requestedPageSize).toBe(call.servedPageSize);
    }
  });

  it("makes exactly one call when everything fits on the first page", async () => {
    const { listPublic, calls } = seededRepository(3);

    const items = await listAllPublicContent(
      "blog_post",
      listPublic as unknown as Parameters<typeof listAllPublicContent>[1],
    );

    expect(items).toHaveLength(3);
    expect(calls).toHaveLength(1);
  });

  it("returns an empty list without looping when there are zero results", async () => {
    const { listPublic, calls } = seededRepository(0);

    expect(
      await listAllPublicContent(
        "blog_post",
        listPublic as unknown as Parameters<typeof listAllPublicContent>[1],
      ),
    ).toEqual([]);
    expect(calls).toHaveLength(1);
  });
});
