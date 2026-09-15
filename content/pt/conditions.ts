import type { ConditionFaq, ConditionTreatmentItem } from "@/content/conditions/types";

/** Brazilian Portuguese content for the seven `/pt/condicoes/*` pages
 * (ATS-SEO-135/ATS-SEO-070-follow-up), translated from content/es/conditions.ts —
 * the vetted reference per docs/multilingual-seo-baseline.md, not a fresh
 * retranslation from English.
 *
 * ── Why one shape instead of seven bespoke pages ────────────────────────
 * Same reasoning as the Spanish layer: these are new pages with no Figma
 * history to inherit, so they share one template
 * (components/sections/pt-condition-page.tsx) driven by the objects below.
 * Optional sections render only when a condition supplies them.
 *
 * ── Claim discipline ────────────────────────────────────────────────────
 * Every Spanish hedge is preserved, not softened: "puede"/"podría" →
 * "pode"/"poderia", "después de una evaluación" → "após uma avaliação",
 * "cuando corresponde" → "quando indicado". No outcome, timeframe, recovery
 * or coverage is promised anywhere, and no visit count is quoted — every
 * page says Dr. Abe reavalia instead.
 *
 * The concussion page keeps the same critical property as its English/
 * Spanish originals: it states up front that chiropractic care is not a
 * substitute for emergency or neurological assessment, and that medical
 * evaluation comes first. That framing must never be softened.
 *
 * All seven routes are `status: "draft"` in content/pt/seo.ts, mirroring
 * the English/Spanish originals — noindex and out of the sitemap pending
 * clinician review, but reachable and linkable from the Portuguese nav.
 *
 * NEEDS LINGUISTIC REVIEW: this content was machine-translated by an LLM
 * with no verified native Brazilian Portuguese fluency (see
 * docs/multilingual-seo-baseline.md §8.2 — the same limitation flagged for
 * ATS-SEO-135/136 generally). Grammar and terminology were checked against
 * dictionaries and the existing content/pt/ modules' established
 * vocabulary, not by a native speaker. Flag for review before this content
 * is promoted out of draft.
 */

export interface PtConditionListSection {
  heading: string;
  items: string[];
  note?: string;
}

export interface PtConditionCard {
  title: string;
  desc: string;
}

export interface PtCondition {
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
  list?: PtConditionListSection;
  feelsLike?: { heading: string; items: PtConditionCard[] };
  howWeTreat?: { heading: string; items: ConditionTreatmentItem[] };
  warning?: { heading: string; bullets: string[] };
  faq: ConditionFaq;
  relatedConfig: { paths: string[]; highlightPath?: string };
}

/** The four standard treatment cards, shared exactly as the Spanish page
 * shares theirs — same images, same order. `desc` is overridden per
 * condition where the source differs. */
function treatmentCards(descriptions: [string, string, string, string]): ConditionTreatmentItem[] {
  const shared = [
    {
      title: "Liberação miofascial / pontos-gatilho",
      image: {
        src: "/figma-exports/how-we-treat-1.png",
        alt: "Liberação miofascial e terapia de pontos-gatilho com a ferramenta Graston",
      },
      meta: "1 h",
    },
    {
      title: "Ajuste quiroprático",
      image: {
        src: "/figma-exports/adjustment-image.jpeg",
        alt: "Dr. Abe realizando um ajuste quiroprático",
      },
      meta: "1 h",
    },
    {
      title: "Tração / descompressão",
      image: {
        src: "/figma-exports/how-we-treat-3.png",
        alt: "Terapia de tração e descompressão da coluna",
      },
      meta: "1 h",
    },
    {
      title: "Visita domiciliar",
      image: {
        src: "/figma-exports/how-we-treat-4.png",
        alt: "Dr. Abe atendendo um paciente em casa",
      },
      meta: "Consultar elegibilidade",
    },
  ];
  return shared.map((card, index) => ({
    ...card,
    desc: descriptions[index],
    ctaLabel: index === 3 ? "CONSULTAR ELEGIBILIDADE" : "SOLICITAR CONSULTA",
    ctaHref: index === 3 ? "/pt/quiropratico-acidentes-de-carro" : "/pt/solicitar-consulta",
  }));
}

const RED_FLAG_HEADING = "Procure um médico o quanto antes se notar:";

