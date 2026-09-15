import type { ConditionFaq, ConditionTreatmentItem } from "@/content/conditions/types";

/** Haitian Creole content for the seven `/ht/kondisyon-nou-trete/*` pages
 * (ATS-SEO-136/ATS-SEO-070-follow-up), translated from content/es/conditions.ts —
 * the vetted reference per docs/multilingual-seo-baseline.md, not a fresh
 * retranslation from English.
 *
 * ── Why one shape instead of seven bespoke pages ────────────────────────
 * Same reasoning as the Spanish/Portuguese layers: these are new pages with
 * no Figma history to inherit, so they share one template
 * (components/sections/ht-condition-page.tsx) driven by the objects below.
 * Optional sections render only when a condition supplies them.
 *
 * ── Claim discipline ────────────────────────────────────────────────────
 * Every Spanish hedge is preserved, not softened: "puede"/"podría" → "ka"/
 * "ta ka", "después de una evaluación" → "apre yon evalyasyon", "cuando
 * corresponde" → "lè sa apwopriye". No outcome, timeframe, recovery or
 * coverage is promised anywhere, and no visit count is quoted — every page
 * says Dr. Abe reevalye instead.
 *
 * The concussion page keeps the same critical property as its English/
 * Spanish originals: it states up front that chiropractic care is not a
 * substitute for emergency or neurological assessment, and that medical
 * evaluation comes first. That framing must never be softened.
 *
 * All seven routes are `status: "draft"` in content/ht/seo.ts, mirroring
 * the English/Spanish originals — noindex and out of the sitemap pending
 * clinician review, but reachable and linkable from the Haitian Creole nav.
 *
 * NEEDS LINGUISTIC REVIEW: this content was machine-translated by an LLM
 * with no verified native Haitian Creole fluency (see
 * docs/multilingual-seo-baseline.md §8.2 — the same limitation flagged for
 * ATS-SEO-135/136 generally, called out there as the largest quality risk
 * for this locale specifically). Grammar and terminology were checked
 * against dictionaries and the existing content/ht/ modules' established
 * vocabulary, not by a native speaker. Do not promote this content out of
 * draft without native-speaker review.
 */

export interface HtConditionListSection {
  heading: string;
  items: string[];
  note?: string;
}

export interface HtConditionCard {
  title: string;
  desc: string;
}

export interface HtCondition {
  slug: string;
  path: string;
  hero: {
    eyebrowChip: string;
    h1: string;
    subhead: string;
    backgroundImage: { src: string; alt: string };
  };
  breadcrumb: string;
  understanding: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    image: { src: string; alt: string };
  };
  list?: HtConditionListSection;
  feelsLike?: { heading: string; items: HtConditionCard[] };
  howWeTreat?: { heading: string; items: ConditionTreatmentItem[] };
  warning?: { heading: string; bullets: string[] };
  faq: ConditionFaq;
  relatedConfig: { paths: string[]; highlightPath?: string };
}

/** The four standard treatment cards, shared exactly as the Spanish/
 * Portuguese pages share theirs — same images, same order. `desc` is
 * overridden per condition where the source differs. */
function treatmentCards(descriptions: [string, string, string, string]): ConditionTreatmentItem[] {
  const shared = [
    {
      title: "Libète myofasyal / pwen deklanchè",
      image: {
        src: "/figma-exports/how-we-treat-1.png",
        alt: "Libète myofasyal ak terapi pwen deklanchè ak zouti Graston",
      },
      meta: "1 è",
    },
    {
      title: "Ajisteman kiwopratik",
      image: {
        src: "/figma-exports/adjustment-image.jpeg",
        alt: "Dr. Abe ap fè yon ajisteman kiwopratik",
      },
      meta: "1 è",
    },
    {
      title: "Traksyon / dekonpresyon",
      image: {
        src: "/figma-exports/how-we-treat-3.png",
        alt: "Terapi traksyon ak dekonpresyon nan kolòn vètebral",
      },
      meta: "1 è",
    },
    {
      title: "Vizit lakay",
      image: {
        src: "/figma-exports/how-we-treat-4.png",
        alt: "Dr. Abe ap trete yon pasyan lakay li",
      },
      meta: "Verifye elijibilite",
    },
  ];
  return shared.map((card, index) => ({
    ...card,
    desc: descriptions[index],
    ctaLabel: index === 3 ? "VERIFYE ELIJIBILITE" : "MANDE RANDEVOU",
    ctaHref: index === 3 ? "/ht/kiwoprate-pou-aksidan-machin" : "/ht/mande-yon-randevou",
  }));
}

const RED_FLAG_HEADING = "Wè yon doktè byen vit si ou remake:";

