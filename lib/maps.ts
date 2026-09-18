import { siteConfig } from "@/content/site";

/** Google Maps embed URL for the business address — shared by
 * LocationFooter's full map and NavbarDropdown's small preview map so
 * both stay in sync with siteConfig.business.address. */
/** Builds the Google Maps embed URL for the practice address (ATS-013). Uses
 * the keyless `?q=<address>&output=embed` form — no Maps API key, no new
 * dependency — shared by LocationFooter and the navbar mega-menu map tile. */
export function buildMapEmbedSrc(): string {
  const { line1, suite, city, state, zip } = siteConfig.business.address;
  const fullAddress = `${line1} ${suite}, ${city}, ${state} ${zip}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;
}

/** Turn-by-turn "Get Directions" link to the practice address (LOCAL-01) —
 * Google's keyless Directions URL scheme (no Maps API key, same
 * no-new-dependency approach as buildMapEmbedSrc), opens in the visitor's
 * own Maps app on mobile or Google Maps in a new tab on desktop. Distinct
 * from buildMapEmbedSrc(): that one is an inline, non-interactive preview
 * iframe; this is a real outbound link a patient in pain or arriving after
 * an accident can tap to actually navigate there. */
export function buildDirectionsUrl(): string {
  const { line1, suite, city, state, zip } = siteConfig.business.address;
  const fullAddress = `${line1} ${suite}, ${city}, ${state} ${zip}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
}