export const ptBackPain: PtCondition = {
  slug: "back-pain",
  path: "/pt/condicoes/dor-nas-costas",
  breadcrumb: "Dor nas costas",
  hero: {
    eyebrowChip: "Dor nas costas depois de um acidente de carro?",
    h1: "Quiroprático para Dor nas Costas em Deerfield Beach, FL",
    subhead:
      "Avaliação quiroprática para dor lombar, rigidez e dor que pode se espalhar para o quadril ou a perna, incluindo sintomas após um acidente de carro.",
    backgroundImage: {
      src: "/figma-exports/drabe-backpain-front.png",
      alt: "Tratamento manual de tecidos moles na lombar",
    },
  },
  understanding: {
    eyebrow: "Entender a dor nas costas",
    heading: "A dor nas costas tem muitas causas possíveis. Encontrar a sua é o primeiro passo",
    paragraphs: [
      "A dor lombar pode vir de um músculo, de um ligamento, de uma articulação que perdeu o movimento normal ou de um disco. Cada uma dessas origens responde a um tratamento diferente, por isso a primeira consulta começa com um exame, não com um tratamento presumido.",
      "Considere uma avaliação se a dor durar mais de uma ou duas semanas, se atrapalhar o sono ou as atividades diárias, ou se começou depois de um acidente de carro, uma queda ou um impacto repentino. Na Flórida, o seguro PIP geralmente exige que o atendimento inicial comece dentro de 14 dias após um acidente de veículo.",
    ],
    image: {
      src: "/figma-exports/drabe-back.png",
      alt: "Dr. Abe revisando o histórico de dor nas costas de um paciente",
    },
  },
  list: {
    heading: "Causas frequentes",
    items: [
      "Distensão muscular ou de ligamentos",
      "Hérnia ou protrusão de disco",
      "Má postura e longos períodos sentado",
      "Mudanças articulares relacionadas à gravidez",
      "Esporte ou esforço repetitivo",
      "Acidentes de carro e impactos repentinos",
    ],
  },
  feelsLike: {
    heading: "Como se sente",
    items: [
      {
        title: "Rigidez surda e constante",
        desc: "Um desconforto contínuo de baixa intensidade, pior depois de ficar muito tempo sentado ou em pé.",
      },
      {
        title: "Pontada ao se mover",
        desc: "Uma flexão ou giro específico que provoca uma fisgada repentina e aguda — geralmente muscular.",
      },
      {
        title: "Dor que não passa",
        desc: "Desconforto que dura semanas ou meses, não apenas um dia ruim.",
      },
      {
        title: "Dor irradiada",
        desc: "Dor que viaja para o quadril ou a perna em vez de ficar apenas na lombar.",
      },
    ],
  },
  howWeTreat: {
    heading: "Como tratamos",
    items: treatmentCards([
      "A distensão lombar costuma se apresentar como músculo tenso e com espasmo ao longo da coluna. A ferramenta Graston trabalha essa tensão diretamente, desfazendo aderências de forma parecida a uma massagem profunda.",
      "A dor nas costas costuma vir de fixações: segmentos da coluna, principalmente na região lombar, que perderam seu movimento normal. O ajuste devolve esse movimento para que os músculos ao redor parem de compensar.",
      "Para dor nas costas relacionada a disco ou de longa duração, a tração alonga a coluna lombar para aliviar a pressão sobre discos e nervos.",
      "Quando até entrar no carro dói, levamos o exame e o tratamento manual até a sua casa.",
    ]),
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Dormência ou fraqueza na perna",
      "Dor que piora à noite ou que não melhora com repouso",
      "Perda de controle da bexiga ou do intestino — procure atendimento de emergência",
    ],
  },
  faq: {
    headerTail: "a dor nas costas",
    items: [
      {
        q: "É seguro fazer um ajuste se eu tenho uma hérnia de disco?",
        a: "Depende da lesão do disco, dos sintomas e dos achados do exame. O Dr. Abe avalia se o ajuste, a descompressão, outra opção conservadora ou um encaminhamento médico é o mais indicado antes de tratar.",
      },
      {
        q: "Devo repousar ou me manter ativo com dor nas costas?",
        a: "Algum repouso ajuda no início, mas repouso demais pode atrasar a recuperação. Damos um plano concreto do que fazer e evitar de acordo com o que realmente está causando sua dor.",
      },
      {
        q: "E se a dor nas costas descer pela perna?",
        a: "Dor que viaja para a perna pode envolver um nervo irritado, incluindo ciática, mas é necessário um exame para avaliar a causa. Procure atendimento urgente se houver fraqueza progressiva ou mudanças na bexiga ou no intestino.",
      },
      {
        q: "Quantas consultas costuma levar para a dor nas costas melhorar?",
        a: "A distensão mecânica costuma melhorar em poucas consultas; a dor relacionada a disco pode levar mais tempo. Reavaliamos ao longo do caminho e ajustamos o plano.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/pt/condicoes/ciatica",
      "/pt/condicoes/dor-no-pescoco",
      "/pt/servicos/descompressao-da-coluna",
      "/pt/condicoes",
      "/pt/quiropratico-acidentes-de-carro",
      "/pt/solicitar-consulta",
    ],
    highlightPath: "/pt/solicitar-consulta",
  },
};

