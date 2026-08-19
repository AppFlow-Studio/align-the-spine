/**
 * Email-safe brand tokens, mirrored from app/globals.css (:root). Hard-coded
 * hex (not CSS vars) because email clients don't resolve custom properties, and
 * web fonts (Fraunces/Poppins) fall back to web-safe families that render
 * consistently across Gmail/Outlook/Apple Mail.
 */
export const brand = {
  navy900: "#253067",
  navy700: "#374690",
  teal500: "#3f7676",
  teal300: "#7fc0c0",
  gold400: "#fbbf24",
  ink900: "#1a1a1a",
  ink500: "#6b6b6b",
  mute400: "#6a6f71",
  panel100: "#f6f6f6",
  border: "#e4e4e7",
  white: "#ffffff",
  error: "#dc2626",
  // Serif display face with a universally-available fallback chain.
  displayFont: "Georgia, 'Times New Roman', serif",
  sansFont: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif",
} as const;

export const practice = {
  name: "Align the Spine Chiropractic",
  phoneDisplay: "(954) 573-7192",
  phoneHref: "tel:+19545737192",
  addressLine1: "811 Southeast 8th Avenue, Suite #101",
  addressLine2: "Deerfield Beach, FL 33441",
} as const;
