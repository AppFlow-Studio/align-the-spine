"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MenuIcon } from "@/components/ui/icons/menu";
import { siteConfig } from "@/content/site";

import { NavbarDrawer } from "./navbar-drawer";
import { NavbarLinks } from "./navbar-links";

export const SOLID_NAV_ROUTES = ["/privacy-policy", "/home-visits", "/thank-you"];

/** Pages whose Hero renders a solid navy-900 right-column panel
 * (components/sections/hero-solid-panel.tsx) — the same color as the
 * default filled "Book Appointment" pill, so it'd be invisible against it
 * while the navbar is still transparent (pre-scroll). Those pages get an
 * outlined pill instead until the navbar goes solid/glass. /home-visits
 * also uses HeroSolidPanel but is already in SOLID_NAV_ROUTES above (its
 * navbar is never transparent), so it doesn't need to be listed here too. */
export const OUTLINE_CTA_ROUTES = [
  "/",
  "/auto-accidents",
  "/services",
  "/conditions/back-pain",
  "/conditions/cervicogenic-headache",
  "/conditions/concussion",
  "/conditions/neck-pain",
  "/conditions/sciatica",
  "/conditions/tmj-jaw-pain",
  "/conditions/whiplash",
];

const SCROLL_THRESHOLD = 40;

type NavbarVariant = "transparent" | "solid";

export function Navbar({ variant }: { variant?: NavbarVariant } = {}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  const resolvedVariant: NavbarVariant =
    variant ?? (SOLID_NAV_ROUTES.includes(pathname) ? "solid" : "transparent");
  const isGlass = resolvedVariant === "solid" || scrolled;
  const outlineCta = OUTLINE_CTA_ROUTES.includes(pathname) && !isGlass;

  // Close the drawer on route change. Adjusting state during render (rather
  // than in an effect) avoids an extra post-commit render pass — see
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setDrawerOpen(false);
  }

  useEffect(() => {
    if (resolvedVariant === "solid") return;

    const onScroll = () => setScrolled(window.scrollY >= SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [resolvedVariant]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 isolate flex h-[100px] items-center will-change-transform">
        <div
          className={`container relative flex items-center justify-between rounded-full px-2 transition-colors duration-300 ${
            isGlass ? "bg-[#636363] backdrop-blur-md" : "bg-transparent"
          }`}
        >
          <Link href="/" className="shrink-0">
            <Image
              src="/figma-exports/logo_blue.png"
              alt={siteConfig.business.name}
              width={65}
              height={65}
            />
          </Link>

          <NavbarLinks isGlass={isGlass} className="hidden lg:flex" />

          <Link
            href={siteConfig.bookingCta.href}
            className={`hidden h-[52px] items-center rounded-full px-6 text-button text-white transition-colors duration-300 lg:flex ${
              outlineCta ? "border border-white bg-transparent" : "bg-navy-900"
            }`}
          >
            {siteConfig.bookingCta.label}
          </Link>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="flex h-10 w-10 items-center justify-center text-white lg:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Rendered as a header sibling, not a child: header has
       * will-change-transform, which establishes a containing block for
       * position:fixed descendants (per spec, same as an actual transform)
       * — nesting the drawer inside it collapsed the drawer's fixed
       * inset-0/h-full to the header's own 100px height instead of the
       * viewport. */}
      <NavbarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
