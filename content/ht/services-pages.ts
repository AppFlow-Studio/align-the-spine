import type { AdjustmentsStep } from "@/content/adjustments-page";
import type { ConditionFaq } from "@/content/conditions/types";
import type { MassageCondition, MassageTechnique } from "@/content/massage-soft-tissue-page";
import type {
  DecompressionCondition,
  DecompressionStep,
} from "@/content/spinal-decompression-page";

/** Haitian Creole content for the four `/ht/sevis/*` pages (ATS-SEO-136
 * follow-up), translated from content/es/services-pages.ts — the vetted
 * reference per docs/multilingual-seo-baseline.md.
 *
 * Structure mirrors the Spanish/English modules exactly (same fields, same
 * images, same ordering) so the Haitian Creole pages compose from the same
 * section components. What differs is the prose.
 *
 * ── Claim discipline ────────────────────────────────────────────────────
 * These pages carry clinical guidance, which is exactly why their English
 * originals are still `status: "draft"` (noindex, out of the sitemap)
 * pending a clinician's sign-off. The Haitian Creole pages are registered
 * `draft` too — `content/i18n.test.ts` enforces that a Haitian Creole page
 * can't be published while its English original isn't. Nothing here adds,
 * broadens, or softens a clinical claim relative to the Spanish source:
 * every hedge ("lè sa apwopriye", "apre yon evalyasyon", "ka") maps to a
 * Spanish "cuando corresponde" / "después de una evaluación" / "puede", and
 * no outcome, timeframe, or coverage is promised.
 *
 * NEEDS LINGUISTIC REVIEW: this content was machine-translated by an LLM
 * with no verified native Haitian Creole fluency — see
 * content/ht/conditions.ts's identical note, which flags this as the
 * largest quality risk for this locale specifically. Do not promote this
 * content out of draft without native-speaker review.
 */

// ──────────────────────────────────── /ht/sevis/ajisteman-kiwopratik

export const htAdjustmentsHero = {
  eyebrowChip: "Rèd nan jwenti oswa mouvman limite?",
  h1: "Ajisteman Kiwopratik nan Deerfield Beach, FL",
  subhead:
    "Ajisteman kiwopratik manyèl aplike presyon kontwole pou amelyore mouvman yon jwenti. Dr. Abe evalye sentòm ou ak sekirite ou anvan li trete.",
  backgroundImage: {
    src: "/figma-exports/adjustments-hero.png",
    alt: "Sal tretman ki prepare pou yon ajisteman kiwopratik",
  },
};

export const htAdjustmentsHowItWorks: AdjustmentsStep[] = [
  {
    title: "Evalyasyon konplè",
    description:
      "Nou idantifye ki segman ki pèdi mobilite yo nan kolizyon an epi nou elimine premyèman nenpòt rezilta ki egzije egzamen imaj oswa yon referans medikal.",
    learnMoreHref: "/ht/kiwoprate-pou-aksidan-machin",
  },
  {
    title: "Ajisteman manyèl",
    description:
      "Dr. Abe aplike presyon presi ak kontwole sou jwenti ki apwopriye a, selon rezilta egzamen ou ak konfò ou.",
    learnMoreHref: "/ht/sevis",
  },
  {
    title: "Plan ak reevalyasyon",
    description:
      "Frekans konsiltasyon yo depann de sentòm ou ak repons ou nan swen an. Rezilta ki gen rapò ak aksidan an dokimante lè sa apwopriye pou reklamasyon ou.",
    learnMoreHref: "/ht/kiwoprate-pou-aksidan-machin",
  },
];

export const htAdjustmentsFaq: ConditionFaq = {
  headerTail: "ajisteman kiwopratik yo",
  items: [
    {
      q: "Èske yon ajisteman fè mal?",
      a: "Pifò pasyan santi presyon oswa yon libète, pa doulè. Li komen pou gen kèk sansiblite apre, tankou lè w kòmanse yon etiman oswa yon egzèsis nouvo. Nou ajiste apwòch la si yon bagay pa santi byen pandan vizit ou.",
    },
    {
      q: "Èske yon ajisteman san danje apre yon aksidan machin?",
      a: "Li ka apwopriye yon fwa yon evalyasyon elimine rezilta ki egzije egzamen imaj, swen ijan, oswa yon referans. Premye vizit la kòmanse ak yon egzamen, li pa prezime ajisteman an apwopriye.",
    },
    {
      q: "Ki diferans ki genyen ant yon ajisteman ak yon masaj?",
      a: "Masaj travay tisi mou ozanviwon jwenti a; ajisteman an aji sou jwenti a limenm, li remèt mouvman nan yon segman ki sispann bouje byen (yon fiksasyon), ki souvan se vrè orijin doulè a.",
    },
    {
      q: "Konbyen ajisteman m ap bezwen?",
      a: "Sa depann de kondisyon an, rezilta egzamen an, ak repons ou nan swen an. Dr. Abe reevalye pwogrè a olye pwomèt davans yon kantite fiks konsiltasyon oswa yon pakè.",
    },
  ],
};

