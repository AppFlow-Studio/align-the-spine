import type { ServiceCardItem } from "@/components/ui/service-card";
import type { DoctorRating } from "@/content/doctor-profile";
import type { Service } from "@/content/services";
import type { SpineOverviewContent } from "@/content/spine-overview";
import { verified } from "@/content/verified-value";
import type { WhyChooseContent } from "@/content/why-choose";

/** Brazilian Portuguese copy for the /pt home page (ATS-SEO-135).
 *
 * Written against Brazilian Portuguese search intent, not translated
 * sentence-by-sentence from the English or Spanish copy — "quiroprático" is
 * the head term Brazilian searchers actually use, and phrasing throughout
 * follows Brazilian Portuguese grammar and vocabulary (not European
 * Portuguese: "você" not "tu", "ônibus"-style everyday register).
 *
 * Same claim discipline as the English and Spanish sides: nothing here
 * promises relief, recovery, cure, or coverage, and no credential, service,
 * or statistic appears that isn't already verified in content/site.ts or
 * content/doctor-profile.ts. "Pode" and "de acordo com sua avaliação" do the
 * same hedging work the English "may"/"can help" does.
 */

export const ptHomeHero = {
  /** H1. Mirrors the English/Spanish hero's two-line split and matches this
   * route's <title>, "Quiroprático em Deerfield Beach, FL". */
  titleLines: ["Quiroprático em", "Deerfield Beach, FL"] as const,
  /** Mirrors the English "We accept cash visits" / Spanish "Aceptamos pagos
   * en efectivo" — no dollar figure, matching the upstream removal of the
   * "$50 office visit" badge from the English hero. */
  badge: "Aceitamos pagamento à vista",
  subhead:
    "Atendimento quiroprático em Deerfield Beach para dor nas costas, dor no pescoço, mobilidade e lesões — com avaliações focadas após acidente de carro.",
  callPillEyebrow: "Vamos conversar hoje",
  /** The English hero carries a note telling Spanish speakers the doctor
   * speaks their language; the Spanish hero carries the reciprocal note.
   * There's no equivalent verified claim for Portuguese — content/site.ts's
   * `bilingualCare` is verified for English/Spanish only ("EN/ES",
   * 2026-08-11), not Portuguese, so this page does not assert the doctor
   * speaks Portuguese. NEEDS LINGUISTIC/FACTUAL REVIEW if that changes: a
   * verified Portuguese-language claim should be added here to match the
   * Spanish page's bilingualNote, but only once it's actually confirmed. */
  form: {
    heading: "Solicite sua avaliação quiroprática",
    submitLabel: "Solicitar minha avaliação",
    footerNote:
      "Venha nos visitar em Deerfield Beach, ou ligue para perguntar se um atendimento a domicílio é indicado para o seu caso e sua localização.",
  },
};

/** Section headings the Portuguese home page passes into shared components. */
export const ptHomeSections = {
  servicesHeading: "Serviços quiropráticos",
  accidentInjuriesEyebrow: "O que tratamos",
  accidentInjuriesHeading: "Lesões comuns por acidente que tratamos",
};

/** Portuguese rendering of content/services.ts's `services`. `slug` values
 * are unchanged — they're the anchor ids Service schema and any inbound
 * #fragment link use, not visitor-facing. The gated "New Patient Special"
 * entry is absent for the same reason it's absent from the English/Spanish
 * lists: it bundles an X-ray-equipment claim and a pricing offer without
 * sign-off (ATS-E4 4.9/4.13). */
export const ptServices: Service[] = [
  {
    slug: "myofascial-release-trigger-point",
    name: "Liberação miofascial / pontos-gatilho",
    duration: "1 h",
    summary:
      "O Dr. Abe utiliza uma ferramenta Graston e pressão direcionada para trabalhar a tensão muscular e a mobilidade restrita dos tecidos moles, de forma parecida com uma massagem profunda focada.",
    image: {
      src: "/figma-exports/drabe-releasetool.png",
      alt: "Liberação miofascial e terapia de pontos-gatilho com uma ferramenta Graston",
    },
  },
  {
    slug: "cupping-therapy",
    name: "Terapia de ventosas",
    duration: "1 h",
    summary:
      "A terapia de ventosas aplica sucção localizada em áreas selecionadas de tensão muscular e pode ser incluída, quando indicado, para desconfortos no pescoço, nas costas ou em outros tecidos moles.",
    image: {
      src: "/figma-exports/cupping-drabe.png",
      alt: "Sessão de terapia de ventosas",
    },
  },
  {
    slug: "adjustment",
    name: "Ajuste quiroprático",
    duration: "1 h",
    summary:
      "Os ajustes quiropráticos aplicam pressão controlada para melhorar o movimento de articulações selecionadas do pescoço, da parte média ou da parte baixa das costas, após uma avaliação adequada.",
    image: {
      src: "/figma-exports/drabeadjust.png",
      alt: "Dr. Abe realizando um ajuste quiroprático",
    },
  },
  {
    slug: "traction-decompression",
    name: "Tração / descompressão",
    duration: "1 h",
    summary:
      "A tração e a descompressão da coluna aplicam uma tração controlada para desconfortos selecionados no pescoço ou na parte baixa das costas. Os parâmetros são definidos com base na avaliação e ajustados para cada paciente.",
    image: {
      src: "/figma-exports/drabe-traction_compression.png",
      alt: "Terapia de tração e descompressão da coluna",
    },
  },
  {
    slug: "car-accidents",
    name: "Acidentes de carro",
    duration: "1 h",
    summary:
      "Depois de um acidente de carro, solicite uma avaliação quiroprática para dor no pescoço, dor nas costas, rigidez, sintomas de torcicolo cervical e outros desconfortos musculoesqueléticos.",
    image: {
      src: "/figma-exports/drabe-consult.png",
      alt: "Consulta com o Dr. Abe após um acidente de carro",
    },
  },
];

