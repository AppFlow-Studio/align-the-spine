import type { Metadata } from "next";

import { AnalyticsListeners } from "@/components/analytics/analytics-listeners";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import { CallRailScript } from "@/components/analytics/callrail-script";
import { GtmScript } from "@/components/analytics/gtm-scripts";
import { TurnstileScript } from "@/components/analytics/turnstile-script";
import { RootShell } from "@/components/layout/root-shell";
import { HTML_LANG, OG_LOCALE } from "@/content/i18n";
import { isProduction, siteConfig } from "@/content/site";

import { fontVariables } from "../fonts";

import "../globals.css";

/** Haitian Creole root layout (ATS-SEO-136) — see app/(en)/layout.tsx for
 * why there is one root layout per locale rather than one shared layout,
 * and app/(es)/layout.tsx / app/(pt)/layout.tsx for the pattern this
 * mirrors exactly.
 *
 * The only structural difference from the English/Spanish/Portuguese
 * layouts is `lang` ("ht", per this epic's locale model — Haitian Creole
 * has no widely-used region-qualified variant, see content/i18n.ts's
 * HTML_LANG comment) and the Haitian Creole defaults below.
 *
 * `title.default`/`description` here are fallbacks only: every Haitian
 * Creole page sets its own via lib/seo/metadata.ts's
 * buildHtRouteMetadata(), which emits `{ absolute }` titles.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.business.name} | Kiwopratè nan Deerfield Beach`,
    template: `%s | ${siteConfig.business.name}`,
  },
  description: `Swen kiwopratik nan Deerfield Beach, FL — evalyasyon apre yon aksidan machin ak vizit lakay lè sa apwopriye. Rele ${siteConfig.business.phone}.`,
  openGraph: {
    siteName: siteConfig.business.name,
    type: "website",
    locale: OG_LOCALE.ht,
    images: [
      {
        url: "/figma-exports/interior-reception.png",
        alt: "Resepsyon Align the Spine nan Deerfield Beach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/figma-exports/interior-reception.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: isProduction() ? { index: true, follow: true } : { index: false, follow: false },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default function HtRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={HTML_LANG.ht} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <GtmScript />
        <AnalyticsScripts />
        <AnalyticsListeners />
        <CallRailScript />
        <TurnstileScript />
        <RootShell locale="ht">{children}</RootShell>
      </body>
    </html>
  );
}
