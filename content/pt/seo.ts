import type { RouteMeta } from "@/content/seo";
import { siteConfig } from "@/content/site";

/** Brazilian Portuguese route registry — the `/pt` mirror of
 * content/seo.ts, built the same way content/es/seo.ts was (ATS-SEO-135,
 * following the shared architecture ATS-SEO-134 generalized).
 *
 * Same `RouteMeta` shape and the same rules: app/sitemap.ts maps over it,
 * and each PT page's `metadata` export pulls its entry by path via
 * getPtRoute() instead of re-declaring title/description, so the two can't
 * drift. content/i18n.test.ts asserts every path here is registered as the
 * `pt` half of a pair in content/i18n.ts (and vice versa).
 *
 * Scope: originally the 9 routes published in both English and Spanish
 * (ATS-SEO-135) — home, car-accident hub, services hub, about, reviews,
 * contact, book-an-appointment, conditions hub, service-areas hub. Extended
 * to include the seven condition pages and four service pages mirroring
 * Spanish's own `status: "draft"` set (ATS-SEO-070 follow-up), now that
 * real Portuguese content exists for them — see content/pt/conditions.ts
 * and content/pt/services-pages.ts. The 19 service-area city pages remain
 * deliberately NOT built here — see docs/multilingual-seo-baseline.md's
 * page-family strategy on why those stay out of scope regardless of locale.
 *
 * Titles/descriptions are written against Brazilian Portuguese search
 * intent (see SEO_QA_EVIDENCE/ahrefs-2026-09/synthesis-part2-and-final-labels.md's
 * pt-br cluster — real but thin seed data: "acidente de carro" carries a
 * real $25 CPC despite low raw volume, "torcicolo"/"dor nas costas"/
 * "dor lombar" are the validated symptom terms), not translated word-for-word
 * from the English or Spanish registries. "Quiroprático" leads titles, the
 * same head-term reasoning as the Spanish "Quiropráctico" (see
 * content/es/seo.ts) — Brazilian Portuguese uses the same pattern.
 *
 * SEARCH-VOLUME EVIDENCE IS THINNER THAN SPANISH'S: the pt-br Ahrefs pull
 * had real seed data but its vocabulary-expansion step hit a term-matching
 * bug (see the synthesis doc) — flagged `NEEDS LINGUISTIC REVIEW` per this
 * ticket's own acceptance criterion where a passage makes a specific
 * clinical/legal claim rather than being safely conservative.
 *
 * ATS-SEO-142: see SEO_QA_EVIDENCE/multilingual-keyword-map.md for the
 * consolidated locale/cluster/intent/target-page-family/funnel table this
 * file's titles are drawn from — every pt-BR row there is labeled `NEEDS
 * MORE EVIDENCE`, which is why these titles target plain, evidence-backed
 * everyday terms rather than an SEO-optimized keyword set that doesn't
 * exist yet.
 */