// ───────────────────────────────────── /ht/sevis/dekonpresyon-kolon

export const htDecompressionHero = {
  eyebrowChip: "Doulè disk oswa doulè nève k ap gaye?",
  h1: "Dekonpresyon Kolòn nan Deerfield Beach, FL",
  subhead:
    "Dekonpresyon kolòn ki pa chirijikal itilize traksyon kontwole pou diminye presyon sou jwenti ak disk kolòn nan. Yon evalyasyon detèmine si li apwopriye pou ka ou a.",
  backgroundImage: {
    src: "/figma-exports/spinal-decompression-hero.png",
    alt: "Sal tretman ki prepare pou terapi dekonpresyon kolòn",
  },
};

export const htDecompressionHowItWorks: DecompressionStep[] = [
  {
    title: "Evalyasyon konplè ak revizyon imaj",
    description:
      "Nou konfime si kolizyon an te lakòz oswa agrave yon blesi disk, epi nou revize egzamen imaj ou deja genyen yo.",
    learnMoreHref: "/ht/kiwoprate-pou-aksidan-machin",
  },
  {
    title: "Sesyon traksyon kontwole",
    description:
      "Yo aplike yon traksyon espesifik sou kolòn nan, ki soulaje ti kras pa ti kras presyon aksidan an te kite sou disk la ak nève a.",
    learnMoreHref: "/ht/sevis/dekonpresyon-kolon",
  },
  {
    title: "Plan ak reevalyasyon",
    description:
      "Frekans sesyon yo depann de rezilta ou yo ak repons ou. Swen ki gen rapò ak aksidan an dokimante pou reklamasyon ou lè sa apwopriye.",
    learnMoreHref: "/ht/kiwoprate-pou-aksidan-machin",
  },
];

export const htDecompressionConditions: DecompressionCondition[] = [
  {
    name: "Syatik",
    description:
      "Doulè ki gaye nan janm nan ki ka enplike iritasyon oswa konpresyon yon nève nan pati anba do a.",
    image: {
      src: "/figma-exports/adjustment-image.jpeg",
      alt: "Kiwopratè ap trete pati anba do yon pasyan pou syatik",
    },
  },
  {
    name: "Blesi disk akoz antòs kou",
    description: "Lè kolizyon an afekte disk la limenm, se pa sèlman tisi mou ki alantou li.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-whiplash.png",
      alt: "Men k ap evalye kou yon pasyan pou yon blesi disk apre yon antòs kou",
    },
  },
  {
    name: "Èni disk (do)",
    description:
      "Yon kondisyon disk nan pati anba do a ki ka irite nève ki tou pre epi afekte mouvman.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-herniated%20disc.png",
      alt: "Men k ap trete pati anba do yon pasyan pou yon èni disk",
    },
  },
  {
    name: "Èni disk (kou)",
    description: "Lè fòs chòk la afekte yon disk nan kou a, se pa sèlman miskilati ki alantou li.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-head.png",
      alt: "Men k ap trete kou yon pasyan pou yon èni disk",
    },
  },
];

export const htDecompressionFaq: ConditionFaq = {
  headerTail: "dekonpresyon kolòn nan",
  items: [
    {
      q: "Èske yon aksidan machin ka lakòz yon èni disk?",
      a: "Yon kolizyon ka blese oswa agrave yon disk nan kolòn nan, men sentòm yo pou kont yo pa konfime yon èni. Yon evalyasyon ak revizyon egzamen imaj ki apwopriye ede detèmine orijin ki pi pwobab la.",
    },
    {
      q: "Èske dekonpresyon kolòn fè mal?",
      a: "Dekonpresyon kolòn itilize traksyon kontwole epi li ajiste selon konfò ou. Fè Dr. Abe konnen si w santi doulè oswa sentòm ki pa nòmal pandan oswa apre yon sesyon pou plan an ka reevalye.",
    },
    {
      q: "Ki diferans ki genyen ak yon ajisteman kiwopratik?",
      a: "Ajisteman an remèt mouvman nan yon jwenti ak yon poze rapid ak kontwole. Dekonpresyon, pou pa li, aplike yon traksyon lan ak kontinyèl pou kreye presyon negatif anndan disk la. Souvan yo itilize yo ansanm, selon sa evalyasyon an jwenn.",
    },
    {
      q: "Konbyen sesyon m ap bezwen apre yon aksidan?",
      a: "Kantite sesyon yo depann de rezilta egzamen an ak repons nan swen an. Dr. Abe reevalye pwogrè a epi dokimante tretman ki gen rapò ak aksidan an lè sa apwopriye.",
    },
  ],
};

