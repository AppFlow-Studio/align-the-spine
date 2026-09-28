import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const revalidateTag = vi.fn();
const revalidatePath = vi.fn();
vi.mock("next/cache", () => ({
  revalidateTag: (...args: unknown[]) => revalidateTag(...args),
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));

const rpc = vi.fn();
const from = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServiceClient: () => ({ rpc, from }),
}));

const { GET } = await import("./route");

function request(token?: string) {
  return new Request("http://localhost/api/cron/publish-scheduled", {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
}

/** Builds the two query shapes the route uses: the due-post list (a chained
 * filter builder) and the single-row status read it does after each refresh. */
function mockSupabase(due: { id: string; slug: string }[], statusAfter: Record<string, string>) {
  from.mockImplementation((table: string) => {
    if (table !== "content_items") throw new Error(`unexpected table ${table}`);
    const builder: Record<string, unknown> = {};
    const chain = () => builder;
    builder.select = chain;
    builder.eq = (column: string, value: string) => {
      if (column === "id") {
        return {
          single: async () => ({ data: { status: statusAfter[value] ?? "scheduled" } }),
        };
      }
      return builder;
    };
    builder.lte = chain;
    builder.limit = async () => ({ data: due, error: null });
    return builder;
  });
  rpc.mockResolvedValue({ error: null });
}

describe("GET /api/cron/publish-scheduled", () => {
  beforeEach(() => {
    vi.stubEnv("CRON_SECRET", "cron-secret");
    vi.stubEnv("CONTENT_REPOSITORY_MODE", "supabase");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    [revalidateTag, revalidatePath, rpc, from].forEach((mock) => mock.mockReset());
  });

  it("rejects a request with no bearer token", async () => {
    mockSupabase([], {});
    expect((await GET(request())).status).toBe(401);
  });

  it("rejects a wrong bearer token", async () => {
    mockSupabase([], {});
    expect((await GET(request("nope"))).status).toBe(401);
  });

  // Publishing public pages unauthenticated would be worse than not running.
  it("refuses to run when CRON_SECRET is unset", async () => {
    vi.stubEnv("CRON_SECRET", "");
    mockSupabase([], {});
    expect((await GET(request("cron-secret"))).status).toBe(401);
  });

  it("no-ops in fixture mode instead of erroring", async () => {
    vi.stubEnv("CONTENT_REPOSITORY_MODE", "fixture");
    const response = await GET(request("cron-secret"));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, skipped: "fixture_mode" });
    expect(from).not.toHaveBeenCalled();
  });

  it("releases a due post and purges its caches", async () => {
    mockSupabase([{ id: "id-1", slug: "scheduled-post" }], { "id-1": "published" });
    const response = await GET(request("cron-secret"));
    expect(await response.json()).toMatchObject({ ok: true, released: 1, stillHeld: [] });
    expect(rpc).toHaveBeenCalledWith("refresh_content_publication", { target_id: "id-1" });
    expect(revalidateTag.mock.calls.map(([tag]) => tag)).toEqual([
      "content:id-1",
      "content:slug:scheduled-post",
      "content:blog_post",
      "content:published",
    ]);
    expect(revalidatePath.mock.calls.map(([path]) => path)).toEqual([
      "/blog/scheduled-post",
      "/blog",
      "/sitemap.xml",
      "/feed.xml",
    ]);
  });

  // A post that went thin or lost a source after being scheduled must not be
  // forced live just because its clock ran out.
  it("leaves a post whose gate no longer passes held, and says so", async () => {
    mockSupabase([{ id: "id-2", slug: "now-blocked" }], { "id-2": "draft" });
    const response = await GET(request("cron-secret"));
    expect(await response.json()).toMatchObject({
      ok: true,
      released: 0,
      stillHeld: ["now-blocked"],
    });
    // No hub-wide purge when nothing actually went live.
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("reports nothing to do without touching the cache", async () => {
    mockSupabase([], {});
    const response = await GET(request("cron-secret"));
    expect(await response.json()).toMatchObject({ ok: true, released: 0 });
    expect(rpc).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
