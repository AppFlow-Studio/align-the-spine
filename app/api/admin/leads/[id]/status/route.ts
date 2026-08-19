import { NextResponse } from "next/server";
import { z } from "zod";

import { getCrmActor } from "@/lib/leads/authorization";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  status: z.enum(["new", "contacted", "qualified", "scheduled", "closed", "spam"]),
  reason: z.string().trim().min(2).max(500),
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return new Response(null, { status: 403 });
  const actor = await getCrmActor();
  if (!actor) return new Response(null, { status: 401 });
  const { id } = await context.params;
  if (!z.string().uuid().safeParse(id).success) return new Response(null, { status: 404 });
  const parsed = schema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success)
    return Response.json({ ok: false, error: "Invalid status update." }, { status: 422 });
  const { error } = await (
    await createSupabaseServerClient()
  ).rpc("update_lead_status", {
    target_lead_id: id,
    target_status: parsed.data.status,
    change_reason: parsed.data.reason,
  });
  if (error) return Response.json({ ok: false, error: "Status update failed." }, { status: 409 });
  return NextResponse.redirect(new URL(`/admin/leads/${id}`, request.url), 303);
}
