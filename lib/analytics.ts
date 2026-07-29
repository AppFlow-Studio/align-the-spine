declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Client-exposed GA4/Google Ads IDs (ATS-132). Set these in .env.local (see
 * .env.example) to turn analytics on; every helper below no-ops when its ID
 * is unset, so local dev without them stays silent instead of erroring. */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
export const GOOGLE_ADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

/** Fires on every successful lead-form submit — both the POST-then-redirect
 * path (LeadForm/UnderlineForm/BookingForm's default) and the inline-success
 * `onSubmit` override path (the homepage contact form) — since both already
 * call this one function. Keeping the Ads conversion here, rather than only
 * on /thank-you, means the inline-success form (which never navigates to
 * /thank-you) still counts as a conversion. */
export function trackLeadConversion(variant: string) {
  gtag("event", "generate_lead", { lead_form_variant: variant });
  if (GOOGLE_ADS_ID && GOOGLE_ADS_CONVERSION_LABEL) {
    gtag("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}` });
  }
}

export function trackPhoneClick() {
  gtag("event", "phone_click");
}

export function trackBookCtaClick() {
  gtag("event", "book_cta_click");
}

/** Fires a GA4 page_view for the given path. gtag's automatic pageview only
 * fires once, on the initial hard load (see AnalyticsScripts' `send_page_view:
 * false`) — client-side route changes in the App Router need this called
 * manually, from AnalyticsListeners' pathname effect. */
export function trackPageView(path: string) {
  gtag("event", "page_view", { page_path: path });
}

export function isPhoneLink(href: string): boolean {
  return href.startsWith("tel:");
}

export function isBookCtaLink(href: string): boolean {
  return href === "/book" || href.startsWith("/book?") || href.startsWith("/book#");
}
