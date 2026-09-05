import type { HowWeHelpStep } from "@/components/sections/how-we-help-steps";
import type { ComparisonRow } from "@/content/comparison-table";
import type { ConditionAccident, ConditionFaqItem } from "@/content/conditions/types";
import { siteConfig } from "@/content/site";
import { verified, type VerifiedValue } from "@/content/verified-value";

/** Brazilian Portuguese content for /pt/quiropratico-acidentes-de-carro
 * (ATS-SEO-135) — the Portuguese site's primary acquisition page.
 *
 * Written for the Brazilian Portuguese accident cluster: "acidente de
 * carro" leads, "colisão" and "torcicolo" appear naturally where a person
 * would actually say them. Ahrefs' pt-br pull (SEO_QA_EVIDENCE/ahrefs-2026-09/
 * synthesis-part2-and-final-labels.md) is thinner seed data than the
 * Spanish pull — real but limited — so this page is written conservatively
 * around the terms that pull actually confirmed rather than assuming a
 * wider cluster.
 *
 * ── Legal accuracy ──────────────────────────────────────────────────────
 * Every statement about Florida PIP below is the same claim, in Portuguese,
 * that content/es/auto-accident.ts makes in Spanish and content/conditions/
 * auto-accident.ts makes in English — checked against Fla. Stat. § 627.736
 * as of August 2026 (see content/es/auto-accident.ts's header comment for
 * the full citation trail). Nothing here tells a reader what their coverage
 * is or what they're entitled to; those are questions for their insurer or
 * a licensed attorney, and every block that touches them says so.
 */

export const ptAutoAccidentHero = {
  eyebrowChip: "ATENDIMENTO QUIROPRÁTICO APÓS UM ACIDENTE",
  titleLines: ["Se machucou em", "um acidente?"] as const,
  subhead:
    "O Dr. Abe realiza avaliações quiropráticas em Deerfield Beach para dor no pescoço, dor nas costas, rigidez e sintomas de torcicolo cervical após um acidente de carro, e documenta os achados para o seu reclamo do seguro PIP quando aplicável.",
  /** Must appear verbatim in `subhead` — the page splits on it. */
  pipLinkPhrase: "seguro PIP",
  callPillEyebrow: "Vamos conversar hoje",
  form: {
    heading: "Solicite sua avaliação por acidente",
    footerNote:
      "Venha nos visitar em Deerfield Beach, ou ligue para perguntar se um atendimento a domicílio é indicado para o seu caso e sua localização.",
  },
};

/** Same client-approved PIP stat the English/Spanish heroes show
 * (content/conditions/auto-accident.ts's `flags.pipStat`) — same
 * verification source and date, because it is the same approved claim in
 * another language, not a new one. */
export const ptPipStat: VerifiedValue<{ value: string; description: string }> = verified(
  {
    value: "$10,000",
    description:
      "em cobertura PIP disponível com uma determinação de condição médica de emergência — $2.500 sem ela",
  },
  "Client-provided design mockup (same approved stat as the English page)",
  "2026-09-02",
);

export const ptAutoAccidentAccident: ConditionAccident = {
  headline: "A lei do PIP da Flórida exige o início do atendimento em até 14 dias",
  body: "Na Flórida, o seguro PIP geralmente exige que o atendimento inicial comece dentro de 14 dias após o acidente. A elegibilidade, o reembolso e os limites de benefícios dependem da sua apólice e das circunstâncias do seu caso.",
  smallprint:
    "A cobertura e o pagamento dependem da sua apólice, da sua elegibilidade, da necessidade médica e das circunstâncias do seu reclamo. Esta página é informação geral, não é aconselhamento jurídico nem uma promessa de cobertura.",
};

export interface PtAnswerBlock {
  heading: string;
  answer: string;
  detail: string;
}

/** Answer-first blocks covering the questions that fan out from
 * "quiroprático depois de um acidente de carro". Each stands alone. */
