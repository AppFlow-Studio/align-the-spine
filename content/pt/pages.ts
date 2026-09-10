import type { ReactNode } from "react";

import type { ServiceCardItem } from "@/components/ui/service-card";
import type { DoctorHistoryContent, DoctorProfileContent } from "@/content/doctor-profile";
import type { PracticeCard } from "@/content/how-he-practices";
import { siteConfig } from "@/content/site";
import { mapVerified } from "@/content/verified-value";

/** Brazilian Portuguese copy for /pt/servicos, /pt/dr-abe-nasser,
 * /pt/avaliacoes, /pt/contato and /pt/solicitar-consulta (ATS-SEO-135).
 *
 * Same claim discipline as everywhere else in this codebase: no credential,
 * price, statistic, or outcome appears here that isn't already verified on
 * the English side. Two places where that visibly constrains the copy,
 * both deliberate, matching content/es/pages.ts's own notes:
 *
 *   - The doctor's degree, school, license and years of practice are still
 *     `doctorCredentials.verified: false` (content/doctor-profile.ts), so
 *     the Portuguese bio describes what he does and who he treats, and
 *     claims no qualification beyond "quiroprático" — the same job title
 *     the site already publishes in plain copy everywhere.
 *   - New-patient pricing is generalized rather than stated as a figure,
 *     matching how content/doctor-profile.ts handles the same sentence.
 *   - No Portuguese-language staff claim is made anywhere here —
 *     content/site.ts's `bilingualCare` verifies English/Spanish only
 *     (2026-08-11), not Portuguese.
 */

// ─────────────────────────────────────────────────────────── shared sections

/** Homepage/contact "Contact us" band, rendered by ContactSection. */
export const ptContactSectionCopy: {
  heading: string;
  body: ReactNode;
  lockupSubtitle: string;
} = {
  heading: "Fale conosco",
  body: "Se machucou ou só tem uma pergunta? Escreva quando quiser — respondemos rápido e sem central de atendimento.",
  lockupSubtitle: "Chiropractic and Wellness Center",
};

/** Portuguese DoctorProfile block, shared by the Portuguese home, services,
 * accident and doctor pages. The rating is derived from the same
 * siteConfig.reviewsRating source the English/Spanish profiles derive
 * from — one verified number, three languages, no second assertion. */
export const ptDoctorProfileContent: DoctorProfileContent = {
  eyebrow: "O DOUTOR POR TRÁS DO SEU ATENDIMENTO",
  name: "Dr. Abe Nasser",
  bio: "O Dr. Abe Nasser é o quiroprático da Align the Spine Chiropractic em Deerfield Beach. Já atendeu pacientes nos condados de Broward e Palm Beach, incluindo atletas, idosos e pessoas em recuperação pós-cirúrgica ou com necessidades relacionadas à gestação.",
  cta: { label: "Solicitar consulta com o Dr. Abe", href: "/pt/solicitar-consulta" },
  rating: mapVerified(siteConfig.reviewsRating, (r) => ({
    value: r.rating,
    count: r.count,
    location: "Deerfield Beach, Florida",
  })),
  portrait: { src: "/figma-exports/portrait.png", alt: "Dr. Abe Nasser" },
};

// ──────────────────────────────────────────────────────────── /pt/servicos

export const ptServicesPage = {
  hero: {
    eyebrow: "Cada tratamento é definido de acordo com a sua avaliação",
    titleLines: ["Serviços quiropráticos", "em Deerfield Beach, FL"] as const,
    subhead:
      "Dos ajustes de rotina ao atendimento especializado de recuperação — o mesmo doutor em cada visita, no consultório ou na sua casa quando indicado.",
    callPillEyebrow: "Vamos conversar hoje",
    form: {
      heading: "Solicite sua avaliação",
      footerNote:
        "Atendemos em Deerfield Beach. Ligue para perguntar se um atendimento a domicílio é indicado para o seu caso e sua localização.",
    },
  },
  catalog: {
    eyebrow: "Nossos serviços",
    heading: "Atendimento completo, adaptado ao seu caso",
  },
  breadcrumb: "Serviços",
};

/** Portuguese rendering of content/services-grid.ts. `href`/`ctaLabel` are
 * deliberately absent on every card except the one that links to the
 * published Portuguese accident page — the same reasoning as
 * content/es/pages.ts's esServicesGrid: the other cards' English/Spanish
 * originals are `status: "draft"` and have no Portuguese page to link to
 * yet, so carrying links over would push Portuguese readers into
 * English-only draft pages. */
