import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  if (request.headers.get("origin") && request.headers.get("origin") !== origin)
    return new Response(null, { status: 403 });
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || password.length < 8)
    return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url), 303);
  try {
    const client = await createSupabaseServerClient();
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error)
      return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url), 303);
    const {
      data: { user },
    } = await client.auth.getUser();
    const { data: profile } = user
      ? await client.from("profiles").select("role,active").eq("id", user.id).single()
      : { data: null };
    if (!profile?.active)
      return NextResponse.redirect(new URL("/admin/login?error=inactive", request.url), 303);
    return NextResponse.redirect(new URL("/admin/content", request.url), 303);
  } catch {
    return NextResponse.redirect(new URL("/admin/login?error=unavailable", request.url), 303);
  }
}
