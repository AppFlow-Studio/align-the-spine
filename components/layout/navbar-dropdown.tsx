"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import type { NavLink as NavLinkConfig } from "@/content/site";

const CLOSE_DELAY_MS = 120;

/** Desktop mega-menu dropdown for a nav item that carries `menu` items
 * (Services, Conditions — content/site.ts) — same idea as Aceternity UI's
 * navbar dropdown pattern, restyled to this site's own navy/teal palette.
 * The panel is frosted glass (translucent + backdrop-blur) rather than a
 * flat navy fill, and its right-hand image swaps to match whichever item
 * is currently hovered/focused — a live preview, not a single static
 * thumbnail. Opens on hover (with a short close delay so moving the
 * mouse from the trigger down into the panel doesn't flicker it shut)
 * and on keyboard focus, so it's reachable by tab as well as pointer. The
 * trigger label itself still navigates to `link.href` on click — the
 * panel is an additional way in, not the only one. */
export function NavbarDropdown({ link }: { link: NavLinkConfig }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(link.menu?.[0]?.href);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const items = link.menu ?? [];
  const activeItem = items.find((item) => item.href === activeHref) ?? items[0];

  const active = pathname === link.href || items.some((item) => pathname === item.href);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  return (
    <li
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocusCapture={openNow}
      onBlurCapture={closeSoon}
    >
      <Link
        href={link.href}
        aria-current={active ? "page" : undefined}
        aria-expanded={open}
        className={`flex items-center gap-1.5 text-nav uppercase text-white transition-opacity duration-300 ${
          active ? "opacity-100 underline underline-offset-4" : "opacity-70 hover:opacity-100"
        }`}
      >
        {link.label}
        <ChevronDownIcon
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </Link>

      <AnimatePresence>
        {open && activeItem && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-1/2 top-full w-[min(94vw,50rem)] -translate-x-1/2 pt-3"
          >
            <div className="flex gap-4 rounded-30 border border-white/15 bg-navy-900/80 p-4 shadow-card backdrop-blur-2xl">
              <ul
                className={
                  items.length > 4 ? "grid flex-1 grid-cols-2 gap-1" : "flex flex-1 flex-col gap-1"
                }
              >
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onMouseEnter={() => setActiveHref(item.href)}
                      onFocus={() => setActiveHref(item.href)}
                      className={`block rounded-15 px-4 py-3 transition-colors ${
                        item.href === activeItem.href ? "bg-white/10" : "hover:bg-white/10"
                      }`}
                    >
                      <span className="block font-sans text-body-lg text-white">{item.label}</span>
                      <span className="mt-0.5 block font-sans text-[13px] leading-5 text-mute-300">
                        {item.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="relative hidden w-80 shrink-0 overflow-hidden rounded-20 bg-black/20 sm:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem.href}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeItem.image.src}
                      alt={activeItem.image.alt}
                      fill
                      sizes="320px"
                      className="object-contain"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
