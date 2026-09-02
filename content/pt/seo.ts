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
 * Scope (ATS-SEO-135): the 9 routes that are actually published in both
 * English and Spanish today — home, car-accident hub, services hub, about,
 * reviews, contact, book-an-appointment, conditions hub, service-areas hub.
 * The draft condition/service pages (back pain, neck pain, adjustments,
 * etc.) and the 19 service-area city pages are deliberately NOT built here
 * — see docs/multilingual-seo-baseline.md's page-family strategy: build the
 * published set first, extend once there's real content/evidence for more,
 * same discipline already applied to Spanish's own city-page decision.
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
      "Owns 'serviços quiropráticos Deerfield Beach' hub intent in Brazilian Portuguese. Individual service pages are not built yet (English/Spanish originals are still draft), so nothing under it competes with it.",
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
      "Owns the conditions-directory intent in Brazilian Portuguese. Individual condition pages are not built yet (English/Spanish originals still draft), so this hub currently links onward primarily to the accident and services pages instead.",
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
];

/** Brazilian Portuguese counterpart of content/seo.ts's getRoute() — throws
 * on an unregistered path so a PT page that forgets to register itself
 * fails the build instead of shipping without a canonical. */
export function getPtRoute(path: string): RouteMeta {
  const route = ptRoutes.find((entry) => entry.path === path);
  if (!route) throw new Error(`content/pt/seo.ts: no route registered for path "${path}"`);
  return route;
}
