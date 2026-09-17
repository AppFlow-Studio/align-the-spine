import { enChromeLabels, esBookingCta, esChromeLabels, esFooter, esNav } from "@/content/es/chrome";
import { getEsRoute } from "@/content/es/seo";
import { htBookingCta, htChromeLabels, htFooter, htNav } from "@/content/ht/chrome";
import { getHtRoute } from "@/content/ht/seo";
import type { Locale } from "@/content/i18n";
import { ptBookingCta, ptChromeLabels, ptFooter, ptNav } from "@/content/pt/chrome";
import { getPtRoute } from "@/content/pt/seo";
import { getRoute, isPublished } from "@/content/seo";
import { getVerifiedStats, siteConfig, type DisplayStat, type NavLink } from "@/content/site";

/** Whether `path` is a registered, published (indexable) route in `locale`
 * — the one place nav-link indexability is decided, so a link can't reach
 * this file's exports without going through it. Not registered at all
 * (getRoute/getEsRoute/etc throw) is treated as "not published": a nav
 * config typo should never crash the navbar, and it must never resolve to
 * "safe to link" by default. */
function isNavTargetPublished(path: string, locale: Locale): boolean {
  try {
    if (locale === "es") return isPublished(getEsRoute(path));
    if (locale === "pt") return isPublished(getPtRoute(path));
    if (locale === "ht") return isPublished(getHtRoute(path));
    return isPublished(getRoute(path));
  } catch {
    return false;
  }
}

/** Nav/footer must never link to a draft/noindex page (ATS-SEO scope
 * follow-up, 2026-09-17) — a primary-nav link to a noindexed destination is
 * a real internal-linking inconsistency, not cosmetic. Every mega-menu item
 * whose own page isn't published yet falls back to the group's own hub href
 * (still a real, published, relevant destination — never the booking CTA,
 * which would misrepresent what the visitor clicked) instead of being
 * silently dropped or left pointing at a noindex URL. Once a page is
 * flipped to `published` in its route registry, its menu item resolves to
 * its own href automatically — no further code change needed here. */
function withPublishedHrefs(nav: NavLink[], locale: Locale): NavLink[] {
  return nav
    .filter((link) => isNavTargetPublished(link.href, locale))
    .map((link) =>
      link.menu
        ? {
            ...link,
            menu: link.menu.map((item) => ({
              ...item,
              href: isNavTargetPublished(item.href, locale) ? item.href : link.href,
            })),
          }
        : link,
    );
}

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
  const rawNav =
    locale === "es" ? esNav : locale === "pt" ? ptNav : locale === "ht" ? htNav : siteConfig.nav;
  return withPublishedHrefs(rawNav, locale);
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

/** Same "never link to a draft/noindex page" invariant as withPublishedHrefs
 * above, applied to a flat footer link list (no menu/hub fallback concept
 * for the footer — a link with no published destination is simply dropped). */
function publishedFooterLinks(links: NavLink[], locale: Locale): NavLink[] {
  return links.filter((link) => isNavTargetPublished(link.href, locale));
}

export function getFooterConfig(locale: Locale): FooterConfig {
  if (locale === "es") {
    return {
      tagline: esFooter.tagline,
      links: publishedFooterLinks(esFooter.links, locale),
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
      links: publishedFooterLinks(ptFooter.links, locale),
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
      links: publishedFooterLinks(htFooter.links, locale),
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
    links: publishedFooterLinks(siteConfig.footer.links, locale),
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
