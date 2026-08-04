"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import {
  isBookCtaLink,
  isPhoneLink,
  trackBookCtaClick,
  trackPageView,
  trackPhoneClick,
} from "@/lib/analytics";

/** Mounted once in the root layout (ATS-132). Two jobs gtag.js can't do on
 * its own in an App Router SPA:
 *
 * 1. Fires a GA4 page_view on every client-side route change (see
 *    AnalyticsScripts' `send_page_view: false` — this is what replaces it).
 * 2. Delegates a single document click listener to catch phone-number and
 *    Book-CTA clicks, since those links are spread across ~10 components
 *    (navbar, footer, hero call pills, service cards, ...) with no shared
 *    click handler to hook into individually. */
export function AnalyticsListeners() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const anchor = (event.target as HTMLElement).closest("a");
      const href = anchor?.getAttribute("href");
      if (!href) return;
      if (isPhoneLink(href)) trackPhoneClick();
      else if (isBookCtaLink(href)) trackBookCtaClick();
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