export const htBackPain: HtCondition = {
  slug: "back-pain",
  path: "/ht/kondisyon-nou-trete/doule-do",
  breadcrumb: "Doulè do",
  hero: {
    eyebrowChip: "Doulè do apre yon aksidan machin?",
    h1: "Kiwopratè pou Doulè Do nan Deerfield Beach, FL",
    subhead:
      "Evalyasyon kiwopratik pou doulè nan pati anba do a, rèd, ak doulè ki ka gaye nan ranch la oswa janm nan, ki gen ladan sentòm apre yon aksidan machin.",
    backgroundImage: {
      src: "/figma-exports/drabe-backpain-front.png",
      alt: "Tretman manyèl tisi mou nan pati anba do a",
    },
  },
  understanding: {
    eyebrow: "Konprann doulè do",
    heading: "Doulè do gen anpil kòz posib. Jwenn pa ou a se premye etap la",
    paragraphs: [
      "Doulè nan pati anba do a ka soti nan yon miskilati, yon ligaman, yon jwenti ki sispann bouje byen, oswa yon disk. Chak nan orijin sa yo reponn a yon tretman diferan, se poutèt sa premye vizit la kòmanse ak yon egzamen, pa ak yon tretman yo prezime.",
      "Konsidere yon evalyasyon si doulè a dire plis pase yon oswa de semèn, si li deranje somèy ou oswa aktivite chak jou ou, oswa si li kòmanse apre yon aksidan machin, yon tonbe, oswa yon chòk sibitman. Nan Florid, asirans PIP jeneralman egzije premye swen yo kòmanse nan 14 jou apre yon aksidan machin.",
    ],
    image: {
      src: "/figma-exports/drabe-back.png",
      alt: "Dr. Abe ap revize istwa doulè do yon pasyan",
    },
  },
  list: {
    heading: "Kòz komen",
    items: [
      "Fowse miskilati oswa ligaman",
      "Èni oswa gonfleman disk",
      "Move pòz kò ak rete chita twòp",
      "Chanjman nan jwenti ki gen rapò ak gwosès",
      "Espò oswa efò repetitif",
      "Aksidan machin ak chòk sibitman",
    ],
  },
  feelsLike: {
    heading: "Kijan li santi",
    items: [
      {
        title: "Rèd soud ki kontinye",
        desc: "Yon jèn kontinyèl ki pa two fò, ki pi mal apre rete chita oswa kanpe pou lontan.",
      },
      {
        title: "Doulè sibitman lè w ap bouje",
        desc: "Yon fleksyon oswa vire espesifik ki lakòz yon sekous sibitman ki file — souvan se miskilati.",
      },
      {
        title: "Doulè ki pa vle ale",
        desc: "Yon jèn ki dire semèn oswa mwa, se pa sèlman yon move jou.",
      },
      {
        title: "Doulè ki gaye",
        desc: "Doulè ki vwayaje nan ranch la oswa janm nan olye rete sèlman nan pati anba do a.",
      },
    ],
  },
  howWeTreat: {
    heading: "Kijan nou trete",
    items: treatmentCards([
      "Fowse nan pati anba do a souvan parèt kòm miskilati ki tèt di ak espas nan tout longè kolòn vètebral la. Zouti Graston travay tansyon sa a dirèkteman, li defè adezyon yo yon fason ki sanble ak yon masaj fon.",
      "Doulè do souvan soti nan fiksasyon: segman nan kolòn vètebral la, sitou nan zòn lonbè a, ki pèdi mouvman nòmal yo. Ajisteman an remèt mouvman sa a pou miskilati ozanviwon yo sispann konpanse.",
      "Pou doulè do ki gen rapò ak disk oswa ki dire lontan, traksyon lonje kolòn lonbè a pou soulaje presyon sou disk yo ak nè yo.",
      "Lè menm antre nan machin fè mal, nou pote egzamen an ak tretman manyèl la lakay ou.",
    ]),
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Angoudisman oswa feblès nan janm nan",
      "Doulè ki vin pi mal lannwit oswa ki pa amelyore ak repo",
      "Pèdi kontwòl vesi oswa trip — chèche swen ijans",
    ],
  },
  faq: {
    headerTail: "doulè do a",
    items: [
      {
        q: "Èske li san danje pou m fè yon ajisteman si m gen yon èni disk?",
        a: "Sa depann de blesi disk la, sentòm yo, ak sa egzamen an jwenn. Dr. Abe evalye si yon ajisteman, dekonpresyon, yon lòt opsyon konsèvatif, oswa yon referans medikal se sa ki pi apwopriye anvan li trete.",
      },
      {
        q: "Èske m dwe repoze oswa rete aktif ak doulè do?",
        a: "Yon ti repo ede nan kòmansman an, men twòp repo ka ralanti rekiperasyon an. Nou ba ou yon plan konkrè sou sa pou fè ak sa pou evite selon sa k ap lakòz doulè ou reyèlman.",
      },
      {
        q: "Kisa si doulè do a desann nan janm nan?",
        a: "Doulè ki vwayaje nan janm nan ka enplike yon nè ki irite, ki gen ladan syatik, men yon egzamen nesesè pou evalye kòz la. Chèche swen ijans si gen feblès k ap ogmante oswa chanjman nan vesi oswa trip.",
      },
      {
        q: "Konbyen vizit li konn pran pou doulè do a amelyore?",
        a: "Fowse mekanik souvan amelyore nan yon kèk vizit; doulè ki gen rapò ak disk ka pran plis tan. Nou reevalye pandan tretman an epi nou ajiste plan an.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/ht/kondisyon-nou-trete/syatik",
      "/ht/kondisyon-nou-trete/doule-kou",
      "/ht/sevis/dekonpresyon-kolon",
      "/ht/kondisyon-nou-trete",
      "/ht/kiwoprate-pou-aksidan-machin",
      "/ht/mande-yon-randevou",
    ],
    highlightPath: "/ht/mande-yon-randevou",
  },
};

