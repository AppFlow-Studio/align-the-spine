import type { ServiceCardItem } from "@/components/ui/service-card";
import type { DoctorRating } from "@/content/doctor-profile";
import type { Service } from "@/content/services";
import type { SpineOverviewContent } from "@/content/spine-overview";
import { verified } from "@/content/verified-value";
import type { WhyChooseContent } from "@/content/why-choose";

/** Haitian Creole copy for the /ht home page (ATS-SEO-136).
 *
 * Genuine Kreyòl Ayisyen, written for how a Haitian Creole speaker actually
 * talks about back/neck pain and car accidents — not French, and not a
 * mechanical cognate-for-cognate rewrite of the Spanish/Portuguese copy.
 * "Kiwopratè" (not "chiropracteur", the French word) leads throughout;
 * "aksidan machin" is the everyday term South Florida's Haitian Creole
 * speakers use for a car accident, not the more formal "aksidan
 * otomobil". "Florid" is the standard Kreyòl spelling of the state name
 * used in Haitian-American press — the office address itself stays
 * byte-identical to the English/Spanish/Portuguese NAP (see
 * content/site.ts), never respelled.
 *
 * Same claim discipline as every other language on this site: nothing here
 * promises relief, recovery, cure, or coverage, and no credential, service,
 * or statistic appears that isn't already verified in content/site.ts or
 * content/doctor-profile.ts. "Ka" ("may/can") does the same hedging work
 * the English "may"/"can help" does.
 *
 * No Kreyòl-speaking-staff claim is made anywhere in this file —
 * content/site.ts's `bilingualCare` verifies English/Spanish only
 * (2026-08-11), not Haitian Creole.
 */

export const htHomeHero = {
  /** H1. Mirrors the English/Spanish/Portuguese hero's two-line split and
   * matches this route's <title>, "Kiwopratè nan Deerfield Beach, FL". */
  titleLines: ["Kiwopratè nan", "Deerfield Beach, FL"] as const,
  /** Mirrors the English "We accept cash visits" — no dollar figure,
   * matching the upstream removal of the "$50 office visit" badge from the
   * English hero. */
  badge: "Nou aksepte peman kach",
  subhead:
    "Swen kiwopratik nan Deerfield Beach pou doulè do, doulè kou, mobilite ak blesi — ak evalyasyon fokis apre yon aksidan machin.",
  callPillEyebrow: "Ann pale jodi a",
  form: {
    heading: "Mande evalyasyon kiwopratik ou",
    submitLabel: "Mande evalyasyon mwen",
    footerNote:
      "Vin wè nou nan Deerfield Beach, oswa rele pou mande si yon vizit lakay ka apwopriye pou ka ou a ak kote ou ye a.",
  },
};

/** Section headings the Haitian Creole home page passes into shared
 * components. */
export const htHomeSections = {
  servicesHeading: "Sèvis kiwopratik",
  accidentInjuriesEyebrow: "Sa nou trete",
  accidentInjuriesHeading: "Blesi aksidan komen nou trete",
};

/** Haitian Creole rendering of content/services.ts's `services`. `slug`
 * values are unchanged — they're the anchor ids Service schema and any
 * inbound #fragment link use, not visitor-facing. The gated "New Patient
 * Special" entry is absent for the same reason it's absent from every
 * other language's list: it bundles an X-ray-equipment claim and a
 * pricing offer without sign-off (ATS-E4 4.9/4.13). */
export const htServices: Service[] = [
  {
    slug: "myofascial-release-trigger-point",
    name: "Relaksman miyofasyal / pwen deklanchè",
    duration: "1 è",
    summary:
      "Dr. Abe itilize yon zouti Graston ak presyon dirije pou travay tansyon miskilè ak mobilite limite nan tisi mou yo, yon fason ki sanble ak yon masaj fon ki fokis.",
    image: {
      src: "/figma-exports/drabe-releasetool.png",
      alt: "Relaksman miyofasyal ak terapi pwen deklanchè ak yon zouti Graston",
    },
  },
  {
    slug: "cupping-therapy",
    name: "Terapi vantouz",
    duration: "1 è",
    summary:
      "Terapi vantouz aplike yon aspirasyon lokalize sou zòn tansyon miskilè yo chwazi, e li ka enkli lè sa apwopriye pou doulè nan kou, do oswa lòt tisi mou.",
    image: {
      src: "/figma-exports/cupping-drabe.png",
      alt: "Sesyon terapi vantouz",
    },
  },
  {
    slug: "adjustment",
    name: "Ajisteman kiwopratik",
    duration: "1 è",
    summary:
      "Ajisteman kiwopratik yo aplike presyon kontwole pou amelyore mouvman kèk atikilasyon nan kou, mitan do oswa ba do a, apre yon bon evalyasyon.",
    image: {
      src: "/figma-exports/drabeadjust.png",
      alt: "Dr. Abe ap fè yon ajisteman kiwopratik",
    },
  },
  {
    slug: "traction-decompression",
    name: "Traksyon / dekonpresyon",
    duration: "1 è",
    summary:
      "Traksyon ak dekonpresyon nan kolòn nan aplike yon traksyon kontwole pou doulè nan kou oswa nan ba do a. Paramèt yo detèmine selon evalyasyon an epi yo ajiste pou chak pasyan.",
    image: {
      src: "/figma-exports/drabe-traction_compression.png",
      alt: "Terapi traksyon ak dekonpresyon kolòn vètebral",
    },
  },
  {
    slug: "car-accidents",
    name: "Aksidan machin",
    duration: "1 è",
    summary:
      "Apre yon aksidan machin, mande yon evalyasyon kiwopratik pou doulè nan kou, doulè nan do, rèd, sentòm blesi kou ak lòt doulè miskilè.",
    image: {
      src: "/figma-exports/drabe-consult.png",
      alt: "Konsiltasyon ak Dr. Abe apre yon aksidan machin",
    },
  },
];