export const ptNeckPain: PtCondition = {
  slug: "neck-pain",
  path: "/pt/condicoes/dor-no-pescoco",
  breadcrumb: "Dor no pescoço",
  hero: {
    eyebrowChip: "Dor no pescoço depois de um acidente de carro?",
    h1: "Quiroprático para Dor no Pescoço em Deerfield Beach, FL",
    subhead:
      "Avaliação quiroprática para dor no pescoço, rigidez e mobilidade limitada, incluindo dor no pescoço que começa depois de um acidente de carro ou torcicolo cervical.",
    backgroundImage: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "Dr. Abe Nasser avaliando o pescoço de um paciente",
    },
  },
  understanding: {
    eyebrow: "Entender a dor no pescoço",
    heading: "O pescoço sustenta muito peso com pouquíssima margem",
    paragraphs: [
      "A coluna cervical sustenta a cabeça com uma amplitude de movimento grande e pouco suporte estrutural, por isso sente rápido os efeitos da postura, do estresse e do impacto. Um impacto repentino pode distender os músculos e ligamentos que a sustentam, e os sintomas podem aparecer depois.",
      "Na Flórida, o seguro PIP geralmente exige que o atendimento inicial comece dentro de 14 dias após um acidente de veículo. A elegibilidade e o reembolso dependem da sua apólice e das circunstâncias.",
    ],
    image: {
      src: "/figma-exports/drabe-releasetool.png",
      alt: "Tratamento de tecidos moles no pescoço e no ombro",
    },
  },
  list: {
    heading: "Causas frequentes",
    items: [
      "Acidentes de carro e impactos repentinos",
      "Torcicolo cervical por colisão traseira",
      "Má postura ao dormir",
      "Tensão muscular relacionada ao estresse",
      "Mudanças articulares degenerativas",
    ],
  },
  feelsLike: {
    heading: "Como se sente",
    items: [
      {
        title: "Rigidez matinal",
        desc: "Tenso e difícil de girar ao acordar, que vai relaxando ao longo do dia.",
      },
      {
        title: 'Desconforto de "pescoço de tela"',
        desc: "Uma tensão surda e persistente na base do crânio depois de horas de computador ou celular.",
      },
      {
        title: "Tensão irradiada",
        desc: "Aperto que se estende para os ombros e a parte alta das costas, não só o pescoço.",
      },
      {
        title: "Dor aguda ou repentina",
        desc: "Um movimento ou ângulo específico que provoca uma pontada, muitas vezes sinal de algo mais estrutural.",
      },
    ],
  },
  howWeTreat: {
    heading: "Como tratamos",
    items: treatmentCards([
      "A tensão por postura, estresse ou posição ao dormir tende a se acumular como nós no pescoço e nos ombros. A ferramenta Graston trabalha essa tensão de forma direcionada nos pontos específicos onde ela se acumula.",
      "A rigidez do dia a dia costuma vir de pequenas fixações nas vértebras cervicais — segmentos que não se movem como deveriam. O ajuste devolve esse movimento.",
      "Para casos selecionados de dor no pescoço que envolvem disco ou articulação, a tração controlada pode reduzir a pressão entre as vértebras. A avaliação determina se é indicado.",
      "Quando a dor no pescoço é tal que girar a cabeça para dirigir fica desconfortável, levamos o exame e o tratamento até a sua casa.",
    ]),
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Dormência, formigamento ou fraqueza em um braço",
      "Dor de cabeça intensa, tontura ou confusão depois de uma colisão",
      "Dor que piora rapidamente em vez de melhorar",
    ],
  },
  faq: {
    headerTail: "a dor no pescoço",
    items: [
      {
        q: "É normal a dor no pescoço se espalhar para os ombros?",
        a: "Sim. Os músculos e nervos do pescoço se conectam diretamente com os ombros e a parte alta das costas, então a dor referida e a rigidez nessa área são comuns tanto na dor aguda quanto na crônica.",
      },
      {
        q: "Um quiroprático pode ajudar com um nervo comprimido no pescoço?",
        a: "O atendimento quiroprático pode ser indicado para algumas causas musculoesqueléticas de irritação nervosa. Primeiro é necessário um exame para determinar se o ajuste, o trabalho de tecidos moles, a revisão de imagens ou um encaminhamento é o próximo passo mais seguro.",
      },
      {
        q: "Quanto tempo pode levar para a dor no pescoço melhorar?",
        a: "Depende da causa, da gravidade e de há quanto tempo você tem os sintomas. O Dr. Abe reavalia sua resposta ao atendimento e ajusta o plano, em vez de prometer um número fixo de consultas.",
      },
      {
        q: "Devo ir mesmo que a dor no pescoço tenha começado há semanas?",
        a: "Sim. Uma avaliação pode ajudar a identificar fatores musculoesqueléticos e se o atendimento quiroprático ou outro tipo de cuidado é indicado, mesmo quando os sintomas começaram há semanas.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/pt/condicoes/torcicolo-cervical",
      "/pt/condicoes/dor-nas-costas",
      "/pt/servicos/descompressao-da-coluna",
      "/pt/condicoes",
      "/pt/quiropratico-acidentes-de-carro",
      "/pt/solicitar-consulta",
    ],
    highlightPath: "/pt/solicitar-consulta",
  },
};

