"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { CheckIcon } from "@/components/ui/icons/check";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { GlobeIcon } from "@/components/ui/icons/globe";
import { findRouteByPath, HREFLANG, LOCALE_ENDONYM, LOCALES, type Locale } from "@/content/i18n";
import { getLanguageSwitcherCopy } from "@/content/language-switcher-labels";
import { cn } from "@/lib/cn";

export interface LanguageSwitcherProps {
  locale: Locale;
  className?: string;
  /** "inline" is the navbar pill — a trigger button that opens a dropdown
   * menu. "block" is the full-width row list the mobile drawer uses —
   * always expanded, since it already lives inside an open drawer overlay
   * and a nested dropdown there would just be a menu inside a menu. */
  variant?: "inline" | "block";
  /** "inline" only. The navbar's switcher sits at the very top of the
   * page, so its menu opens downward (the default). The footer's switcher
   * sits at the very bottom — opening downward there would push the panel
   * past the end of the document, so it opens upward instead. */
  openUpward?: boolean;
}

interface LanguageOption {
  locale: Locale;
  endonym: string;
  /** Real path in this locale for the CURRENT route, or null when no
   * equivalent page exists yet. */
  href: string | null;
  isCurrent: boolean;
}

/** Four-language switch (ATS-SEO-137): English, Español, Português, Kreyòl
 * Ayisyen, listed in that order (content/i18n.ts's `LOCALES`).
 *
 * Resolves the *equivalent* page, not the other locale's home page — same
 * principle the original two-way switcher used, generalized: an accident
 * page switches to the accident page in each other locale that has one,
 * using content/i18n.ts's `findRouteByPath()` (the same route-pair table
 * hreflang, the sitemap, and internal links all read), so this can't drift
 * from what Google is told or what the sitemap emits.
 *
 * ATS-SEO-137's "deliberate UX fallback" for a locale with no equivalent
 * page: still LIST it (so a reader can see the site exists in that
 * language, not just silently lose an option), but render it as inert
 * text with a "not available for this page" accessible name — never a
 * link, and never a silent substitute for that locale's home page. If
 * NO locale besides the current one has a real equivalent at all (e.g.
 * /privacy-policy, which is English-only by design), the whole switcher
 * renders nothing, exactly like the original two-way version did — a menu
 * offering nothing real to switch to isn't a fallback, it's noise.
 *
 * Real `<a href>` elements, not next/link and not JS-only buttons: this is
 * the same choice the original made and for the same reason — the two
 * locales live in separate route groups with separate root layouts, so
 * crossing between them is a full document load either way, and a real
 * anchor with `hrefLang`/`lang` is both a crawlable signal and what a
 * screen reader needs to announce the destination language correctly.
 * Every anchor (and every disabled item) is unconditionally present in the
 * server-rendered HTML — the dropdown's open/closed state only toggles
 * CSS visibility and `aria-hidden`/`tabIndex`, it never mounts or unmounts
 * the menu items, so the destinations are in the raw HTML response
 * whether or not JavaScript ever runs. */
export function LanguageSwitcher({
  locale,
  className,
  variant = "inline",
  openUpward = false,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const copy = getLanguageSwitcherCopy(locale);

  const route = findRouteByPath(pathname, locale);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // No registry entry at all for this path (e.g. a blog post, an admin
  // route) — there's no route-pair data to build a switcher from, same as
  // the original component's behavior for an unregistered page.
  if (!route) return null;

  const options: LanguageOption[] = LOCALES.map((loc) => ({
    locale: loc,
    endonym: LOCALE_ENDONYM[loc],
    href: route[loc],
    isCurrent: loc === locale,
  }));

  const hasRealAlternative = options.some((option) => !option.isCurrent && option.href !== null);
  if (!hasRealAlternative) return null;

  const menuItems = (
    <>
      {options.map((option) => (
        <li key={option.locale} role="none">
          {option.isCurrent ? (
            <span
              role="menuitemradio"
              aria-checked="true"
              className="flex min-h-11 items-center justify-between gap-3 rounded-full px-4 py-2.5 font-sans text-nav text-white"
            >
              <span>{option.endonym}</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="sr-only">{copy.currentLanguage}</span>
                <CheckIcon className="h-4 w-4 shrink-0 text-teal-300" aria-hidden="true" />
              </span>
            </span>
          ) : option.href !== null ? (
            <a
              href={option.href}
              hrefLang={HREFLANG[option.locale]}
              lang={HREFLANG[option.locale]}
              role="menuitem"
              aria-label={copy.viewIn(option.endonym)}
              tabIndex={variant === "block" || open ? 0 : -1}
              className="flex min-h-11 items-center rounded-full px-4 py-2.5 font-sans text-nav text-mute-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {option.endonym}
            </a>
          ) : (
            <span
              role="menuitem"
              aria-disabled="true"
              className="flex min-h-11 cursor-default items-center rounded-full px-4 py-2.5 font-sans text-nav text-mute-400/60"
            >
              {option.endonym}
              <span className="sr-only"> — {copy.notAvailable(option.endonym)}</span>
            </span>
          )}
        </li>
      ))}
    </>
  );

  if (variant === "block") {
    return (
      <div className={className}>
        <p className="px-4 pb-1 font-sans text-[11px] uppercase tracking-[0.1em] text-mute-400">
          {copy.menuLabel}
        </p>
        <ul role="menu" aria-label={copy.menuLabel} className="flex flex-col">
          {menuItems}
        </ul>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={copy.triggerLabel}
        onClick={() => setOpen((prev) => !prev)}
        className="group inline-flex min-h-11 items-center gap-1.5 rounded-full font-sans text-nav uppercase underline-offset-4 transition-opacity duration-300 opacity-70 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
      >
        <GlobeIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
        {LOCALE_ENDONYM[locale]}
        <ChevronDownIcon
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      <ul
        role="menu"
        aria-label={copy.menuLabel}
        aria-hidden={!open}
        className={cn(
          "absolute right-0 z-10 w-56 rounded-20 border border-white/15 bg-navy-900/95 p-2 shadow-card backdrop-blur-2xl transition-all duration-150",
          openUpward ? "bottom-full origin-bottom-right mb-2" : "top-full origin-top-right mt-2",
          open
            ? "translate-y-0 opacity-100"
            : cn("pointer-events-none opacity-0", openUpward ? "translate-y-1" : "-translate-y-1"),
        )}
      >
        {menuItems}
      </ul>
    </div>
  );
}
