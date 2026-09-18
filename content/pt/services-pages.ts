import type { AdjustmentsStep } from "@/content/adjustments-page";
import type { ConditionFaq } from "@/content/conditions/types";
import type { MassageCondition, MassageTechnique } from "@/content/massage-soft-tissue-page";
import type {
  DecompressionCondition,
  DecompressionStep,
} from "@/content/spinal-decompression-page";

/** Brazilian Portuguese content for the four `/pt/servicos/*` pages
 * (ATS-SEO-135 follow-up), translated from content/es/services-pages.ts —
 * the vetted reference per docs/multilingual-seo-baseline.md.
 *
 * Structure mirrors the Spanish/English modules exactly (same fields, same
 * images, same ordering) so the Portuguese pages compose from the same
 * section components. What differs is the prose.
 *
 * ── Claim discipline ────────────────────────────────────────────────────
 * These pages carry clinical guidance, which is exactly why their English
 * originals are still `status: "draft"` (noindex, out of the sitemap)
 * pending a clinician's sign-off. The Portuguese pages are registered
 * `draft` too — `content/i18n.test.ts` enforces that a Portuguese page can't
 * be published while its English original isn't. Nothing here adds,
 * broadens, or softens a clinical claim relative to the Spanish source:
 * every hedge ("quando indicado", "após uma avaliação", "pode") maps to a
 * Spanish "cuando corresponde" / "después de una evaluación" / "puede", and
 * no outcome, timeframe, or coverage is promised.
 *
 * NEEDS LINGUISTIC REVIEW: this content was machine-translated by an LLM
 * with no verified native Brazilian Portuguese fluency — see
 * content/pt/conditions.ts's identical note. Flag for review before
 * promoting out of draft.
 */

// ──────────────────────────────────── /pt/servicos/ajustes-quiropraticos

export const ptAdjustmentsHero = {
  eyebrowChip: "Rigidez articular ou movimento limitado?",
  h1: "Ajustes Quiropráticos em Deerfield Beach, FL",
  subhead:
    "Ajustes quiropráticos manuais aplicam pressão controlada para melhorar o movimento de uma articulação. O Dr. Abe avalia seus sintomas e sua segurança antes de tratar.",
  backgroundImage: {
    src: "/figma-exports/adjustments-hero.png",
    alt: "Sala de tratamento preparada para um ajuste quiroprático",
  },
};

export const ptAdjustmentsHowItWorks: AdjustmentsStep[] = [
  {
    title: "Avaliação completa",
    description:
      "Identificamos quais segmentos perderam mobilidade na colisão e descartamos primeiro qualquer achado que exija exames de imagem ou um encaminhamento médico.",
    learnMoreHref: "/pt/quiropratico-acidentes-de-carro",
  },
  {
    title: "Ajuste manual",
    description:
      "O Dr. Abe aplica pressão precisa e controlada sobre a articulação adequada, de acordo com os achados do seu exame e o seu conforto.",
    learnMoreHref: "/pt/servicos",
  },
  {
    title: "Plano e reavaliação",
    description:
      "A frequência das consultas depende dos seus sintomas e da sua resposta ao atendimento. Os achados relacionados ao acidente ficam documentados quando indicado para o seu sinistro.",
    learnMoreHref: "/pt/quiropratico-acidentes-de-carro",
  },
];

export const ptAdjustmentsFaq: ConditionFaq = {
  headerTail: "os ajustes quiropráticos",
  items: [
    {
      q: "Um ajuste dói?",
      a: "A maioria dos pacientes sente pressão ou uma liberação, não dor. É comum alguma sensibilidade depois, parecida com a de começar um alongamento ou exercício novo. Ajustamos a abordagem se algo não parecer certo durante a sua consulta.",
    },
    {
      q: "É seguro fazer um ajuste depois de um acidente de carro?",
      a: "Pode ser indicado uma vez que uma avaliação descarte achados que exijam exames de imagem, atendimento urgente ou um encaminhamento. A primeira consulta começa com um exame, não presumindo que o ajuste é indicado.",
    },
    {
      q: "Qual é a diferença entre um ajuste e uma massagem?",
      a: "A massagem trabalha o tecido mole ao redor da articulação; o ajuste atua na própria articulação, devolvendo movimento a um segmento que parou de se mover bem (uma fixação), que muitas vezes é a verdadeira origem da dor.",
    },
    {
      q: "Quantos ajustes vou precisar?",
      a: "Depende da condição, dos achados do exame e da sua resposta ao atendimento. O Dr. Abe reavalia o progresso em vez de prometer de antemão um número fixo de consultas ou um pacote.",
    },
  ],
};

