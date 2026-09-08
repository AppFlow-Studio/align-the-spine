import type { Locale } from "@/content/i18n";

/** UI strings the four-language switcher renders itself (ATS-SEO-137) —
 * genuinely per-*UI*-language, not per-target-language: a Spanish reader
 * sees these prompts in Spanish regardless of which of the four locales
 * they're about to switch to, a Portuguese reader sees them in Portuguese,
 * etc. This replaces the old two-way `languageSwitch`/`languageSwitchShort`
 * fields that used to live on each `content/{locale}/chrome.ts`'s
 * `xxChromeLabels` object — those encoded a single hardcoded "switch to
 * the one other language" sentence and can't express "switch to whichever
 * of three other languages you pick," so they're centralized here instead
 * of being duplicated (and inevitably drifting) across four chrome files.
 *
 * `viewIn`/`notAvailable` are parameterized by the TARGET locale's own
 * endonym (content/i18n.ts's LOCALE_ENDONYM) — e.g. on an English page the
 * Português menu item's accessible name is `viewIn("Português")`, which
 * renders "View this page in Português", not a translated "Portuguese".
 * The endonym is what a Portuguese speaker actually calls their own
 * language, and reusing the same LOCALE_ENDONYM string everywhere (the nav
 * label, the hreflang comment, this sentence) is what keeps all three from
 * drifting into three different spellings of the same language.
 */
export interface LanguageSwitcherCopy {
  /** Accessible name for the trigger button that opens the menu. */
  triggerLabel: string;
  /** aria-label on the <ul role="menu">. */
  menuLabel: string;
  /** aria-label for the link that switches to `targetEndonym`. */
  viewIn: (targetEndonym: string) => string;
  /** Visible + accessible text for a locale with no real equivalent page
   * for the route currently being viewed — ATS-SEO-137's "deliberate UX
   * fallback": the locale is still listed (so the reader can see a
   * Portuguese/Haitian Creole version of the SITE exists, even though not
   * of this specific page), but it renders as inert text, not a link, and
   * never silently substitutes that locale's home page. */
  notAvailable: (targetEndonym: string) => string;
  /** Screen-reader-only text marking which item is the current page's
   * language, alongside the visible checkmark. */
  currentLanguage: string;
}

const en: LanguageSwitcherCopy = {
  triggerLabel: "Choose a language",
  menuLabel: "Available languages",
  viewIn: (targetEndonym) => `View this page in ${targetEndonym}`,
  notAvailable: (targetEndonym) => `${targetEndonym} isn't available for this page yet`,
  currentLanguage: "Current language",
};

const es: LanguageSwitcherCopy = {
  triggerLabel: "Elegir idioma",
  menuLabel: "Idiomas disponibles",
  viewIn: (targetEndonym) => `Ver esta página en ${targetEndonym}`,
  notAvailable: (targetEndonym) => `${targetEndonym} todavía no está disponible para esta página`,
  currentLanguage: "Idioma actual",
};

const pt: LanguageSwitcherCopy = {
  triggerLabel: "Escolher idioma",
  menuLabel: "Idiomas disponíveis",
  viewIn: (targetEndonym) => `Ver esta página em ${targetEndonym}`,
  notAvailable: (targetEndonym) => `${targetEndonym} ainda não está disponível para esta página`,
  currentLanguage: "Idioma atual",
};

const ht: LanguageSwitcherCopy = {
  triggerLabel: "Chwazi yon lang",
  menuLabel: "Lang ki disponib",
  viewIn: (targetEndonym) => `Wè paj sa a an ${targetEndonym}`,
  notAvailable: (targetEndonym) => `${targetEndonym} poko disponib pou paj sa a`,
  currentLanguage: "Lang aktyèl la",
};

const COPY: Record<Locale, LanguageSwitcherCopy> = { en, es, pt, ht };

export function getLanguageSwitcherCopy(locale: Locale): LanguageSwitcherCopy {
  return COPY[locale];
}
