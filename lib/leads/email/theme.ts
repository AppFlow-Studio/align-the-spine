/**
 * Email-safe brand tokens. Hard-coded hex (not CSS vars) because email
 * clients don't resolve custom properties — values copied directly from
 * app/globals.css's :root, not approximated. Verify against that file if
 * the brand palette ever changes.
 */
import { siteConfig } from "@/content/site";

export const brand = {
  navy900: "#253067",
  navy800: "#2b3565",
  navy700: "#374690",
  teal500: "#3f7676",
  teal300: "#7fc0c0",
  gold400: "#fbbf24",
  ink900: "#1a1a1a",
  ink500: "#6b6b6b",
  mute400: "#6a6f71",
  mute300: "#cdcdcd",
  panel100: "#f6f6f6",
  border: "#e4e4e7",
  white: "#ffffff",
  // Serif display face with a universally-available fallback chain — web
  // fonts (Fraunces) don't load in email clients.
  displayFont: "Georgia, 'Times New Roman', serif",
  sansFont: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif",
} as const;

export const practice = {
  name: siteConfig.business.name,
  shortName: siteConfig.business.shortName,
  phoneDisplay: siteConfig.business.phone,
  phoneHref: siteConfig.business.phoneHref,
  addressLine1: `${siteConfig.business.address.line1}, ${siteConfig.business.address.suite}`,
  addressLine2: `${siteConfig.business.address.city}, ${siteConfig.business.address.state} ${siteConfig.business.address.zip}`,
  /** Same photo the site's own hero sections use (blog-hero.tsx,
   * service-area-hero.tsx) — a real, already-live Bunny CDN URL, not a
   * `public/` asset. `siteConfig.siteUrl`-relative assets (e.g. the local
   * logo PNGs) are NOT usable here: nothing under this repo's public/ is
   * deployed anywhere publicly yet, so a relative-to-siteUrl path 404s for
   * every real recipient. If a logo file gets uploaded to the Bunny CDN,
   * swap this header to an <img> the same way; until then a text wordmark
   * over this photo is the only reliably-rendering option.
   */
  heroImageUrl:
    "https://align-the-spine.b-cdn.net/images/WhatsApp%20Image%202026-08-17%20at%2017.38.56%20(1).jpeg",
  /** White-on-transparent circular seal logo, hosted on the same Bunny CDN
   * pull zone the site's real content images already use — pairs with the
   * navy hero header. */
  logoUrl: "https://align-the-spine.b-cdn.net/images/logo_blue.png",
} as const;
