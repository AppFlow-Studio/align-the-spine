import { beforeEach, describe, expect, it, vi } from "vitest";

import { listAllPublicContent } from "@/lib/content/public-content";
import type { PublicContentItem } from "@/lib/content/types";

import { FEED_MAX_ENTRIES, GET } from "./route";

vi.mock("@/lib/content/public-content", () => ({
  listAllPublicContent: vi.fn(),
}));

/** ATS-A02 regression coverage for /feed.xml.
 *
 * The sitemap's "24-item ceiling" was fixed on 2026-09-17; this route was
 * missed and kept calling `listPublicContent({ pageSize: 24 })`, reading a
 * single repository page as the complete archive. There was no test here at
 * all, which is why the miss survived a full review. */
function post(n: number): PublicContentItem {
  const day = String(n).padStart(2, "0");
  return {
    slug: `post-${day}`,
    title: `Post ${n}`,
    excerpt: `Excerpt for post ${n}.`,
    publishedAt: `2026-03-${day}T00:00:00.000Z`,
    updatedAt: `2026-03-${day}T00:00:00.000Z`,
    author: { name: "Dr. Abe Nasser" },
  } as unknown as PublicContentItem;
}

async function feedBody(items: PublicContentItem[]): Promise<string> {
  vi.mocked(listAllPublicContent).mockResolvedValue(items as never);
  return (await GET()).text();
}

describe("/feed.xml", () => {
  beforeEach(() => vi.mocked(listAllPublicContent).mockReset());

  it("sources posts from the all-pages helper, never a single bounded page", async () => {
    await feedBody([post(1)]);

    expect(listAllPublicContent).toHaveBeenCalledWith("blog_post");
    // A bare content-type call cannot carry a pageSize, so the old
    // `{ pageSize: 24 }` shape cannot come back without failing here.
    expect(vi.mocked(listAllPublicContent).mock.calls[0]).toHaveLength(1);
  });

  it("includes the 25th published post", async () => {
    const body = await feedBody(Array.from({ length: 25 }, (_, i) => post(i + 1)));

    expect(body).toContain("/blog/post-25");
    expect(body.match(/<entry>/g) ?? []).toHaveLength(25);
  });

  it("orders entries newest first regardless of repository order", async () => {
    const shuffled = [post(3), post(1), post(25), post(10)];
    const body = await feedBody(shuffled);

    const order = [...body.matchAll(/<id>[^<]*\/blog\/(post-\d+)<\/id>/g)].map((m) => m[1]);
    expect(order).toEqual(["post-25", "post-10", "post-03", "post-01"]);
  });

  it("applies its entry cap only after retrieving everything", async () => {
    const overCap = FEED_MAX_ENTRIES + 10;
    const body = await feedBody(Array.from({ length: overCap }, (_, i) => post(i + 1)));

    // Everything was fetched...
    expect(listAllPublicContent).toHaveBeenCalledWith("blog_post");
    // ...and the cap is a deliberate trim of the newest N, not a page boundary.
    expect(body.match(/<entry>/g) ?? []).toHaveLength(FEED_MAX_ENTRIES);
    expect(body).toContain(`/blog/post-${overCap}`);
  });

  it("declares a cap well above the repository page ceiling", async () => {
    // If FEED_MAX_ENTRIES ever drops to 24 it becomes indistinguishable from
    // the bug this route used to have.
    expect(FEED_MAX_ENTRIES).toBeGreaterThan(24);
  });

  it("emits valid Atom with the correct content type and no unescaped markup", async () => {
    vi.mocked(listAllPublicContent).mockResolvedValue([
      { ...post(1), title: 'Whiplash & "recovery" <rules>' },
    ] as never);
    const response = await GET();
    const body = await response.text();

    expect(response.headers.get("Content-Type")).toContain("application/atom+xml");
    expect(body.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(body).toContain("&amp;");
    expect(body).toContain("&quot;");
    expect(body).toContain("&lt;rules&gt;");
  });

  it("renders an empty but valid feed when nothing is published", async () => {
    const body = await feedBody([]);

    expect(body).toContain("<feed");
    expect(body).not.toContain("<entry>");
  });
});
