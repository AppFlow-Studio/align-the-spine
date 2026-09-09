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
 * Scope: originally the same 9 routes ATS-SEO-135 built for Portuguese —
 * the ones published in both English and Spanish: home, car-accident hub,
 * services hub, about, reviews, contact, book-an-appointment, conditions
 * hub, service-areas hub. Extended to include the seven condition pages and
 * four service pages mirroring Spanish/Portuguese's own `status: "draft"`
 * set (ATS-SEO-070 follow-up), now that real Haitian Creole content exists
 * for them — see content/ht/conditions.ts and content/ht/services-pages.ts.
 * The 19 service-area city pages remain deliberately NOT built here — see
 * docs/multilingual-seo-baseline.md's page-family strategy.
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
      "Owns 'sèvis kiwopratik Deerfield Beach' hub intent in Haitian Creole, and now links onward to the four real (draft) Haitian Creole service pages under it.",
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
      "Owns the conditions-directory intent in Haitian Creole, and now links onward to the seven real (draft) Haitian Creole condition pages under it.",
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
  // ── Condition pages ──────────────────────────────────────────────────
  // All seven are `status: "draft"`, mirroring their English/Spanish/
  // Portuguese originals: real, finished pages awaiting clinician review of
  // their medical content. Served noindex and kept out of the sitemap, but
  // reachable and linkable from the Haitian Creole nav.
  {
    path: "/ht/kondisyon-nou-trete/doule-do",
    title: `Kiwopratè pou Doulè Do nan Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Evalyasyon kiwopratik pou doulè nan pati anba do a, rèd, ak doulè ki ka gaye nan ranch la oswa janm nan, ki gen ladan sentòm apre yon aksidan machin.",
    image: {
      src: "/figma-exports/drabe-backpain-front.png",
      alt: "Tretman manyèl tisi mou nan pati anba do a",
    },
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Haitian Creole-language back pain condition intent",
    justification:
      "Owns 'doulè do kiwopratè Deerfield Beach'. Distinct from the sciatica page, which owns radiating leg pain. Draft until the English original clears clinician review.",
  },
  {
    path: "/ht/kondisyon-nou-trete/doule-kou",
    title: `Kiwopratè pou Doulè Kou nan Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Evalyasyon kiwopratik pou doulè kou, rèd, ak mobilite limite, ki gen ladan doulè ki kòmanse apre yon aksidan machin oswa yon antòs kou.",
    image: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "Dr. Abe Nasser ap evalye kou yon pasyan",
    },
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Haitian Creole-language neck pain condition intent",
    justification:
      "Owns 'doulè kou kiwopratè Deerfield Beach'. Distinct from the whiplash page, which owns the collision-injury framing. Draft until the English original clears review.",
  },
  {
    path: "/ht/kondisyon-nou-trete/syatik",
    title: `Kiwopratè pou Syatik nan Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Evalyasyon ak tretman ki fokis sou dekonpresyon pou doulè syatik ak doulè nève ki gaye, ak vizit lakay lè sa apwopriye pou ka ou a.",
    image: {
      src: "/figma-exports/drabe-backpain-front.png",
      alt: "Dr. Abe ap evalye yon pasyan pou syatik",
    },
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Haitian Creole-language sciatica condition intent",
    justification:
      "Owns 'syatik kiwopratè Deerfield Beach' — radiating nerve pain, distinct from the back-pain page's localized intent. Draft until the English original clears review.",
  },
  {
    path: "/ht/kondisyon-nou-trete/antos-kou",
    title: `Kiwopratè pou Antòs Kou nan Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Antòs kou se yon blesi nan kou ki koze pa yon mouvman sibitman, komen nan kolizyon dèyè. Evalyasyon rèd, mobilite limite, ak tèt fè mal.",
    image: {
      src: "/figma-exports/drabe-whiplash-man.png",
      alt: "Dr. Abe ap trete yon pasyan pou antòs kou",
    },
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Haitian Creole-language whiplash condition intent",
    justification:
      "Owns 'antòs kou kiwopratè' collision-injury intent, distinct from the general neck-pain page. Draft until the English original clears review.",
  },
  {
    path: "/ht/kondisyon-nou-trete/tet-fe-mal-sevikojenik",
    title: `Kiwopratè pou Tèt Fè Mal Sèvikojenik | Deerfield Beach | ${siteConfig.business.shortName}`,
    description:
      "Tèt fè mal sèvikojenik se yon doulè ki soti nan kou a. Evalyasyon mobilite sèvikal ak lòt faktè miskilo-eskeletik anvan yo rekòmande swen.",
    image: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Evalyasyon tansyon sèvikal ki gen rapò ak tèt fè mal",
    },
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Haitian Creole-language cervicogenic headache condition intent",
    justification:
      "Owns 'tèt fè mal ki soti nan kou' intent in Haitian Creole, distinct from both the neck-pain and concussion pages. Draft until the English original clears review.",
  },
  {
    path: "/ht/kondisyon-nou-trete/konmosyon-serebral",
    title: `Sentòm Konmosyon Serebral Apre yon Aksidan Machin | ${siteConfig.business.shortName}`,
    description:
      "Yon konmosyon serebral se yon blesi serebral tramatik lejè ki bezwen evalyasyon medikal. Swen kiwopratik pa ranplase yon evalyasyon ijans oswa nerolojik.",
    image: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Dr. Abe ap evalye yon pasyan apre yon aksidan",
    },
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Haitian Creole-language concussion-after-accident informational intent",
    justification:
      "Owns post-accident concussion symptom queries in Haitian Creole. Informational and safety-first by design — routes readers to medical evaluation rather than booking. Draft until the English original clears review.",
  },
  {
    path: "/ht/kondisyon-nou-trete/doule-machwa-atm",
    title: `Kiwopratè pou ATM ak Doulè Machwa | Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Evalyasyon mouvman jwenti machwa a, tansyon miskilè ozanviwon li, ak faktè sèvikal yo anvan yo deside si swen kiwopratik apwopriye.",
    image: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Dr. Abe ap evalye machwa yon pasyan",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Haitian Creole-language TMJ/jaw pain condition intent",
    justification:
      "Owns 'doulè machwa ATM' intent in Haitian Creole, distinct from the cervicogenic-headache page it commonly co-occurs with. Draft until the English original clears review.",
  },
  // ── Service pages ─────────────────────────────────────────────────────
  // All four are `status: "draft"`, mirroring their English/Spanish/
  // Portuguese originals: they carry clinical guidance that hasn't had a
  // clinician's sign-off, so they're served noindex and kept out of the
  // sitemap while remaining reachable (and linkable from the Haitian Creole
  // nav) by direct URL.
  {
    path: "/ht/sevis/ajisteman-kiwopratik",
    title: `Ajisteman Kiwopratik nan Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Ajisteman kiwopratik nan Deerfield Beach: presyon kontwole pou amelyore mouvman jwenti nan kou a, mitan do a, oswa pati anba do a, apre yon evalyasyon.",
    image: {
      src: "/figma-exports/adjustments-hero.png",
      alt: "Sal tretman ki prepare pou yon ajisteman kiwopratik",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Haitian Creole-language chiropractic adjustment treatment intent",
    justification:
      "Owns 'ajisteman kiwopratik Deerfield Beach' treatment intent in Haitian Creole. Draft until the English original clears clinician review; hreflang alternate of /services/chiropractic-adjustments.",
  },
  {
    path: "/ht/sevis/dekonpresyon-kolon",
    title: `Dekonpresyon Kolòn nan Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Dekonpresyon kolòn ki pa chirijikal nan Deerfield Beach: traksyon kontwole pou diminye presyon sou disk ak jwenti yo, lè evalyasyon an endike.",
    image: {
      src: "/figma-exports/spinal-decompression-hero.png",
      alt: "Sal tretman ki prepare pou terapi dekonpresyon kolòn",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Haitian Creole-language spinal decompression treatment intent",
    justification:
      "Owns 'dekonpresyon kolòn Deerfield Beach' intent in Haitian Creole, distinct from the adjustment page's. Draft until the English original clears clinician review.",
  },
  {
    path: "/ht/sevis/terapi-tisi-mou",
    title: `Masaj ak Terapi Tisi Mou | Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Terapi tisi mou nan Deerfield Beach: libète myofasyal, teknik Graston, ak tisi fon pou tansyon miskilè ak doulè apre yon blesi.",
    image: {
      src: "/figma-exports/massage-soft-tissue-hero.png",
      alt: "Sal tretman masaj ak terapi tisi mou",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Haitian Creole-language soft-tissue therapy treatment intent",
    justification:
      "Owns 'terapi tisi mou / masaj kiwopratik' intent in Haitian Creole. Draft until the English original clears clinician review.",
  },
  {
    path: "/ht/sevis/terapi-vantouz",
    title: `Terapi Vantouz nan Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Terapi vantouz nan Deerfield Beach: aspirasyon lokalize nan zòn tansyon miskilè seleksyone, itilize lè sa apwopriye ansanm ak yon evalyasyon kiwopratik.",
    image: { src: "/figma-exports/cupping-drabe.png", alt: "Sesyon terapi vantouz" },
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Haitian Creole-language cupping therapy treatment intent",
    justification:
      "Owns 'terapi vantouz Deerfield Beach' intent in Haitian Creole — a single technique, distinct from the broader soft-tissue page. Draft until the English original clears clinician review.",
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
