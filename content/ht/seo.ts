import type { RouteMeta } from "@/content/seo";
import { siteConfig } from "@/content/site";

/** Haitian Creole route registry — the `/ht` mirror of content/es/seo.ts
 * and content/pt/seo.ts, built the same way (ATS-SEO-136, following the
 * shared architecture ATS-SEO-134 generalized).
 *
 * Same `RouteMeta` shape and the same rules: app/sitemap.ts maps over it,
 * and each HT page's `metadata` export pulls its entry by path via
 * getHtRoute() instead of re-declaring title/description, so the two can't
 * drift. content/i18n.test.ts asserts every path here is registered as the
 * `ht` half of a pair in content/i18n.ts (and vice versa).
 *
 * Scope (ATS-SEO-136): the same 9 routes ATS-SEO-135 built for
 * Portuguese — the ones actually published in both English and Spanish
 * today: home, car-accident hub, services hub, about, reviews, contact,
 * book-an-appointment, conditions hub, service-areas hub. The draft
 * condition/service pages and the 19 service-area city pages are
 * deliberately NOT built here — see docs/multilingual-seo-baseline.md's
 * page-family strategy.
 *
 * SEARCH-VOLUME EVIDENCE: all 6 Ahrefs seed terms for Haitian Creole
 * returned zero measurable volume/KD/CPC data — see
 * SEO_QA_EVIDENCE/ahrefs-2026-09/synthesis-part2-and-final-labels.md's "##
 * Haitian Creole (ht)" section, labeled "NEEDS MORE EVIDENCE — documented
 * tooling limitation, not a negative finding." Titles/descriptions below
 * are therefore written around plain, everyday Kreyòl Ayisyen terms a
 * patient would actually use ("kiwopratè", "aksidan machin", "doulè do"),
 * not an SEO-optimized keyword set — there is no keyword evidence to
 * optimize against yet. The demographic justification for this page set
 * (Census/ACS language-spoken-at-home data for Broward/Palm Beach County's
 * Haitian Creole-speaking population) is documented in that synthesis
 * doc, not search volume.
 *
 * "Kiwopratè" leads titles (not the French "chiropracteur") — the same
 * head-term reasoning as the Spanish "Quiropráctico" and Portuguese
 * "Quiroprático" (see content/es/seo.ts, content/pt/seo.ts).
 *
 * ATS-SEO-142: see SEO_QA_EVIDENCE/multilingual-keyword-map.md for the
 * consolidated locale/cluster/intent/target-page-family/funnel table —
 * every Haitian Creole row there is `NEEDS MORE EVIDENCE — documented
 * tooling limitation`, which is why these titles stay evidence-conservative
 * rather than guessing at an SEO-optimized phrasing no data supports.
 */
