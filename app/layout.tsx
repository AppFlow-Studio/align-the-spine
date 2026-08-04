import type { Metadata } from "next";
import { Geist, Newsreader, Poppins } from "next/font/google";

import { AnalyticsListeners } from "@/components/analytics/analytics-listeners";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import { GtmNoscript, GtmScript } from "@/components/analytics/gtm-scripts";
import { RootShell } from "@/components/layout/root-shell";
import { isProduction, siteConfig } from "@/content/site";

import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/** Site-wide metadata scaffolding (P0A SEO foundation). Every route sets its
 * own title/description/OG/Twitter/robots via lib/seo/metadata.ts's
 * buildMetadata(), which wraps `title` in `{ absolute }` — so `title.template`
 * below only ever applies to a route that doesn't call buildMetadata (none
 * currently do). `robots` mirrors buildMetadata's own isProduction() gate so
 * a route can't ship indexable in a nonproduction deploy by omission. */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.business.name} | South Florida's Chiropractor`,
    template: `%s | ${siteConfig.business.name}`,
  },
  description:
    "Elite spinal health care in Deerfield Beach, FL — office visits from $50, same-day car accident evaluations, and home visits when it fits your case.",
  openGraph: {
    siteName: siteConfig.business.name,
    type: "website",
    images: [
      { url: "/figma-exports/interior-reception.png", alt: "Align the Spine reception area" },
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
        <GtmScript />
        <AnalyticsScripts />
        <AnalyticsListeners />
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
