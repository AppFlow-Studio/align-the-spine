import type { Metadata } from "next";
import Link from "next/link";

import { listLeadsWithDelivery, type LeadDeliverySummary } from "@/lib/lead/admin";
import { isSupabaseConfigured } from "@/lib/lead/env";
import { formatEastern, formLabel, leadDisplayName } from "@/lib/lead/present";
import type { OutboxRow } from "@/lib/lead/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

function DeliveryBadge({ label, row }: { label: string; row?: OutboxRow }) {
  if (!row) return <span className="text-xs text-gray-400">{label}: —</span>;
  const state = row.delivery_state ?? row.status;
  const tone =
    row.status === "dead_letter" ||
    row.delivery_state === "bounced" ||
    row.delivery_state === "complained"
      ? "bg-red-100 text-red-700"
      : row.status === "sent" || row.delivery_state === "delivered"
        ? "bg-green-100 text-green-700"
        : row.status === "suppressed"
          ? "bg-amber-100 text-amber-800"
          : "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${tone}`}>
      {label}: {state}
    </span>
  );
}

function DeliveryCell({ delivery }: { delivery: LeadDeliverySummary }) {
  return (
    <div className="flex flex-wrap gap-1">
      <DeliveryBadge label="office" row={delivery.office} />
      <DeliveryBadge label="patient" row={delivery.patient} />
      {delivery.sheets ? <DeliveryBadge label="sheets" row={delivery.sheets} /> : null}
    </div>
  );
}

export default async function AdminLeadsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="mx-auto max-w-3xl p-8 font-sans">
        <h1 className="text-xl font-semibold">Lead CRM</h1>
        <p className="mt-4 text-sm text-gray-600">
          The lead store is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY). Set these to
          view leads.
        </p>
      </main>
    );
  }

  const items = await listLeadsWithDelivery(100);

  return (
    <main className="mx-auto max-w-6xl p-8 font-sans">
      <h1 className="text-xl font-semibold text-gray-900">Lead CRM</h1>
      <p className="mt-1 text-sm text-gray-500">{items.length} most recent leads</p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Received (ET)</th>
              <th className="px-4 py-3">Form</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Delivery</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ lead, delivery }) => (
              <tr key={lead.id} className="border-t border-gray-100 align-top">
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {formatEastern(lead.created_at)}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {formLabel(lead.form_variant)}
                  <span className="ml-1 text-xs text-gray-400">v{lead.form_version}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      lead.priority === "high"
                        ? "rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800"
                        : "text-xs text-gray-500"
                    }
                  >
                    {lead.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <div className="font-medium">{leadDisplayName(lead) ?? "—"}</div>
                  <div className="text-xs text-gray-500">{lead.phone ?? "—"}</div>
                  <div className="text-xs text-gray-500">{lead.email ?? "—"}</div>
                </td>
                <td className="px-4 py-3">
                  <DeliveryCell delivery={delivery} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
