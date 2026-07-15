"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MenuIcon } from "@/components/ui/icons/menu";
import { siteConfig } from "@/content/site";

import { NavbarDrawer } from "./navbar-drawer";
import { NavbarLinks } from "./navbar-links";

export const SOLID_NAV_ROUTES = ["/privacy", "/home-visits", "/thank-you"];

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
    <header className="fixed inset-x-0 top-0 z-50 flex h-[100px] items-center">
      <div
        className={`container flex items-center justify-between rounded-full px-2 ${
          isGlass ? "bg-white/[13%] backdrop-blur-md" : "bg-transparent"
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

        <NavbarLinks isGlass={isGlass} className="hidden md:flex" />

        <Link
          href={siteConfig.bookingCta.href}
          className={`hidden h-[52px] items-center rounded-40 px-6 text-button text-white transition-colors duration-300 md:flex ${
            isGlass ? "bg-navy-900" : "bg-navy-900/20"
          }`}
        >
          {siteConfig.bookingCta.label}
        </Link>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
          className="flex h-10 w-10 items-center justify-center text-white md:hidden"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      <NavbarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