export const ptWhiplash: PtCondition = {
  slug: "whiplash",
  path: "/pt/condicoes/torcicolo-cervical",
  breadcrumb: "Torcicolo cervical",
  hero: {
    eyebrowChip: "Torcicolo cervical depois de um acidente?",
    h1: "Quiroprático para Torcicolo Cervical em Deerfield Beach, FL",
    subhead:
      "O torcicolo cervical (whiplash) é uma lesão no pescoço causada por um movimento brusco de ida e volta, comum em colisões traseiras. O Dr. Abe avalia rigidez, mobilidade limitada e dores de cabeça relacionadas.",
    backgroundImage: {
      src: "/figma-exports/drabe-whiplash-man.png",
      alt: "Dr. Abe tratando um paciente com torcicolo cervical",
    },
  },
  understanding: {
    eyebrow: "Entender o torcicolo cervical",
    heading: "Se sentir bem no local da batida não significa que não houve lesão",
    paragraphs: [
      "O torcicolo cervical acontece quando a cabeça se desloca rapidamente para trás e para frente, distendendo os músculos e ligamentos do pescoço além da amplitude normal. Os sintomas podem se acumular nas horas ou dias seguintes à colisão, não no momento do impacto.",
      "Na Flórida, o seguro PIP geralmente exige que o atendimento inicial comece dentro de 14 dias após um acidente de veículo; a cobertura depende da elegibilidade e dos termos da apólice.",
    ],
    image: {
      src: "/figma-exports/drabe-whiplash.png",
      alt: "Avaliação do pescoço de um paciente por torcicolo cervical",
    },
  },
  list: {
    heading: "Sintomas frequentes",
    items: [
      "Dor e rigidez no pescoço que pioram no dia seguinte ao acidente",
      "Dores de cabeça que começam na base do crânio",
      "Menor amplitude de movimento — dificuldade para girar a cabeça",
      "Dor no ombro e na parte alta das costas",
      "Formigamento ou dormência nos braços",
    ],
  },
  feelsLike: {
    heading: "Como se sente",
    items: [
      {
        title: "Início tardio",
        desc: "Sentir-se bem no local da batida e acordar sem conseguir girar o pescoço.",
      },
      {
        title: "Rigidez no pescoço",
        desc: "Costuma ser o primeiro sintoma: tenso, restrito, desconfortável ao girar.",
      },
      {
        title: "Dores de cabeça",
        desc: "Costumam começar na base do crânio, às vezes dias depois do impacto.",
      },
      {
        title: "Mobilidade reduzida",
        desc: "Dificuldade para girar a cabeça completamente para um lado ou os dois.",
      },
    ],
  },
  howWeTreat: {
    heading: "Como tratamos",
    items: treatmentCards([
      "Usamos a ferramenta Graston para trabalhar o tecido cicatricial e o espasmo muscular do pescoço e da parte alta das costas que se acumulam depois de uma colisão, ajudando a recuperar o movimento normal do tecido mole.",
      "Depois de um torcicolo cervical, algumas articulações do pescoço podem ter o movimento restrito. Se a avaliação indicar, um ajuste controlado pode ser incluído.",
      "Quando os achados sugerem envolvimento de disco cervical, pode-se considerar tração controlada para reduzir a pressão. É usada apenas quando a avaliação indica.",
      "Girar a cabeça para checar os espelhos costuma ser o mais difícil no início. Vamos até a sua casa nesses primeiros dias, quando dirigir ainda não é realista.",
    ]),
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Dormência, formigamento ou fraqueza nos braços ou nas mãos",
      "Dor de cabeça intensa, tontura, vômito ou confusão",
      "Dor que piora rapidamente em vez de melhorar",
    ],
  },
  faq: {
    headerTail: "o torcicolo cervical",
    items: [
      {
        q: "Quanto tempo leva para o torcicolo cervical sarar?",
        a: "Casos leves costumam melhorar em algumas semanas de atendimento constante; lesões mais significativas podem levar alguns meses. Reavaliamos regularmente e ajustamos seu plano conforme você progride.",
      },
      {
        q: 'O que significa o "grau" de um torcicolo cervical?',
        a: "O grau descreve a gravidade, desde sintomas no pescoço sem sinais físicos até fratura ou luxação. Um profissional qualificado deve avaliar a lesão em vez de se basear apenas nos sintomas.",
      },
      {
        q: "O torcicolo cervical pode causar dores de cabeça semanas depois?",
        a: "Sim. As dores de cabeça cervicogênicas, que têm origem no pescoço, são um dos sintomas tardios mais comuns do torcicolo cervical, e às vezes aparecem bem depois que a rigidez inicial passa.",
      },
      {
        q: "Como funciona a cobertura do PIP para a minha consulta?",
        a: "Na Flórida, o PIP geralmente exige que o atendimento inicial comece dentro de 14 dias após um acidente de veículo. Os limites de benefício e o pagamento dependem da sua elegibilidade, da sua apólice, da necessidade médica e dos detalhes do sinistro.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/pt/condicoes/dor-no-pescoco",
      "/pt/condicoes/dor-de-cabeca-cervicogenica",
      "/pt/servicos/terapia-de-tecidos-moles",
      "/pt/condicoes",
      "/pt/quiropratico-acidentes-de-carro",
      "/pt/solicitar-consulta",
    ],
    highlightPath: "/pt/solicitar-consulta",
  },
};

