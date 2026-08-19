"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { TopStatsBar } from "./top-stats-bar";

interface RootShellProps {
  children: ReactNode;
}

/** Global chrome shell: skip link, TopStatsBar, Navbar, main landmark, and
 * the standard Footer. Mounted once in app/layout.tsx. LocationIntro/
 * LocationFooter are page-level sections now (Home/Services/About/Book each
 * import and place them directly — see app/page.tsx), not part of this
 * shell. */
export function RootShell({ children }: RootShellProps) {
  const pathname = usePathname();
  const editorial = pathname.startsWith("/admin") || pathname.startsWith("/preview");
  if (editorial) {
    return (
      <>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-20 focus:bg-white focus:px-4 focus:py-2 focus:text-ink-900"
        >
          Skip to content
        </a>
        {children}
      </>
    );
  }
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-20 focus:bg-white focus:px-4 focus:py-2 focus:text-ink-900"
      >
        Skip to content
      </a>
      {/* Every Hero/HeroSolidPanel page bleeds its photo up over this bar so
       * it was never actually visible below `lg` in practice — the bleed
       * margin was fragile (see hero-solid-panel.tsx's CRO-pass comment for
       * where it broke), so this makes that always-hidden-below-lg intent
       * explicit instead of relying on pixel-matching a margin to it.
       * HeroSolidPanel's own in-panel trust line covers social proof below
       * `lg` instead (see hero-solid-panel.tsx). */}
      <TopStatsBar className="container hidden py-4 lg:block lg:py-6" />
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
