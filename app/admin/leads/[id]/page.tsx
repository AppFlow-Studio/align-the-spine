import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getLeadDetail } from "@/lib/lead/admin";
import {
  attributionSummary,
  formatEastern,
  formatUtc,
  formLabel,
  leadDisplayName,
} from "@/lib/lead/present";
import type { OutboxRow } from "@/lib/lead/types";

import { retryDeliveryAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex gap-3 py-1.5">
      <div className="w-40 shrink-0 text-xs uppercase tracking-wide text-gray-400">{label}</div>
      <div className="text-sm text-gray-800">{value || "—"}</div>
    </div>
  );
}

function OutboxCard({ row }: { row: OutboxRow }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="font-medium text-gray-900">{row.delivery_purpose}</div>
        <div className="text-xs text-gray-500">{row.destination}</div>
      </div>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
        <div>
          Status: <span className="font-medium text-gray-800">{row.status}</span>
        </div>
        <div>
          Delivery: <span className="font-medium text-gray-800">{row.delivery_state ?? "—"}</span>
        </div>
        <div>
          Attempts: {row.attempts}/{row.max_attempts}
        </div>
        <div>Next attempt: {row.next_attempt_at ? formatEastern(row.next_attempt_at) : "—"}</div>
        <div className="col-span-2 truncate">External id: {row.external_id ?? "—"}</div>
        <div className="col-span-2 truncate">Idempotency: {row.idempotency_key ?? "—"}</div>
        {row.last_error ? (
          <div className="col-span-2 text-red-600">Last error: {row.last_error}</div>
        ) : null}
      </dl>
      {row.status === "dead_letter" ? (
        <form action={retryDeliveryAction} className="mt-3">
          <input type="hidden" name="outboxId" value={row.id} />
          <input type="hidden" name="leadId" value={row.lead_id} />
          <button
            type="submit"
            className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            Retry (dead-lettered)
          </button>
        </form>
      ) : null}
      {row.status === "suppressed" ? (
        <p className="mt-3 text-xs text-amber-700">
          Suppressed by a bounce/complaint — not resendable.
        </p>
      ) : null}
    </div>
  );
}

export default async function AdminLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getLeadDetail(id);
  if (!detail) notFound();
  const { lead, outbox } = detail;

  return (
    <main className="mx-auto max-w-4xl p-8 font-sans">
      <Link href="/admin/leads" className="text-sm text-blue-600 hover:underline">
        ← All leads
      </Link>

      <h1 className="mt-3 text-xl font-semibold text-gray-900">
        {leadDisplayName(lead) ?? "Lead"}
        <span
          className={
            lead.priority === "high"
              ? "ml-3 rounded bg-amber-100 px-2 py-0.5 align-middle text-xs font-semibold text-amber-800"
              : "ml-3 align-middle text-xs text-gray-500"
          }
        >
          {lead.priority}
        </span>
      </h1>

      <section className="mt-6 rounded-lg border border-gray-200 p-5">
        <Field label="Form" value={`${formLabel(lead.form_variant)} · v${lead.form_version}`} />
        <Field label="Received (ET)" value={formatEastern(lead.created_at)} />
        <Field label="Received (UTC)" value={formatUtc(lead.created_at)} />
        <Field label="Phone" value={lead.phone} />
        <Field label="Email" value={lead.email} />
        <Field label="ZIP" value={lead.zip} />
        <Field label="Preferred time" value={lead.best_time} />
        <Field label="Reason" value={lead.reason} />
        <Field label="Accident-related" value={lead.car_accident} />
        <Field label="Source page" value={lead.source_path} />
        <Field label="Attribution" value={attributionSummary(lead.attribution)} />
        <Field
          label="Sensitive on file"
          value={lead.sensitive_present ? "Yes (encrypted, not shown)" : "No"}
        />
        <Field label="CRM status" value={lead.status} />
      </section>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Deliveries
      </h2>
      <div className="mt-3 grid gap-3">
        {outbox.map((row) => (
          <OutboxCard key={row.id} row={row} />
        ))}
        {outbox.length === 0 ? <p className="text-sm text-gray-500">No deliveries.</p> : null}
      </div>
    </main>
  );
}
