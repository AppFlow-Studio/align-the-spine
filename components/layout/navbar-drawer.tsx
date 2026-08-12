"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { CloseIcon } from "@/components/ui/icons/close";
import { siteConfig } from "@/content/site";

import { useFocusTrap } from "./use-focus-trap";

export function NavbarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const containerRef = useFocusTrap(open);
  // Which nav-item labels have their submenu accordion expanded — a Set
  // rather than a single value since there's no reason opening one should
  // close another in this short a list.
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  function toggleExpanded(label: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  return (
    <div className="lg:hidden" aria-hidden={!open} inert={!open}>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-navy-900/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`fixed right-0 top-0 z-50 flex h-full w-4/5 max-w-sm flex-col gap-8 overflow-y-auto bg-navy-900 p-8 shadow-card transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="self-end text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        <ul className="flex flex-col gap-6">
          {siteConfig.nav.map((link) => {
            if (!link.menu) {
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="text-nav uppercase text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {link.label}
                  </Link>
                </li>
              );
            }

            const isExpanded = expanded.has(link.label);
            return (
              <li key={link.label}>
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => toggleExpanded(link.label)}
                  className="flex w-full items-center justify-between text-nav uppercase text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {link.label}
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <ul className="mt-4 flex flex-col gap-4 border-l border-white/15 pl-4">
                        <li>
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className="font-alt text-alt-label text-mute-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                          >
                            All {link.label}
                          </Link>
                        </li>
                        {link.menu.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className="font-alt text-alt-label text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <Link
          href={siteConfig.bookingCta.href}
          onClick={onClose}
          className="mt-auto flex h-[52px] items-center justify-center rounded-full bg-white px-6 text-button text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
        >
          {siteConfig.bookingCta.label}
        </Link>
      </div>
    </div>
  );
}
