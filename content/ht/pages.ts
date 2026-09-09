import type { ReactNode } from "react";

import type { ServiceCardItem } from "@/components/ui/service-card";
import type { DoctorHistoryContent, DoctorProfileContent } from "@/content/doctor-profile";
import type { PracticeCard } from "@/content/how-he-practices";
import { siteConfig } from "@/content/site";
import { mapVerified } from "@/content/verified-value";

/** Haitian Creole copy for /ht/sevis, /ht/dr-abe-nasser, /ht/komante-pasyan,
 * /ht/kontakte-nou and /ht/mande-yon-randevou (ATS-SEO-136).
 *
 * Same claim discipline as everywhere else in this codebase: no credential,
 * price, statistic, or outcome appears here that isn't already verified on
 * the English side.
 *
 *   - The doctor's degree, school, license and years of practice are still
 *     `doctorCredentials.verified: false` (content/doctor-profile.ts), so
 *     the Kreyòl bio describes what he does and who he treats, and claims
 *     no qualification beyond "kiwopratè" — the same job title the site
 *     already publishes in plain copy everywhere.
 *   - New-patient pricing is generalized rather than stated as a figure,
 *     matching how content/doctor-profile.ts handles the same sentence.
 *   - No Kreyòl-language staff claim is made anywhere here —
 *     content/site.ts's `bilingualCare` verifies English/Spanish only
 *     (2026-08-11), not Haitian Creole.
 */

// ─────────────────────────────────────────────────────────── shared sections

/** Homepage/contact "Contact us" band, rendered by ContactSection. */
export const htContactSectionCopy: {
  heading: string;
  body: ReactNode;
  lockupSubtitle: string;
} = {
  heading: "Kontakte nou",
  body: "Ou blese oswa ou gen yon kesyon senpleman? Ekri nou nenpòt lè — nou reponn vit, pa gen sant apèl.",
  lockupSubtitle: "Chiropractic and Wellness Center",
};

/** Haitian Creole DoctorProfile block, shared by the Haitian Creole home,
 * services, accident and doctor pages. The rating is derived from the
 * same siteConfig.reviewsRating source every other language derives from —
 * one verified number, four languages, no second assertion. */
export const htDoctorProfileContent: DoctorProfileContent = {
  eyebrow: "DOKTÈ KI DÈYÈ SWEN OU A",
  name: "Dr. Abe Nasser",
  bio: "Dr. Abe Nasser se kiwopratè Align the Spine Chiropractic nan Deerfield Beach. Li deja swen pasyan nan konte Broward ak Palm Beach, ki gen ladan atlèt, granmoun aje, ak moun k ap refè apre operasyon oswa ki gen bezwen ki gen rapò ak gwosès.",
  cta: { label: "Mande randevou ak Dr. Abe", href: "/ht/mande-yon-randevou" },
  rating: mapVerified(siteConfig.reviewsRating, (r) => ({
    value: r.rating,
    count: r.count,
    location: "Deerfield Beach, Florida",
  })),
  portrait: { src: "/figma-exports/portrait.png", alt: "Dr. Abe Nasser" },
};

// ──────────────────────────────────────────────────────────────── /ht/sevis

export const htServicesPage = {
  hero: {
    eyebrow: "Chak tretman detèmine selon evalyasyon ou",
    titleLines: ["Sèvis kiwopratik", "nan Deerfield Beach, FL"] as const,
    subhead:
      "Depi ajisteman regilye jiska swen rekiperasyon espesyalize — menm doktè a chak vizit, nan biwo a oswa lakay ou lè sa apwopriye.",
    callPillEyebrow: "Ann pale jodi a",
    form: {
      heading: "Mande evalyasyon ou",
      footerNote:
        "Nou sèvi Deerfield Beach. Rele pou mande si yon vizit lakay ka apwopriye pou ka ou a ak kote ou ye a.",
    },
  },
  catalog: {
    eyebrow: "Sèvis nou yo",
    heading: "Swen konplè, adapte pou ka ou a",
  },
  breadcrumb: "Sèvis",
};

/** Haitian Creole rendering of content/services-grid.ts. `href`/`ctaLabel`
 * are deliberately absent on every card except the one that links to the
 * published Haitian Creole accident page — same reasoning as
 * content/es/pages.ts's esServicesGrid and content/pt/pages.ts's
 * ptServicesGrid: the other cards' English/Spanish/Portuguese originals are
 * `status: "draft"` and have no Haitian Creole page to link to yet. */
