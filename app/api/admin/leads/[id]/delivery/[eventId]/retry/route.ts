import { NextResponse } from "next/server";
import { z } from "zod";

import { getCrmActor } from "@/lib/leads/authorization";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string; eventId: string }> },
) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return new Response(null, { status: 403 });
  if (!(await getCrmActor())) return new Response(null, { status: 401 });
  const { id, eventId } = await context.params;
  if (!z.string().uuid().safeParse(id).success || !z.string().uuid().safeParse(eventId).success)
    return new Response(null, { status: 404 });
  const form = await request.formData();
  const reason = z.string().trim().min(2).max(500).safeParse(form.get("reason"));
  if (!reason.success)
    return Response.json({ ok: false, error: "Retry reason required." }, { status: 422 });
  const client = await createSupabaseServerClient();
  const { data: event } = await client
    .from("lead_delivery_outbox")
    .select("lead_id")
    .eq("id", eventId)
    .single();
  if (event?.lead_id !== id) return new Response(null, { status: 404 });
  const { error } = await client.rpc("retry_lead_delivery", {
    target_event_id: eventId,
    retry_reason: reason.data,
  });
  if (error) return Response.json({ ok: false, error: "Delivery retry failed." }, { status: 409 });
  return NextResponse.redirect(new URL(`/admin/leads/${id}`, request.url), 303);
}