export const ptSciatica: PtCondition = {
  slug: "sciatica",
  path: "/pt/condicoes/ciatica",
  breadcrumb: "Ciática",
  hero: {
    eyebrowChip: "Ciática ou dor nervosa que desce pela perna?",
    h1: "Quiroprático para Ciática em Deerfield Beach, FL",
    subhead:
      "Avaliação e tratamento focado em descompressão para dor ciática e dor nervosa irradiada, com visitas domiciliares quando indicado para o seu caso.",
    backgroundImage: {
      src: "/figma-exports/drabe-backpain-front.png",
      alt: "Dr. Abe avaliando um paciente com ciática",
    },
  },
  understanding: {
    eyebrow: "Entender a ciática",
    heading: "A ciática não fica só nas costas: ela viaja",
    paragraphs: [
      "A dor lombar comum fica na região lombar. A ciática irradia: desce pelo glúteo e pela perna porque a própria raiz nervosa está comprimida ou irritada, não apenas o músculo ou a articulação ao redor.",
      "Uma colisão pode agravar a lombar e contribuir para sintomas irradiados na perna. Na Flórida, o seguro PIP geralmente exige que o atendimento inicial comece dentro de 14 dias após um acidente de veículo.",
    ],
    image: {
      src: "/figma-exports/drabe-back.png",
      alt: "Dr. Abe avaliando a lombar de um paciente",
    },
  },
  list: {
    heading: "Sintomas frequentes",
    items: [
      "Dor aguda, ardente ou parecida com choque elétrico",
      "Dor que piora ao sentar ou tossir",
      "Dormência e formigamento na perna ou no pé",
      "Fraqueza muscular na perna afetada",
      "Dor localizada na região do glúteo",
    ],
  },
  feelsLike: {
    heading: "Como se sente",
    items: [
      {
        title: "Dor irradiada para a perna",
        desc: "Dor que viaja da lombar, passa pelo glúteo e desce pela perna.",
      },
      {
        title: "Pontada ou ardor",
        desc: "Uma sensação aguda, como choque elétrico, que percorre o trajeto do nervo ciático.",
      },
      {
        title: "Dormência ou formigamento",
        desc: "Sensação de agulhadas ou perda de sensibilidade especificamente na perna ou no pé.",
      },
      {
        title: "Fraqueza muscular",
        desc: 'Dificuldade para mover o pé ou a perna, que ficam "pesados" ou pouco responsivos.',
      },
    ],
  },
  howWeTreat: {
    heading: "Como tratamos",
    items: treatmentCards([
      "O piriforme e os músculos ao redor costumam ficar tensos em torno do nervo ciático e somar dor. A ferramenta Graston libera essa tensão diretamente na região que comprime o nervo.",
      "Quando os achados sugerem que o movimento articular restrito da região lombar contribui para os sintomas, o Dr. Abe pode incluir um ajuste controlado no plano.",
      "Quando um disco ou um estreitamento ao redor do nervo pode contribuir para os sintomas, a tração controlada pode ser considerada depois de avaliar se é adequada.",
      "A ciática pode tornar insuportável sentar no carro. Levamos o exame completo e o tratamento até a sua casa quando chegar ao consultório não é realista.",
    ]),
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Fraqueza progressiva na perna ou no pé",
      "Dormência na região da virilha ou na parte interna das coxas",
      "Perda de controle da bexiga ou do intestino — procure atendimento de emergência",
    ],
  },
  faq: {
    headerTail: "a ciática",
    items: [
      {
        q: "Um acidente de carro pode causar ciática?",
        a: "Um acidente de carro pode agravar a lombar e contribuir para sintomas do nervo ciático, mas é necessário um exame para identificar as causas prováveis. Mencione a colisão e quando os sintomas apareceram durante sua avaliação.",
      },
      {
        q: "Qual é a diferença entre ciática e dor nas costas comum?",
        a: "A dor nas costas comum fica na região lombar. A ciática irradia: desce pelo glúteo e pela perna porque há uma raiz nervosa comprimida, não apenas o músculo ou a articulação ao redor.",
      },
      {
        q: "Vou precisar de cirurgia por causa de uma hérnia de disco?",
        a: "Não necessariamente. Muitas pessoas começam com atendimento conservador orientado por um profissional, mas fraqueza progressiva, sintomas graves ou certos achados do exame podem exigir uma avaliação médica ou cirúrgica com urgência.",
      },
      {
        q: "Quanto tempo costuma levar para a ciática melhorar?",
        a: "Depende da causa e da gravidade. Um episódio muscular pode evoluir diferente de sintomas que envolvem disco ou nervo, então o Dr. Abe reavalia o progresso e ajusta o plano conforme necessário.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/pt/condicoes/dor-nas-costas",
      "/pt/servicos/descompressao-da-coluna",
      "/pt/condicoes",
      "/pt/quiropratico-acidentes-de-carro",
      "/pt/solicitar-consulta",
    ],
    highlightPath: "/pt/solicitar-consulta",
  },
};