// ───────────────────────────────────── /pt/servicos/descompressao-da-coluna

export const ptDecompressionHero = {
  eyebrowChip: "Dor de disco ou dor nervosa irradiada?",
  h1: "Descompressão da Coluna em Deerfield Beach, FL",
  subhead:
    "A descompressão da coluna não cirúrgica usa tração controlada para reduzir a pressão sobre as articulações e discos da coluna. Uma avaliação determina se é indicada para o seu caso.",
  backgroundImage: {
    src: "/figma-exports/spinal-decompression-hero.png",
    alt: "Sala de tratamento preparada para terapia de descompressão da coluna",
  },
};

export const ptDecompressionHowItWorks: DecompressionStep[] = [
  {
    title: "Avaliação completa e revisão de imagens",
    description:
      "Confirmamos se a colisão causou ou agravou uma lesão de disco, e revisamos os exames de imagem que você já tenha.",
    learnMoreHref: "/pt/quiropratico-acidentes-de-carro",
  },
  {
    title: "Sessões de tração controlada",
    description:
      "Aplica-se uma tração específica sobre a coluna, aliviando gradualmente a pressão que o acidente deixou sobre o disco e o nervo.",
    learnMoreHref: "/pt/servicos/descompressao-da-coluna",
  },
  {
    title: "Plano e reavaliação",
    description:
      "A frequência das sessões depende dos seus achados e da sua resposta. O atendimento relacionado ao acidente é documentado para o seu sinistro quando indicado.",
    learnMoreHref: "/pt/quiropratico-acidentes-de-carro",
  },
];

export const ptDecompressionConditions: DecompressionCondition[] = [
  {
    name: "Ciática",
    description:
      "Dor irradiada para a perna que pode envolver irritação ou compressão de um nervo da lombar.",
    image: {
      src: "/figma-exports/adjustment-image.jpeg",
      alt: "Quiroprático tratando a lombar de um paciente por ciática",
    },
  },
  {
    name: "Lesão de disco por torcicolo cervical",
    description: "Quando a colisão afeta o próprio disco, não apenas o tecido mole ao redor.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-whiplash.png",
      alt: "Mão avaliando o pescoço de um paciente por uma lesão de disco depois de um torcicolo cervical",
    },
  },
  {
    name: "Hérnia de disco (costas)",
    description:
      "Uma condição de disco na lombar que pode irritar nervos próximos e afetar o movimento.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-herniated%20disc.png",
      alt: "Mãos tratando a lombar de um paciente por uma hérnia de disco",
    },
  },
  {
    name: "Hérnia de disco (pescoço)",
    description:
      "Quando a força do impacto afeta um disco do pescoço, não apenas o músculo ao redor.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-head.png",
      alt: "Mãos tratando o pescoço de um paciente por uma hérnia de disco",
    },
  },
];

export const ptDecompressionFaq: ConditionFaq = {
  headerTail: "a descompressão da coluna",
  items: [
    {
      q: "Um acidente de carro pode causar uma hérnia de disco?",
      a: "Uma colisão pode lesionar ou agravar um disco da coluna, mas os sintomas por si só não confirmam uma hérnia. Uma avaliação e a revisão dos exames de imagem adequados ajudam a determinar a origem mais provável.",
    },
    {
      q: "A descompressão da coluna dói?",
      a: "A descompressão da coluna usa tração controlada e se ajusta ao seu conforto. Avise o Dr. Abe se sentir dor ou sintomas incomuns durante ou depois de uma sessão para que o plano possa ser reavaliado.",
    },
    {
      q: "Qual é a diferença em relação a um ajuste quiroprático?",
      a: "O ajuste devolve movimento a uma articulação com um impulso rápido e controlado. Já a descompressão aplica uma tração lenta e sustentada para gerar pressão negativa dentro do disco. Com frequência são usadas juntas, de acordo com o que a avaliação encontrar.",
    },
    {
      q: "Quantas sessões vou precisar depois de um acidente?",
      a: "O número de sessões depende dos achados do exame e da resposta ao atendimento. O Dr. Abe reavalia o progresso e documenta o tratamento relacionado ao acidente quando indicado.",
    },
  ],
};

// ────────────────────────────── /pt/servicos/terapia-de-tecidos-moles

