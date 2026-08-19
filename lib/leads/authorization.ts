import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface CrmActor {
  id: string;
  displayName: string;
  email: string;
  role: "admin" | "lead_manager";
}

export async function getCrmActor(): Promise<CrmActor | null> {
  if (
    process.env.NODE_ENV !== "production" &&
    (process.env.LEAD_REPOSITORY_MODE ?? process.env.CONTENT_REPOSITORY_MODE ?? "fixture") ===
      "fixture"
  ) {
    return {
      id: "00000000-0000-4000-8000-000000000001",
      displayName: "Local CRM demo",
      email: "local-only@example.invalid",
      role: "admin",
    };
  }
  const client = await createSupabaseServerClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null;
  const { data } = await client
    .from("profiles")
    .select("display_name,email,role,active")
    .eq("id", user.id)
    .single();
  if (!data?.active || !["admin", "lead_manager"].includes(data.role)) return null;
  return {
    id: user.id,
    displayName: data.display_name,
    email: data.email,
    role: data.role as "admin" | "lead_manager",
  };
}

export async function requireCrmActor() {
  const actor = await getCrmActor();
  if (!actor) redirect("/admin/login?error=unauthorized");
  return actor;
}
