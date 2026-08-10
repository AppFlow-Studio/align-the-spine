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
