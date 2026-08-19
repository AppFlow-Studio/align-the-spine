import Link from "next/link";

import { requireCrmActor } from "@/lib/leads/authorization";
import { listCrmLeads, type LeadFilters } from "@/lib/leads/crm";

export const dynamic = "force-dynamic";

const FORM_OPTIONS = [
  "heroEval",
  "accidentEval",
  "contactUs",
  "carAccident",
  "reviewsEval",
  "contact",
  "eligibility",
  "booking",
];

function value(input: string | string[] | undefined) {
  return typeof input === "string" ? input : undefined;
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const actor = await requireCrmActor();
  const params = await searchParams;
  const filters: LeadFilters = Object.fromEntries(
    Object.entries(params).map(([key, entry]) => [key, value(entry)]),
  );
  const leads = await listCrmLeads(filters);

  return (
    <main className="container py-10 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-700">
            Lead CRM
          </p>
          <h1 className="mt-2 font-display text-4xl text-navy-900 sm:text-5xl">Website requests</h1>
          <p className="mt-2 text-ink-500">
            Signed in as {actor.displayName}. Sensitive fields stay sealed.
          </p>
        </div>
        <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-800 shadow-sm">
          {leads.length} result{leads.length === 1 ? "" : "s"}
        </div>
      </div>

      <form
        className="mt-8 grid gap-3 rounded-3xl bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Filter leads"
      >
        <label className="text-sm font-semibold text-navy-900">
          Search
          <input
            name="query"
            defaultValue={filters.query}
            className="mt-2 min-h-11 w-full rounded-xl border border-mute-300 px-3"
            placeholder="Name, phone, or email"
          />
        </label>
        <label className="text-sm font-semibold text-navy-900">
          From
          <input
            name="from"
            type="date"
            defaultValue={filters.from}
            className="mt-2 min-h-11 w-full rounded-xl border border-mute-300 px-3"
          />
        </label>
        <label className="text-sm font-semibold text-navy-900">
          To
          <input
            name="to"
            type="date"
            defaultValue={filters.to}
            className="mt-2 min-h-11 w-full rounded-xl border border-mute-300 px-3"
          />
        </label>
        <FilterSelect name="form" label="Form" value={filters.form} options={FORM_OPTIONS} />
        <FilterSelect
          name="status"
          label="Status"
          value={filters.status}
          options={["new", "contacted", "qualified", "scheduled", "closed", "spam"]}
        />
        <FilterSelect
          name="priority"
          label="Priority"
          value={filters.priority}
          options={["high", "standard"]}
        />
        <FilterSelect
          name="intent"
          label="Intent"
          value={filters.intent}
          options={["car_accident", "general"]}
        />
        <label className="text-sm font-semibold text-navy-900">
          Source
          <input
            name="source"
            defaultValue={filters.source}
            className="mt-2 min-h-11 w-full rounded-xl border border-mute-300 px-3"
          />
        </label>
        <label className="text-sm font-semibold text-navy-900">
          Medium
          <input
            name="medium"
            defaultValue={filters.medium}
            className="mt-2 min-h-11 w-full rounded-xl border border-mute-300 px-3"
          />
        </label>
        <label className="text-sm font-semibold text-navy-900">
          Campaign
          <input
            name="campaign"
            defaultValue={filters.campaign}
            className="mt-2 min-h-11 w-full rounded-xl border border-mute-300 px-3"
          />
        </label>
        <div className="flex items-end gap-2 lg:col-span-2">
          <button
            className="min-h-11 rounded-full bg-navy-900 px-5 font-semibold text-white"
            type="submit"
          >
            Apply filters
          </button>
          <Link
            href="/admin/leads"
            className="inline-flex min-h-11 items-center rounded-full px-5 font-semibold text-navy-800"
          >
            Clear
          </Link>
        </div>
      </form>

      {leads.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-dashed border-mute-300 bg-white p-10 text-center">
          <h2 className="font-display text-3xl text-navy-900">No leads match these filters</h2>
          <p className="mt-2 text-ink-500">Local fixture mode intentionally starts empty.</p>
        </section>
      ) : (
        <div
          className="mt-8 overflow-x-auto rounded-3xl bg-white shadow-sm"
          tabIndex={0}
          aria-label="Lead results table"
        >
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="bg-navy-900 text-white">
              <tr>
                {[
                  "Submitted",
                  "Contact",
                  "Form",
                  "Intent",
                  "Priority",
                  "Status",
                  "Campaign",
                  "Delivery",
                  "",
                ].map((heading) => (
                  <th className="px-4 py-3" key={heading}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const fields = lead.contact_fields as Record<string, string>;
                const attribution = Array.isArray(lead.lead_attribution)
                  ? lead.lead_attribution[0]
                  : lead.lead_attribution;
                return (
                  <tr key={lead.id} className="border-b border-mute-200 last:border-0">
                    <td className="px-4 py-4">
                      {new Date(lead.submitted_at).toLocaleString("en-US")}
                    </td>
                    <td className="px-4 py-4">
                      <strong className="block text-navy-900">
                        {fields.firstName
                          ? `${fields.firstName} ${fields.lastName ?? ""}`
                          : fields.name}
                      </strong>
                      <span className="text-ink-500">{fields.phone || fields.email}</span>
                    </td>
                    <td className="px-4 py-4">{lead.form_id}</td>
                    <td className="px-4 py-4">{lead.intent}</td>
                    <td className="px-4 py-4">{lead.priority}</td>
                    <td className="px-4 py-4">{lead.status}</td>
                    <td className="px-4 py-4">{attribution?.utm_campaign ?? "—"}</td>
                    <td className="px-4 py-4">
                      <DeliveryBadge status={lead.delivery_status} />
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        className="inline-flex min-h-11 items-center rounded-full px-3 font-semibold text-teal-700"
                        href={`/admin/leads/${lead.id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function FilterSelect({
  name,
  label,
  value: selected,
  options,
}: {
  name: string;
  label: string;
  value?: string;
  options: string[];
}) {
  return (
    <label className="text-sm font-semibold text-navy-900">
      {label}
      <select
        name={name}
        defaultValue={selected ?? ""}
        className="mt-2 min-h-11 w-full rounded-xl border border-mute-300 bg-white px-3"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}

function DeliveryBadge({ status }: { status: string }) {
  const tone =
    status === "delivered"
      ? "bg-teal-100 text-teal-800"
      : status === "failed"
        ? "bg-red-100 text-red-800"
        : "bg-amber-100 text-amber-900";
  return (
    <span className={`inline-flex rounded-full px-3 py-1 font-semibold ${tone}`}>{status}</span>
  );
}
