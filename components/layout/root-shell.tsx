import type { ReactNode } from "react";

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
      <Footer />
    </>
  );
}