export const ptCervicogenicHeadache: PtCondition = {
  slug: "cervicogenic-headache",
  path: "/pt/condicoes/dor-de-cabeca-cervicogenica",
  breadcrumb: "Dor de cabeça cervicogênica",
  hero: {
    eyebrowChip: "Dores de cabeça que começaram depois de um acidente de carro?",
    h1: "Quiroprático para Dor de Cabeça Cervicogênica em Deerfield Beach, FL",
    subhead:
      "A dor de cabeça cervicogênica é dor referida a partir do pescoço. O Dr. Abe avalia a mobilidade cervical e outros fatores musculoesqueléticos antes de recomendar atendimento.",
    backgroundImage: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Dr. Abe avaliando um paciente com tensão no pescoço relacionada à dor de cabeça",
    },
  },
  understanding: {
    eyebrow: "Entender a dor de cabeça cervicogênica",
    heading: "Uma dor de cabeça que na verdade começa no pescoço",
    paragraphs: [
      "A dor de cabeça cervicogênica não se origina na cabeça: é dor referida das articulações, músculos ou nervos do pescoço. Por isso ela pode persistir mesmo que o medicamento alivie a dor, e por isso a avaliação se concentra no movimento cervical.",
      "Vários tipos de dor de cabeça podem se sobrepor, então um profissional deve avaliar os sintomas. Uma dor de cabeça nova, intensa ou que piora depois de uma colisão precisa de avaliação médica o quanto antes.",
    ],
    image: {
      src: "/figma-exports/align-thespne-neck.png",
      alt: "Avaliação do pescoço relacionada à dor de cabeça",
    },
  },
  feelsLike: {
    heading: "Como se sente",
    items: [
      {
        title: "Desconforto na base do crânio",
        desc: "Começa na parte de trás da cabeça e se espalha para a frente.",
      },
      {
        title: "Pressão de um só lado",
        desc: "Permanece em um lado, diferente de uma dor de cabeça tensional típica.",
      },
      {
        title: "Piora com o movimento",
        desc: "Girar ou inclinar a cabeça desencadeia ou intensifica a dor.",
      },
      {
        title: "Pode persistir com medicamento",
        desc: "O medicamento pode aliviar a dor sem tratar o fator cervical que contribui para ela.",
      },
    ],
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Uma dor de cabeça nova, intensa ou que piora rapidamente",
      "Confusão, vômito ou perda de consciência depois de uma batida",
      "Dormência, formigamento ou fraqueza nos braços ou nas pernas",
    ],
  },
  faq: {
    headerTail: "as dores de cabeça cervicogênicas",
    items: [
      {
        q: "Um acidente de carro pode causar dores de cabeça que aparecem semanas depois?",
        a: "As dores de cabeça podem começar depois de um acidente ou ficar mais evidentes mais tarde, mas o momento em que aparecem não identifica a causa por si só. Uma dor de cabeça nova, intensa ou que piora depois de uma colisão precisa de avaliação médica o quanto antes.",
      },
      {
        q: "Como sei se minha dor de cabeça vem do pescoço?",
        a: "As dores de cabeça cervicogênicas podem ser de um só lado e piorar com o movimento do pescoço ou com amplitude de movimento limitada. Um profissional deve avaliar os sintomas porque vários tipos de dor de cabeça podem se sobrepor.",
      },
      {
        q: "O medicamento para dor ajuda?",
        a: "O medicamento pode reduzir a dor em algumas pessoas, mas não determina se o pescoço está contribuindo. Converse sobre dúvidas de medicamentos com quem os prescreveu, e procure uma avaliação se os sintomas persistirem.",
      },
      {
        q: "Quantas consultas vou precisar?",
        a: "Depende da causa, dos achados do exame e da resposta ao atendimento. O Dr. Abe reavalia o progresso em vez de prometer um número fixo de consultas.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/pt/condicoes/torcicolo-cervical",
      "/pt/condicoes/dor-no-pescoco",
      "/pt/condicoes",
      "/pt/quiropratico-acidentes-de-carro",
      "/pt/solicitar-consulta",
    ],
    highlightPath: "/pt/solicitar-consulta",
  },
};

