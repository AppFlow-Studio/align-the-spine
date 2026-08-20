import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireEditorialActor } from "@/lib/content/authorization";
import { contentStatusSchema } from "@/lib/content/schemas";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const requestSchema = z.object({
  expectedVersion: z.number().int().positive(),
  targetStatus: contentStatusSchema,
  reason: z.string().trim().min(8).max(500),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestOrigin = request.headers.get("origin");
  if (requestOrigin && requestOrigin !== new URL(request.url).origin)
    return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
  await requireEditorialActor();
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid transition request." }, { status: 400 });
  const { id } = await params;
  const client = await createSupabaseServerClient();
  const { data, error } = await client
    .rpc("transition_content", {
      target_id: id,
      expected_version: parsed.data.expectedVersion,
      target_status: parsed.data.targetStatus,
      transition_reason: parsed.data.reason,
    })
    .single();
  if (error || !data) {
    const conflict = error?.code === "40001";
    return NextResponse.json(
      {
        error: conflict
          ? "This item changed in another session. Reload before retrying."
          : "The transition was not allowed.",
      },
      { status: conflict ? 409 : 422 },
    );
  }
  const row = data as {
    event_id: string;
    content_type: "blog_post" | "service_area";
    slug: string;
  };
  const itemPath =
    row.content_type === "blog_post" ? `/blog/${row.slug}` : `/service-areas/${row.slug}`;
  const hubPath = row.content_type === "blog_post" ? "/blog" : "/service-areas";
  const targets = [itemPath, hubPath, "/sitemap.xml", "/feed.xml"];
  try {
    revalidateTag(`content:${id}`, "max");
    revalidateTag(`content:slug:${row.slug}`, "max");
    revalidateTag(`content:${row.content_type}`, "max");
    revalidateTag("content:published", "max");
    targets.forEach((path) => revalidatePath(path));
    await client.rpc("complete_publication_event", {
      target_event_id: row.event_id,
      result_status: "succeeded",
      targets,
    });
    return NextResponse.json({ ok: true, path: itemPath, revalidation: "succeeded" });
  } catch {
    await client.rpc("complete_publication_event", {
      target_event_id: row.event_id,
      result_status: "failed",
      targets,
      result_error_code: "revalidation_failed",
      result_error_detail: "Retry cache invalidation; the content transaction was preserved.",
    });
    return NextResponse.json(
      { ok: true, path: itemPath, revalidation: "retry_required" },
      { status: 202 },
    );
  }
}
