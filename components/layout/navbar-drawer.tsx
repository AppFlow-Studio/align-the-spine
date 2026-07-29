"use client";

import { useEffect } from "react";
import Link from "next/link";

import { CloseIcon } from "@/components/ui/icons/close";
import { siteConfig } from "@/content/site";

import { useFocusTrap } from "./use-focus-trap";

export function NavbarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const containerRef = useFocusTrap(open);

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
        className={`fixed right-0 top-0 z-50 flex h-full w-4/5 max-w-sm flex-col gap-8 bg-navy-900 p-8 shadow-card transition-transform duration-300 ${
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
          {siteConfig.nav.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="text-nav uppercase text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={siteConfig.bookingCta.href}
          onClick={onClose}
          className="mt-auto flex h-[52px] items-center justify-center rounded-40 bg-white px-6 text-button text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
        >
          {siteConfig.bookingCta.label}
        </Link>
      </div>
    </div>
  );
}