export const ptServicesGrid: ServiceCardItem[] = [
  {
    slug: "adjustments",
    name: "Ajustes quiropráticos",
    duration: "",
    summary:
      "Ajustes manuais com pressão controlada para melhorar o movimento das articulações do pescoço, da parte média ou da parte baixa das costas, quando indicado.",
    image: {
      src: "/figma-exports/drabeadjust.png",
      alt: "Dr. Abe realizando um ajuste quiroprático",
    },
    // ATS-SEO-070 follow-up: this card's own page now exists in Portuguese.
    href: "/pt/servicos/ajustes-quiropraticos",
    ctaLabel: "Saiba mais",
  },
  {
    slug: "sports-injury",
    name: "Lesões esportivas",
    duration: "",
    summary:
      "Avaliação e tratamento manual para distensões, entorses e lesões por uso excessivo, com um plano pensado para voltar ao seu esporte.",
    image: {
      src: "/figma-exports/abe-back-turn.png",
      alt: "Avaliação e tratamento de uma lesão esportiva",
    },
  },
  {
    slug: "posture-corrective",
    name: "Postura e correção",
    duration: "",
    summary:
      "Avaliação e atendimento quiroprático para a tensão postural que se acumula com o trabalho sentado, dirigir ou movimentos repetitivos.",
    image: {
      src: "/figma-exports/drabe-spine.png",
      alt: "Atendimento postural e corretivo da coluna",
    },
  },
  {
    slug: "spinal-decompression",
    name: "Descompressão espinal",
    duration: "",
    summary:
      "Descompressão espinal por tração controlada para desconfortos selecionados de disco, articulação e dor nervosa irradiada, após uma avaliação completa.",
    image: {
      src: "/figma-exports/drabe-traction_compression.png",
      alt: "Terapia de tração e descompressão da coluna",
    },
    href: "/pt/servicos/descompressao-da-coluna",
    ctaLabel: "Saiba mais",
  },
  {
    slug: "headache-migraine",
    name: "Dor de cabeça e enxaqueca",
    duration: "",
    summary:
      "Avaliação focada no pescoço e atendimento quiroprático para dores de cabeça que podem ter um componente musculoesquelético ou cervical.",
    image: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Tratamento de dor de cabeça e enxaqueca",
    },
  },
  {
    slug: "car-accidents",
    name: "Acidentes de carro",
    duration: "",
    summary:
      "Depois de um acidente de carro, solicite uma avaliação quiroprática para dor no pescoço, dor nas costas, rigidez, sintomas de torcicolo cervical e outros desconfortos musculoesqueléticos.",
    image: {
      src: "/figma-exports/drabe-consult.png",
      alt: "Consulta com o Dr. Abe após um acidente de carro",
    },
    href: "/pt/quiropratico-acidentes-de-carro",
    ctaLabel: "Saiba mais",
  },
  {
    slug: "cupping-therapy",
    name: "Terapia de ventosas",
    duration: "",
    summary:
      "A terapia de ventosas aplica sucção localizada em áreas selecionadas de tensão muscular e pode ser incluída, quando indicado, para desconfortos no pescoço, nas costas ou em outros tecidos moles.",
    image: { src: "/figma-exports/cupping-drabe.png", alt: "Sessão de terapia de ventosas" },
    href: "/pt/servicos/terapia-de-ventosas",
    ctaLabel: "Saiba mais",
  },
  {
    slug: "massage-soft-tissue",
    name: "Massagem / tecidos moles",
    duration: "",
    summary:
      "Liberação miofascial e atendimento direcionado de tecidos moles para tensão muscular, mobilidade restrita e dor após uma lesão.",
    image: {
      src: "/figma-exports/drabe-soft-tissue.png",
      alt: "Terapia de massagem e tecidos moles",
    },
    href: "/pt/servicos/terapia-de-tecidos-moles",
    ctaLabel: "Saiba mais",
  },
];

// ────────────────────────────────────────────────────── /pt/dr-abe-nasser

