"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getNav } from "@/content/chrome";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";

import { NavbarDropdown } from "./navbar-dropdown";

export function NavbarLinks({
  isGlass,
  className = "",
  locale = DEFAULT_LOCALE,
}: {
  isGlass: boolean;
  className?: string;
  locale?: Locale;
}) {
  const pathname = usePathname();
  // Spanish uses a flat nav (no mega-menus) — see content/es/chrome.ts for
  // why. The `link.menu` branch below simply never fires for it.
  const nav = getNav(locale);

  // Locales without service/condition mega-menus yet (pt/ht — see
  // content/pt/chrome.ts's own doc comment) list more top-level items than
  // en/es, so this row needs to fit more labels in the same navbar pill.
  // Tighter gaps + a smaller nav text size (both applied to every locale,
  // not just the longer ones, so the row doesn't visibly change size
  // between languages) plus `whitespace-nowrap` stop a long label like
  // "Acidentes de Carro" from wrapping to two lines and blowing out the
  // pill's fixed height.
  return (
    <ul
      className={`items-center gap-2.5 rounded-40 px-6 py-2 transition-colors duration-300 xl:gap-3.5 2xl:gap-5 ${className}`}
    >
      {nav.map((link) => {
        if (link.menu) return <NavbarDropdown key={link.label} link={link} />;

        const active = pathname === link.href;
        return (
          <li key={link.label}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap text-[14px] uppercase leading-6 tracking-[0.85px] text-white underline-offset-4 transition-opacity duration-300 ${
                active ? "opacity-100 underline" : "opacity-70 hover:underline hover:opacity-100"
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