// ────────────────────────────── /ht/sevis/terapi-tisi-mou

export const htMassageHero = {
  eyebrowChip: "Tansyon miskilè oswa doulè nan tisi mou?",
  h1: "Masaj ak Terapi Tisi Mou nan Deerfield Beach, FL",
  subhead:
    "Swen dirije sou tisi mou pou tansyon miskilè, mobilite restren, ak doulè apre yon blesi, chwazi apre yon evalyasyon kiwopratik ak Dr. Abe.",
  backgroundImage: {
    src: "/figma-exports/massage-soft-tissue-hero.png",
    alt: "Sal tretman masaj ak terapi tisi mou",
  },
};

export const htMassageTechniques: MassageTechnique[] = [
  {
    title: "Teknik Graston / pwen deklanchè",
    description:
      "Itilize yon zouti asye inoksidab pou travay tisi sikatris ak espas miskilè yon kolizyon kite dèyè — sanble ak yon masaj fon, men pi dirije.",
    bestFor: "espas miskilè, tisi sikatris, tansyon kwonik",
    image: {
      src: "/figma-exports/drabe-releasetool.png",
      alt: "Tretman tisi mou ak teknik Graston",
    },
  },
  {
    title: "Libète myofasyal",
    description:
      "Presyon kontinyèl sou fasya ki antoure miskilati yo libere tansyon ki akimile nan jou apre chòk la.",
    bestFor: "mouvman restren, rèd akoz antòs kou",
    image: {
      src: "/figma-exports/drabe-backpain.png",
      alt: "Tretman libète myofasyal",
    },
  },
  {
    title: "Terapi tisi fon",
    description:
      "Presyon lan e fèm rive nan kouch miskilè ki pi fon ki afekte pa kontizyon oswa fowse chòk la.",
    bestFor: "kontizyon fon, kontrakti miskilè, doulè apre yon aksidan",
    image: {
      src: "/figma-exports/drabe-soft-tissue.png",
      alt: "Tretman terapi tisi fon",
    },
  },
];

export const htMassageConditions: MassageCondition[] = [
  {
    name: "Antòs kou",
    description: "Travay espas ak kontrakti miskilè ozanviwon kou a apre yon evalyasyon apwopriye.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-whiplash.png",
      alt: "Men k ap evalye kou yon pasyan apre yon antòs kou",
    },
  },
  {
    name: "Doulè kou",
    description: "Pou tansyon ak rèd ki swiv yon kolizyon, se pa sèlman jèn chak jou a.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/dr-abe-neck.png",
      alt: "Dr. Abe Nasser ap trete kou ak zepòl yon pasyan",
    },
  },
  {
    name: "Doulè do",
    description: "Travay espas miskilè ki ka akonpaye yon blesi do, disk, oswa jwenti.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-backpain-front.png",
      alt: "Men k ap trete pati anba do yon pasyan",
    },
  },
  {
    name: "Zepòl ak ekstremite",
    description: "Kontizyon ak tòma tisi mou nan bra ak zepòl akoz senti sekirite a.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/align-the-spine-shoulders.png",
      alt: "Men k ap trete zepòl yon pasyan",
    },
  },
];

export const htMassageFaq: ConditionFaq = {
  headerTail: "terapi tisi mou a",
  items: [
    {
      q: "Èske travay tisi mou ede jis apre yon aksidan machin?",
      a: "Li ka apwopriye yon fwa yon evalyasyon elimine blesi ki egzije swen ijan oswa yon referans. Mansyone kolizyon an ak lè sentòm yo te parèt pou Dr. Abe ka chwazi yon teknik apwopriye epi dokimante vizit la.",
    },
    {
      q: "Ki diferans ak yon masaj òdinè?",
      a: "Yon masaj òdinè chèche rilaksasyon jeneral; sa a se yon tretman dirije nan tisi espesifik kolizyon an afekte — Graston, libète myofasyal, oswa tisi fon, selon si se tisi sikatris, rèd fasya, oswa kontizyon fon.",
    },
    {
      q: "Èske sa kouvri nan reklamasyon aksidan mwen an?",
      a: "Si blesi ou gen rapò ak aksidan an, nou dokimante chak sesyon pou li anrejistre nan reklamasyon ou. Detay kouvèti yo depann de kontra asirans ou — n ap ede w nan sa nou kapab.",
    },
    {
      q: "Konbyen sesyon m ap bezwen apre yon aksidan?",
      a: "Sa varye selon blesi a ak repons nan swen an. Dr. Abe reevalye sentòm ou olye pwomèt davans yon kantite fiks sesyon oswa yon pakè.",
    },
  ],
};

// ──────────────────────────────────── /ht/sevis/terapi-vantouz