export const htServicesGrid: ServiceCardItem[] = [
  {
    slug: "adjustments",
    name: "Ajisteman kiwopratik",
    duration: "",
    summary:
      "Ajisteman manyèl ak presyon kontwole pou amelyore mouvman atikilasyon nan kou, mitan do, oswa ba do a, lè sa apwopriye.",
    image: {
      src: "/figma-exports/drabeadjust.png",
      alt: "Dr. Abe ap fè yon ajisteman kiwopratik",
    },
    // ATS-SEO-070 follow-up: this card's own page now exists in Haitian Creole.
    href: "/ht/sevis/ajisteman-kiwopratik",
    ctaLabel: "Aprann plis",
  },
  {
    slug: "sports-injury",
    name: "Blesi espòtif",
    duration: "",
    summary:
      "Evalyasyon ak tretman manyèl pou foul, antòch, ak blesi twòp itilizasyon, ak yon plan ki fèt pou fè ou tounen nan espò ou.",
    image: {
      src: "/figma-exports/abe-back-turn.png",
      alt: "Evalyasyon ak tretman yon blesi espòtif",
    },
  },
  {
    slug: "posture-corrective",
    name: "Pòs ak koreksyon",
    duration: "",
    summary:
      "Evalyasyon ak swen kiwopratik pou tansyon pòs ki akimile ak travay chita, kondwi, oswa mouvman repetitif.",
    image: {
      src: "/figma-exports/drabe-spine.png",
      alt: "Swen pòs ak koreksyon kolòn",
    },
  },
  {
    slug: "spinal-decompression",
    name: "Dekonpresyon kolòn",
    duration: "",
    summary:
      "Dekonpresyon kolòn pa traksyon kontwole pou doulè disk, atikilasyon, ak doulè nè ki chwazi, apre yon evalyasyon konplè.",
    image: {
      src: "/figma-exports/drabe-traction_compression.png",
      alt: "Terapi traksyon ak dekonpresyon kolòn vètebral",
    },
    href: "/ht/sevis/dekonpresyon-kolon",
    ctaLabel: "Aprann plis",
  },
  {
    slug: "headache-migraine",
    name: "Tèt fè mal ak migrèn",
    duration: "",
    summary:
      "Evalyasyon ki fokis sou kou ak swen kiwopratik pou tèt fè mal ki ka gen yon kòz miskilè oswa sèvikal.",
    image: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Tretman tèt fè mal ak migrèn",
    },
  },
  {
    slug: "car-accidents",
    name: "Aksidan machin",
    duration: "",
    summary:
      "Apre yon aksidan machin, mande yon evalyasyon kiwopratik pou doulè kou, doulè do, rèd, sentòm blesi kou, ak lòt doulè miskilè.",
    image: {
      src: "/figma-exports/drabe-consult.png",
      alt: "Konsiltasyon ak Dr. Abe apre yon aksidan machin",
    },
    href: "/ht/kiwoprate-pou-aksidan-machin",
    ctaLabel: "Aprann plis",
  },
  {
    slug: "cupping-therapy",
    name: "Terapi vantouz",
    duration: "",
    summary:
      "Terapi vantouz aplike yon aspirasyon lokalize sou zòn tansyon miskilè yo chwazi, e li ka enkli lè sa apwopriye pou doulè kou, do, oswa lòt tisi mou.",
    image: { src: "/figma-exports/cupping-drabe.png", alt: "Sesyon terapi vantouz" },
    href: "/ht/sevis/terapi-vantouz",
    ctaLabel: "Aprann plis",
  },
  {
    slug: "massage-soft-tissue",
    name: "Masaj / tisi mou",
    duration: "",
    summary:
      "Relaksman miyofasyal ak swen tisi mou dirije pou tansyon miskilè, mobilite limite, ak doulè apre yon blesi.",
    image: {
      src: "/figma-exports/drabe-soft-tissue.png",
      alt: "Terapi masaj ak tisi mou",
    },
    href: "/ht/sevis/terapi-tisi-mou",
    ctaLabel: "Aprann plis",
  },
];

// ─────────────────────────────────────────────────────────── /ht/dr-abe-nasser

