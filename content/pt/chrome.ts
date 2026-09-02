import type { NavLink } from "@/content/site";

/** Brazilian Portuguese site chrome: navigation, footer, and the handful of
 * UI strings the shell renders directly (ATS-SEO-135).
 *
 * Deliberately simpler than content/es/chrome.ts's nav: Spanish has full
 * mega-menus for services/conditions/cities because those individual pages
 * exist in Spanish. None of that exists in Portuguese yet (ATS-SEO-135's
 * scope is the 9 published-parity pages only — see content/pt/seo.ts's
 * header comment), so the nav links straight to each hub instead of
 * fabricating dropdown destinations that don't exist. Every href here is a
 * Portuguese route registered in content/i18n.ts; content/i18n.test.ts
 * asserts that, so a nav link can't point at a Portuguese URL nothing
 * serves.
 */
export const ptNav: NavLink[] = [
  { label: "Serviços", href: "/pt/servicos" },
  { label: "Condições", href: "/pt/condicoes" },
  { label: "Acidentes de Carro", href: "/pt/quiropratico-acidentes-de-carro" },
  { label: "Sobre o Dr. Abe", href: "/pt/dr-abe-nasser" },
  { label: "Avaliações", href: "/pt/avaliacoes" },
  { label: "Áreas de Atendimento", href: "/pt/areas-de-atendimento" },
  { label: "Contato", href: "/pt/contato" },
];

/** "Solicitar Consulta", not "Marcar"/"Agendar": the form sends a request
 * and the office calls back — it does not confirm a time slot. Same
 * non-promise reasoning as the English "Request" CTA (ATS-E3 3.4) and the
 * Spanish "Solicitar Cita". */
export const ptBookingCta: NavLink = {
  label: "Solicitar Consulta",
  href: "/pt/solicitar-consulta",
};

export const ptFooter = {
  tagline:
    "Atendimento quiroprático em Deerfield Beach, da sua primeira avaliação até a sua recuperação.",
  links: [
    { label: "Atendimento após acidente", href: "/pt/quiropratico-acidentes-de-carro" },
    { label: "Sobre o Dr. Abe", href: "/pt/dr-abe-nasser" },
    { label: "Avaliações", href: "/pt/avaliacoes" },
    { label: "Áreas de atendimento", href: "/pt/areas-de-atendimento" },
  ] as NavLink[],
  copyrightName: "Align the Spine Chiropractic",
  /** /privacy-policy has no Portuguese version (a legal notice needs
   * counsel review, not a content translation — see content/i18n.ts,
   * same rule already applied to Spanish). The Portuguese footer still
   * links to it, marked `hrefLang="en"` so both the reader and Google know
   * they're crossing into English. */
  privacyPolicy: { label: "Política de Privacidade (em inglês)", href: "/privacy-policy" },
};

/** Chrome strings the shell renders outside of any content module. */
export const ptChromeLabels = {
  skipToContent: "Pular para o conteúdo",
  openMenu: "Abrir menu",
  closeMenu: "Fechar menu",
  viewAll: (label: string) => `Ver tudo: ${label}`,
  callUs: "Fale conosco hoje",
  languageSwitch: "View this page in English",
  languageSwitchShort: "English",
  /** Spanish labels for content/site.ts's verified stat chips. Only the
   * label is translated — the values are verified factual claims and stay
   * as approved (see getVerifiedStats). */
  stats: {
    Reviews: "Avaliações",
    Visits: "Consultas",
    "When it applies": "Quando aplicável",
    "Bilingual care": "Atendimento bilíngue",
    Insurance: "Seguro",
  } as Record<string, string>,
  statValues: {
    "Same-day": "No mesmo dia",
    "Home visits": "Atendimento a domicílio",
    "PIP accepted": "Aceitamos PIP",
  } as Record<string, string>,
};
