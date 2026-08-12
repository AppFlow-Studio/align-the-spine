/** Ad-click / campaign attribution params worth capturing on these pages
 * once they're running as Google Ads landing pages and sitelinks. gclid is
 * the one that matters most — it's what lets a lead be matched back to the
 * exact ad click, including for a manual/offline conversion import later
 * (e.g. "this lead became a real patient 3 weeks later"). */
const ATTRIBUTION_PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

type AttributionKey = (typeof ATTRIBUTION_PARAMS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

const STORAGE_KEY = "ats_attribution";
/** Google Click IDs run long but aren't unbounded — this is generous
 * headroom over any real one, just a ceiling against something absurd
 * ending up in the URL. */
const MAX_VALUE_LENGTH = 512;

/** Captures attribution params from the current URL and merges them into
 * whatever's already stored, without overwriting an existing value with a
 * blank one — so a visitor who clicks a Google ad to /auto-accidents, then
 * browses to /about before converting, still has their gclid attached when
 * they eventually submit a form on a page whose own URL never carried it. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const found: Attribution = {};
  for (const key of ATTRIBUTION_PARAMS) {
    const value = params.get(key);
    if (value) found[key] = value.slice(0, MAX_VALUE_LENGTH);
  }
  if (Object.keys(found).length === 0) return;

  try {
    const existing = getStoredAttribution();
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...found }));
  } catch {
    // sessionStorage can throw in private-browsing/storage-restricted
    // contexts — attribution capture is a nice-to-have, never worth
    // breaking the page over.
  }
}

/** Validates an untrusted `attribution` payload from a direct POST to
 * /api/lead (a normal submit sends whatever getStoredAttribution() had, but
 * nothing stops a direct request from sending anything) — picks only the
 * known keys, keeps only string values, and re-applies the same length
 * ceiling capture applies client-side. Never throws; anything malformed is
 * simply dropped rather than rejecting the whole lead over it. */
export function sanitizeAttribution(input: unknown): Attribution {
  if (typeof input !== "object" || input === null) return {};
  const record = input as Record<string, unknown>;
  const result: Attribution = {};
  for (const key of ATTRIBUTION_PARAMS) {
    const value = record[key];
    if (typeof value === "string" && value.length > 0) {
      result[key] = value.slice(0, MAX_VALUE_LENGTH);
    }
  }
  return result;
}

export function getStoredAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed as Attribution;
  } catch {
    return {};
  }
}