export const ptMassageHero = {
  eyebrowChip: "Tensão muscular ou dor nos tecidos moles?",
  h1: "Massagem e Terapia de Tecidos Moles em Deerfield Beach, FL",
  subhead:
    "Atendimento direcionado de tecidos moles para tensão muscular, mobilidade restrita e dor após uma lesão, selecionado depois de uma avaliação quiroprática do Dr. Abe.",
  backgroundImage: {
    src: "/figma-exports/massage-soft-tissue-hero.png",
    alt: "Sala de tratamento de massagem e terapia de tecidos moles",
  },
};

export const ptMassageTechniques: MassageTechnique[] = [
  {
    title: "Técnica Graston / pontos-gatilho",
    description:
      "Utiliza uma ferramenta de aço inoxidável para trabalhar o tecido cicatricial e o espasmo muscular deixados por uma colisão — parecido com uma massagem profunda, mas mais direcionado.",
    bestFor: "espasmo muscular, tecido cicatricial, tensão crônica",
    image: {
      src: "/figma-exports/drabe-releasetool.png",
      alt: "Tratamento de tecidos moles com a técnica Graston",
    },
  },
  {
    title: "Liberação miofascial",
    description:
      "A pressão sustentada sobre a fáscia ao redor dos músculos libera a tensão acumulada nos dias seguintes ao impacto.",
    bestFor: "movimento restrito, rigidez por torcicolo cervical",
    image: {
      src: "/figma-exports/drabe-backpain.png",
      alt: "Tratamento de liberação miofascial",
    },
  },
  {
    title: "Terapia de tecido profundo",
    description:
      "A pressão lenta e firme alcança as camadas musculares mais profundas afetadas por contusões ou distensões do acidente.",
    bestFor: "contusões profundas, contratura muscular, dor após um acidente",
    image: {
      src: "/figma-exports/drabe-soft-tissue.png",
      alt: "Tratamento de terapia de tecido profundo",
    },
  },
];

export const ptMassageConditions: MassageCondition[] = [
  {
    name: "Torcicolo cervical",
    description:
      "Trabalha o espasmo e a contratura muscular ao redor do pescoço depois de uma avaliação adequada.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-whiplash.png",
      alt: "Mão avaliando o pescoço de um paciente depois de um torcicolo cervical",
    },
  },
  {
    name: "Dor no pescoço",
    description:
      "Para a tensão e a rigidez que seguem uma colisão, não apenas o desconforto do dia a dia.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/dr-abe-neck.png",
      alt: "Dr. Abe Nasser tratando o pescoço e o ombro de um paciente",
    },
  },
  {
    name: "Dor nas costas",
    description:
      "Trabalha o espasmo muscular que pode acompanhar uma lesão nas costas, de disco ou articular.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-backpain-front.png",
      alt: "Mãos tratando a lombar de um paciente",
    },
  },
  {
    name: "Ombro e extremidades",
    description:
      "Contusões e trauma de tecidos moles em braços e ombros causados pelo cinto de segurança.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/align-the-spine-shoulders.png",
      alt: "Mãos tratando o ombro de um paciente",
    },
  },
];

export const ptMassageFaq: ConditionFaq = {
  headerTail: "a terapia de tecidos moles",
  items: [
    {
      q: "O trabalho de tecidos moles ajuda logo depois de um acidente de carro?",
      a: "Pode ser indicado uma vez que uma avaliação descarte lesões que exijam atendimento urgente ou um encaminhamento. Mencione a colisão e quando os sintomas apareceram para que o Dr. Abe escolha uma técnica adequada e documente a consulta.",
    },
    {
      q: "Qual é a diferença em relação a uma massagem comum?",
      a: "Uma massagem comum busca relaxamento geral; isto é um tratamento direcionado ao tecido específico afetado pela colisão — Graston, liberação miofascial ou tecido profundo, dependendo se é tecido cicatricial, rigidez da fáscia ou contusão profunda.",
    },
    {
      q: "Isso é coberto pelo meu sinistro do acidente?",
      a: "Se a sua lesão está relacionada ao acidente, documentamos cada sessão para que fique registrada no seu sinistro. Os detalhes de cobertura dependem da sua apólice — ajudamos no que for possível.",
    },
    {
      q: "Quantas sessões vou precisar depois de um acidente?",
      a: "Varia de acordo com a lesão e a resposta ao atendimento. O Dr. Abe reavalia seus sintomas em vez de prometer de antemão um número fixo de sessões ou um pacote.",
    },
  ],
};

// ──────────────────────────────────── /pt/servicos/terapia-de-ventosas

