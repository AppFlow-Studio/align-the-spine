import { afterEach, describe, expect, it, vi } from "vitest";

const revalidateTag = vi.fn();
const revalidatePath = vi.fn();

// The route's only side effect is cache invalidation, which needs a Next
// request context to run for real. Mocked so the tests can assert on exactly
// which tags and paths a given payload purges.
vi.mock("next/cache", () => ({
  revalidateTag: (...args: unknown[]) => revalidateTag(...args),
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));

const { POST } = await import("./route");

function request(body: unknown, secret?: string) {
  return new Request("http://localhost/api/internal/content-revalidate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(secret === undefined ? {} : { "x-revalidate-secret": secret }),
    },
    body: JSON.stringify(body),
  });
}

const payload = { slug: "what-to-do-after-a-car-accident", contentType: "blog_post" as const };

describe("POST /api/internal/content-revalidate", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    revalidateTag.mockClear();
    revalidatePath.mockClear();
  });

  // Fails closed. An unconfigured deployment must not expose a cache-purge
  // endpoint to the internet just because nobody set the variable.
  it("rejects every request when CONTENT_REVALIDATION_SECRET is unset", async () => {
    vi.stubEnv("CONTENT_REVALIDATION_SECRET", "");
    const response = await POST(request(payload, "anything"));
    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a wrong secret", async () => {
    vi.stubEnv("CONTENT_REVALIDATION_SECRET", "correct-horse-battery-staple");
    const response = await POST(request(payload, "wrong-secret"));
    expect(response.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("rejects a missing secret header", async () => {
    vi.stubEnv("CONTENT_REVALIDATION_SECRET", "correct-horse-battery-staple");
    expect((await POST(request(payload))).status).toBe(401);
  });

  it("rejects a payload with no usable slug", async () => {
    vi.stubEnv("CONTENT_REVALIDATION_SECRET", "s3cret");
    const response = await POST(request({ slug: "Not A Slug" }, "s3cret"));
    expect(response.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("purges the tags and paths a published post is cached under", async () => {
    vi.stubEnv("CONTENT_REVALIDATION_SECRET", "s3cret");
    const response = await POST(
      request({ ...payload, id: "40000000-0000-4000-8000-000000000001" }, "s3cret"),
    );
    expect(response.status).toBe(200);
    // The same tag set lib/content/public-content.ts caches these reads under.
    expect(revalidateTag.mock.calls.map(([tag]) => tag)).toEqual([
      "content:40000000-0000-4000-8000-000000000001",
      "content:slug:what-to-do-after-a-car-accident",
      "content:blog_post",
      "content:published",
    ]);
    expect(revalidatePath.mock.calls.map(([path]) => path)).toEqual([
      "/blog/what-to-do-after-a-car-accident",
      "/blog",
      "/sitemap.xml",
      "/feed.xml",
    ]);
  });

  it("works without an id, since a direct writer may only know the slug", async () => {
    vi.stubEnv("CONTENT_REVALIDATION_SECRET", "s3cret");
    const response = await POST(request(payload, "s3cret"));
    expect(response.status).toBe(200);
    expect(revalidateTag.mock.calls.map(([tag]) => tag)).not.toContain("content:undefined");
  });

  it("routes a service-area slug to its own paths", async () => {
    vi.stubEnv("CONTENT_REVALIDATION_SECRET", "s3cret");
    await POST(request({ slug: "boca-raton", contentType: "service_area" }, "s3cret"));
    expect(revalidatePath.mock.calls.map(([path]) => path)).toEqual([
      "/service-areas/boca-raton",
      "/service-areas",
      "/sitemap.xml",
      "/feed.xml",
    ]);
  });
});
