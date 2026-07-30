import type { Metadata } from "next";
import { Geist, Newsreader, Poppins } from "next/font/google";

import { AnalyticsListeners } from "@/components/analytics/analytics-listeners";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import { GtmNoscript, GtmScript } from "@/components/analytics/gtm-scripts";
import { RootShell } from "@/components/layout/root-shell";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { siteConfig } from "@/content/site";
import { localBusinessJsonLd } from "@/lib/seo/local-business";

import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

/** Fallback metadata for any route that doesn't set its own `title`/
 * `description` (every current page does — see app/page.tsx, app/about/
 * page.tsx, etc.). No `title.template` here: each page already bakes the
 * business name into its own title string, so a template would double it up. */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: `${siteConfig.business.name} | South Florida's Chiropractor`,
  description:
    "Elite spinal health care in Deerfield Beach, FL — office visits from $50, same-day car accident evaluations, and home visits when it fits your case.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${poppins.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <GtmNoscript />
        <JsonLdScript data={localBusinessJsonLd} />
        <GtmScript />
        <AnalyticsScripts />
        <AnalyticsListeners />
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