export const htRoutes: RouteMeta[] = [
  {
    path: "/ht",
    title: `Kiwopratè nan Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Swen kiwopratik nan Deerfield Beach pou doulè do, doulè kou, ak mobilite, ak evalyasyon fokis apre yon aksidan machin.",
    image: {
      src: "/figma-exports/interior-reception.png",
      alt: "Resepsyon Align the Spine nan Deerfield Beach",
    },
    changeFrequency: "weekly",
    priority: 1,
    lastModified: "2026-09-02",
    primaryQuery: "Haitian Creole-language Deerfield Beach general chiropractic intent",
    justification:
      "Owns broad 'kiwopratè Deerfield Beach' intent for Haitian Creole searchers. hreflang alternate of the English, Spanish, and Portuguese home pages — each owns its own language's version of the same intent.",
  },
  {
    path: "/ht/kiwoprate-pou-aksidan-machin",
    title: `Kiwopratè pou Aksidan Machin | Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Evalyasyon kiwopratik apre yon aksidan machin nan Deerfield Beach: doulè kou, doulè do, ak blesi kou. Lwa PIP Florid: 14 jou pou kòmanse tretman.",
    image: {
      src: "/figma-exports/interior-corridor.png",
      alt: "Koulwa resepsyon Align the Spine nan Deerfield Beach",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-09-02",
    primaryQuery: "Haitian Creole-language car-accident chiropractic intent",
    justification:
      "Owns the Haitian Creole accident cluster ('aksidan machin') on one URL and carries the PIP timing explainer. hreflang alternate of /car-accident-chiropractor, /es/quiropractico-accidentes-de-auto, and /pt/quiropratico-acidentes-de-carro.",
  },
  {
    path: "/ht/sevis",
    title: `Sèvis Kiwopratik nan Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Sèvis kiwopratik nan Deerfield Beach: ajisteman, dekonpresyon kolòn, ak terapi tisi mou ak Dr. Abe Nasser. Mande ki opsyon ki apwopriye pou ka ou a.",
    image: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "Dr. Abe Nasser ap evalye kou yon pasyan",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-09-02",
    primaryQuery: "Haitian Creole-language general-care services hub",
    justification:
      "Owns 'sèvis kiwopratik Deerfield Beach' hub intent in Haitian Creole. Individual service pages are not built yet (English/Spanish/Portuguese originals are still draft), so nothing under it competes with it.",
  },
  {
    path: "/ht/dr-abe-nasser",
    title: `Dr. Abe Nasser, Kiwopratè nan Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Fè konesans ak Dr. Abe Nasser, kiwopratè Align the Spine Chiropractic nan Deerfield Beach, ak fason li apwoche swen santre sou pasyan.",
    image: {
      src: "/figma-exports/portrait.png",
      alt: "Pòtrè Dr. Abe Nasser",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-09-02",
    primaryQuery: "Haitian Creole-language doctor-entity query",
    justification:
      "Owns the doctor-entity query in Haitian Creole, same Person @id as the English/Spanish/Portuguese pages (one person, four languages, not four people).",
  },
  {
    path: "/ht/komante-pasyan",
    title: `Kòmantè Pasyan yo | Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description: "Kòmantè reyèl pasyan Align the Spine Chiropractic nan Deerfield Beach, FL.",
    image: {
      src: "/figma-exports/interior-table.png",
      alt: "Sal tretman Align the Spine Chiropractic",
    },
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: "2026-09-02",
    primaryQuery: "Haitian Creole-language Align the Spine patient reviews",
    justification:
      "Owns the trust/validation query in Haitian Creole. Reviews themselves stay in their original language (not translated — a rewritten review presented as the patient's own words would be a fabricated review), matching the Spanish/Portuguese pages' exact policy.",
  },
  {
    path: "/ht/kontakte-nou",
    title: `Kontakte Nou | ${siteConfig.business.shortName} | Deerfield Beach, FL`,
    description: `Kontakte Align the Spine Chiropractic nan 811 SE 8th Ave, Suite 101, Deerfield Beach, FL, oswa rele ${siteConfig.business.phone}.`,
    image: {
      src: "/figma-exports/exterior-img.png",
      alt: "Fasad deyò bilding biwo a nan Deerfield Beach",
    },
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: "2026-09-02",
    primaryQuery: "Haitian Creole-language contact / location / hours",
    justification:
      "Owns the local-entity/NAP query in Haitian Creole — the canonical location block for this language lives here.",
  },
  {
    path: "/ht/mande-yon-randevou",
    // ATS-E3 (3.4)/ES/PT precedent: "Mande", jamè "Rezève"/"Konfime" — biwo
    // a rele tounen pou konfime yon lè; fòm sa a pa konfime youn li menm.
    title: `Mande Randevou ak yon Kiwopratè | Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Mande yon randevou ak Dr. Abe nan Deerfield Beach. Voye enfòmasyon ou epi nou rele ou tounen pou konfime lè a; se pa yon rezèvasyon otomatik.",
    image: {
      src: "/figma-exports/phone-mockup.png",
      alt: "Pasyan k ap rele Align the Spine pou mande yon randevou",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-09-02",
    primaryQuery: "Haitian Creole-language appointment-request conversion action",
    justification:
      "Owns the Haitian Creole booking-form action itself, not a topical query — the CTA target every Haitian Creole page links to.",
  },
  {
    path: "/ht/kondisyon-nou-trete",
    title: `Kondisyon Nou Trete | Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Aprann sou kondisyon Align the Spine Chiropractic evalye nan Deerfield Beach, ki gen ladan doulè do, doulè kou, ak doulè apre aksidan machin.",
    image: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Dr. Abe Nasser ap evalye yon pasyan",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-09-02",
    primaryQuery: "Haitian Creole-language conditions overview hub",
    justification:
      "Owns the conditions-directory intent in Haitian Creole. Individual condition pages are not built yet (English/Spanish/Portuguese originals still draft), so this hub currently links onward primarily to the accident and services pages instead.",
  },
  {
    path: "/ht/zon-nou-sevi",
    title: `Zòn Nou Sèvi Toupre Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Align the Spine Chiropractic gen yon sèl biwo verifye nan Deerfield Beach, FL. Gade kijan vizit lakay mache pou kominote ki tou pre.",
    image: {
      src: "/figma-exports/exterior-img.png",
      alt: "Fasad deyò bilding biwo a nan Deerfield Beach",
    },
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: "2026-09-02",
    primaryQuery: "Haitian Creole-language nearby-city service-area coverage index",
    justification:
      "Owns the service-area-coverage query in Haitian Creole, states the one-office truth plainly. No individual HT city pages exist yet — see this file's header comment.",
  },
];

/** Haitian Creole counterpart of content/seo.ts's getRoute() — throws on an
 * unregistered path so an HT page that forgets to register itself fails
 * the build instead of shipping without a canonical. */
export function getHtRoute(path: string): RouteMeta {
  const route = htRoutes.find((entry) => entry.path === path);
  if (!route) throw new Error(`content/ht/seo.ts: no route registered for path "${path}"`);
  return route;
}
