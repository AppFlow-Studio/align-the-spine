import { NextResponse } from "next/server";

import { getEditorialContentRepository } from "@/lib/content";
import { requireEditorialActor } from "@/lib/content/authorization";
import { evaluatePublicationGates } from "@/lib/content/publication-gates";
import { editorialUpdateSchema } from "@/lib/content/schemas";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestOrigin = request.headers.get("origin");
  if (requestOrigin && requestOrigin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
  }
  await requireEditorialActor();
  const parsed = editorialUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const { id } = await params;
  const repository = await getEditorialContentRepository();
  const current = await repository.getEditorialById(id);
  if (!current) return NextResponse.json({ error: "Content not found." }, { status: 404 });
  if (current.version !== parsed.data.expectedVersion) {
    return NextResponse.json(
      { error: "This item changed in another session.", latestVersion: current.version },
      { status: 409 },
    );
  }
  const merged = {
    ...current,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt,
    directAnswer: parsed.data.directAnswer,
    keyTakeaways: parsed.data.keyTakeaways,
    faqs: parsed.data.faqs,
    blocks: parsed.data.blocks,
    seoTitle: parsed.data.seoTitle,
    metaDescription: parsed.data.metaDescription,
    ogTitle: parsed.data.ogTitle || undefined,
    ogDescription: parsed.data.ogDescription || undefined,
    // The RPC creates/links the actual asset row server-side, so its real
    // id isn't known yet here — only truthiness matters to the publication
    // gate (lib/content/publication-gates.ts), so a placeholder is enough
    // to reflect "this save will have a linked image" without pretending
    // to know its id.
    featuredImageAssetId: parsed.data.featuredImageUrl
      ? (current.featuredImageAssetId ?? "pending")
      : current.featuredImageAssetId,
    featuredImageAlt: parsed.data.featuredImageAlt || current.featuredImageAlt,
    featured: parsed.data.featured,
    noindex: parsed.data.noindex,
    noindexReason: parsed.data.noindexReason || undefined,
  };
  const gateResult = evaluatePublicationGates(merged);
  const client = await createSupabaseServerClient();
  const { data, error } = await client
    .rpc("save_content_draft", {
      target_id: id,
      expected_version: parsed.data.expectedVersion,
      patch: parsed.data,
      change_note: parsed.data.changeNote,
      next_gate_result: gateResult,
    })
    .single();
  if (error || !data) {
    const conflict = error?.code === "40001";
    return NextResponse.json(
      { error: conflict ? "This item changed in another session." : "Draft save failed." },
      { status: conflict ? 409 : 422 },
    );
  }
  const saved = data as { new_version: number; saved_at: string };
  return NextResponse.json({
    ok: true,
    version: saved.new_version,
    savedAt: saved.saved_at,
    gateResult,
  });
}