export const htDoctorPage = {
  hero: {
    eyebrow: htDoctorProfileContent.eyebrow,
    titleLines: ["Dr. Abe Nasser,", "D.C."] as const,
    subhead:
      "Fè konesans ak Dr. Abe Nasser, kiwopratè Align the Spine Chiropractic nan Deerfield Beach, ak fason li swen chak pasyan.",
    callPillEyebrow: "Ann pale jodi a",
  },
  breadcrumb: "Dr. Abe Nasser",
  practices: {
    eyebrow: "KIJAN LI TRAVAY",
    heading: "Sa pasyan yo vrèman remake",
    officeCallout: {
      heading: "Biwo a, lè ou pito vini",
      body: "Vizit lakay ofri selon ka ou a ak kote ou ye a — men biwo Deerfield Beach la toujou la.",
    },
  },
  galleryHeading: "Biwo nou nan Deerfield Beach",
};

export const htDoctorHistoryContent: DoctorHistoryContent = {
  eyebrow: "PARIKOU",
  heading: "Bati sou lide pou se doktè ki vrèman prezan an",
  paragraphs: [
    "Dr. Abe te kòmanse karyè kiwopratik li ap swen pasyan nan konte Broward ak Palm Beach, ak pasyan nan tout etap rekiperasyon — anvan ak apre gwosès, apre operasyon, granmoun aje, ak atlèt. Sou wout la, li te toujou remake menm modèl la: pasyan yo t ap chanje soti nan yon pwofesyonèl pou ale nan yon lòt selon ki moun ki disponib jou sa a, san yo pa janm rive gen kontinuite ki vrèman akselere rekiperasyon.",
    "Align the Spine te fèt sou lide kontrè a. Yon sèl doktè, chak vizit. Pri klè olye yon labiren kòd, ak yon premye evalyasyon aksesib, paske premye vizit la pa dwe yon pari ki chè ki anpeche moun al fè yon egzamen.",
  ],
};

export const htHowHePracticesCards: PracticeCard[] = [
  {
    title: "Swen aksesib",
    description:
      "Pri klè — bon swen kiwopratik pa dwe yon liks. Rele pou konnen pri aktyèl pou nouvo pasyan.",
    image: {
      src: "/figma-exports/drabe-whiplash.png",
      alt: "Sesyon tretman kiwopratik",
    },
  },
  {
    title: "Toujou menm doktè a",
    description:
      "Pa gen pwofesyonèl k ap chanje. Chak vizit se Dr. Abe ki wè ou — li konnen ka ou a paske se li menm ki swen ou.",
    image: {
      src: "/figma-exports/drabe-backpain.png",
      alt: "Dr. Abe ap swen yon pasyan",
    },
  },
  {
    title: "Nan chak etap lavi",
    description:
      "Anvan ak apre gwosès, apre operasyon, granmoun aje, atlèt — swen ki fèt pou moman ou ye a.",
    image: {
      src: "/figma-exports/athome-drabe.png",
      alt: "Dr. Abe ap swen yon pasyan lakay li",
    },
  },
];

// ─────────────────────────────────────────────────────────── /ht/komante-pasyan

export const htReviewsPage = {
  h1: "Kòmantè pasyan Align the Spine Chiropractic",
  intro:
    "Sa yo se kòmantè reyèl pasyan nan Deerfield Beach. Gade poukisa sid Florid fè konfyans nan Dr. Abe, epi kòmanse pwòp rekiperasyon ou.",
  ratingSuffix: "kòmantè senk zetwal",
  ratingTail: "e sa kontinye ogmante",
  /** ATS-SEO-070 follow-up: reviews now show a real Haitian Creole
   * translation (content/testimonials.ts's `quoteHt`), same policy/wording
   * as the Spanish/Portuguese pages — this note used to say the opposite
   * (no translated version published) back when no `quoteHt` existed;
   * updated to match once it did, since the old wording would now be false.
   * The English original is what each patient actually wrote; the
   * translation is disclosed, never presented as their own wording. */
  languageNote:
    "Kòmantè sa yo te ekri an angle pa pasyan nou yo e yo tradui an Kreyòl Ayisyen. Tèks orijinal an angle a rete san chanjman nan vèsyon angle paj sa a.",
  formHeading: "Resevwa menm swen senk zetwal la",
  formFootnote:
    "Souvan gen randevou disponib menm jou a. Nou sèvi Deerfield Beach ak kominote ki tou pre nan sid Florid.",
  heroAlt: "Align the Spine Chiropractic and Wellness Center",
  carouselHeading: "Sa pasyan nou yo di",
};

// ───────────────────────────────────────────────────────────── /ht/kontakte-nou