export const htNeckPain: HtCondition = {
  slug: "neck-pain",
  path: "/ht/kondisyon-nou-trete/doule-kou",
  breadcrumb: "Doulè kou",
  hero: {
    eyebrowChip: "Doulè kou apre yon aksidan machin?",
    h1: "Kiwopratè pou Doulè Kou nan Deerfield Beach, FL",
    subhead:
      "Evalyasyon kiwopratik pou doulè kou, rèd, ak mobilite limite, ki gen ladan doulè kou ki kòmanse apre yon aksidan machin oswa yon antòs kou.",
    backgroundImage: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "Dr. Abe Nasser ap evalye kou yon pasyan",
    },
  },
  understanding: {
    eyebrow: "Konprann doulè kou",
    heading: "Kou a sipòte anpil pwa ak trè piti mo",
    paragraphs: [
      "Kolòn sèvikal la sipòte tèt la ak yon gran mouvman ak trè piti soutyen striktirèl, se poutèt sa li santi pòz kò, tansyon, ak chòk byen vit. Yon chòk sibitman ka fowse miskilati ak ligaman ki sipòte l yo, e sentòm yo ka parèt pita.",
      "Nan Florid, asirans PIP jeneralman egzije premye swen yo kòmanse nan 14 jou apre yon aksidan machin. Elijibilite ak ranbousman depann de kontra asirans ou ak sikonstans yo.",
    ],
    image: {
      src: "/figma-exports/drabe-releasetool.png",
      alt: "Tretman tisi mou nan kou ak zepòl",
    },
  },
  list: {
    heading: "Kòz komen",
    items: [
      "Aksidan machin ak chòk sibitman",
      "Antòs kou akoz yon kolizyon dèyè",
      "Move pòz kò lè w ap dòmi",
      "Tansyon miskilati ki gen rapò ak estrès",
      "Chanjman jwenti degeneratif",
    ],
  },
  feelsLike: {
    heading: "Kijan li santi",
    items: [
      {
        title: "Rèd nan maten",
        desc: "Tèt di e difisil pou vire lè w leve, ki soulaje pandan jounen an.",
      },
      {
        title: 'Jèn "kou telefòn"',
        desc: "Yon tansyon soud e ki kontinye nan baz kran an apre plizyè èdtan sou òdinatè oswa telefòn.",
      },
      {
        title: "Tansyon ki gaye",
        desc: "Sere ki gaye nan zepòl ak pati anwo do a, se pa sèlman kou a.",
      },
      {
        title: "Doulè fò oswa sibitman",
        desc: "Yon mouvman oswa ang espesifik ki lakòz yon doulè sibitman, souvan yon siy pou yon bagay ki plis striktirèl.",
      },
    ],
  },
  howWeTreat: {
    heading: "Kijan nou trete",
    items: treatmentCards([
      "Tansyon ki soti nan pòz kò, estrès, oswa pozisyon dòmi gen tandans akimile tankou ne nan kou ak zepòl. Zouti Graston travay tansyon sa a dirèkteman nan pwen espesifik kote li akimile.",
      "Rèd chak jou souvan soti nan ti fiksasyon nan vètèb sèvikal yo — segman ki pa bouje jan yo ta dwe. Ajisteman an remèt mouvman sa a.",
      "Pou ka espesifik doulè kou ki enplike yon disk oswa yon jwenti, traksyon kontwole ka diminye presyon ant vètèb yo. Evalyasyon an detèmine si sa apwopriye.",
      "Lè doulè kou a fè vire tèt pou kondwi vin twò enkonfòtab, nou pote egzamen an ak tretman an lakay ou.",
    ]),
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Angoudisman, pikotman, oswa feblès nan yon bra",
      "Gwo tèt fè mal, vètij, oswa konfizyon apre yon aksidan",
      "Doulè k ap vin pi mal vit olye pou l amelyore",
    ],
  },
  faq: {
    headerTail: "doulè kou a",
    items: [
      {
        q: "Èske li nòmal pou doulè kou gaye nan zepòl yo?",
        a: "Wi. Miskilati ak nè nan kou a konekte dirèkteman ak zepòl ak pati anwo do a, kidonk doulè ki gaye ak rèd nan zòn sa a komen ni nan doulè ki fèk kòmanse ni nan doulè kwonik.",
      },
      {
        q: "Èske yon kiwopratè ka ede ak yon nè kwense nan kou a?",
        a: "Swen kiwopratik ka apwopriye pou kèk kòz miskilo-eskeletik ki lakòz iritasyon nève. Premyèman, yon egzamen nesesè pou detèmine si yon ajisteman, travay tisi mou, revizyon imaj, oswa yon referans se pwochen etap ki pi sekiritè a.",
      },
      {
        q: "Konbyen tan li ka pran pou doulè kou a amelyore?",
        a: "Sa depann de kòz la, gravite a, ak konbyen tan ou gen sentòm yo. Dr. Abe reevalye repons ou nan swen an epi li ajiste plan an, olye pwomèt yon kantite vizit fiks.",
      },
      {
        q: "Èske m dwe ale menm si doulè kou a kòmanse gen kèk semèn?",
        a: "Wi. Yon evalyasyon ka ede idantifye faktè miskilo-eskeletik ak si swen kiwopratik oswa yon lòt kalite swen apwopriye, menm lè sentòm yo kòmanse gen kèk semèn.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/ht/kondisyon-nou-trete/antos-kou",
      "/ht/kondisyon-nou-trete/doule-do",
      "/ht/sevis/dekonpresyon-kolon",
      "/ht/kondisyon-nou-trete",
      "/ht/kiwoprate-pou-aksidan-machin",
      "/ht/mande-yon-randevou",
    ],
    highlightPath: "/ht/mande-yon-randevou",
  },
};

