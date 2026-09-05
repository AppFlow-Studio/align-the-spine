import type { HowWeHelpStep } from "@/components/sections/how-we-help-steps";
import type { ComparisonRow } from "@/content/comparison-table";
import type { ConditionAccident, ConditionFaqItem } from "@/content/conditions/types";
import { siteConfig } from "@/content/site";
import { verified, type VerifiedValue } from "@/content/verified-value";

/** Haitian Creole content for /ht/kiwoprate-pou-aksidan-machin (ATS-SEO-136)
 * — the Haitian Creole site's primary acquisition page.
 *
 * SEARCH-VOLUME EVIDENCE: all 6 Ahrefs seed terms for Haitian Creole
 * returned zero measurable volume/KD/CPC data (see
 * SEO_QA_EVIDENCE/ahrefs-2026-09/synthesis-part2-and-final-labels.md's "##
 * Haitian Creole (ht)" section — labeled "NEEDS MORE EVIDENCE — documented
 * tooling limitation, not a negative finding"). This page is written
 * conservatively around plain, everyday Kreyòl Ayisyen terms rather than
 * SEO-optimized keyword targeting, since there is no keyword evidence to
 * optimize against yet. South Florida's Haitian Creole-speaking population
 * (Census/ACS language-spoken-at-home data for Broward/Palm Beach County)
 * is the demographic justification for this page's existence, per that
 * synthesis doc's recommendation — not search volume.
 *
 * ── Legal accuracy ──────────────────────────────────────────────────────
 * Every statement about Florida PIP below is the same claim, in Haitian
 * Creole, that content/es/auto-accident.ts and content/pt/auto-accident.ts
 * make in Spanish and Portuguese — checked against Fla. Stat. § 627.736 as
 * of August 2026 (see content/es/auto-accident.ts's header comment for the
 * full citation trail). Nothing here tells a reader what their coverage is
 * or what they're entitled to; those are questions for their insurance
 * company or a licensed attorney, and every block that touches them says
 * so. PIP stays untranslated — a Florida legal term, not a concept with a
 * natural Kreyòl name.
 */

export const htAutoAccidentHero = {
  eyebrowChip: "SWEN KIWOPRATIK APRE YON AKSIDAN",
  titleLines: ["Ou blese nan", "yon aksidan?"] as const,
  subhead:
    "Dr. Abe fè evalyasyon kiwopratik nan Deerfield Beach pou doulè kou, doulè do, rèd, ak sentòm blesi kou apre yon aksidan machin, e li dokimante rezilta yo pou reklamasyon asirans PIP ou lè sa apwopriye.",
  /** Must appear verbatim in `subhead` — the page splits on it. */
  pipLinkPhrase: "asirans PIP",
  callPillEyebrow: "Ann pale jodi a",
  form: {
    heading: "Mande evalyasyon aksidan ou",
    footerNote:
      "Vin wè nou nan Deerfield Beach, oswa rele pou mande si yon vizit lakay ka apwopriye pou ka ou a ak kote ou ye a.",
  },
};

/** Same client-approved PIP stat the English/Spanish/Portuguese heroes
 * show (content/conditions/auto-accident.ts's `flags.pipStat`) — same
 * verification source and date, because it is the same approved claim in
 * another language, not a new one. */
export const htPipStat: VerifiedValue<{ value: string; description: string }> = verified(
  {
    value: "$10,000",
    description:
      "nan kouvèti PIP disponib si gen yon detèminasyon kondisyon medikal ijans — $2,500 san li",
  },
  "Client-provided design mockup (same approved stat as the English page)",
  "2026-09-02",
);

export const htAutoAccidentAccident: ConditionAccident = {
  headline: "Lwa PIP nan Florid egzije ou kòmanse tretman nan 14 jou",
  body: "Nan Florid, asirans PIP la jeneralman egzije tretman inisyal la kòmanse nan 14 jou apre aksidan an. Elijibilite, ranbousman, ak limit benefis yo depann de kontra asirans ou ak sikonstans ka ou a.",
  smallprint:
    "Kouvèti ak peman depann de kontra asirans ou, elijibilite ou, nesesite medikal, ak sikonstans reklamasyon ou an. Paj sa a se enfòmasyon jeneral, li pa konsèy legal ni yon pwomès kouvèti.",
};

