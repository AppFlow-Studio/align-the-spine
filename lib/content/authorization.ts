import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { EditorialRole } from "./types";

export interface EditorialActor {
  id: string;
  displayName: string;
  email: string;
  role: EditorialRole;
}

export async function requireEditorialActor(): Promise<EditorialActor> {
  if (
    process.env.NODE_ENV !== "production" &&
    (process.env.CONTENT_REPOSITORY_MODE ?? "fixture") === "fixture"
  ) {
    return {
      id: "00000000-0000-4000-8000-000000000001",
      displayName: "Local CMS demo",
      email: "local-only@example.invalid",
      role: "admin",
    };
  }
  const client = await createSupabaseServerClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await client
    .from("profiles")
    .select("display_name,email,role,active")
    .eq("id", user.id)
    .single();
  if (!profile?.active) redirect("/admin/login?error=inactive");
  if (profile.role === "lead_manager") redirect("/admin/leads");
  if (!(["admin", "editor", "clinician_reviewer"] as string[]).includes(profile.role))
    redirect("/admin/login?error=unauthorized");
  return {
    id: user.id,
    displayName: profile.display_name,
    email: profile.email,
    role: profile.role as EditorialRole,
  };
}