export const ptAutoAccidentAnswers: PtAnswerBlock[] = [
  {
    heading: "O que devo fazer se sinto dor depois de um acidente de carro?",
    answer:
      "Se você tem sintomas graves — dor intensa, dificuldade para respirar, confusão, dormência ou fraqueza — procure atendimento de emergência primeiro, não uma consulta quiroprática.",
    detail:
      "Para desconfortos musculoesqueléticos que não são emergência, como rigidez no pescoço, dor nas costas ou dor de cabeça que aparece um ou dois dias depois da batida, uma avaliação precoce permite documentar o que encontramos e determinar se o tratamento quiroprático é indicado para o seu caso ou se é melhor encaminhar você a outro profissional.",
  },
  {
    heading: "Quando devo procurar um quiroprático depois de uma colisão?",
    answer:
      "Quanto antes você for avaliado, melhor fica documentado o caso — e na Flórida o seguro PIP geralmente exige que o atendimento inicial comece dentro de 14 dias após o acidente.",
    detail:
      "Não é preciso esperar a dor piorar. Alguns desconfortos de tecidos moles levam horas ou dias para aparecer, então se sentir bem no dia do acidente não significa que não há nada para avaliar. Se os 14 dias já passaram, você ainda pode receber atendimento — o que muda é como a seguradora trata o reclamo, e isso deve ser consultado com ela ou com um advogado.",
  },
  {
    heading: "O que acontece na primeira consulta?",
    answer:
      "Conversamos sobre o que aconteceu, revisamos seus sintomas e fazemos um exame físico focado no pescoço, nas costas e nas áreas onde você sente desconforto.",
    detail:
      "A partir desse exame, o Dr. Abe explica o que encontrou e se o atendimento quiroprático é indicado para o seu caso, se é melhor um encaminhamento a outro profissional, ou ambos. Os achados relacionados ao acidente ficam documentados. Quem atende é o próprio Dr. Abe, e ele mesmo atende o telefone do consultório.",
  },
  {
    heading: "Quanto o seguro PIP cobre na Flórida?",
    answer:
      "Pela lei da Flórida, o PIP cobre 80% das despesas médicas razoáveis dentro de um limite combinado de $10.000 — mas esse limite cai para $2.500 se não houver uma determinação de condição médica de emergência.",
    detail:
      "Essa determinação só pode ser feita por um médico (MD ou DO), um dentista, um assistente médico ou um enfermeiro registrado. Um quiroprático não está autorizado pela lei da Flórida a fazê-la. Por isso não prometemos um valor: o que a sua apólice cobre depende do seu caso, da sua cobertura e dessa determinação. Consulte sua seguradora ou um advogado licenciado sobre a sua situação específica.",
  },
  {
    heading: "Preciso de um boletim de ocorrência ou de um advogado para ser atendido?",
    answer: "Não. Você pode vir apenas com as informações do seu seguro.",
    detail:
      "Se você já tem um boletim de ocorrência, um advogado ou um ajustador de sinistros designado, coordenamos a documentação diretamente com eles para que o seu plano de atendimento e seus registros estejam prontos quando forem necessários. Não encaminhamos pacientes a advogados nem recebemos indicações em troca.",
  },
  {
    heading: "Dor no pescoço e nas costas depois do acidente",
    answer:
      "A dor no pescoço e na parte baixa das costas são os desconfortos mais frequentes depois de uma colisão, principalmente em batidas traseiras.",
    detail:
      "A força repentina pode distender músculos e ligamentos, irritar articulações e, em alguns casos, afetar os discos. Quando a dor irradia para um braço ou uma perna, ou vem acompanhada de dormência ou formigamento, é um achado que precisa ser avaliado logo e que pode exigir exames de imagem ou encaminhamento médico.",
  },
];

export const ptAutoAccidentRedFlags = {
  heading: "Quando procurar atendimento de emergência, não uma consulta",
  intro:
    "Ligue para o 911 ou vá a um pronto-socorro se, depois do acidente, você apresentar qualquer um destes sinais:",
  items: [
    "Dormência, formigamento ou fraqueza nos braços ou pernas",
    "Dor de cabeça intensa, tontura, vômito ou confusão",
    "Perda de consciência, mesmo que breve",
    "Dor no peito ou no abdômen, ou dificuldade para respirar",
    "Dor que piora rapidamente em vez de melhorar",
  ],
  footnote:
    "A Align the Spine não é um serviço de emergência e não faz diagnóstico pela internet. Esta página é informação geral e não substitui a avaliação de um profissional de saúde.",
};

/** "Como ajudamos" steps — Portuguese rendering of
 * content/auto-accident.ts's autoAccidentSteps, same three images. */
export const ptAutoAccidentSteps: HowWeHelpStep[] = [
  {
    image: "/figma-exports/home-visits-step-call.png",
    alt: "Telefone mostrando uma chamada recebida",
    title: "Ligue ou solicite on-line",
    description:
      "Conte para nós o que aconteceu. Sem central de atendimento e sem música de espera.",
  },
  {
    image: "/figma-exports/home-visits-step-eligibility.png",
    alt: "Prancheta com um formulário de avaliação",
    title: "Avaliação completa",
    description:
      "Um exame completo e a documentação que o seu reclamo realmente precisa — no consultório ou na sua casa.",
  },
  {
    image: "/figma-exports/home-visits-step-visit.png",
    alt: "Caderno e caneta prontos para um plano de tratamento",
    title: "Um plano de atendimento documentado",
    description:
      "O atendimento é definido de acordo com a sua avaliação, e os achados relacionados ao acidente ficam documentados para o seu reclamo.",
  },
];

export const ptAutoAccidentStepsHeading = "Da ligação a se sentir você mesmo outra vez";

export const ptAutoAccidentCoordinationQuote =
  "Quando o seu caso envolve um advogado ou um ajustador de seguros, coordenamos diretamente com eles — para que o seu plano de tratamento e a sua documentação estejam prontos quando forem necessários.";