export const ptTmjJawPain: PtCondition = {
  slug: "tmj-jaw-pain",
  path: "/pt/condicoes/dor-na-mandibula-atm",
  breadcrumb: "ATM / dor na mandíbula",
  hero: {
    eyebrowChip: "Dor, tensão ou estalo na mandíbula?",
    h1: "Quiroprático para ATM e Dor na Mandíbula em Deerfield Beach, FL",
    subhead:
      "O Dr. Abe avalia o movimento da articulação da mandíbula, a tensão muscular ao redor e os fatores cervicais antes de decidir se o atendimento quiroprático pode ser indicado.",
    backgroundImage: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Dr. Abe avaliando a mandíbula de um paciente",
    },
  },
  understanding: {
    eyebrow: "Entender o trauma da ATM",
    heading: "A mesma força que causa o torcicolo cervical chega até a mandíbula",
    paragraphs: [
      "A articulação temporomandibular fica a centímetros da coluna cervical, e o impacto que provoca um torcicolo cervical também pode tensionar a mandíbula — principalmente quando ela é apertada durante a colisão. Por isso a dor na mandíbula e a dor no pescoço aparecem juntas com frequência depois de um acidente.",
      "Os sintomas na mandíbula podem ter várias causas, por isso é necessária uma avaliação. O Dr. Abe revisa o movimento articular, a musculatura ao redor e a relação com o pescoço antes de decidir se é indicado tratar ou encaminhar.",
    ],
    image: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "Dr. Abe avaliando o pescoço e a mandíbula de um paciente",
    },
  },
  feelsLike: {
    heading: "Como se sente",
    items: [
      {
        title: "Estalo ao abrir",
        desc: "Um clique ou salto ao abrir a boca ou mastigar.",
      },
      {
        title: "Tensão na mandíbula",
        desc: "Dor ou rigidez na articulação, às vezes ao acordar.",
      },
      {
        title: "Dificuldade para mastigar",
        desc: "Desconforto que aparece ao comer ou ao abrir a boca completamente.",
      },
      {
        title: "Dor de cabeça a partir da mandíbula",
        desc: "Dor que se origina na articulação da mandíbula e não no pescoço.",
      },
    ],
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Mandíbula travada, que não abre nem fecha",
      "Inchaço ou dor intensa na articulação depois de um golpe",
      "Dormência no rosto depois de uma colisão",
    ],
  },
  faq: {
    headerTail: "a ATM e a dor na mandíbula",
    items: [
      {
        q: "Um acidente de carro pode mesmo causar problemas de ATM?",
        a: "Uma colisão pode distender a articulação da mandíbula ou os músculos ao redor, principalmente quando a mandíbula é apertada durante o impacto. É necessária uma avaliação porque os sintomas na mandíbula podem ter várias causas.",
      },
      {
        q: "Como é sentir a disfunção da ATM?",
        a: "Os sinais frequentes incluem estalo ao abrir a boca, dor ou tensão na mandíbula, dificuldade para mastigar e dores de cabeça que se originam na articulação da mandíbula e não no pescoço.",
      },
      {
        q: "Como se trata a disfunção da ATM?",
        a: "O tratamento depende do que a avaliação encontrar: pode incluir mobilização suave da articulação, trabalho de tecidos moles na musculatura ao redor e orientação sobre hábitos, como apertar a mandíbula, que continuam agravando o quadro.",
      },
      {
        q: "Quantas consultas vou precisar?",
        a: "Varia de acordo com a causa, os achados do exame e fatores contínuos como apertar ou ranger os dentes. O Dr. Abe reavalia o progresso em vez de prometer um número fixo de consultas.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/pt/condicoes/dor-no-pescoco",
      "/pt/condicoes/dor-de-cabeca-cervicogenica",
      "/pt/condicoes",
      "/pt/quiropratico-acidentes-de-carro",
      "/pt/solicitar-consulta",
    ],
    highlightPath: "/pt/solicitar-consulta",
  },
};

