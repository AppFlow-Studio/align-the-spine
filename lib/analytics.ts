declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Conversion hook point for ATS-132. Pushes a GTM-style event so whichever
 * analytics stack ATS-132 lands (GTM, GA4, ads pixel) can consume it without
 * touching the form code. Safe to call anywhere — no-ops on the server. */
export function trackLeadConversion(variant: string) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: "lead_form_submit", leadFormVariant: variant });
}