export const ptDoctorPage = {
  hero: {
    eyebrow: ptDoctorProfileContent.eyebrow,
    titleLines: ["Dr. Abe Nasser,", "D.C."] as const,
    subhead:
      "Conheça o Dr. Abe Nasser, o quiroprático da Align the Spine Chiropractic em Deerfield Beach, e a forma como ele atende cada paciente.",
    callPillEyebrow: "Vamos conversar hoje",
  },
  breadcrumb: "Dr. Abe Nasser",
  practices: {
    eyebrow: "COMO ELE TRABALHA",
    heading: "O que os pacientes realmente notam",
    officeCallout: {
      heading: "O consultório, quando você prefere vir até nós",
      body: "Os atendimentos a domicílio são oferecidos de acordo com o seu caso e sua localização — mas o consultório em Deerfield Beach está sempre aqui.",
    },
  },
  galleryHeading: "Nosso consultório em Deerfield Beach",
};

export const ptDoctorHistoryContent: DoctorHistoryContent = {
  eyebrow: "TRAJETÓRIA",
  heading: "Construído sobre a ideia de ser o doutor que realmente está presente",
  paragraphs: [
    "O Dr. Abe começou sua carreira quiroprática atendendo nos condados de Broward e Palm Beach, com pacientes em todas as fases da recuperação — antes e depois da gestação, pós-cirúrgicos, idosos e atletas. Ao longo do caminho, notou sempre o mesmo padrão: os pacientes ficavam alternando entre o profissional disponível naquele dia, sem nunca alcançar a continuidade que realmente acelera a recuperação.",
    "A Align the Spine nasceu da ideia contrária. Um único doutor, em cada visita. Preços claros em vez de um labirinto de códigos, e uma primeira avaliação acessível, porque a primeira consulta não deveria ser uma aposta cara que impede as pessoas de se examinarem.",
  ],
};

export const ptHowHePracticesCards: PracticeCard[] = [
  {
    title: "Atendimento acessível",
    description:
      "Preços claros — um bom atendimento quiroprático não deveria ser um luxo. Ligue para saber o valor atual para pacientes novos.",
    image: {
      src: "/figma-exports/drabe-whiplash.png",
      alt: "Sessão de tratamento quiroprático",
    },
  },
  {
    title: "Sempre o mesmo doutor",
    description:
      "Sem profissionais alternando. Em cada visita, quem atende é o Dr. Abe — ele conhece o seu caso porque é ele quem trata você.",
    image: {
      src: "/figma-exports/drabe-backpain.png",
      alt: "Dr. Abe atendendo um paciente",
    },
  },
  {
    title: "Em cada fase da vida",
    description:
      "Antes e depois da gestação, pós-cirúrgicos, idosos, atletas — atendimento pensado para o momento em que você está.",
    image: {
      src: "/figma-exports/athome-drabe.png",
      alt: "Dr. Abe atendendo um paciente em casa",
    },
  },
];

// ───────────────────────────────────────────────────────────── /pt/avaliacoes

export const ptReviewsPage = {
  h1: "Avaliações de pacientes da Align the Spine Chiropractic",
  intro:
    "Estas são avaliações reais de pacientes em Deerfield Beach. Veja por que o sul da Flórida confia no Dr. Abe, e depois comece a sua própria recuperação.",
  ratingSuffix: "avaliações cinco estrelas",
  ratingTail: "e contando",
  /** ATS-SEO-070 follow-up: reviews now show a real Portuguese translation
   * (content/testimonials.ts's `quotePt`), same policy/wording as the
   * Spanish page (content/es/pages.ts's esReviewsPage.languageNote) — this
   * note used to say the opposite (no translated version published) back
   * when no `quotePt` existed; updated to match once it did, since the old
   * wording would now be false. The English original is what each patient
   * actually wrote; the translation is disclosed, never presented as their
   * own wording. */
  languageNote:
    "Estas avaliações foram escritas em inglês pelos nossos pacientes e estão traduzidas para o português. O texto original em inglês é mantido sem alterações na versão em inglês desta página.",
  formHeading: "Receba o mesmo atendimento 5 estrelas",
  formFootnote:
    "Com frequência há horários disponíveis no mesmo dia. Atendemos em Deerfield Beach e comunidades próximas do sul da Flórida.",
  heroAlt: "Align the Spine Chiropractic and Wellness Center",
  carouselHeading: "O que nossos pacientes dizem",
};

// ──────────────────────────────────────────────────────────── /pt/contato