export const ptConcussion: PtCondition = {
  slug: "concussion",
  path: "/pt/condicoes/concussao",
  breadcrumb: "Concussão",
  hero: {
    eyebrowChip: "Bateu a cabeça ou ficou tonto depois de um acidente?",
    h1: "Sintomas de Concussão Depois de um Acidente de Carro",
    subhead:
      "Uma concussão é uma lesão cerebral traumática leve que precisa de avaliação médica. O atendimento quiroprático não substitui uma avaliação de emergência nem neurológica.",
    backgroundImage: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Dr. Abe avaliando um paciente depois de um acidente de carro",
    },
  },
  understanding: {
    eyebrow: "Entender a concussão",
    heading: "Primeiro a avaliação médica — sempre",
    paragraphs: [
      "Uma concussão pode ocorrer sem perda de consciência e sem uma batida direta na cabeça: basta que a força da colisão movimente o cérebro dentro do crânio. Qualquer pessoa com possíveis sintomas depois de uma batida deve receber uma avaliação médica adequada.",
      "Esta página é informação geral. A Align the Spine não diagnostica nem trata a lesão cerebral em si. Depois de uma avaliação médica, o Dr. Abe pode avaliar separadamente sintomas no pescoço ou musculoesqueléticos e determinar se atendimento ou encaminhamento é indicado.",
    ],
    image: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Avaliação de um paciente depois de um acidente de carro",
    },
  },
  list: {
    heading: "Sintomas clássicos",
    items: [
      "Dor de cabeça ou pressão na cabeça",
      "Tontura ou problemas de equilíbrio",
      "Sensibilidade à luz ou ao ruído",
      "Fadiga ou alterações do sono",
      "Irritabilidade ou mudanças de humor",
    ],
    note: "Procure avaliação médica o quanto antes diante de possíveis sintomas de concussão depois de um acidente, e atendimento de emergência se os sintomas forem graves ou piorarem.",
  },
  howWeTreat: {
    heading: "Como funciona o nosso papel",
    items: [
      {
        title: "Primeiro a avaliação médica",
        desc: "Possíveis sintomas de concussão exigem avaliação de um profissional médico adequado. Sinais de alerta não devem esperar por uma consulta quiroprática.",
        image: {
          src: "/figma-exports/how-we-treat-1.png",
          alt: "Avaliação médica depois de um acidente",
        },
        meta: "A segurança em primeiro lugar",
        ctaLabel: "LIGAR PARA O CONSULTÓRIO",
        ctaHref: "/pt/contato",
      },
      {
        title: "Revisão de pescoço e torcicolo cervical",
        desc: "Depois da alta médica, o Dr. Abe pode avaliar se há também dor no pescoço, rigidez ou problemas musculoesqueléticos relacionados a um torcicolo cervical.",
        image: {
          src: "/figma-exports/adjustment-image.jpeg",
          alt: "Avaliação do pescoço depois da alta médica",
        },
        meta: "Depois da alta",
        ctaLabel: "VER TORCICOLO CERVICAL",
        ctaHref: "/pt/condicoes/torcicolo-cervical",
      },
      {
        title: "Atendimento só quando indicado",
        desc: "Qualquer atendimento quiroprático se limita a achados musculoesqueléticos adequados e é coordenado com a orientação médica quando há sintomas de concussão envolvidos.",
        image: {
          src: "/figma-exports/how-we-treat-3.png",
          alt: "Atendimento quiroprático coordenado com orientação médica",
        },
        meta: "Caso a caso",
        ctaLabel: "SOLICITAR CONSULTA",
        ctaHref: "/pt/solicitar-consulta",
      },
      {
        title: "Reavaliação contínua",
        desc: "Sintomas neurológicos novos, dor de cabeça que piora, vômito repetido, confusão, fraqueza ou perda de consciência exigem atendimento médico urgente.",
        image: {
          src: "/figma-exports/how-we-treat-4.png",
          alt: "Acompanhamento de sintomas depois de uma concussão",
        },
        meta: "Conheça os sinais de alerta",
        ctaLabel: "VER SINAIS DE ALERTA",
        ctaHref: "/pt/quiropratico-acidentes-de-carro",
      },
    ],
  },
  warning: {
    heading: "Procure atendimento de emergência imediatamente se aparecer:",
    bullets: [
      "Perda de consciência, mesmo que breve",
      "Dor de cabeça que piora, vômito repetido ou convulsões",
      "Confusão, dificuldade para falar, fraqueza ou dormência",
    ],
  },
  faq: {
    headerTail: "a concussão e o atendimento posterior",
    items: [
      {
        q: "É possível ter uma concussão sem perder a consciência ou bater a cabeça?",
        a: "Sim. Uma concussão pode ocorrer sem perda de consciência e sem uma batida direta na cabeça. Qualquer pessoa com possíveis sintomas depois de uma colisão deve receber uma avaliação médica adequada.",
      },
      {
        q: "Quanto tempo costumam durar os sintomas de uma concussão?",
        a: "O tempo de recuperação varia. Dor de cabeça persistente, tontura, problemas de concentração ou outros sintomas devem ser avaliados por um profissional médico adequado, em vez de julgados por um prazo fixo.",
      },
      {
        q: "O atendimento quiroprático é seguro depois de uma concussão?",
        a: "O atendimento quiroprático não diagnostica nem trata a lesão cerebral em si. Depois de uma avaliação médica adequada, o Dr. Abe pode avaliar separadamente sintomas no pescoço ou musculoesqueléticos e determinar se atendimento ou encaminhamento é indicado.",
      },
      {
        q: "Por que a concussão e o torcicolo cervical costumam passar despercebidos juntos?",
        a: "As duas condições podem compartilhar sintomas depois de uma colisão, incluindo dor de cabeça e tontura. A avaliação médica cuida da possível lesão cerebral, enquanto um exame musculoesquelético à parte pode avaliar a dor no pescoço ou o torcicolo cervical depois da alta.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/pt/condicoes/torcicolo-cervical",
      "/pt/condicoes/dor-no-pescoco",
      "/pt/condicoes",
      "/pt/quiropratico-acidentes-de-carro",
      "/pt/solicitar-consulta",
    ],
    highlightPath: "/pt/solicitar-consulta",
  },
};

/** Every Portuguese condition, in the same order the Spanish/English hubs
 * render them. */
export const ptConditions: PtCondition[] = [
  ptBackPain,
  ptNeckPain,
  ptWhiplash,
  ptSciatica,
  ptConcussion,
  ptCervicogenicHeadache,
  ptTmjJawPain,
];

/** Shared section copy for the Portuguese condition template. */
export const ptConditionPageCopy = {
  readyHeading: "Quando você estiver pronto",
  readyBody:
    "Solicite uma avaliação no consultório, ou pergunte se uma visita domiciliar é indicada para o seu caso e a sua localização.",
  readyCta: "Solicitar minha avaliação",
  relatedHeading: "Condições e tratamentos relacionados",
  accidentEyebrow: "Foi por causa de um acidente?",
  callEyebrow: "Vamos conversar hoje",
};
