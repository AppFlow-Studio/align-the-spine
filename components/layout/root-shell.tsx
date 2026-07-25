"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { ContactSection } from "../sections/contact-section";
import { Footer } from "./footer";
import { LocationFooter } from "./location-footer";
import { LocationIntro } from "./location-intro";
import { Navbar } from "./navbar";
import { TopStatsBar } from "./top-stats-bar";

export const LOCATION_FOOTER_ROUTES = ["/", "/services", "/about"];

/** Routes whose ContactSection sits below LocationFooter's Hours of
 * Operation, per the artboard, instead of being mounted mid-page. Home
 * still mounts its own ContactSection inline (ATS-071) — revisit if/when
 * that's brought in line with this same layout. */
const CONTACT_AFTER_FOOTER_ROUTES = ["/services", "/about"];

type FooterVariant = "standard" | "location";

interface RootShellProps {
  children: ReactNode;
  footerVariant?: FooterVariant;
}

/** Global chrome shell: skip link, TopStatsBar, Navbar, main landmark, and a
 * swappable Footer/LocationFooter. Mounted once in app/layout.tsx. */
export function RootShell({ children, footerVariant }: RootShellProps) {
  const pathname = usePathname();
  const resolvedVariant: FooterVariant =
    footerVariant ?? (LOCATION_FOOTER_ROUTES.includes(pathname) ? "location" : "standard");

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-20 focus:bg-white focus:px-4 focus:py-2 focus:text-ink-900"
      >
        Skip to content
      </a>
      <TopStatsBar className="container py-4 md:py-6" />
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      {resolvedVariant === "location" && (
        <>
          <LocationIntro />
          <LocationFooter />
          {CONTACT_AFTER_FOOTER_ROUTES.includes(pathname) && <ContactSection />}
        </>
      )}
      <Footer />
    </>
  );
}