export const ptRoutes: RouteMeta[] = [
  {
    path: "/pt",
    title: `Quiroprático em Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Atendimento quiroprático em Deerfield Beach para dor nas costas, dor no pescoço e mobilidade, com avaliações focadas após acidente de carro.",
    image: {
      src: "/figma-exports/interior-reception.png",
      alt: "Recepção da Align the Spine em Deerfield Beach",
    },
    changeFrequency: "weekly",
    priority: 1,
    lastModified: "2026-09-02",
    primaryQuery: "Brazilian Portuguese-language Deerfield Beach general chiropractic intent",
    justification:
      "Owns broad 'quiroprático Deerfield Beach' intent for Brazilian Portuguese searchers. hreflang alternate of the English and Spanish home pages, not a competitor to either — each owns its own language's version of the same intent.",
  },
  {
    path: "/pt/quiropratico-acidentes-de-carro",
    title: `Quiroprático para Acidentes de Carro | Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Avaliação quiroprática após acidente de carro em Deerfield Beach: dor no pescoço, dor nas costas e torcicolo cervical. Lei PIP da Flórida: 14 dias para iniciar o atendimento.",
    image: {
      src: "/figma-exports/interior-corridor.png",
      alt: "Corredor de recepção da Align the Spine em Deerfield Beach",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-09-02",
    primaryQuery: "Brazilian Portuguese-language car-accident chiropractic intent",
    justification:
      "Owns the Brazilian Portuguese accident cluster ('acidente de carro', 'colisão') on one URL and carries the PIP timing explainer. hreflang alternate of /car-accident-chiropractor and /es/quiropractico-accidentes-de-auto.",
  },
  {
    path: "/pt/servicos",
    title: `Serviços Quiropráticos em Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Serviços quiropráticos em Deerfield Beach: ajustes, descompressão da coluna e terapia de tecidos moles com o Dr. Abe Nasser. Consulte qual opção é indicada para o seu caso.",
    image: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "Dr. Abe Nasser avaliando o pescoço de um paciente",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-09-02",
    primaryQuery: "Brazilian Portuguese-language general-care services hub",
    justification:
      "Owns 'serviços quiropráticos Deerfield Beach' hub intent in Brazilian Portuguese, and now links onward to the four real (draft) Portuguese service pages under it.",
  },
  {
    path: "/pt/dr-abe-nasser",
    title: `Dr. Abe Nasser, Quiroprático em Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Conheça o Dr. Abe Nasser, o quiroprático da Align the Spine Chiropractic em Deerfield Beach, e sua abordagem de atendimento centrada no paciente.",
    image: {
      src: "/figma-exports/portrait.png",
      alt: "Retrato do Dr. Abe Nasser",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-09-02",
    primaryQuery: "Brazilian Portuguese-language doctor-entity query",
    justification:
      "Owns the doctor-entity query in Brazilian Portuguese, same Person @id as the English/Spanish pages (one person, three languages, not three people).",
  },
  {
    path: "/pt/avaliacoes",
    title: `Avaliações de Pacientes | Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Avaliações reais de pacientes da Align the Spine Chiropractic em Deerfield Beach, FL.",
    image: {
      src: "/figma-exports/interior-table.png",
      alt: "Sala de atendimento da Align the Spine Chiropractic",
    },
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: "2026-09-02",
    primaryQuery: "Brazilian Portuguese-language Align the Spine patient reviews",
    justification:
      "Owns the trust/validation query in Brazilian Portuguese. Reviews themselves stay in their original language (not translated — a rewritten review presented as the patient's own words would be a fabricated review), matching the Spanish page's exact policy.",
  },
  {
    path: "/pt/contato",
    title: `Contato | ${siteConfig.business.shortName} | Deerfield Beach, FL`,
    description: `Entre em contato com a Align the Spine Chiropractic na 811 SE 8th Ave, Suite 101, Deerfield Beach, FL, ou ligue para ${siteConfig.business.phone}.`,
    image: {
      src: "/figma-exports/exterior-img.png",
      alt: "Fachada externa do prédio do consultório em Deerfield Beach",
    },
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: "2026-09-02",
    primaryQuery: "Brazilian Portuguese-language contact / location / hours",
    justification:
      "Owns the local-entity/NAP query in Brazilian Portuguese — the canonical location block for this language lives here.",
  },
  {
    path: "/pt/solicitar-consulta",
    // ATS-E3 (3.4)/ES precedent: "Solicitar", never "Marcar"/"Agendar" —
    // the office calls back to confirm a time, this form does not confirm
    // one itself. The English CTA was reworded off "Book" for exactly this
    // reason; the Portuguese CTA must not reintroduce the promise.
    title: `Solicitar Consulta com um Quiroprático | Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Solicite uma consulta com o Dr. Abe em Deerfield Beach. Envie seus dados e retornaremos a ligação para confirmar o horário; não é uma reserva automática.",
    image: {
      src: "/figma-exports/phone-mockup.png",
      alt: "Paciente ligando para a Align the Spine para solicitar uma consulta",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-09-02",
    primaryQuery: "Brazilian Portuguese-language appointment-request conversion action",
    justification:
      "Owns the Brazilian Portuguese booking-form action itself, not a topical query — the CTA target every Portuguese page links to.",
  },
  {
    path: "/pt/condicoes",
    title: `Condições Tratadas | Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Conheça as condições avaliadas pela Align the Spine Chiropractic em Deerfield Beach, incluindo dor nas costas, dor no pescoço e dor após acidente de carro.",
    image: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Dr. Abe Nasser avaliando um paciente",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-09-02",
    primaryQuery: "Brazilian Portuguese-language conditions overview hub",
    justification:
      "Owns the conditions-directory intent in Brazilian Portuguese, and now links onward to the seven real (draft) Portuguese condition pages under it.",
  },
  {
    path: "/pt/areas-de-atendimento",
    title: `Áreas de Atendimento Perto de Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "A Align the Spine Chiropractic tem um único consultório verificado em Deerfield Beach, FL. Veja como funciona o atendimento a domicílio para comunidades próximas.",
    image: {
      src: "/figma-exports/exterior-img.png",
      alt: "Fachada externa do prédio do consultório em Deerfield Beach",
    },
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: "2026-09-02",
    primaryQuery: "Brazilian Portuguese-language nearby-city service-area coverage index",
    justification:
      "Owns the service-area-coverage query in Brazilian Portuguese, states the one-office truth plainly. No individual PT city pages exist yet — see this file's header comment.",
  },
  // ── Condition pages ──────────────────────────────────────────────────
  // All seven are `status: "draft"`, mirroring their English/Spanish
  // originals: real, finished pages awaiting clinician review of their
  // medical content. Served noindex and kept out of the sitemap, but
  // reachable and linkable from the Portuguese nav.
  {
    path: "/pt/condicoes/dor-nas-costas",
    title: `Quiroprático para Dor nas Costas em Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Avaliação quiroprática para dor lombar, rigidez e dor que pode se espalhar para o quadril ou a perna, incluindo sintomas após um acidente de carro.",
    image: {
      src: "/figma-exports/drabe-backpain-front.png",
      alt: "Tratamento manual de tecidos moles na lombar",
    },
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Brazilian Portuguese-language back pain condition intent",
    justification:
      "Owns 'dor nas costas quiroprático Deerfield Beach'. Distinct from the sciatica page, which owns radiating leg pain. Draft until the English original clears clinician review.",
  },
  {
    path: "/pt/condicoes/dor-no-pescoco",
    title: `Quiroprático para Dor no Pescoço em Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Avaliação quiroprática para dor no pescoço, rigidez e mobilidade limitada, incluindo dor que começa após um acidente de carro ou torcicolo cervical.",
    image: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "Dr. Abe Nasser avaliando o pescoço de um paciente",
    },
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Brazilian Portuguese-language neck pain condition intent",
    justification:
      "Owns 'dor no pescoço quiroprático Deerfield Beach'. Distinct from the whiplash page, which owns the collision-injury framing. Draft until the English original clears review.",
  },
  {
    path: "/pt/condicoes/ciatica",
    title: `Quiroprático para Ciática em Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Avaliação e tratamento focado em descompressão para dor ciática e dor nervosa irradiada, com visitas domiciliares quando indicado para o seu caso.",
    image: {
      src: "/figma-exports/drabe-backpain-front.png",
      alt: "Dr. Abe avaliando um paciente com ciática",
    },
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Brazilian Portuguese-language sciatica condition intent",
    justification:
      "Owns 'ciática quiroprático Deerfield Beach' — radiating nerve pain, distinct from the back-pain page's localized intent. Draft until the English original clears review.",
  },
  {
    path: "/pt/condicoes/torcicolo-cervical",
    title: `Quiroprático para Torcicolo Cervical em Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "O torcicolo cervical é uma lesão no pescoço por movimento brusco, comum em colisões traseiras. Avaliação de rigidez, mobilidade limitada e dores de cabeça.",
    image: {
      src: "/figma-exports/drabe-whiplash-man.png",
      alt: "Dr. Abe tratando um paciente com torcicolo cervical",
    },
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Brazilian Portuguese-language whiplash condition intent",
    justification:
      "Owns 'torcicolo cervical quiroprático' collision-injury intent, distinct from the general neck-pain page. Draft until the English original clears review.",
  },
  {
    path: "/pt/condicoes/dor-de-cabeca-cervicogenica",
    title: `Quiroprático para Dor de Cabeça Cervicogênica | Deerfield Beach | ${siteConfig.business.shortName}`,
    description:
      "A dor de cabeça cervicogênica é dor referida a partir do pescoço. Avaliação da mobilidade cervical e de outros fatores musculoesqueléticos antes de recomendar atendimento.",
    image: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Avaliação de tensão cervical relacionada à dor de cabeça",
    },
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Brazilian Portuguese-language cervicogenic headache condition intent",
    justification:
      "Owns 'dor de cabeça que vem do pescoço' intent in Brazilian Portuguese, distinct from both the neck-pain and concussion pages. Draft until the English original clears review.",
  },
  {
    path: "/pt/condicoes/concussao",
    title: `Sintomas de Concussão Depois de um Acidente de Carro | ${siteConfig.business.shortName}`,
    description:
      "Uma concussão é uma lesão cerebral traumática leve que precisa de avaliação médica. O atendimento quiroprático não substitui uma avaliação de emergência ou neurológica.",
    image: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Dr. Abe avaliando um paciente depois de um acidente",
    },
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Brazilian Portuguese-language concussion-after-accident informational intent",
    justification:
      "Owns post-accident concussion symptom queries in Brazilian Portuguese. Informational and safety-first by design — routes readers to medical evaluation rather than booking. Draft until the English original clears review.",
  },
  {
    path: "/pt/condicoes/dor-na-mandibula-atm",
    title: `Quiroprático para ATM e Dor na Mandíbula | Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Avaliação do movimento da articulação da mandíbula, da tensão muscular ao redor e dos fatores cervicais antes de decidir se o atendimento quiroprático é indicado.",
    image: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Dr. Abe avaliando a mandíbula de um paciente",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Brazilian Portuguese-language TMJ/jaw pain condition intent",
    justification:
      "Owns 'dor na mandíbula ATM' intent in Brazilian Portuguese, distinct from the cervicogenic-headache page it commonly co-occurs with. Draft until the English original clears review.",
  },
  // ── Service pages ─────────────────────────────────────────────────────
  // All four are `status: "draft"`, mirroring their English/Spanish
  // originals: they carry clinical guidance that hasn't had a clinician's
  // sign-off, so they're served noindex and kept out of the sitemap while
  // remaining reachable (and linkable from the Portuguese nav) by direct URL.
  {
    path: "/pt/servicos/ajustes-quiropraticos",
    title: `Ajustes Quiropráticos em Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Ajustes quiropráticos em Deerfield Beach: pressão controlada para melhorar o movimento articular do pescoço, da parte média ou baixa das costas, após avaliação.",
    image: {
      src: "/figma-exports/adjustments-hero.png",
      alt: "Sala de tratamento preparada para um ajuste quiroprático",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Brazilian Portuguese-language chiropractic adjustment treatment intent",
    justification:
      "Owns 'ajuste quiroprático Deerfield Beach' treatment intent in Brazilian Portuguese. Draft until the English original clears clinician review; hreflang alternate of /services/chiropractic-adjustments.",
  },
  {
    path: "/pt/servicos/descompressao-da-coluna",
    title: `Descompressão da Coluna em Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Descompressão da coluna não cirúrgica em Deerfield Beach: tração controlada para reduzir a pressão sobre discos e articulações, quando a avaliação indicar.",
    image: {
      src: "/figma-exports/spinal-decompression-hero.png",
      alt: "Sala de tratamento preparada para terapia de descompressão da coluna",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Brazilian Portuguese-language spinal decompression treatment intent",
    justification:
      "Owns 'descompressão da coluna Deerfield Beach' intent in Brazilian Portuguese, distinct from the adjustment page's. Draft until the English original clears clinician review.",
  },
  {
    path: "/pt/servicos/terapia-de-tecidos-moles",
    title: `Massagem e Terapia de Tecidos Moles | Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Terapia de tecidos moles em Deerfield Beach: liberação miofascial, técnica Graston e tecido profundo para tensão muscular e dor após uma lesão.",
    image: {
      src: "/figma-exports/massage-soft-tissue-hero.png",
      alt: "Sala de tratamento de massagem e terapia de tecidos moles",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Brazilian Portuguese-language soft-tissue therapy treatment intent",
    justification:
      "Owns 'terapia de tecidos moles / massagem quiroprática' intent in Brazilian Portuguese. Draft until the English original clears clinician review.",
  },
  {
    path: "/pt/servicos/terapia-de-ventosas",
    title: `Terapia de Ventosas em Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Terapia de ventosas em Deerfield Beach: sucção localizada em áreas selecionadas de tensão muscular, usada quando indicado junto com uma avaliação quiroprática.",
    image: { src: "/figma-exports/cupping-drabe.png", alt: "Sessão de terapia de ventosas" },
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: "2026-09-09",
    status: "draft",
    primaryQuery: "Brazilian Portuguese-language cupping therapy treatment intent",
    justification:
      "Owns 'terapia de ventosas Deerfield Beach' intent in Brazilian Portuguese — a single technique, distinct from the broader soft-tissue page. Draft until the English original clears clinician review.",
  },
];

/** Brazilian Portuguese counterpart of content/seo.ts's getRoute() — throws
 * on an unregistered path so a PT page that forgets to register itself
 * fails the build instead of shipping without a canonical. */
export function getPtRoute(path: string): RouteMeta {
  const route = ptRoutes.find((entry) => entry.path === path);
  if (!route) throw new Error(`content/pt/seo.ts: no route registered for path "${path}"`);
  return route;
}
