import { enChromeLabels, esBookingCta, esChromeLabels, esFooter, esNav } from "@/content/es/chrome";
import { htBookingCta, htChromeLabels, htFooter, htNav } from "@/content/ht/chrome";
import type { Locale } from "@/content/i18n";
import { ptBookingCta, ptChromeLabels, ptFooter, ptNav } from "@/content/pt/chrome";
import { getVerifiedStats, siteConfig, type DisplayStat, type NavLink } from "@/content/site";

/** Locale accessors for the shared site chrome.
 *
 * The navbar, drawer, and footer are one set of components rendered in
 * every language — there is no per-language copy of any of them. They read
 * their labels and links through these accessors instead of importing
 * siteConfig directly, which is what keeps a design change from having to
 * be made twice (and from being made once and silently missed in a
 * non-English locale).
 */
export function getNav(locale: Locale): NavLink[] {
  if (locale === "es") return esNav;
  if (locale === "pt") return ptNav;
  if (locale === "ht") return htNav;
  return siteConfig.nav;
}

export function getBookingCta(locale: Locale): NavLink {
  if (locale === "es") return esBookingCta;
  if (locale === "pt") return ptBookingCta;
  if (locale === "ht") return htBookingCta;
  return siteConfig.bookingCta;
}

export interface FooterConfig {
  tagline: string;
  links: NavLink[];
  copyrightName: string;
  contactHeading: string;
  siteHeading: string;
  privacyLabel: string;
  privacyHref: string;
  /** True when the privacy link crosses into the other language, so the
   * anchor can carry an honest hrefLang/lang. */
  privacyIsForeignLanguage: boolean;
  licenseLine: string;
}

export function getFooterConfig(locale: Locale): FooterConfig {
  if (locale === "es") {
    return {
      tagline: esFooter.tagline,
      links: esFooter.links,
      copyrightName: esFooter.copyrightName,
      contactHeading: "Contacto",
      siteHeading: "Sitio",
      privacyLabel: esFooter.privacyPolicy.label,
      privacyHref: esFooter.privacyPolicy.href,
      privacyIsForeignLanguage: true,
      licenseLine: "Con licencia en el estado de Florida.",
    };
  }

  if (locale === "pt") {
    return {
      tagline: ptFooter.tagline,
      links: ptFooter.links,
      copyrightName: ptFooter.copyrightName,
      contactHeading: "Contato",
      siteHeading: "Site",
      privacyLabel: ptFooter.privacyPolicy.label,
      privacyHref: ptFooter.privacyPolicy.href,
      privacyIsForeignLanguage: true,
      licenseLine: "Licenciado no estado da Flórida.",
    };
  }

  if (locale === "ht") {
    return {
      tagline: htFooter.tagline,
      links: htFooter.links,
      copyrightName: htFooter.copyrightName,
      contactHeading: "Kontak",
      siteHeading: "Sit la",
      privacyLabel: htFooter.privacyPolicy.label,
      privacyHref: htFooter.privacyPolicy.href,
      privacyIsForeignLanguage: true,
      licenseLine: "Gen lisans nan eta Florid.",
    };
  }

  return {
    tagline: siteConfig.footer.tagline,
    links: siteConfig.footer.links,
    copyrightName: siteConfig.footer.copyrightName,
    contactHeading: "Contact",
    siteHeading: "Site",
    privacyLabel: "Privacy Policy",
    privacyHref: "/privacy-policy",
    privacyIsForeignLanguage: false,
    licenseLine: "Licensed in the State of Florida.",
  };
}

export function getChromeLabels(locale: Locale) {
  if (locale === "es") return esChromeLabels;
  if (locale === "pt") return ptChromeLabels;
  if (locale === "ht") return htChromeLabels;
  return enChromeLabels;
}

/** getVerifiedStats() with the labels (and the display strings that are
 * English prose rather than data) rendered in `locale`.
 *
 * The verification gate is untouched — this maps over whatever
 * getVerifiedStats() already approved and never adds, broadens, or
 * re-words a claim. A stat with no Spanish rendering falls through to its
 * approved English value rather than being dropped, so a new approved
 * claim can't silently vanish from the Spanish bar. */
export function getLocalizedStats(locale: Locale): DisplayStat[] {
  const stats = getVerifiedStats();
  if (locale === "en") return stats;
  const labels =
    locale === "pt" ? ptChromeLabels : locale === "ht" ? htChromeLabels : esChromeLabels;

  return stats.map((stat) => ({
    label: labels.stats[stat.label] ?? stat.label,
    value: labels.statValues[stat.value] ?? stat.value,
  }));
}