export const htWhiplash: HtCondition = {
  slug: "whiplash",
  path: "/ht/kondisyon-nou-trete/antos-kou",
  breadcrumb: "Antòs kou",
  hero: {
    eyebrowChip: "Antòs kou apre yon aksidan?",
    h1: "Kiwopratè pou Antòs Kou nan Deerfield Beach, FL",
    subhead:
      "Antòs kou (whiplash) se yon blesi nan kou ki koze pa yon mouvman sibitman ale-vini. Li komen nan kolizyon dèyè. Dr. Abe evalye rèd, mobilite limite, ak tèt fè mal ki gen rapò ak sa.",
    backgroundImage: {
      src: "/figma-exports/drabe-whiplash-man.png",
      alt: "Dr. Abe ap trete yon pasyan pou antòs kou",
    },
  },
  understanding: {
    eyebrow: "Konprann antòs kou",
    heading: "Santi w byen kote aksidan an pa vle di pa gen okenn blesi",
    paragraphs: [
      "Antòs kou rive lè tèt la deplase byen vit dèyè epi devan, sa fowse miskilati ak ligaman kou a pi lwen pase mouvman nòmal yo. Sentòm yo ka akimile nan èdtan oswa jou apre kolizyon an, pa nan moman an.",
      "Nan Florid, asirans PIP jeneralman egzije premye swen yo kòmanse nan 14 jou apre yon aksidan machin; kouvèti a depann de elijibilite ak tèm kontra asirans lan.",
    ],
    image: {
      src: "/figma-exports/drabe-whiplash.png",
      alt: "Evalyasyon kou yon pasyan pou antòs kou",
    },
  },
  list: {
    heading: "Sentòm komen",
    items: [
      "Doulè ak rèd nan kou ki vin pi mal jou apre aksidan an",
      "Tèt fè mal ki kòmanse nan baz kran an",
      "Mwens mouvman — difikilte pou vire tèt la",
      "Doulè zepòl ak pati anwo do a",
      "Pikotman oswa angoudisman nan bra yo",
    ],
  },
  feelsLike: {
    heading: "Kijan li santi",
    items: [
      {
        title: "Kòmansman ki reta",
        desc: "Santi w byen kote aksidan an epi reveye san ou pa ka vire kou ou.",
      },
      {
        title: "Rèd nan kou",
        desc: "Souvan premye sentòm lan: tèt di, limite, enkonfòtab lè w vire.",
      },
      {
        title: "Tèt fè mal",
        desc: "Souvan kòmanse nan baz kran an, pafwa jou apre chòk la.",
      },
      {
        title: "Mobilite redwi",
        desc: "Difikilte pou vire tèt la konplètman nan yon kote oswa toude kote.",
      },
    ],
  },
  howWeTreat: {
    heading: "Kijan nou trete",
    items: treatmentCards([
      "Nou itilize zouti Graston pou travay tisi sikatris ak espas miskilati nan kou ak pati anwo do a ki akimile apre yon kolizyon, sa ede rekipere mouvman nòmal tisi mou a.",
      "Apre yon antòs kou, kèk jwenti nan kou a ka gen mouvman limite. Si evalyasyon an sipòte l, yon ajisteman kontwole ka enkli.",
      "Lè rezilta yo sijere yon konplikasyon disk sèvikal, yo ka konsidere traksyon kontwole pou diminye presyon. Li itilize sèlman lè evalyasyon an sipòte sa.",
      "Vire tèt pou gade nan retwovizè yo souvan pi difisil bagay la nan kòmansman an. Nou vin lakay ou nan premye jou sa yo, lè kondwi poko reyalis.",
    ]),
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Angoudisman, pikotman, oswa feblès nan bra yo oswa men yo",
      "Gwo tèt fè mal, vètij, vomisman, oswa konfizyon",
      "Doulè k ap vin pi mal vit olye pou l amelyore",
    ],
  },
  faq: {
    headerTail: "antòs kou a",
    items: [
      {
        q: "Konbyen tan li pran pou antòs kou geri?",
        a: "Ka lejè souvan amelyore nan kèk semèn swen kontinye; blesi ki pi grav yo ka pran kèk mwa. Nou reevalye regilyèman epi nou ajiste plan ou pandan ou ap pwogrese.",
      },
      {
        q: 'Kisa "gwo pousantaj" antòs kou a vle di?',
        a: "Gwo pousantaj la dekri gravite a, soti nan sentòm nan kou san siy fizik jiska fraktur oswa dejwente. Yon pwofesyonèl kalifye dwe evalye blesi a olye pou l depann sèlman sou sentòm yo.",
      },
      {
        q: "Èske antòs kou ka lakòz tèt fè mal plizyè semèn apre?",
        a: "Wi. Tèt fè mal sèvikojenik, ki soti nan kou a, se youn nan sentòm ki reta yo pi komen nan antòs kou, e pafwa yo parèt byen lontan apre rèd inisyal la fin pase.",
      },
      {
        q: "Kijan kouvèti PIP la fonksyone pou vizit mwen?",
        a: "Nan Florid, PIP jeneralman egzije premye swen yo kòmanse nan 14 jou apre yon aksidan machin. Limit benefis yo ak peman an depann de elijibilite ou, kontra asirans ou, nesesite medikal, ak detay reklamasyon an.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/ht/kondisyon-nou-trete/doule-kou",
      "/ht/kondisyon-nou-trete/tet-fe-mal-sevikojenik",
      "/ht/sevis/terapi-tisi-mou",
      "/ht/kondisyon-nou-trete",
      "/ht/kiwoprate-pou-aksidan-machin",
      "/ht/mande-yon-randevou",
    ],
    highlightPath: "/ht/mande-yon-randevou",
  },
};

