/**
 * Presentation helpers shared by the delivery worker (office email) and the
 * admin CRM view. Pure, non-PII formatting only.
 */
import type { LeadRow } from "./types";

const FORM_LABELS: Record<string, string> = {
  heroEval: "Evaluation request",
  accidentEval: "Accident evaluation",
  contactUs: "Contact form",
  carAccident: "Car accident evaluation",
  reviewsEval: "Evaluation (reviews)",
  contact: "Contact request",
  eligibility: "Home-visit eligibility",
  booking: "Appointment request",
};

export function formLabel(variant: string): string {
  return FORM_LABELS[variant] ?? variant;
}

/** First segment of the submission UUID — a short, opaque triage handle. */
export function shortSubmissionId(submissionId: string): string {
  return submissionId.split("-")[0] ?? submissionId.slice(0, 8);
}

const UTC_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const ET_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

export function formatUtc(iso: string): string {
  return `${UTC_FMT.format(new Date(iso))} UTC`;
}

export function formatEastern(iso: string): string {
  return `${ET_FMT.format(new Date(iso))} ET`;
}

/**
 * Non-PII attribution summary. utm_* values are shown; the opaque click ids
 * (gclid/gbraid/wbraid) are reported as "present" rather than dumping the raw
 * identifier into the email body.
 */
export function attributionSummary(attribution: Record<string, string>): string | null {
  const parts: string[] = [];
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    if (attribution[key]) parts.push(`${key.replace("utm_", "")}=${attribution[key]}`);
  }
  for (const id of ["gclid", "gbraid", "wbraid"]) {
    if (attribution[id]) parts.push(`${id} present`);
  }
  return parts.length > 0 ? parts.join("; ") : null;
}

/** Best available display name across the heterogeneous forms. */
export function leadDisplayName(lead: LeadRow): string | null {
  if (lead.full_name) return lead.full_name;
  const combined = [lead.first_name, lead.last_name].filter(Boolean).join(" ").trim();
  return combined || null;
}