/** Portuguese rendering of content/accident-injuries.ts. Same six entries,
 * same images, same slugs. Summaries describe what the injury is and what
 * the care addresses — never an outcome. */
export const ptAccidentInjuries: ServiceCardItem[] = [
  {
    slug: "whiplash",
    name: "Torcicolo cervical",
    duration: "",
    summary:
      "Distensão no pescoço, rigidez e menor amplitude de movimento causadas por um impacto repentino.",
    image: {
      src: "/figma-exports/drabe-whiplash.png",
      alt: "Tratamento de torcicolo cervical",
    },
  },
  {
    slug: "lower-back-pain",
    name: "Dor lombar",
    duration: "",
    summary:
      "Trabalho de alinhamento para tratar a compressão da coluna lombar e os espasmos musculares deixados por colisões traseiras.",
    image: {
      src: "/figma-exports/drabe-backpain.png",
      alt: "Tratamento de dor lombar",
    },
  },
  {
    slug: "herniated-disc",
    name: "Hérnia de disco",
    duration: "",
    summary:
      "Técnicas de descompressão para aliviar a pressão sobre os nervos causada pelo deslocamento de um disco.",
    image: {
      src: "/figma-exports/drabe-herniated%20disc.png",
      alt: "Tratamento de hérnia de disco",
    },
  },
  {
    slug: "shoulder-extremity",
    name: "Ombro e extremidades",
    duration: "",
    summary:
      "Atendimento para o trauma no ombro causado pelo cinto de segurança e para lesões articulares em braços e pernas.",
    image: {
      src: "/figma-exports/drabe-shoulder.png",
      alt: "Tratamento de ombro e extremidades",
    },
  },
  {
    slug: "headaches",
    name: "Dores de cabeça",
    duration: "",
    summary:
      "Ajustes na região cervical alta para aliviar dores de cabeça e tensão que surgem após um trauma.",
    image: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Tratamento de dores de cabeça",
    },
  },
  {
    slug: "soft-tissue",
    name: "Tecidos moles",
    duration: "",
    summary:
      "Liberação miofascial para contusões musculares profundas e distensões de ligamentos em qualquer parte do corpo.",
    image: {
      src: "/figma-exports/drabe-soft-tissue.png",
      alt: "Tratamento de tecidos moles",
    },
  },
];

/** Portuguese rendering of content/why-choose.ts. The rating reuses the
 * same already-verified figure the English/Spanish versions reuse — not a
 * second, independently-asserted claim. "Align the Spine Chiropractic"
 * stays untranslated — it's the business's legal name and its search
 * entity, and translating it would break NAP consistency across languages. */
export const ptWhyChooseContent: WhyChooseContent = {
  headingLines: ["Por que escolher", "a Align the Spine", "Chiropractic"],
  body: "Da dor nas costas do dia a dia e lesões esportivas até a recuperação após um acidente, a Align the Spine nasceu de uma ideia: um bom atendimento quiroprático deveria estar ao alcance de todos. Preços claros, explicados sem rodeios. E um doutor que conhece você pelo nome — porque na Align the Spine, quem atende é sempre o Dr. Abe.",
  cta: { label: "Solicitar uma consulta", href: "/pt/solicitar-consulta" },
  rating: verified<DoctorRating>(
    { value: 5, count: 152, location: "Deerfield Beach, Florida" },
    "Matches the already-verified review count in siteConfig.stats",
    "2026-09-02",
  ),
  image: {
    src: "/figma-exports/interior-table.png",
    alt: "Sala de atendimento da Align the Spine",
  },
};

/** Portuguese rendering of content/spine-overview.ts's static home-page
 * spine diagram. `id`, `position` and `labelSide` are layout data, not
 * copy, and are unchanged — only `name`/`description` and the alt text are
 * Portuguese. Region names keep the clinical Latin term with the
 * plain-language gloss in parentheses, the same shape the English/Spanish
 * use ("Cervical (Neck)" / "Cervical (cuello)"). */
export const ptSpineOverviewContent: SpineOverviewContent = {
  eyebrow: "Entenda sua coluna",
  heading: "Sua coluna controla tudo",
  image: {
    src: "/figma-exports/spine-straight-poster.jpg",
    alt: "Uma coluna que passa de uma postura curvada para uma postura ereta e alinhada",
  },
  video: "https://align-the-spine.b-cdn.net/images/spine-straight.mp4",
  videoPoster: "/figma-exports/spine-hunched-poster.jpg",
  segments: [
    {
      id: "cervical",
      name: "Cervical (pescoço)",
      description:
        "Dores de cabeça, rigidez no pescoço e tensão nos ombros: a maioria começa aqui.",
      position: { x: 52, y: 22 },
      labelSide: "left",
    },
    {
      id: "thoracic",
      name: "Torácica (parte média das costas)",
      description: "A fonte de dor mais comum. Sustenta a maior parte do peso do corpo.",
      position: { x: 52, y: 44 },
      labelSide: "right",
    },
    {
      id: "lumbar",
      name: "Lombar (parte baixa das costas)",
      description:
        "A má postura, o trabalho sentado e o estresse comprimem essa região todos os dias.",
      position: { x: 52, y: 61 },
      labelSide: "left",
    },
    {
      id: "sacral",
      name: "Sacra (base)",
      description:
        "A dor no quadril, a ciática e o desconforto nervoso costumam começar nessa região.",
      position: { x: 52, y: 76 },
      labelSide: "right",
    },
  ],
};
