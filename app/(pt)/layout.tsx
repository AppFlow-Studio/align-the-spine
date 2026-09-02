import type { Metadata } from "next";

import { AnalyticsListeners } from "@/components/analytics/analytics-listeners";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import { GtmScript } from "@/components/analytics/gtm-scripts";
import { TurnstileScript } from "@/components/analytics/turnstile-script";
import { RootShell } from "@/components/layout/root-shell";
import { HTML_LANG, OG_LOCALE } from "@/content/i18n";
import { isProduction, siteConfig } from "@/content/site";

import { fontVariables } from "../fonts";

import "../globals.css";

/** Brazilian Portuguese root layout (ATS-SEO-135) — see app/(en)/layout.tsx
 * for why there is one root layout per locale rather than one shared
 * layout, and app/(es)/layout.tsx for the pattern this mirrors exactly.
 *
 * The only structural difference from the English/Spanish layouts is `lang`
 * (pt-BR, per this epic's locale model — see docs/multilingual-seo-baseline.md)
 * and the Portuguese defaults below. Everything else — analytics, fonts,
 * shell — is the same code path, so Portuguese pages can't drift into a
 * separate, half-instrumented version of the site.
 *
 * `title.default`/`description` here are fallbacks only: every Portuguese
 * page sets its own via lib/seo/metadata.ts's buildPtRouteMetadata(), which
 * emits `{ absolute }` titles.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.business.name} | Quiroprático em Deerfield Beach`,
    template: `%s | ${siteConfig.business.name}`,
  },
  description: `Atendimento quiroprático em Deerfield Beach, FL — avaliações após acidente de carro e atendimento a domicílio quando indicado. Ligue para ${siteConfig.business.phone}.`,
  openGraph: {
    siteName: siteConfig.business.name,
    type: "website",
    locale: OG_LOCALE.pt,
    images: [
      {
        url: "/figma-exports/interior-reception.png",
        alt: "Recepção da Align the Spine em Deerfield Beach",
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

export default function PtRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={HTML_LANG.pt} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <GtmScript />
        <AnalyticsScripts />
        <AnalyticsListeners />
        <TurnstileScript />
        <RootShell locale="pt">{children}</RootShell>
      </body>
    </html>
  );
}
