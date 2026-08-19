import Link from "next/link";
import { notFound } from "next/navigation";

import { requireCrmActor } from "@/lib/leads/authorization";
import { getCrmLead } from "@/lib/leads/crm";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireCrmActor();
  const { id } = await params;
  const lead = await getCrmLead(id);
  if (!lead) notFound();
  const fields = lead.contact_fields as Record<string, string>;
  const attribution = Array.isArray(lead.lead_attribution)
    ? lead.lead_attribution[0]
    : lead.lead_attribution;
  const consents = [...(lead.lead_consent_receipts ?? [])].sort((a, b) =>
    b.recorded_at.localeCompare(a.recorded_at),
  );
  const events = [...(lead.lead_status_events ?? [])].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );
  const deliveries = (lead.lead_delivery_outbox ?? []) as DeliveryRow[];
  return (
    <main className="container py-10 lg:py-14">
      <Link href="/admin/leads" className="font-semibold text-teal-700">
        ← All leads
      </Link>
      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[.12em] text-teal-700">
            {lead.form_id} · {lead.priority}
          </p>
          <h1 className="mt-2 font-display text-4xl text-navy-900">
            {fields.firstName ? `${fields.firstName} ${fields.lastName ?? ""}` : fields.name}
          </h1>
          <p className="mt-2 text-ink-500">
            Received {new Date(lead.submitted_at).toLocaleString("en-US")}
          </p>
        </div>
        <span className="rounded-full bg-white px-4 py-2 font-semibold text-navy-900">
          {lead.status}
        </span>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Section title="Contact details">
          <DefinitionList values={fields} />
        </Section>
        <Section title="Update status">
          <form method="post" action={`/api/admin/leads/${lead.id}/status`} className="grid gap-4">
            <label className="font-semibold text-navy-900">
              Status
              <select
                name="status"
                defaultValue={lead.status}
                className="mt-2 min-h-11 w-full rounded-xl border border-mute-300 bg-white px-3"
              >
                {["new", "contacted", "qualified", "scheduled", "closed", "spam"].map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="font-semibold text-navy-900">
              Reason
              <input
                required
                minLength={2}
                maxLength={500}
                name="reason"
                className="mt-2 min-h-11 w-full rounded-xl border border-mute-300 px-3"
              />
            </label>
            <button className="min-h-11 w-fit rounded-full bg-navy-900 px-5 font-semibold text-white">
              Save status
            </button>
          </form>
        </Section>
        <Section title="Attribution">
          <DefinitionList values={attribution ?? {}} />
        </Section>
        <Section title="Consent receipts">
          {consents.map((receipt) => (
            <article key={receipt.id} className="border-b border-mute-200 py-3 last:border-0">
              <strong>
                {receipt.granted ? "Granted" : "Not granted"} · {receipt.consent_version}
              </strong>
              <p className="mt-1 text-sm text-ink-500">{receipt.wording}</p>
              <time className="text-xs text-ink-500">
                {new Date(receipt.recorded_at).toLocaleString("en-US")}
              </time>
            </article>
          ))}
        </Section>
        <Section title="Status timeline">
          {events.map((event) => (
            <article key={event.id} className="border-b border-mute-200 py-3 last:border-0">
              <strong>
                {event.from_status ? `${event.from_status} → ` : ""}
                {event.to_status}
              </strong>
              <p className="text-sm text-ink-500">{event.reason}</p>
              <time className="text-xs text-ink-500">
                {new Date(event.created_at).toLocaleString("en-US")}
              </time>
            </article>
          ))}
        </Section>
        <Section title="Delivery health">
          {deliveries.map((delivery) => (
            <article key={delivery.id} className="border-b border-mute-200 py-3 last:border-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <strong>
                  {delivery.destination}: {delivery.state}
                </strong>
                {["retry", "dead_letter"].includes(delivery.state) && (
                  <form
                    method="post"
                    action={`/api/admin/leads/${lead.id}/delivery/${delivery.id}/retry`}
                  >
                    <input
                      type="hidden"
                      name="reason"
                      value="Manual retry requested from lead detail."
                    />
                    <button className="min-h-11 rounded-full px-4 font-semibold text-teal-700">
                      Retry
                    </button>
                  </form>
                )}
              </div>
              <p className="text-sm text-ink-500">
                Attempts: {delivery.attempt_count}/{delivery.max_attempts}
              </p>
              {delivery.last_error_detail && (
                <p className="mt-1 text-sm text-red-700">{delivery.last_error_detail}</p>
              )}
              {(delivery.lead_delivery_attempts ?? []).map((attempt) => (
                <p className="mt-1 text-xs text-ink-500" key={attempt.id}>
                  Attempt {attempt.attempt_number}: {attempt.outcome ?? "processing"}
                </p>
              ))}
            </article>
          ))}
        </Section>
      </div>
      <aside className="mt-8 rounded-3xl border border-amber-300 bg-amber-50 p-5">
        <strong className="text-navy-900">Sensitive payload sealed</strong>
        <p className="mt-1 text-sm text-ink-500">
          Free-text messages and exact accident dates are encrypted and are not displayed in this
          CRM or sent to Google Sheets.
        </p>
      </aside>
    </main>
  );
}

interface DeliveryAttemptRow {
  id: string;
  attempt_number: number;
  outcome?: string | null;
}

interface DeliveryRow {
  id: string;
  destination: string;
  state: string;
  attempt_count: number;
  max_attempts: number;
  last_error_detail?: string | null;
  lead_delivery_attempts?: DeliveryAttemptRow[];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="font-display text-2xl text-navy-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
function DefinitionList({ values }: { values: Record<string, unknown> }) {
  return (
    <dl className="grid gap-3">
      {Object.entries(values)
        .filter(([key, entry]) => entry != null && !["lead_id", "created_at"].includes(key))
        .map(([key, entry]) => (
          <div key={key} className="grid gap-1 sm:grid-cols-[160px_1fr]">
            <dt className="font-semibold text-navy-900">{key.replaceAll("_", " ")}</dt>
            <dd className="break-words text-ink-500">{String(entry)}</dd>
          </div>
        ))}
    </dl>
  );
}
