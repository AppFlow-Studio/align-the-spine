"use client";

import { getStoredAttribution } from "@/lib/attribution";

import { LEAD_FORM_VERSION } from "./contracts";
import { getTurnstileToken } from "./turnstile-client";

export async function submitLead(
  clientSubmissionId: string,
  formId: string,
  values: Record<string, string>,
  website = "",
) {
  // Fetched fresh per submit, after the honeypot short-circuit in every
  // caller (LeadForm/UnderlineForm/BookingForm) — a filled honeypot never
  // reaches here, so this never spends a token on an already-caught bot.
  // The one shared submission function every form on the site calls
  // through, so this is the single place the bot check needs to live.
  const turnstileToken = await getTurnstileToken();
  const response = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientSubmissionId,
      formId,
      formVersion: LEAD_FORM_VERSION,
      values,
      website,
      turnstileToken,
      attribution: getStoredAttribution(),
      sourcePagePath: window.location.pathname,
    }),
  });
  const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
  if (!response.ok || !result?.ok) throw new Error("lead_submission_failed");
}
