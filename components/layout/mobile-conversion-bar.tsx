"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getBookingCta, getChromeLabels } from "@/content/chrome";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import { isPublished, routes } from "@/content/seo";
import { siteConfig } from "@/content/site";
import {
  getOverlayOpenServerSnapshot,
  getOverlayOpenSnapshot,
  subscribeOverlayOpen,
} from "@/lib/ui/overlay-open-store";

// ATS-SEO-093 names Home/Accident/About/service-area pages. About and
// service-areas are English-only today, so only their EN paths are listed;
// Home and the car-accident page exist in all four locales (matching
// navbar.tsx's OUTLINE_CTA_ROUTES for the same two routes) so those get
// every locale's path. Condition/service pages aren't published in any
// locale yet — isPublished() below keeps this list correct without a
// change once they are, in whichever locale ships first.
const STATIC_BAR_PATHS = new Set([
  "/",
  "/about",
  "/car-accident-chiropractor",
  "/es",
  "/es/quiropractico-accidentes-de-auto",
  "/pt",
  "/pt/quiropratico-acidentes-de-carro",
  "/ht",
  "/ht/kiwoprate-pou-aksidan-machin",
]);

function isConversionBarRoute(pathname: string): boolean {
  if (STATIC_BAR_PATHS.has(pathname)) return true;
  if (pathname === "/service-areas" || pathname.startsWith("/service-areas/")) return true;
  if (pathname.startsWith("/conditions/") || pathname.startsWith("/services/")) {
    const route = routes.find((r) => r.path === pathname);
    return route ? isPublished(route) : false;
  }
  return false;
}

// Below this scroll depth the Hero's own call pill/CTA is still on screen
// (every Hero variant is at least a full viewport tall) — showing the bar
// there would duplicate it, which the ticket explicitly rules out.
const SHOW_AFTER_SCROLL_FRACTION = 0.85;

export function MobileConversionBar({ locale = DEFAULT_LOCALE }: { locale?: Locale } = {}) {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const overlayOpen = useSyncExternalStore(
    subscribeOverlayOpen,
    getOverlayOpenSnapshot,
    getOverlayOpenServerSnapshot,
  );

  const onBarRoute = isConversionBarRoute(pathname);

  useEffect(() => {
    if (!onBarRoute) return;

    const onScroll = () => {
      setPastHero(window.scrollY >= window.innerHeight * SHOW_AFTER_SCROLL_FRACTION);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onBarRoute]);

  useEffect(() => {
    if (!onBarRoute) return;
    // Hides the bar once the footer (and its own ContactSection form) is
    // reachable, so a fixed bottom bar never overlaps those form controls
    // and never stacks a second CTA next to the footer's own.
    const sentinel = document.getElementById("mobile-conversion-bar-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setNearFooter(entry.isIntersecting), {
      rootMargin: "0px 0px -10% 0px",
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onBarRoute]);

  if (!onBarRoute) return null;

  const visible = pastHero && !nearFooter && !overlayOpen;
  const labels = getChromeLabels(locale);
  const bookingCta = getBookingCta(locale);

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 flex gap-3 bg-navy-900/95 px-4 pt-3 shadow-card backdrop-blur-sm transition-transform duration-300 xl:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      {/* variant="glass": the site's established call-pill pattern (same
       * one Navbar/Hero use) — its own built-in phone-icon badge, so this
       * doesn't need to add one. variant="white" for the booking CTA, not
       * "teal": button.tsx's own doc comment says a resting teal fill reads
       * out of place on a navy-900 panel (teal is reserved for the hover
       * state there) — this bar's background is navy-900/95. */}
      <Button
        href={siteConfig.business.phoneHref}
        variant="glass"
        aria-label={`${labels.callLabel} ${siteConfig.business.phone}`}
        className="flex-1 justify-center"
      >
        {labels.callLabel}
      </Button>
      {/* Explicit horizontal/vertical padding (not just a smaller text
       * size) rather than relying on the "white" variant's own all-sides
       * padding: at a 320-375px viewport "Request Appointment" next to a
       * same-row Call pill has ~130px to work with — the variant's default
       * padding + button text size wraps to two lines there, mismatching
       * the fixed-height glass button beside it. whitespace-nowrap; the
       * button widens to its flex-1 share instead of wrapping. */}
      <Button
        href={bookingCta.href}
        variant="white"
        className="flex-1 justify-center gap-1.5 whitespace-nowrap px-2 py-3 text-[13px] sm:gap-3 sm:px-6 sm:py-4 sm:text-button"
      >
        {bookingCta.label}
      </Button>
    </div>
  );
}