export const ptAutoAccidentFaq: ConditionFaqItem[] = [
  {
    q: "Estou me sentindo bem — preciso mesmo passar por avaliação?",
    a: "Alguns sintomas relacionados a um acidente aparecem depois. Se você tem sintomas graves ou que pioram, procure atendimento médico com urgência; caso contrário, uma avaliação oportuna permite documentar o desconforto e determinar se o tratamento ou um encaminhamento são indicados.",
  },
  {
    q: "Isso vai custar algo do meu bolso?",
    a: "Depende da sua cobertura e dos detalhes do seu caso. Ligue para nós e explicamos o que esperar antes da sua primeira consulta. Não podemos garantir que o seu seguro vai pagar nem dizer quanto vai cobrir.",
  },
  {
    q: "E se os 14 dias já passaram?",
    a: "Você ainda pode procurar o atendimento médico adequado, mas na Flórida o pagamento do PIP geralmente depende de ter recebido o atendimento inicial dentro de 14 dias. Pergunte à sua seguradora ou a um profissional jurídico qualificado sobre a sua cobertura específica.",
  },
  {
    // NEEDS LINGUISTIC/FACTUAL REVIEW: content/site.ts's `bilingualCare` is
    // verified for English/Spanish only (2026-08-11), not Portuguese — this
    // answer deliberately does NOT assert Portuguese-language service and
    // instead points the reader at the phone call itself, matching this
    // ticket's "no unverified service-language claims" rule. Revisit if a
    // Portuguese-speaking staff claim is ever verified.
    q: "Vocês atendem em português?",
    a: "Ligue para o consultório e pergunte diretamente — o Dr. Abe ou a equipe confirmam por telefone antes da sua visita.",
  },
  {
    q: "O quiroprático pode determinar se eu tive uma condição médica de emergência?",
    a: "Não. Pela lei da Flórida, essa determinação só pode ser feita por um médico (MD ou DO), um dentista, um assistente médico ou um enfermeiro registrado. É um ponto importante porque o limite de benefícios do PIP depende dela.",
  },
  {
    q: "Posso pedir um atendimento a domicílio depois de um acidente?",
    a: "Você pode perguntar. Os atendimentos a domicílio dependem do seu caso e da sua localização, e confirmamos a elegibilidade quando você liga — não é um serviço garantido.",
  },
];

export const ptAutoAccidentFaqHeading = {
  eyebrow: "Perguntas frequentes",
  headingLead: "Tudo o que você precisa saber sobre",
  headingTail: "lesões por acidente de carro",
};

/** Portuguese comparison rows — same five rows the English/Spanish
 * auto-accident variant renders. "Priority Scheduling" is rendered as
 * "Agenda prioritária", not as a same-day promise: the approved claim in
 * content/site.ts is `sameDayAvailability: "Same-day"`, already carried by
 * the stat bar, and this row shouldn't quietly upgrade it. */
export const ptComparisonCopy = {
  eyebrow: "Uma forma melhor de se recuperar",
  heading: "Por que se arrastar até uma clínica quando você está com dor?",
  subheading:
    "O Dr. Abe Nasser monta o plano em torno da sua recuperação — incluindo atendimentos a domicílio quando indicado.",
  columnHeadings: {
    careBenefits: "Benefícios do atendimento",
    alignTheSpine: "Align the Spine",
    traditionalClinic: "Clínica tradicional",
  },
  footnote:
    "Os atendimentos a domicílio são oferecidos de acordo com o seu caso e a sua localização — confirmamos a elegibilidade quando você liga.",
  rows: [
    {
      label: "Deslocamento",
      alignTheSpine: "Atendimento a domicílio, quando indicado",
      traditionalClinic: "Você dirige com dor",
    },
    {
      label: "Disponibilidade",
      alignTheSpine: "Agenda prioritária",
      traditionalClinic: "Lista de espera de 2 a 3 semanas",
    },
    {
      label: "Conforto",
      alignTheSpine: "Sua própria sala",
      traditionalClinic: "Sala de espera clínica",
    },
  ] as ComparisonRow[],
  autoAccidentRows: [
    {
      label: "Seu médico",
      alignTheSpine: "O mesmo doutor em cada visita",
      traditionalClinic: "Um profissional diferente a cada vez",
    },
    {
      label: "Indicação de advogados",
      alignTheSpine: "Não é necessária indicação",
      traditionalClinic: "Indicação externa exigida",
    },
  ] as ComparisonRow[],
};

/** The two navy CTA bands on the accident page. */
export const ptAutoAccidentCtaBands = {
  ready: {
    heading: "Quando você estiver pronto",
    body: "Solicite uma avaliação no consultório, ou pergunte se um atendimento a domicílio é indicado para o seu caso e sua localização.",
    cta: "Solicitar minha avaliação",
  },
  call: {
    heading: "Ainda com dúvidas? É só ligar",
    body: "O Dr. Abe atende o telefone. Sem central de atendimento e sem música de espera.",
    eyebrow: "Vamos conversar hoje",
    cta: `Ligar para ${siteConfig.business.phone}`,
  },
};
