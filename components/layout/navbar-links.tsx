"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/content/site";

export function NavbarLinks({ isGlass, className = "" }: { isGlass: boolean; className?: string }) {
  const pathname = usePathname();

  return (
    <ul
      className={`items-center gap-10 rounded-40 px-8 py-2 transition-colors duration-300 ${
        isGlass ? "bg-white/[13%] backdrop-blur-md" : "bg-transparent"
      } ${className}`}
    >
      {siteConfig.nav.map((link) => {
        const active = pathname === link.href;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`text-nav uppercase text-white transition-opacity duration-300 ${
                active ? "opacity-100 underline underline-offset-4" : "opacity-70 hover:opacity-100"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
