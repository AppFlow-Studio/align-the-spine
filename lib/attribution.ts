const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "gbraid",
  "wbraid",
  "dclid",
  "msclkid",
  "fbclid",
  "ttclid",
  "li_fat_id",
] as const;

const CONTEXT_KEYS = [
  "initialLandingPath",
  "latestLandingPath",
  "referrerHost",
  "fbc",
  "fbp",
  "gaClientId",
  "gaSessionId",
  "gaSessionNumber",
] as const;

type AttributionParam = (typeof ATTRIBUTION_PARAMS)[number];
type ContextKey = (typeof CONTEXT_KEYS)[number];
export type Attribution = Partial<Record<AttributionParam | ContextKey, string | number>>;

const STORAGE_KEY = "ats_attribution_v2";
const MAX_VALUE_LENGTH = 512;

function pathOnly(value: string) {
  try {
    const url = new URL(value, window.location.origin);
    return url.origin === window.location.origin ? url.pathname.slice(0, 512) || "/" : undefined;
  } catch {
    return undefined;
  }
}

function cookie(name: string) {
  const prefix = `${name}=`;
  return document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length, prefix.length + MAX_VALUE_LENGTH);
}

function gaContext(): Pick<Attribution, "gaClientId" | "gaSessionId" | "gaSessionNumber"> {
  const ga = cookie("_ga")?.split(".");
  const sessionCookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("_ga_") && !part.startsWith("_ga="))
    ?.split("=")[1]
    ?.split(".");
  return {
    ...(ga && ga.length >= 4 ? { gaClientId: `${ga.at(-2)}.${ga.at(-1)}` } : {}),
    ...(sessionCookie && sessionCookie.length >= 3
      ? {
          gaSessionId: sessionCookie[2],
          gaSessionNumber: Number.isFinite(Number(sessionCookie[3]))
            ? Number(sessionCookie[3])
            : undefined,
        }
      : {}),
  };
}

export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredAttribution();
    const params = new URLSearchParams(window.location.search);
    const currentPath = pathOnly(window.location.href) ?? "/";
    const found: Attribution = {
      ...existing,
      initialLandingPath: existing.initialLandingPath ?? currentPath,
      latestLandingPath: currentPath,
      ...(cookie("_fbc") ? { fbc: cookie("_fbc") } : {}),
      ...(cookie("_fbp") ? { fbp: cookie("_fbp") } : {}),
      ...gaContext(),
    };
    if (!existing.referrerHost && document.referrer) {
      try {
        found.referrerHost = new URL(document.referrer).hostname.slice(0, 255);
      } catch {
        // Invalid referrers are ignored; full referrer URLs are never retained.
      }
    }
    for (const key of ATTRIBUTION_PARAMS) {
      const value = params.get(key);
      if (value) found[key] = value.slice(0, MAX_VALUE_LENGTH);
    }
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  } catch {
    // Attribution is optional and must never break navigation or forms.
  }
}

export function sanitizeAttribution(input: unknown): Attribution {
  if (typeof input !== "object" || input === null) return {};
  const record = input as Record<string, unknown>;
  const result: Attribution = {};
  for (const key of [...ATTRIBUTION_PARAMS, ...CONTEXT_KEYS]) {
    const value = record[key];
    if (key === "gaSessionNumber") {
      if (typeof value === "number" && Number.isInteger(value) && value >= 0) result[key] = value;
      continue;
    }
    if (typeof value !== "string" || !value) continue;
    if ((key === "initialLandingPath" || key === "latestLandingPath") && !/^\/[^?#]*$/.test(value))
      continue;
    result[key] = value.slice(0, MAX_VALUE_LENGTH);
  }
  return result;
}

export function getStoredAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeAttribution(JSON.parse(raw)) : {};
  } catch {
    return {};
  }
}