export const ptContactPage = {
  hero: {
    eyebrow: "Estamos em Deerfield Beach",
    h1: "Fale com a Align the Spine",
    subhead: `Ligue para ${siteConfig.business.phone}, escreva para nós, ou envie o formulário e retornamos a ligação.`,
    formHeading: "Envie uma mensagem",
  },
  breadcrumb: "Contato",
  faqEyebrow: "Perguntas frequentes",
  faqHeading: "Antes da sua primeira visita",
  faq: [
    {
      question: "Como solicito uma consulta?",
      answer: `Ligue para ${siteConfig.business.phone} ou envie o formulário desta página. Retornamos a ligação para confirmar o horário — o formulário não reserva a consulta automaticamente.`,
    },
    {
      // NEEDS LINGUISTIC/FACTUAL REVIEW: no verified Portuguese-language
      // staff claim exists (content/site.ts's bilingualCare covers
      // English/Spanish only). This answer states the verified fact
      // (English service, phone contact) rather than assuming Portuguese.
      question: "Vocês atendem em português?",
      answer:
        "Ligue para o consultório e pergunte diretamente — a equipe confirma por telefone antes da sua visita.",
    },
    {
      question: "Onde fica o consultório?",
      answer: `Estamos em ${siteConfig.business.address.line1}, ${siteConfig.business.address.suite}, Deerfield Beach, FL ${siteConfig.business.address.zip}, dentro do Palm Plaza. Ao entrar na praça, somos o prédio no canto do extremo direito.`,
    },
    {
      question: "O que eu levo na minha primeira visita?",
      answer:
        "Um documento de identificação e as informações do seu seguro. Se o seu caso é de um acidente de carro e você já tem um boletim de ocorrência, um número de reclamo ou um advogado, traga — mas não é exigência para que você seja atendido.",
    },
  ],
};

// ─────────────────────────────────────────────────── /pt/solicitar-consulta

export const ptBookingPage = {
  hero: {
    eyebrow: "Solicite sua consulta",
    h1: "Solicitar uma consulta quiroprática",
    subhead:
      "Preencha o formulário e retornamos a ligação para confirmar o horário. Se preferir resolver por telefone, ligue para " +
      siteConfig.business.phone +
      " e fale diretamente com o Dr. Abe.",
    formHeading: "Solicite sua avaliação",
    footerNote:
      "Este formulário envia uma solicitação; não confirma um horário. Nós ligamos para combinar a consulta.",
  },
  breadcrumb: "Solicitar consulta",
  faqEyebrow: "Antes de solicitar",
  faqHeading: "Sobre a solicitação de consulta",
  faq: [
    {
      question: "Enviar o formulário confirma a minha consulta?",
      answer: `Não. O formulário envia uma solicitação; nós retornamos a ligação para combinar o dia e o horário. Se preferir confirmar de uma vez, ligue para ${siteConfig.business.phone}.`,
    },
    {
      question: "Quanto tempo demora para me ligarem?",
      answer:
        "Ligamos o mais rápido possível dentro do horário de atendimento. Se o seu caso é de um acidente recente e você está preocupado com o prazo de 14 dias do PIP, ligue diretamente em vez de esperar o retorno.",
    },
    {
      question: "Quais informações o formulário pede?",
      answer:
        "Nome, telefone e o motivo geral da consulta. Não pedimos histórico médico detalhado nem a descrição do acidente pelo formulário — isso é conversado na visita.",
    },
    {
      question: "Posso solicitar um atendimento a domicílio por aqui?",
      answer:
        "Sim, selecione essa opção como motivo. Confirmamos se é indicado para o seu caso e sua localização quando ligarmos — não é um serviço garantido.",
    },
  ],
  whatHappensNext: {
    eyebrow: "O que vem a seguir",
    heading: "Como funciona",
    steps: [
      {
        title: "Você envia a solicitação",
        body: "Nome, telefone e o motivo da consulta. Nada de histórico médico detalhado no formulário.",
      },
      {
        title: "Nós retornamos a ligação",
        body: "Combinamos um horário que funcione para você e explicamos o que trazer.",
      },
      {
        title: "Você vem para a sua avaliação",
        body: "O Dr. Abe revisa seus sintomas, faz um exame focado e explica se o atendimento quiroprático é indicado para o seu caso.",
      },
    ],
  },
};