export const htSciatica: HtCondition = {
  slug: "sciatica",
  path: "/ht/kondisyon-nou-trete/syatik",
  breadcrumb: "Syatik",
  hero: {
    eyebrowChip: "Syatik oswa doulè nève k ap desann nan janm nan?",
    h1: "Kiwopratè pou Syatik nan Deerfield Beach, FL",
    subhead:
      "Evalyasyon ak tretman ki fokis sou dekonpresyon pou doulè syatik ak doulè nève ki gaye, ak vizit lakay lè sa apwopriye pou ka ou a.",
    backgroundImage: {
      src: "/figma-exports/drabe-backpain-front.png",
      alt: "Dr. Abe ap evalye yon pasyan pou syatik",
    },
  },
  understanding: {
    eyebrow: "Konprann syatik",
    heading: "Syatik pa rete sèlman nan do: li vwayaje",
    paragraphs: [
      "Doulè do komen rete nan pati anba do a. Syatik gaye: li desann nan ranch la ak janm nan paske rasin nève a li menm konprese oswa irite, se pa sèlman miskilati oswa jwenti ki alantou li.",
      "Yon kolizyon ka agrave pati anba do a epi kontribye nan sentòm ki gaye nan janm nan. Nan Florid, asirans PIP jeneralman egzije premye swen yo kòmanse nan 14 jou apre yon aksidan machin.",
    ],
    image: {
      src: "/figma-exports/drabe-back.png",
      alt: "Dr. Abe ap evalye pati anba do yon pasyan",
    },
  },
  list: {
    heading: "Sentòm komen",
    items: [
      "Doulè fò, k ap boule, oswa tankou yon chòk elektrik",
      "Doulè ki vin pi mal lè w chita oswa touse",
      "Angoudisman ak pikotman nan janm nan oswa pye a",
      "Feblès miskilè nan janm ki afekte a",
      "Doulè lokalize nan zòn ranch la",
    ],
  },
  feelsLike: {
    heading: "Kijan li santi",
    items: [
      {
        title: "Doulè ki gaye nan janm nan",
        desc: "Doulè ki vwayaje soti nan pati anba do a, pase pa ranch la, epi desann nan janm nan.",
      },
      {
        title: "Doulè file oswa k ap boule",
        desc: "Yon sansasyon fò, tankou elektrik, ki pase sou tout chemen nève syatik la.",
      },
      {
        title: "Angoudisman oswa pikotman",
        desc: "Sansasyon zegwi oswa pèt sansasyon espesyalman nan janm nan oswa pye a.",
      },
      {
        title: "Feblès miskilè",
        desc: 'Difikilte pou deplase pye a oswa janm nan, ki santi "lou" oswa ki pa reponn byen.',
      },
    ],
  },
  howWeTreat: {
    heading: "Kijan nou trete",
    items: treatmentCards([
      "Miskilati piriform la ak sa ki alantou li souvan vin tèt di alantou nève syatik la epi ogmante doulè a. Zouti Graston libere tansyon sa a dirèkteman nan zòn ki konprese nève a.",
      "Lè rezilta yo sijere mouvman jwenti limite nan zòn lonbè a kontribye nan sentòm yo, Dr. Abe ka enkli yon ajisteman kontwole nan plan an.",
      "Lè yon disk oswa yon retresisman alantou nève a ka kontribye nan sentòm yo, yo ka konsidere traksyon kontwole apre yo fin evalye si sa apwopriye.",
      "Syatik ka fè chita nan machin vin ensipòtab. Nou pote egzamen konplè a ak tretman an lakay ou lè vin nan konsiltasyon an pa reyalis.",
    ]),
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Feblès k ap ogmante nan janm nan oswa pye a",
      "Angoudisman nan zòn ren an oswa pati anndan kwis yo",
      "Pèdi kontwòl vesi oswa trip — chèche swen ijans",
    ],
  },
  faq: {
    headerTail: "syatik la",
    items: [
      {
        q: "Èske yon aksidan machin ka lakòz syatik?",
        a: "Yon aksidan machin ka agrave pati anba do a epi kontribye nan sentòm nève syatik, men yon egzamen nesesè pou idantifye kòz posib yo. Mansyone kolizyon an ak lè sentòm yo te parèt pandan evalyasyon w lan.",
      },
      {
        q: "Ki diferans ki genyen ant syatik ak doulè do komen?",
        a: "Doulè do komen rete nan pati anba do a. Syatik gaye: li desann nan ranch la ak janm nan paske gen yon rasin nève konprese, se pa sèlman miskilati oswa jwenti ki alantou li.",
      },
      {
        q: "Èske m ap bezwen operasyon pou yon èni disk?",
        a: "Pa nesesèman. Anpil moun kòmanse ak swen konsèvatif ki gide pa yon pwofesyonèl, men feblès k ap ogmante, sentòm grav, oswa sèten rezilta egzamen ka egzije yon evalyasyon medikal oswa chirijikal byen vit.",
      },
      {
        q: "Konbyen tan li konn pran pou syatik amelyore?",
        a: "Sa depann de kòz la ak gravite a. Yon epizòd miskilè ka evolye diferan de sentòm ki enplike yon disk oswa yon nève, kidonk Dr. Abe reevalye pwogrè a epi ajiste plan an jan nesesè.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/ht/kondisyon-nou-trete/doule-do",
      "/ht/sevis/dekonpresyon-kolon",
      "/ht/kondisyon-nou-trete",
      "/ht/kiwoprate-pou-aksidan-machin",
      "/ht/mande-yon-randevou",
    ],
    highlightPath: "/ht/mande-yon-randevou",
  },
};

