import type { NavLink } from "@/content/site";

/** Haitian Creole site chrome: navigation, footer, and the handful of UI
 * strings the shell renders directly (ATS-SEO-136).
 *
 * Deliberately simpler than content/es/chrome.ts's nav, matching
 * content/pt/chrome.ts's approach: Spanish has full mega-menus for
 * services/conditions/cities because those individual pages exist in
 * Spanish. None of that exists in Haitian Creole yet (ATS-SEO-136's scope
 * is the 9 published-parity pages only — see content/ht/seo.ts's header
 * comment), so the nav links straight to each hub instead of fabricating
 * dropdown destinations that don't exist. Every href here is a Haitian
 * Creole route registered in content/i18n.ts; content/i18n.test.ts asserts
 * that, so a nav link can't point at a Haitian Creole URL nothing serves.
 */
export const htNav: NavLink[] = [
  { label: "Sèvis", href: "/ht/sevis" },
  { label: "Kondisyon", href: "/ht/kondisyon-nou-trete" },
  { label: "Aksidan Machin", href: "/ht/kiwoprate-pou-aksidan-machin" },
  { label: "Sou Dr. Abe", href: "/ht/dr-abe-nasser" },
  { label: "Kòmantè", href: "/ht/komante-pasyan" },
  { label: "Zòn Nou Sèvi", href: "/ht/zon-nou-sevi" },
  { label: "Kontakte Nou", href: "/ht/kontakte-nou" },
];

/** "Mande Randevou", jamè "Rezève"/"Konfime": fòm nan voye yon demann e
 * biwo a rele tounen — li pa konfime yon lè li menm. Same non-promise
 * reasoning as the English "Request" CTA (ATS-E3 3.4) and the Spanish
 * "Solicitar Cita"/Portuguese "Solicitar Consulta". */
export const htBookingCta: NavLink = { label: "Mande Randevou", href: "/ht/mande-yon-randevou" };

export const htFooter = {
  tagline: "Swen kiwopratik nan Deerfield Beach, depi premye evalyasyon ou jiska rekiperasyon ou.",
  links: [
    { label: "Swen apre aksidan", href: "/ht/kiwoprate-pou-aksidan-machin" },
    { label: "Sou Dr. Abe", href: "/ht/dr-abe-nasser" },
    { label: "Kòmantè", href: "/ht/komante-pasyan" },
    { label: "Zòn nou sèvi", href: "/ht/zon-nou-sevi" },
  ] as NavLink[],
  copyrightName: "Align the Spine Chiropractic",
  /** /privacy-policy has no Haitian Creole version (a legal notice needs
   * counsel review, not a content translation — see content/i18n.ts, same
   * rule already applied to Spanish and Portuguese). The Haitian Creole
   * footer still links to it, marked `hrefLang="en"` so both the reader
   * and Google know they're crossing into English. */
  privacyPolicy: { label: "Règleman sou Konfidansyalite (an anglè)", href: "/privacy-policy" },
};

/** Chrome strings the shell renders outside of any content module. */
export const htChromeLabels = {
  skipToContent: "Ale dirèkteman nan kontni an",
  openMenu: "Ouvri meni",
  closeMenu: "Fèmen meni",
  viewAll: (label: string) => `Wè tout: ${label}`,
  callUs: "Rele nou jodi a",
  /** Haitian Creole labels for content/site.ts's verified stat chips. Only
   * the label is translated — the values are verified factual claims and
   * stay as approved (see getVerifiedStats). */
  stats: {
    Reviews: "Kòmantè",
    Visits: "Vizit",
    "When it applies": "Lè sa apwopriye",
    "Bilingual care": "Swen bileng",
    Insurance: "Asirans",
  } as Record<string, string>,
  statValues: {
    "Same-day": "Menm jou a",
    "Home visits": "Vizit lakay",
    "PIP accepted": "Nou aksepte PIP",
  } as Record<string, string>,
};