export const htCuppingHero = {
  eyebrowChip: "Tansyon miskilè lokalize?",
  h1: "Terapi Vantouz nan Deerfield Beach, FL",
  subhead:
    "Aspirasyon lokalize aplike nan zòn tansyon miskilè seleksyone, itilize lè sa apwopriye ansanm ak yon evalyasyon kiwopratik ak Dr. Abe.",
  backgroundImage: {
    src: "/figma-exports/cupping-drabe.png",
    alt: "Sesyon terapi vantouz",
  },
};

/** Related-link paths for the Haitian Creole cupping page — the Haitian
 * Creole counterparts of content/cupping-therapy-page.ts's config. `/blog`
 * is omitted: the blog is CMS-driven and English-only, so it would drop a
 * Haitian Creole reader into English. */
export const htCuppingRelatedConfig = {
  paths: [
    "/ht/sevis/terapi-tisi-mou",
    "/ht/sevis/ajisteman-kiwopratik",
    "/ht/kiwoprate-pou-aksidan-machin",
    "/ht/sevis",
    "/ht/mande-yon-randevou",
  ],
  highlightPath: "/ht/mande-yon-randevou",
};

/** Related-link rows for the other three Haitian Creole service pages.
 * Draft routes are dropped automatically by buildHtRelatedLinks(), so the
 * row gets shorter, never wrong, if a sibling page isn't published yet. */
export const htAdjustmentsRelatedConfig = {
  paths: [
    "/ht/sevis/dekonpresyon-kolon",
    "/ht/sevis/terapi-tisi-mou",
    "/ht/kiwoprate-pou-aksidan-machin",
    "/ht/sevis",
    "/ht/mande-yon-randevou",
  ],
  highlightPath: "/ht/mande-yon-randevou",
};

export const htDecompressionRelatedConfig = {
  paths: [
    "/ht/sevis/ajisteman-kiwopratik",
    "/ht/sevis/terapi-tisi-mou",
    "/ht/kiwoprate-pou-aksidan-machin",
    "/ht/sevis",
    "/ht/mande-yon-randevou",
  ],
  highlightPath: "/ht/mande-yon-randevou",
};

export const htMassageRelatedConfig = {
  paths: [
    "/ht/sevis/ajisteman-kiwopratik",
    "/ht/sevis/terapi-vantouz",
    "/ht/kiwoprate-pou-aksidan-machin",
    "/ht/sevis",
    "/ht/mande-yon-randevou",
  ],
  highlightPath: "/ht/mande-yon-randevou",
};

export const htCuppingFaq: ConditionFaq = {
  headerTail: "terapi vantouz la",
  items: [
    {
      q: "Kisa terapi vantouz ye?",
      a: "Terapi vantouz aplike aspirasyon lokalize nan zòn tansyon miskilè seleksyone, lè l itilize gode yo mete sou po a. Li ka enkli ansanm ak lòt travay tisi mou lè sa apwopriye pou jèn nan kou, nan do, oswa nan lòt zòn.",
    },
    {
      q: "Ki diferans ak yon masaj?",
      a: "Masaj itilize presyon manyèl; vantouz itilize aspirasyon pou atire san nan yon zòn espesifik tansyon. Dr. Abe chwazi teknik la — oswa konbinezon an — selon evalyasyon ou, pa selon yon woutin fiks.",
    },
    {
      q: "Èske vantouz apwopriye pou tout moun?",
      a: "Yo itilize lè sa apwopriye pou zòn tansyon miskilè seleksyone, apre yon evalyasyon. Dr. Abe ap di ou si sa apwopriye pou ka ou a oswa si yon lòt teknik tisi mou se yon pi bon pwen depa.",
    },
    {
      q: "Èske sa kouvri nan reklamasyon aksidan mwen an?",
      a: "Si tretman ou gen rapò ak aksidan an, nou dokimante chak sesyon pou li anrejistre nan reklamasyon ou. Detay kouvèti yo depann de kontra asirans ou — n ap ede w nan sa nou kapab.",
    },
  ],
};

/** Section headings the Haitian Creole service pages pass into shared
 * components. */
export const htServicePageCopy = {
  howItWorksHeading: "Kijan sa fonksyone",
  isItRightHeading: "Èske sa apwopriye pou ka ou a?",
  readyHeading: "Lè ou pare",
  readyBody:
    "Mande yon evalyasyon nan kabinè a, oswa mande si yon vizit lakay apwopriye pou ka ou a ak kote ou ye a.",
  readyCta: "Mande evalyasyon mwen",
  faqEyebrow: "Kesyon moun poze souvan",
  faqHeadingLead: "Tout sa ou bezwen konnen sou",
  techniquesHeading: "Teknik nou itilize",
  conditionsHeading: "Kondisyon nou evalye",
  bestForLabel: "Endike pou",
  relatedHeading: "Kondisyon ak tretman ki gen rapò",
};