export interface HtAnswerBlock {
  heading: string;
  answer: string;
  detail: string;
}

/** Answer-first blocks covering the questions that fan out from "kiwopratè
 * apre yon aksidan machin". Each stands alone. */
export const htAutoAccidentAnswers: HtAnswerBlock[] = [
  {
    heading: "Kisa mwen dwe fè si mwen gen doulè apre yon aksidan machin?",
    answer:
      "Si ou gen sentòm grav — doulè fò, difikilte pou respire, konfizyon, angoudi, oswa febles — chèche swen ijans anvan, pa yon randevou kiwopratik.",
    detail:
      "Pou doulè miskilè ki pa yon ijans, tankou kou rèd, doulè do, oswa tèt fè mal ki parèt yon jou oswa de jou apre chòk la, yon evalyasyon bonè pèmèt nou dokimante sa nou jwenn epi detèmine si tretman kiwopratik apwopriye pou ka ou a oswa si li ta pi bon pou refere ou bay yon lòt pwofesyonèl.",
  },
  {
    heading: "Kilè mwen dwe wè yon kiwopratè apre yon aksidan?",
    answer:
      "Pi bonè ou fè yon evalyasyon, pi byen ka a dokimante — e nan Florid, asirans PIP jeneralman egzije tretman inisyal la kòmanse nan 14 jou apre aksidan an.",
    detail:
      "Ou pa bezwen tann doulè a vin pi mal. Kèk doulè nan tisi mou ka pran plizyè èdtan oswa plizyè jou pou parèt, kidonk santi ou byen menm jou aksidan an pa vle di pa gen anyen pou evalye. Si 14 jou yo deja pase, ou ka toujou resevwa swen — sa ki chanje se fason konpayi asirans ou trete reklamasyon an, epi sa ou dwe diskite ak yo oswa ak yon avoka.",
  },
  {
    heading: "Kisa k ap pase nan premye vizit la?",
    answer:
      "Nou pale sou sa ki te pase, nou revize sentòm ou yo, epi nou fè yon egzamen fizik ki fokis sou kou, do, ak zòn kote ou gen doulè.",
    detail:
      "Apati egzamen sa a, Dr. Abe eksplike ou sa li jwenn, epi si tretman kiwopratik apwopriye pou ka ou a, si li ta pi bon pou refere ou bay yon lòt pwofesyonèl, oswa toude. Rezilta ki gen rapò ak aksidan an dokimante. Se Dr. Abe menm ki wè ou, epi se li menm ki reponn telefòn biwo a.",
  },
  {
    heading: "Konbyen asirans PIP kouvri nan Florid?",
    answer:
      "Selon lwa Florid, PIP kouvri 80% depans medikal rezonab yo nan yon limit konbine $10,000 — men limit sa a desann a $2,500 si pa gen yon detèminasyon kondisyon medikal ijans.",
    detail:
      "Se sèlman yon doktè (MD oswa DO), yon dantis, yon asistan medikal, oswa yon enfimyè anrejistre avanse ki ka fè detèminasyon sa a. Yon kiwopratè pa otorize pa lwa Florid pou fè li. Se poutèt sa nou pa pwomèt yon chif: sa kontra asirans ou kouvri depann de ka ou a, kouvèti ou, ak detèminasyon sa a. Kontakte konpayi asirans ou oswa yon avoka ki gen lisans pou sitiyasyon espesifik ou a.",
  },
  {
    heading: "Èske mwen bezwen yon rapò lapolis oswa yon avoka pou nou wè m?",
    answer: "Non. Ou ka vini sèlman ak enfòmasyon asirans ou.",
    detail:
      "Si ou deja gen yon rapò lapolis, yon avoka, oswa yon ajisteur asirans, nou ka kowòdone dokiman yo dirèkteman ak yo pou plan tretman ou ak dosye ou yo pare lè yo bezwen yo. Nou pa refere pasyan bay avoka ni nou pa resevwa referans an echanj.",
  },
  {
    heading: "Doulè kou ak do apre aksidan an",
    answer:
      "Doulè kou ak ba do se doulè ki pi frekan apre yon kolizyon, sitou nan aksidan yon machin frape ou pa dèyè.",
    detail:
      "Fòs sanzatann lan ka foul misk ak ligaman, irite atikilasyon yo, e nan kèk ka, afekte disk yo. Lè doulè a rayone nan yon bra oswa yon janm, oswa li vin ak angoudi oswa pikotman, se yon rezilta ki bezwen evalye vit e ki ka mande egzamen imaj oswa yon referans medikal.",
  },
];