export const htCervicogenicHeadache: HtCondition = {
  slug: "cervicogenic-headache",
  path: "/ht/kondisyon-nou-trete/tet-fe-mal-sevikojenik",
  breadcrumb: "Tèt fè mal sèvikojenik",
  hero: {
    eyebrowChip: "Tèt fè mal ki kòmanse apre yon aksidan machin?",
    h1: "Kiwopratè pou Tèt Fè Mal Sèvikojenik nan Deerfield Beach, FL",
    subhead:
      "Tèt fè mal sèvikojenik se yon doulè ki soti nan kou a. Dr. Abe evalye mobilite sèvikal la ak lòt faktè miskilo-eskeletik anvan li rekòmande swen.",
    backgroundImage: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Dr. Abe ap evalye yon pasyan pou tansyon nan kou ki gen rapò ak tèt fè mal",
    },
  },
  understanding: {
    eyebrow: "Konprann tèt fè mal sèvikojenik",
    heading: "Yon tèt fè mal ki reyèlman kòmanse nan kou a",
    paragraphs: [
      "Tèt fè mal sèvikojenik pa soti nan tèt la: se yon doulè ki soti nan jwenti, miskilati, oswa nève nan kou a. Se poutèt sa li ka kontinye menm si medikaman soulaje doulè a, e se poutèt sa evalyasyon an konsantre sou mouvman sèvikal la.",
      "Plizyè kalite tèt fè mal ka sanble youn ak lòt, kidonk yon pwofesyonèl dwe evalye sentòm yo. Yon tèt fè mal nouvo, fò, oswa k ap vin pi mal apre yon kolizyon bezwen yon evalyasyon medikal byen vit.",
    ],
    image: {
      src: "/figma-exports/align-thespne-neck.png",
      alt: "Evalyasyon kou ki gen rapò ak tèt fè mal",
    },
  },
  feelsLike: {
    heading: "Kijan li santi",
    items: [
      {
        title: "Jèn nan baz kran an",
        desc: "Kòmanse nan pati dèyè tèt la epi gaye devan.",
      },
      {
        title: "Presyon nan yon sèl kote",
        desc: "Rete nan yon sèl kote, diferan de yon tèt fè mal tansyon tipik.",
      },
      {
        title: "Vin pi mal ak mouvman",
        desc: "Vire oswa panche tèt la deklanche oswa entansifye doulè a.",
      },
      {
        title: "Ka kontinye ak medikaman",
        desc: "Medikaman ka soulaje doulè a san li pa trete faktè sèvikal la ki kontribye nan li.",
      },
    ],
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Yon tèt fè mal nouvo, fò, oswa k ap vin pi mal byen vit",
      "Konfizyon, vomisman, oswa pèt konesans apre yon aksidan",
      "Angoudisman, pikotman, oswa feblès nan bra oswa janm",
    ],
  },
  faq: {
    headerTail: "tèt fè mal sèvikojenik yo",
    items: [
      {
        q: "Èske yon aksidan machin ka lakòz tèt fè mal ki parèt plizyè semèn apre?",
        a: "Tèt fè mal ka kòmanse apre yon aksidan oswa vin pi evidan pita, men moman li parèt la pa idantifye kòz la pou kont li. Yon tèt fè mal nouvo, fò, oswa k ap vin pi mal apre yon kolizyon bezwen yon evalyasyon medikal byen vit.",
      },
      {
        q: "Kijan mwen konnen si tèt fè mal mwen soti nan kou a?",
        a: "Tèt fè mal sèvikojenik ka rete nan yon sèl kote epi vin pi mal ak mouvman kou a oswa ak mouvman limite. Yon pwofesyonèl dwe evalye sentòm yo paske plizyè kalite tèt fè mal ka sanble youn ak lòt.",
      },
      {
        q: "Èske medikaman doulè a ede?",
        a: "Medikaman ka diminye doulè a pou kèk moun, men li pa detèmine si kou a ap kontribye. Diskite kesyon medikaman ak moun ki preskri yo, epi chèche yon evalyasyon si sentòm yo kontinye.",
      },
      {
        q: "Konbyen vizit m ap bezwen?",
        a: "Sa depann de kòz la, rezilta egzamen an, ak repons nan swen an. Dr. Abe reevalye pwogrè a olye pwomèt yon kantite vizit fiks.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/ht/kondisyon-nou-trete/antos-kou",
      "/ht/kondisyon-nou-trete/doule-kou",
      "/ht/kondisyon-nou-trete",
      "/ht/kiwoprate-pou-aksidan-machin",
      "/ht/mande-yon-randevou",
    ],
    highlightPath: "/ht/mande-yon-randevou",
  },
};

