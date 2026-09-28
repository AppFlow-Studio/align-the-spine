import { NextResponse } from "next/server";
import { z } from "zod";

import { requireEditorialActor } from "@/lib/content/authorization";
import { slugSchema } from "@/lib/content/schemas";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Creates a blog post from the admin dashboard.
 *
 * Deliberately a thin wrapper over the same `publish_blog_post()` RPC a worker
 * calls when writing straight to Supabase
 * (supabase/migrations/202609270003_blog_direct_upload.sql), so the admin path
 * and the direct path cannot drift into producing different rows. The RPC also
 * means a paste-in Markdown body becomes real content blocks without this route
 * knowing anything about block shapes.
 *
 * The post is created as a draft and publishes itself the moment its gates pass
 * — which, if the create form was given a long enough body, an image, and an
 * FAQ, is immediately. */
const createSchema = z.object({
  title: z.string().trim().min(12).max(180),
  slug: slugSchema.optional(),
  excerpt: z.string().trim().min(40).max(500),
  markdown: z.string().trim().max(200_000).optional(),
  imageUrl: z
    .string()
    .trim()
    .max(2_000)
    .refine((value) => value === "" || value.startsWith("https://"), {
      message: "Must be a full https:// URL.",
    })
    .optional(),
  imageAlt: z.string().trim().max(200).optional(),
});

/** "What To Do After A Crash" -> "what-to-do-after-a-crash". Mirrors
 * slugSchema's shape so a derived slug can never be one the database rejects. */
export function slugFromTitle(title: string): string {
  return (
    title
      .normalize("NFKD")
      // Combining diacritical marks left behind by NFKD, so "Latigazo Cervical"
      // and "Látigazo Cervical" produce the same slug.
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100)
      .replace(/-+$/g, "")
  );
}

export async function POST(request: Request) {
  const requestOrigin = request.headers.get("origin");
  if (requestOrigin && requestOrigin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
  }
  await requireEditorialActor();
  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const slug = parsed.data.slug ?? slugFromTitle(parsed.data.title);
  if (!slugSchema.safeParse(slug).success) {
    return NextResponse.json(
      { error: "Could not build a usable slug from that title. Enter one directly." },
      { status: 422 },
    );
  }

  const client = await createSupabaseServerClient();
  const { data, error } = await client.rpc("publish_blog_post", {
    payload: {
      slug,
      title: parsed.data.title,
      excerpt: parsed.data.excerpt,
      markdown: parsed.data.markdown ?? "",
      imageUrl: parsed.data.imageUrl ?? "",
      imageAlt: parsed.data.imageAlt ?? "",
    },
  });
  if (error || !data) {
    // A duplicate slug is the one failure a writer can fix themselves, so it
    // gets its own message instead of the generic one.
    const duplicate = error?.code === "23505" || /duplicate key/i.test(error?.message ?? "");
    return NextResponse.json(
      {
        error: duplicate
          ? "A post with that slug already exists. Open it instead, or choose another slug."
          : "Could not create the post.",
        detail: error?.message,
      },
      { status: duplicate ? 409 : 422 },
    );
  }

  const result = data as {
    id: string;
    slug: string;
    status: string;
    publiclyVisible: boolean;
    gate: { passed: boolean; blockers: string[] };
  };
  return NextResponse.json({ ok: true, ...result }, { status: 201 });
}