export const htAutoAccidentRedFlags = {
  heading: "Kilè pou chèche swen ijans, pa yon randevou",
  intro: "Rele 911 oswa ale nan yon sal ijans si, apre aksidan an, ou gen nenpòt nan siy sa yo:",
  items: [
    "Angoudi, pikotman, oswa febles nan bra oswa janm",
    "Tèt fè mal fò, tèt vire, vomisman, oswa konfizyon",
    "Pèt konesans, menm si li kout",
    "Doulè nan pwatrin oswa nan vant, oswa difikilte pou respire",
    "Doulè ki vin pi mal rapid olye li amelyore",
  ],
  footnote:
    "Align the Spine se pa yon sèvis ijans e li pa fè dyagnostik sou entènèt. Paj sa a se enfòmasyon jeneral e li pa ranplase evalyasyon yon pwofesyonèl sante.",
};

/** "Kijan nou ede" steps — Haitian Creole rendering of
 * content/auto-accident.ts's autoAccidentSteps, same three images. */
export const htAutoAccidentSteps: HowWeHelpStep[] = [
  {
    image: "/figma-exports/home-visits-step-call.png",
    alt: "Telefòn k ap montre yon apèl k ap antre",
    title: "Rele oswa mande sou entènèt",
    description: "Rakonte nou sa ki te pase. Pa gen sant apèl, pa gen mizik datant.",
  },
  {
    image: "/figma-exports/home-visits-step-eligibility.png",
    alt: "Planchèt ak yon fòm evalyasyon",
    title: "Evalyasyon konplè",
    description:
      "Yon egzamen konplè ak dokiman reklamasyon ou an vrèman bezwen — nan biwo a oswa lakay ou.",
  },
  {
    image: "/figma-exports/home-visits-step-visit.png",
    alt: "Kaye ak plim pare pou yon plan tretman",
    title: "Yon plan swen dokimante",
    description:
      "Swen an baze sou evalyasyon ou an, e rezilta ki gen rapò ak aksidan an dokimante pou reklamasyon ou an.",
  },
];

export const htAutoAccidentStepsHeading = "Soti nan apèl la pou santi w tounen ou menm ankò";

export const htAutoAccidentCoordinationQuote =
  "Lè ka ou a enplike yon avoka oswa yon ajisteur asirans, nou kowòdone dirèkteman ak yo — pou plan tretman ou ak dokiman ou yo pare lè yo bezwen yo.";