export const htContactPage = {
  hero: {
    eyebrow: "Nou nan Deerfield Beach",
    h1: "Kontakte Align the Spine",
    subhead: `Rele ${siteConfig.business.phone}, ekri nou, oswa voye fòm nan epi nou rele ou tounen.`,
    formHeading: "Voye yon mesaj",
  },
  breadcrumb: "Kontakte nou",
  faqEyebrow: "Kesyon moun poze souvan",
  faqHeading: "Anvan premye vizit ou",
  faq: [
    {
      question: "Kijan pou m mande yon randevou?",
      answer: `Rele ${siteConfig.business.phone} oswa voye fòm ki nan paj sa a. Nou rele ou tounen pou konfime lè a — fòm nan pa rezève randevou a otomatikman.`,
    },
    {
      // NEEDS LINGUISTIC/FACTUAL REVIEW: no verified Haitian Creole-language
      // staff claim exists (content/site.ts's bilingualCare covers
      // English/Spanish only). This answer states the verified fact
      // (phone contact) rather than assuming Kreyòl service.
      question: "Èske nou pale Kreyòl?",
      answer: "Rele biwo a epi mande dirèkteman — ekip la konfime sou telefòn anvan vizit ou.",
    },
    {
      question: "Kote biwo a ye?",
      answer: `Nou nan ${siteConfig.business.address.line1}, ${siteConfig.business.address.suite}, Deerfield Beach, FL ${siteConfig.business.address.zip}, anndan Palm Plaza. Lè ou antre nan plaza a, nou se bilding nan kwen adwat la.`,
    },
    {
      question: "Kisa pou m pote nan premye vizit mwen an?",
      answer:
        "Yon pyès idantite ak enfòmasyon asirans ou. Si ka ou a se pou yon aksidan machin epi ou deja gen yon rapò lapolis, yon nimewo reklamasyon, oswa yon avoka, pote yo — men se pa yon obligasyon pou nou wè ou.",
    },
  ],
};

// ─────────────────────────────────────────────────── /ht/mande-yon-randevou

export const htBookingPage = {
  hero: {
    eyebrow: "Mande randevou ou",
    h1: "Mande yon randevou kiwopratik",
    subhead:
      "Ranpli fòm nan epi nou rele ou tounen pou konfime lè a. Si ou pito rezoud sa nan telefòn, rele " +
      siteConfig.business.phone +
      " epi pale dirèkteman ak Dr. Abe.",
    formHeading: "Mande evalyasyon ou",
    footerNote:
      "Fòm sa a voye yon demann; li pa konfime yon lè. Nou rele ou pou kowòdone randevou a.",
  },
  breadcrumb: "Mande randevou",
  faqEyebrow: "Anvan ou mande",
  faqHeading: "Sou demann randevou a",
  faq: [
    {
      question: "Èske voye fòm nan konfime randevou m?",
      answer: `Non. Fòm nan voye yon demann; nou rele ou tounen pou dakò sou jou a ak lè a. Si ou pito konfime imedyatman, rele ${siteConfig.business.phone}.`,
    },
    {
      question: "Konbyen tan sa pran pou nou rele m?",
      answer:
        "Nou rele ou pi vit posib pandan lè biwo a louvri. Si ka ou a se pou yon aksidan resan e ou enkyete sou delè 14 jou PIP la, rele nou dirèkteman olye ou tann yon apèl tounen.",
    },
    {
      question: "Ki enfòmasyon fòm nan mande?",
      answer:
        "Non, telefòn, ak rezon jeneral vizit la. Nou pa mande istwa medikal detaye ni deskripsyon aksidan an nan fòm nan — sa diskite nan vizit la.",
    },
    {
      question: "Èske mwen ka mande yon vizit lakay nan fòm sa a?",
      answer:
        "Wi, chwazi opsyon sa a kòm rezon. Nou konfime si li apwopriye pou ka ou a ak kote ou ye a lè nou rele ou — se pa yon sèvis garanti.",
    },
  ],
  whatHappensNext: {
    eyebrow: "Sa k ap vini apre",
    heading: "Kijan sa mache",
    steps: [
      {
        title: "Ou voye demann lan",
        body: "Non, telefòn, ak rezon vizit la. Pa gen istwa medikal detaye nan fòm nan.",
      },
      {
        title: "Nou rele ou tounen",
        body: "Nou dakò sou yon lè ki bon pou ou epi nou di ou kisa pou pote.",
      },
      {
        title: "Ou vini pou evalyasyon ou",
        body: "Dr. Abe revize sentòm ou yo, fè yon egzamen fokis, epi eksplike ou si swen kiwopratik apwopriye pou ka ou a.",
      },
    ],
  },
};
