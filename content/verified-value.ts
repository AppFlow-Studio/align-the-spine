/** ATS-E4 (4.1): every unverified/placeholder business claim in the site
 * (hours, review counts, ratings, bilingual care, same-day availability,
 * insurance/PIP billing language, pricing) must route through this type
 * instead of being asserted as a plain string/number. A claim renders only
 * when `status === 'verified'` AND `value` is non-null — everything
 * defaults to `needs-confirmation` with `value: null` until the client
 * signs off (see content/site.ts, content/doctor-profile.ts,
 * content/why-choose.ts, content/testimonials.ts). */
export type VerificationStatus = "verified" | "needs-confirmation";

export interface VerifiedValue<T> {
  value: T | null;
  status: VerificationStatus;
  /** Who/what confirmed this (e.g. "Client email 2026-08-10", "Google
   * Business Profile"). Required in practice once status is "verified". */
  source?: string;
  /** ISO date the value was last confirmed accurate. */
  lastVerified?: string;
}

/** Convenience constructor for the default, unapproved state. */
export function unverified<T>(): VerifiedValue<T> {
  return { value: null, status: "needs-confirmation" };
}

/** Convenience constructor for an approved claim. */
export function verified<T>(value: T, source: string, lastVerified: string): VerifiedValue<T> {
  return { value, status: "verified", source, lastVerified };
}

/** Type guard + the only correct way to decide whether a VerifiedValue may
 * render: narrows `value` to non-null when true. */
export function isVerified<T>(
  claim: VerifiedValue<T>,
): claim is VerifiedValue<T> & { value: T; status: "verified" } {
  return claim.status === "verified" && claim.value !== null;
}
