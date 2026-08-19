import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { fixtureAssets } from "@/lib/content/fixtures";

const assetIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!assetIdPattern.test(id)) return new Response(null, { status: 404 });

  let assetUrl: string | undefined;
  if ((process.env.CONTENT_REPOSITORY_MODE ?? "fixture") === "fixture") {
    assetUrl = fixtureAssets.find(
      (asset) => asset.id === id && asset.approvalState === "approved",
    )?.url;
  } else {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key)
      return Response.json({ error: "Content service unavailable." }, { status: 503 });
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await client
      .from("assets")
      .select("url")
      .eq("id", id)
      .eq("approval_state", "approved")
      .maybeSingle();
    if (error) return Response.json({ error: "Content service unavailable." }, { status: 503 });
    assetUrl = data?.url;
  }

  if (!assetUrl) return new Response(null, { status: 404 });
  const destination = assetUrl.startsWith("/") ? new URL(assetUrl, request.url) : new URL(assetUrl);
  return NextResponse.redirect(destination, 307);
}
