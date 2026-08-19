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
import { captureAttribution } from "@/lib/attribution";

/** Mounted once in the root layout (ATS-132). Two jobs gtag.js can't do on
 * its own in an App Router SPA:
 *
 * 1. Fires a GA4 page_view on every client-side route change (see
 *    AnalyticsScripts' `send_page_view: false` — this is what replaces it).
 * 2. Captures gclid/utm_* params on every landing (lib/attribution.ts) — these
 *    pages run as Google Ads landing pages/sitelinks, and a lead can land on
 *    one page from the ad click then convert on another before the URL still
 *    carries the param.
 * 3. Delegates a single document click listener to catch phone-number and
 *    Book-CTA clicks, since those links are spread across ~10 components
 *    (navbar, footer, hero call pills, service cards, ...) with no shared
 *    click handler to hook into individually. */
export function AnalyticsListeners() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/preview")) return;
    trackPageView(pathname);
    captureAttribution();
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/preview")) return;
    function handleClick(event: MouseEvent) {
      const anchor = (event.target as HTMLElement).closest("a");
      const href = anchor?.getAttribute("href");
      if (!href) return;
      if (isPhoneLink(href)) trackPhoneClick();
      else if (isBookCtaLink(href)) trackBookCtaClick();
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  return null;
}