/** Haitian Creole rendering of content/accident-injuries.ts. Same six
 * entries, same images, same slugs. Summaries describe what the injury is
 * and what the care addresses — never an outcome. */
export const htAccidentInjuries: ServiceCardItem[] = [
  {
    slug: "whiplash",
    name: "Blesi kou",
    duration: "",
    summary: "Foul nan kou, rèd, ak mwens mobilite ki soti nan yon frap sanzatann.",
    image: {
      src: "/figma-exports/drabe-whiplash.png",
      alt: "Tretman blesi kou",
    },
  },
  {
    slug: "lower-back-pain",
    name: "Doulè nan ba do",
    duration: "",
    summary:
      "Travay aliyman pou trete konpresyon nan kolòn ba do a ak spas miskilè aksidan pa dèyè yo lakòz.",
    image: {
      src: "/figma-exports/drabe-backpain.png",
      alt: "Tretman doulè nan ba do",
    },
  },
  {
    slug: "herniated-disc",
    name: "Èni diskal",
    duration: "",
    summary: "Teknik dekonpresyon pou soulaje presyon sou nè yo ki soti nan yon disk ki deplase.",
    image: {
      src: "/figma-exports/drabe-herniated%20disc.png",
      alt: "Tretman èni diskal",
    },
  },
  {
    slug: "shoulder-extremity",
    name: "Zepòl ak manm yo",
    duration: "",
    summary: "Swen pou blesi zepòl senti sekirite lakòz, ak blesi atikilasyon nan bra ak janm.",
    image: {
      src: "/figma-exports/drabe-shoulder.png",
      alt: "Tretman zepòl ak manm yo",
    },
  },
  {
    slug: "headaches",
    name: "Tèt fè mal",
    duration: "",
    summary:
      "Ajisteman nan pati anwo kou a pou soulaje tèt fè mal ak tansyon ki parèt apre yon chòk.",
    image: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Tretman tèt fè mal",
    },
  },
  {
    slug: "soft-tissue",
    name: "Tisi mou",
    duration: "",
    summary: "Relaksman miyofasyal pou kontizyon miskilè fon ak foul ligaman nenpòt kote nan kò a.",
    image: {
      src: "/figma-exports/drabe-soft-tissue.png",
      alt: "Tretman tisi mou",
    },
  },
];

/** Haitian Creole rendering of content/why-choose.ts. The rating reuses the
 * same already-verified figure the other languages reuse — not a second,
 * independently-asserted claim. "Align the Spine Chiropractic" stays
 * untranslated — it's the business's legal name and its search entity. */
export const htWhyChooseContent: WhyChooseContent = {
  headingLines: ["Poukisa chwazi", "Align the Spine", "Chiropractic"],
  body: "Depi doulè do chak jou ak blesi espòtif jiska rekiperasyon apre yon aksidan, Align the Spine te fèt sou yon lide: bon swen kiwopratik ta dwe aksesib pou tout moun. Pri klè, eksplike san detou. Epi yon doktè ki konnen non ou — paske nan Align the Spine, se toujou Dr. Abe ki wè ou.",
  cta: { label: "Mande yon randevou", href: "/ht/mande-yon-randevou" },
  rating: verified<DoctorRating>(
    { value: 5, count: 152, location: "Deerfield Beach, Florida" },
    "Matches the already-verified review count in siteConfig.stats",
    "2026-09-02",
  ),
  image: {
    src: "/figma-exports/interior-table.png",
    alt: "Sal tretman Align the Spine",
  },
};

/** Haitian Creole rendering of content/spine-overview.ts's static
 * home-page spine diagram. `id`, `position` and `labelSide` are layout
 * data, not copy, and are unchanged — only `name`/`description` and the
 * alt text are Kreyòl. Region names keep the clinical Latin term with a
 * plain-language gloss in parentheses, same shape every other language
 * uses ("Cervical (Neck)" / "Cervical (cuello)" / "Cervical (pescoço)"). */
export const htSpineOverviewContent: SpineOverviewContent = {
  eyebrow: "Konprann kolòn ou",
  heading: "Kolòn ou kontwole tout bagay",
  image: {
    src: "/figma-exports/spine-straight-poster.jpg",
    alt: "Yon kolòn vètebral k ap pase soti nan yon pozisyon vout pou rive nan yon pozisyon dwat ki aliye",
  },
  video: "https://align-the-spine.b-cdn.net/images/spine-straight.mp4",
  videoPoster: "/figma-exports/spine-hunched-poster.jpg",
  segments: [
    {
      id: "cervical",
      name: "Sèvikal (kou)",
      description: "Tèt fè mal, kou rèd, ak tansyon nan zepòl: pifò kòmanse la a.",
      position: { x: 52, y: 22 },
      labelSide: "left",
    },
    {
      id: "thoracic",
      name: "Torasik (mitan do)",
      description: "Sous doulè ki pi komen an. Li sipòte pifò nan pwa kò a.",
      position: { x: 52, y: 44 },
      labelSide: "right",
    },
    {
      id: "lumbar",
      name: "Lonbè (ba do)",
      description: "Move pozisyon, travay chita, ak estrès konprese zòn sa a chak jou.",
      position: { x: 52, y: 61 },
      labelSide: "left",
    },
    {
      id: "sacral",
      name: "Sakral (baz)",
      description: "Doulè nan ranch, syatik, ak doulè nè souvan kòmanse nan zòn sa a.",
      position: { x: 52, y: 76 },
      labelSide: "right",
    },
  ],
};