export const htTmjJawPain: HtCondition = {
  slug: "tmj-jaw-pain",
  path: "/ht/kondisyon-nou-trete/doule-machwa-atm",
  breadcrumb: "ATM / doulè machwa",
  hero: {
    eyebrowChip: "Doulè, tansyon, oswa bri nan machwa a?",
    h1: "Kiwopratè pou ATM ak Doulè Machwa nan Deerfield Beach, FL",
    subhead:
      "Dr. Abe evalye mouvman jwenti machwa a, tansyon miskilè ozanviwon li, ak faktè sèvikal yo anvan li deside si swen kiwopratik ka apwopriye.",
    backgroundImage: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Dr. Abe ap evalye machwa yon pasyan",
    },
  },
  understanding: {
    eyebrow: "Konprann tòma ATM",
    heading: "Menm fòs ki lakòz antòs kou a rive jis nan machwa a",
    paragraphs: [
      "Jwenti tanpowomandibilè a sitiye a santimèt de kolòn sèvikal la, epi chòk ki lakòz yon antòs kou ka tansyone machwa a tou — sitou lè li sere pandan kolizyon an. Se poutèt sa doulè machwa ak doulè kou souvan parèt ansanm apre yon aksidan.",
      "Sentòm nan machwa a ka gen plizyè kòz, kidonk yon evalyasyon nesesè. Dr. Abe revize mouvman jwenti a, miskilati ozanviwon li, ak relasyon ak kou a anvan li deside si li apwopriye pou trete oswa voye pasyan an bay yon lòt pwofesyonèl.",
    ],
    image: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "Dr. Abe ap evalye kou ak machwa yon pasyan",
    },
  },
  feelsLike: {
    heading: "Kijan li santi",
    items: [
      {
        title: "Bri lè w ouvri",
        desc: "Yon klik oswa yon so lè w ouvri bouch la oswa manje.",
      },
      {
        title: "Tansyon nan machwa a",
        desc: "Doulè oswa rèd nan jwenti a, pafwa lè w leve.",
      },
      {
        title: "Difikilte pou manje",
        desc: "Jèn ki parèt lè w manje oswa lè w ouvri bouch la konplètman.",
      },
      {
        title: "Tèt fè mal ki soti nan machwa a",
        desc: "Doulè ki soti nan jwenti machwa a e pa nan kou a.",
      },
    ],
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Machwa bloke, ki pa ouvri oswa ki pa fèmen",
      "Anfle oswa doulè fò nan jwenti a apre yon frap",
      "Angoudisman nan figi a apre yon aksidan",
    ],
  },
  faq: {
    headerTail: "ATM ak doulè machwa a",
    items: [
      {
        q: "Èske yon aksidan machin reyèlman ka lakòz pwoblèm ATM?",
        a: "Yon kolizyon ka fowse jwenti machwa a oswa miskilati ozanviwon li, sitou lè machwa a sere pandan chòk la. Yon evalyasyon nesesè paske sentòm nan machwa a ka gen plizyè kòz.",
      },
      {
        q: "Kijan li santi lè gen yon dezòd nan ATM?",
        a: "Siy komen yo enkli bri lè w ouvri bouch la, doulè oswa tansyon nan machwa a, difikilte pou manje, ak tèt fè mal ki soti nan jwenti machwa a e pa nan kou a.",
      },
      {
        q: "Kijan yo trete yon dezòd nan ATM?",
        a: "Tretman an depann de sa evalyasyon an jwenn: li ka enkli mobilizasyon dous nan jwenti a, travay tisi mou nan miskilati ozanviwon li, ak konsèy sou abitid, tankou sere machwa a, ki kontinye agrave sitiyasyon an.",
      },
      {
        q: "Konbyen vizit m ap bezwen?",
        a: "Sa varye selon kòz la, rezilta egzamen an, ak faktè kontinyèl tankou sere oswa gwense dan. Dr. Abe reevalye pwogrè a olye pwomèt yon kantite vizit fiks.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/ht/kondisyon-nou-trete/doule-kou",
      "/ht/kondisyon-nou-trete/tet-fe-mal-sevikojenik",
      "/ht/kondisyon-nou-trete",
      "/ht/kiwoprate-pou-aksidan-machin",
      "/ht/mande-yon-randevou",
    ],
    highlightPath: "/ht/mande-yon-randevou",
  },
};

