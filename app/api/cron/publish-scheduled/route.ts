import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { createSupabaseServiceClient } from "@/lib/supabase/server";

/** Releases blog posts whose scheduled time has arrived.
 *
 * `scheduledFor` in the future sends a post to `scheduled` instead of
 * `published` (202609270002's trigger). Without this route that status would be
 * a dead end — nothing else ever flips it — so a writer who scheduled a post
 * would watch its date pass in silence.
 *
 * Deliberately no new database objects: the trigger already publishes a
 * `scheduled` row the moment its `scheduled_for` is no longer in the future, and
 * `refresh_content_publication()` is a no-op UPDATE whose only job is to make
 * the trigger re-evaluate. So this route finds due rows and touches them; the
 * gate still decides. A post that went thin or lost its sources since being
 * scheduled stays unpublished and keeps its blockers, exactly as it would on any
 * other save.
 *
 * Wire as a Vercel Cron (vercel.json). Vercel sends `Authorization: Bearer
 * $CRON_SECRET` automatically for cron-triggered requests. Fails closed: no
 * CRON_SECRET, no run — this publishes public pages, so there is no
 * "open when unconfigured" mode. */
const MAX_PER_RUN = 50;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if ((process.env.CONTENT_REPOSITORY_MODE ?? "fixture") !== "supabase") {
    // Fixture mode has no database to read; returning ok keeps a misconfigured
    // preview deployment's cron from alerting every night.
    return NextResponse.json({ ok: true, skipped: "fixture_mode", released: 0 });
  }

  const client = createSupabaseServiceClient();
  const { data: due, error } = await client
    .from("content_items")
    .select("id,slug")
    .eq("content_type", "blog_post")
    .eq("status", "scheduled")
    .lte("scheduled_for", new Date().toISOString())
    .limit(MAX_PER_RUN);

  if (error) {
    console.error("[cron/publish-scheduled] failed to query due posts:", error);
    return NextResponse.json({ ok: false, error: "query_failed" }, { status: 503 });
  }
  if (!due?.length) return NextResponse.json({ ok: true, released: 0 });

  const released: string[] = [];
  const stillHeld: string[] = [];
  for (const post of due) {
    // Sequential: each call fires the item's triggers, and a handful of rows a
    // night never justifies concurrent writes against the same table.
    const { error: refreshError } = await client.rpc("refresh_content_publication", {
      target_id: post.id,
    });
    if (refreshError) {
      console.error(`[cron/publish-scheduled] ${post.slug} failed to refresh:`, refreshError);
      stillHeld.push(post.slug);
      continue;
    }
    const { data: after } = await client
      .from("content_items")
      .select("status")
      .eq("id", post.id)
      .single();
    if (after?.status === "published") {
      released.push(post.slug);
      revalidateTag(`content:${post.id}`, "max");
      revalidateTag(`content:slug:${post.slug}`, "max");
      revalidatePath(`/blog/${post.slug}`);
    } else {
      // Its gate stopped passing between scheduling and now. Left alone with
      // its blockers rather than forced live.
      stillHeld.push(post.slug);
    }
  }

  if (released.length) {
    revalidateTag("content:blog_post", "max");
    revalidateTag("content:published", "max");
    ["/blog", "/sitemap.xml", "/feed.xml"].forEach((path) => revalidatePath(path));
  }

  return NextResponse.json({ ok: true, released: released.length, stillHeld });
}