export const ptCuppingHero = {
  eyebrowChip: "Tensão muscular localizada?",
  h1: "Terapia de Ventosas em Deerfield Beach, FL",
  subhead:
    "Sucção localizada aplicada em áreas selecionadas de tensão muscular, usada quando indicado junto com uma avaliação quiroprática do Dr. Abe.",
  backgroundImage: {
    src: "/figma-exports/cupping-drabe.png",
    alt: "Sessão de terapia de ventosas",
  },
};

/** Related-link paths for the Portuguese cupping page — the Portuguese
 * counterparts of content/cupping-therapy-page.ts's config. `/blog` is
 * omitted: the blog is CMS-driven and English-only, so it would drop a
 * Portuguese reader into English. */
export const ptCuppingRelatedConfig = {
  paths: [
    "/pt/servicos/terapia-de-tecidos-moles",
    "/pt/servicos/ajustes-quiropraticos",
    "/pt/quiropratico-acidentes-de-carro",
    "/pt/servicos",
    "/pt/solicitar-consulta",
  ],
  highlightPath: "/pt/solicitar-consulta",
};

/** Related-link rows for the other three Portuguese service pages. Draft
 * routes are dropped automatically by buildPtRelatedLinks(), so the row
 * gets shorter, never wrong, if a sibling page isn't published yet. */
export const ptAdjustmentsRelatedConfig = {
  paths: [
    "/pt/servicos/descompressao-da-coluna",
    "/pt/servicos/terapia-de-tecidos-moles",
    "/pt/quiropratico-acidentes-de-carro",
    "/pt/servicos",
    "/pt/solicitar-consulta",
  ],
  highlightPath: "/pt/solicitar-consulta",
};

export const ptDecompressionRelatedConfig = {
  paths: [
    "/pt/servicos/ajustes-quiropraticos",
    "/pt/servicos/terapia-de-tecidos-moles",
    "/pt/quiropratico-acidentes-de-carro",
    "/pt/servicos",
    "/pt/solicitar-consulta",
  ],
  highlightPath: "/pt/solicitar-consulta",
};

export const ptMassageRelatedConfig = {
  paths: [
    "/pt/servicos/ajustes-quiropraticos",
    "/pt/servicos/terapia-de-ventosas",
    "/pt/quiropratico-acidentes-de-carro",
    "/pt/servicos",
    "/pt/solicitar-consulta",
  ],
  highlightPath: "/pt/solicitar-consulta",
};

export const ptCuppingFaq: ConditionFaq = {
  headerTail: "a terapia de ventosas",
  items: [
    {
      q: "O que é terapia de ventosas?",
      a: "A terapia de ventosas aplica sucção localizada em áreas selecionadas de tensão muscular, usando copos colocados sobre a pele. Pode ser incluída junto com outro trabalho de tecidos moles quando indicado para desconfortos no pescoço, nas costas ou em outras áreas.",
    },
    {
      q: "Qual é a diferença em relação a uma massagem?",
      a: "A massagem usa pressão manual; as ventosas usam sucção para atrair fluxo sanguíneo para uma área específica de tensão. O Dr. Abe escolhe a técnica — ou a combinação — de acordo com a sua avaliação, não com uma rotina fixa.",
    },
    {
      q: "As ventosas são adequadas para todos?",
      a: "São usadas quando indicado para áreas selecionadas de tensão muscular, depois de uma avaliação. O Dr. Abe informará se isso é adequado para o seu caso ou se outra técnica de tecidos moles é um melhor ponto de partida.",
    },
    {
      q: "Isso é coberto pelo meu sinistro do acidente?",
      a: "Se o seu tratamento está relacionado ao acidente, documentamos cada sessão para que fique registrada no seu sinistro. Os detalhes de cobertura dependem da sua apólice — ajudamos no que for possível.",
    },
  ],
};

/** Section headings the Portuguese service pages pass into shared
 * components. */
export const ptServicePageCopy = {
  howItWorksHeading: "Como funciona",
  isItRightHeading: "É indicado para o seu caso?",
  readyHeading: "Quando você estiver pronto",
  readyBody:
    "Solicite uma avaliação no consultório, ou pergunte se uma visita domiciliar é indicada para o seu caso e a sua localização.",
  readyCta: "Solicitar minha avaliação",
  faqEyebrow: "Perguntas frequentes",
  faqHeadingLead: "Tudo o que você precisa saber sobre",
  techniquesHeading: "Técnicas que utilizamos",
  conditionsHeading: "Condições que avaliamos",
  bestForLabel: "Indicado para",
  relatedHeading: "Condições e tratamentos relacionados",
};