export const htAutoAccidentFaq: ConditionFaqItem[] = [
  {
    q: "Mwen santi m byen — èske m vrèman bezwen yon evalyasyon?",
    a: "Kèk sentòm ki gen rapò ak yon aksidan parèt pita. Si ou gen sentòm grav oswa ki vin pi mal, chèche swen medikal touswit; sinon, yon evalyasyon bonè pèmèt dokimante doulè a e detèmine si tretman oswa yon referans apwopriye.",
  },
  {
    q: "Èske sa pral koute m nan pòch mwen?",
    a: "Sa depann de kouvèti ou ak detay ka ou a. Rele nou epi nou eksplike ou sa pou tann anvan premye vizit ou. Nou pa ka garanti asirans ou ap peye ni di ou konbyen li pral kouvri.",
  },
  {
    q: "Kisa k ap pase si 14 jou yo deja pase?",
    a: "Ou ka toujou chèche swen medikal ki apwopriye, men nan Florid peman PIP jeneralman depann de si ou te resevwa tretman inisyal la nan 14 jou yo. Mande konpayi asirans ou oswa yon pwofesyonèl legal kalifye sou kouvèti espesifik ou a.",
  },
  {
    // NEEDS LINGUISTIC/FACTUAL REVIEW: content/site.ts's `bilingualCare` is
    // verified for English/Spanish only (2026-08-11), not Haitian Creole —
    // this answer deliberately does NOT assert Kreyòl-language service and
    // instead points the reader at the phone call itself, matching this
    // ticket's "preserve factual business data... do not propagate
    // disputed claims" rule.
    q: "Èske nou pale Kreyòl?",
    a: "Rele biwo a epi mande dirèkteman — ekip la konfime sou telefòn anvan vizit ou.",
  },
  {
    q: "Èske kiwopratè a ka detèmine si mwen te gen yon kondisyon medikal ijans?",
    a: "Non. Selon lwa Florid, se sèlman yon doktè (MD oswa DO), yon dantis, yon asistan medikal, oswa yon enfimyè anrejistre avanse ki ka fè detèminasyon sa a. Se yon pwen enpòtan paske limit benefis PIP la depann de li.",
  },
  {
    q: "Èske mwen ka mande yon vizit lakay apre yon aksidan?",
    a: "Ou ka mande. Vizit lakay depann de ka ou a ak kote ou ye a, e nou konfime elijibilite lè ou rele — se pa yon sèvis garanti.",
  },
];

export const htAutoAccidentFaqHeading = {
  eyebrow: "Kesyon moun poze souvan",
  headingLead: "Tout sa ou bezwen konnen sou",
  headingTail: "blesi aksidan machin",
};

/** Haitian Creole comparison rows — same five rows the other languages'
 * auto-accident variant renders. "Priority Scheduling" is rendered as
 * "Orè priyoritè", not as a same-day promise: the approved claim in
 * content/site.ts is `sameDayAvailability: "Same-day"`, already carried by
 * the stat bar, and this row shouldn't quietly upgrade it. */
export const htComparisonCopy = {
  eyebrow: "Yon pi bon fason pou refè",
  heading: "Poukisa trennen kò w rive nan yon klinik lè w gen doulè?",
  subheading:
    "Dr. Abe Nasser bati plan an alantou rekiperasyon ou — ki gen ladan vizit lakay lè sa apwopriye.",
  columnHeadings: {
    careBenefits: "Benefis swen yo",
    alignTheSpine: "Align the Spine",
    traditionalClinic: "Klinik tradisyonèl",
  },
  footnote: "Vizit lakay ofri selon ka ou a ak kote ou ye a — nou konfime elijibilite lè ou rele.",
  rows: [
    {
      label: "Deplasman",
      alignTheSpine: "Vizit lakay, lè sa apwopriye",
      traditionalClinic: "Ou kondwi ak doulè",
    },
    {
      label: "Disponibilite",
      alignTheSpine: "Orè priyoritè",
      traditionalClinic: "Lis datant 2 a 3 semèn",
    },
    {
      label: "Konfò",
      alignTheSpine: "Pwòp sal pa ou",
      traditionalClinic: "Sal datant klinik",
    },
  ] as ComparisonRow[],
  autoAccidentRows: [
    {
      label: "Doktè ou",
      alignTheSpine: "Menm doktè a chak vizit",
      traditionalClinic: "Yon pwofesyonèl diferan chak fwa",
    },
    {
      label: "Referans avoka",
      alignTheSpine: "Pa gen referans ki nesesè",
      traditionalClinic: "Referans deyò obligatwa",
    },
  ] as ComparisonRow[],
};

/** The two navy CTA bands on the accident page. */
export const htAutoAccidentCtaBands = {
  ready: {
    heading: "Lè ou pare",
    body: "Mande yon evalyasyon nan biwo a, oswa mande si yon vizit lakay ka apwopriye pou ka ou a ak kote ou ye a.",
    cta: "Mande evalyasyon mwen",
  },
  call: {
    heading: "Ou gen kesyon toujou? Jis rele",
    body: "Se Dr. Abe ki reponn telefòn nan. Pa gen sant apèl, pa gen mizik datant.",
    eyebrow: "Ann pale jodi a",
    cta: `Rele ${siteConfig.business.phone}`,
  },
};
