import { getLocalizedRoute, localeFromPath, LOCALES } from "@/content/i18n";

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
/** Separate from GA4/Ads above — the client's own GTM container, installed
 * verbatim per their install instructions (ATS-132). Kept independent so
 * whoever manages the GTM container can add other tags (ad-platform pixels,
 * etc.) without touching the direct GA4/Ads gtag.js install below. */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

export type LeadPriority = "high" | "standard";

/** Form variants whose entire framing is accident-specific — the
 * /auto-accidents hero and the homepage's accident-framed default form. */
const HIGH_PRIORITY_VARIANTS = new Set(["carAccident", "accidentEval"]);

/** Classifies a lead as "high" priority (accident-related, the primary
 * commercial goal) vs "standard" (general chiropractic). Checks, in order:
 * (1) the explicit "Is this related to a car accident?" field every lead
 * form carries (content/lead-forms.ts's carAccidentField) — the most
 * reliable signal since it's a direct answer, not an inference; (2) /book's
 * "Reason for Visit" select being set to "accident", which serves the same
 * purpose on that one form instead of a redundant second question; (3)
 * which form variant it came through, for the two forms whose entire page
 * framing is already accident-specific and might leave the explicit field
 * blank. This is a PRIVATE operational triage signal only: it is read
 * server-side (lib/leads/request.ts) to classify the stored CRM lead and by
 * /api/lead's office email, and MUST never be added to GA4, Google Ads, GTM,
 * or any other outbound analytics event. Exported (not "use client") so the
 * server route can reuse the same classification instead of re-deriving it. */
export function classifyLeadPriority(
  variant: string,
  values: Record<string, string> = {},
): LeadPriority {
  if (values.carAccident === "yes") return "high";
  if (values.reason === "accident") return "high";
  if (values.carAccident === "no") return "standard";
  if (HIGH_PRIORITY_VARIANTS.has(variant)) return "high";
  return "standard";
}

/** ATS-SEO-143: "locale may be measured with generic values such as en, es,
 * pt-BR, ht." Uses this site's own bare Locale codes (en/es/pt/ht — the
 * same values content/i18n.ts's LOCALES/LOCALE_ENDONYM key on) rather than
 * the region-qualified hreflang codes (en-US/es-US/pt-BR/ht): a generic
 * locale dimension for GA4 segmentation, never a page's precise identity —
 * exactly what the ticket asks for, nothing more specific. */
export function trackPhoneClick(path: string) {
  gtag("event", "phone_click", { locale: localeFromPath(path) });
}

export function trackBookCtaClick(path: string) {
  gtag("event", "book_cta_click", { locale: localeFromPath(path) });
}

/** Fires a GA4 page_view for the given path. gtag's automatic pageview only
 * fires once, on the initial hard load (see AnalyticsScripts' `send_page_view:
 * false`) — client-side route changes in the App Router need this called
 * manually, from AnalyticsListeners' pathname effect. */
export function trackPageView(path: string) {
  gtag("event", "page_view", { page_path: path, locale: localeFromPath(path) });
}

export function isPhoneLink(href: string): boolean {
  return href.startsWith("tel:");
}

/** Every locale's booking-CTA path, read from content/i18n.ts's route table
 * (the single source of truth every nav/footer/hero booking link already
 * points at) rather than hardcoded here a second time — a route slug
 * changing in one place could otherwise silently stop matching in this
 * unrelated file. */
const BOOK_CTA_PATHS: readonly string[] = LOCALES.map(
  (locale) => getLocalizedRoute("bookAppointment")[locale],
).filter((path): path is string => path !== null);

/** ATS-SEO-143: this used to match only the English `/book-an-appointment`
 * path, so `book_cta_click` never fired for a Spanish, Portuguese, or
 * Haitian Creole visitor clicking their own locale's booking CTA — a
 * conversion-tracking gap the ticket's "language selection must not break
 * conversion tracking" requirement exists to catch. Now checks every
 * locale's own booking path. */
export function isBookCtaLink(href: string): boolean {
  return BOOK_CTA_PATHS.some(
    (path) => href === path || href.startsWith(`${path}?`) || href.startsWith(`${path}#`),
  );
}