export const htConcussion: HtCondition = {
  slug: "concussion",
  path: "/ht/kondisyon-nou-trete/konmosyon-serebral",
  breadcrumb: "Konmosyon serebral",
  hero: {
    eyebrowChip: "Ou frape tèt ou oswa ou santi tèt vire apre yon aksidan?",
    h1: "Sentòm Konmosyon Serebral Apre yon Aksidan Machin",
    subhead:
      "Yon konmosyon serebral se yon blesi serebral tramatik lejè ki bezwen evalyasyon medikal. Swen kiwopratik pa ranplase yon evalyasyon ijans oswa nerolojik.",
    backgroundImage: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Dr. Abe ap evalye yon pasyan apre yon aksidan machin",
    },
  },
  understanding: {
    eyebrow: "Konprann konmosyon serebral",
    heading: "Premyèman evalyasyon medikal — toujou",
    paragraphs: [
      "Yon konmosyon serebral ka rive san pèt konesans e san yon frap dirèk sou tèt la: li sifi pou fòs kolizyon an deplase sèvo a anndan kran an. Nenpòt moun ki gen posib sentòm apre yon aksidan dwe resevwa yon evalyasyon medikal apwopriye.",
      "Paj sa a se enfòmasyon jeneral. Align the Spine pa dyagnostike ni trete blesi serebral la limenm. Apre yon evalyasyon medikal, Dr. Abe ka evalye separeman sentòm nan kou a oswa sentòm miskilo-eskeletik epi detèmine si swen oswa yon referans apwopriye.",
    ],
    image: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Evalyasyon yon pasyan apre yon aksidan machin",
    },
  },
  list: {
    heading: "Sentòm klasik",
    items: [
      "Tèt fè mal oswa presyon nan tèt la",
      "Vètij oswa pwoblèm ekilib",
      "Sansiblite ak limyè oswa bri",
      "Fatig oswa chanjman nan somèy",
      "Iritabilite oswa chanjman imè",
    ],
    note: "Chèche evalyasyon medikal byen vit devan posib sentòm konmosyon apre yon aksidan, ak swen ijans si sentòm yo grav oswa yo vin pi mal.",
  },
  howWeTreat: {
    heading: "Kijan wòl nou fonksyone",
    items: [
      {
        title: "Premyèman evalyasyon medikal",
        desc: "Posib sentòm konmosyon egzije evalyasyon yon pwofesyonèl medikal apwopriye. Siy alèt yo pa dwe tann pou yon vizit kiwopratik.",
        image: {
          src: "/figma-exports/how-we-treat-1.png",
          alt: "Evalyasyon medikal apre yon aksidan",
        },
        meta: "Sekirite an premye",
        ctaLabel: "RELE KABINÈ A",
        ctaHref: "/ht/kontakte-nou",
      },
      {
        title: "Revizyon kou ak antòs kou",
        desc: "Apre yo fin egzeyate pasyan an nan kad medikal, Dr. Abe ka evalye si genyen tou doulè kou, rèd, oswa pwoblèm miskilo-eskeletik ki gen rapò ak yon antòs kou.",
        image: {
          src: "/figma-exports/adjustment-image.jpeg",
          alt: "Evalyasyon kou apre egzeyasyon medikal",
        },
        meta: "Apre egzeyasyon an",
        ctaLabel: "GADE ANTÒS KOU",
        ctaHref: "/ht/kondisyon-nou-trete/antos-kou",
      },
      {
        title: "Swen sèlman lè li apwopriye",
        desc: "Nenpòt swen kiwopratik limite a rezilta miskilo-eskeletik ki apwopriye epi li kowòdone ak konsèy medikal lè gen sentòm konmosyon nan tablo a.",
        image: {
          src: "/figma-exports/how-we-treat-3.png",
          alt: "Swen kiwopratik kowòdone ak konsèy medikal",
        },
        meta: "Ka pa ka",
        ctaLabel: "MANDE RANDEVOU",
        ctaHref: "/ht/mande-yon-randevou",
      },
      {
        title: "Reevalyasyon kontinyèl",
        desc: "Nouvo sentòm nerolojik, tèt fè mal k ap vin pi mal, vomisman repetitif, konfizyon, feblès, oswa pèt konesans egzije swen medikal ijan.",
        image: {
          src: "/figma-exports/how-we-treat-4.png",
          alt: "Swiv sentòm apre yon konmosyon",
        },
        meta: "Aprann siy alèt yo",
        ctaLabel: "GADE SIY ALÈT YO",
        ctaHref: "/ht/kiwoprate-pou-aksidan-machin",
      },
    ],
  },
  warning: {
    heading: "Chèche swen ijans imedyatman si youn nan sa yo parèt:",
    bullets: [
      "Pèt konesans, menm si li kout",
      "Tèt fè mal k ap vin pi mal, vomisman repetitif, oswa kriz konvilsyon",
      "Konfizyon, difikilte pou pale, feblès, oswa angoudisman",
    ],
  },
  faq: {
    headerTail: "konmosyon serebral la ak swen apre",
    items: [
      {
        q: "Èske se posib pou gen yon konmosyon san pèdi konesans ni frape tèt?",
        a: "Wi. Yon konmosyon serebral ka rive san pèt konesans e san yon frap dirèk sou tèt la. Nenpòt moun ki gen posib sentòm apre yon aksidan dwe resevwa yon evalyasyon medikal apwopriye.",
      },
      {
        q: "Konbyen tan sentòm konmosyon konn dire?",
        a: "Tan rekiperasyon an varye. Tèt fè mal ki kontinye, vètij, pwoblèm konsantrasyon, oswa lòt sentòm dwe evalye pa yon pwofesyonèl medikal apwopriye, olye pou yo jije selon yon delè fiks.",
      },
      {
        q: "Èske swen kiwopratik san danje apre yon konmosyon?",
        a: "Swen kiwopratik pa dyagnostike ni trete blesi serebral la limenm. Apre yon evalyasyon medikal apwopriye, Dr. Abe ka evalye separeman sentòm nan kou a oswa sentòm miskilo-eskeletik epi detèmine si swen oswa yon referans apwopriye.",
      },
      {
        q: "Poukisa konmosyon ak antòs kou souvan pa remake ansanm?",
        a: "De kondisyon sa yo ka pataje sentòm apre yon kolizyon, ki gen ladan tèt fè mal ak vètij. Evalyasyon medikal la okipe posib blesi serebral la, pandan yon egzamen miskilo-eskeletik apa ka evalye doulè kou a oswa antòs kou a apre egzeyasyon an.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/ht/kondisyon-nou-trete/antos-kou",
      "/ht/kondisyon-nou-trete/doule-kou",
      "/ht/kondisyon-nou-trete",
      "/ht/kiwoprate-pou-aksidan-machin",
      "/ht/mande-yon-randevou",
    ],
    highlightPath: "/ht/mande-yon-randevou",
  },
};

/** Every Haitian Creole condition, in the same order the Spanish/Portuguese
 * hubs render them. */
export const htConditions: HtCondition[] = [
  htBackPain,
  htNeckPain,
  htWhiplash,
  htSciatica,
  htConcussion,
  htCervicogenicHeadache,
  htTmjJawPain,
];

/** Shared section copy for the Haitian Creole condition template. */
export const htConditionPageCopy = {
  readyHeading: "Lè ou pare",
  readyBody:
    "Mande yon evalyasyon nan kabinè a, oswa mande si yon vizit lakay apwopriye pou ka ou a ak kote ou ye a.",
  readyCta: "Mande evalyasyon mwen",
  relatedHeading: "Kondisyon ak tretman ki gen rapò",
  accidentEyebrow: "Èske se te akoz yon aksidan?",
  callEyebrow: "Ann pale jodi a",
};
