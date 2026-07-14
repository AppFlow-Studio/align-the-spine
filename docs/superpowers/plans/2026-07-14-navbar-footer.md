# Navbar & Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the global `Navbar` (transparent-over-hero ↔ glass/sticky on scroll, mobile drawer) and `Footer` (navy, config-driven) components and mount them once in `app/layout.tsx` as shared page chrome.

**Architecture:** Two independent component trees under `components/layout/`. `Footer` is a server component with no state. `Navbar` is a client component tree (`navbar.tsx` + `navbar-links.tsx` + `navbar-drawer.tsx` + `use-focus-trap.ts`) driven by scroll position, route (`usePathname`), and open/closed drawer state. Both read all copy/links from `content/site.ts` — no hardcoded strings. No test framework exists in this repo yet (confirmed: no `test` script, no test runner in `package.json`); verification follows the pattern already established in the ATS-001/002 plans — `npm run typecheck` / `lint` / `build` plus explicit manual dev-server QA steps, not automated unit tests.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind CSS v4. No new npm dependencies.

## Global Constraints

- Full design reference: `docs/superpowers/specs/2026-07-14-navbar-footer-design.md`. Read it first if anything below is ambiguous.
- Logo asset for **both** navbar states and the footer is `/figma-exports/logo_blue.png` (light/white mark) — never `/figma-exports/logo.png` (full-color).
- `text-nav` (Poppins 17px / 0.85px tracking, already in `tailwind.config.ts`) is reused as-is for both navbar states. Do not add a second nav font token.
- Book Appointment must route to `/book`. `siteConfig.bookingCta.href` changes from the ATS-002 placeholder `"#"` to `"/book"`.
- No new npm dependencies — scroll transition is a plain `scroll` event listener; the mobile drawer's focus trap is hand-rolled.
- `SOLID_NAV_ROUTES` (pages with no hero, so the navbar must render glass from load, never transparent): starts as `["/book", "/privacy", "/home-visits"]`.
- Mobile breakpoint is Tailwind's default `md` (768px) — use `md:` / `hidden md:flex`, not a custom breakpoint.
- Footer's copyright year is computed via `new Date().getFullYear()` at render — never hardcoded.
- Icons: this repo has no icon library. `components/ui/icons/arrow-right.tsx` already establishes the pattern of a small hand-drawn inline-SVG component as a stand-in when Figma's icon asset can't be fetched (Figma MCP is rate-limited this session, same as when that file was created). Follow the same pattern for the hamburger/close icons — do not fabricate any other visual detail this way.
- Colors used: `bg-navy-900` (`#253067`, existing token), `bg-navy-900/20` (existing `--overlay-navy-20` token) for the transparent-state Book pill.

---

### Task 1: Footer typography tokens

**Files:**

- Modify: `tailwind.config.ts`

**Interfaces:**

- Produces: Tailwind utilities `text-footer-tagline`, `text-footer-heading`, `text-footer-copy`, available to any component via `fontSize` theme lookup. Task 3 (Footer component) consumes these three class names directly.

- [ ] **Step 1: Add the three font-size entries**

Open `tailwind.config.ts`. The existing `fontSize` block (inside `theme.extend`) ends with `"alt-label"`. Add three new entries right after it, matching the existing tuple format exactly (raw px values, no CSS var indirection — the existing `fontSize` scale in this file doesn't use CSS vars, unlike `colors`/`borderRadius`):

```ts
      fontSize: {
        hero: ["87px", { lineHeight: "90px", fontWeight: "300" }],
        h2: ["35px", { lineHeight: "66px", fontWeight: "600" }],
        eyebrow: ["25px", { lineHeight: "40px", letterSpacing: "1.25px", fontWeight: "500" }],
        "body-lg": ["25px", { lineHeight: "40px", fontWeight: "400" }],
        button: ["20px", { lineHeight: "40px", fontWeight: "400" }],
        nav: ["17px", { lineHeight: "40px", letterSpacing: "0.85px", fontWeight: "400" }],
        "faq-q": ["25px", { lineHeight: "40px", fontWeight: "600" }],
        "faq-a": ["25px", { lineHeight: "40px", fontWeight: "400" }],
        "alt-label": ["22px", { lineHeight: "40px", fontWeight: "400" }],
        "footer-tagline": ["23px", { lineHeight: "39px", fontWeight: "400" }],
        "footer-heading": ["25px", { lineHeight: "40px", letterSpacing: "1.25px", fontWeight: "500" }],
        "footer-copy": ["20px", { lineHeight: "32px", fontWeight: "400" }],
      },
```

- [ ] **Step 2: Verify typecheck and lint**

Run: `npm run typecheck`
Expected: exits 0, no output.

Run: `npm run lint`
Expected: exits 0, no errors.

- [ ] **Step 3: Verify the utilities generate — throwaway probe**

Temporarily add to `app/page.tsx`, inside the returned JSX (anywhere valid):

```tsx
<span className="text-footer-tagline text-footer-heading text-footer-copy hidden">probe</span>
```

Run: `npm run build`
Expected: build succeeds (confirms Tailwind recognizes all three class names — an unrecognized class name doesn't fail the build, so this step confirms no typo in the config by checking the generated CSS instead: after building, grep the output).

Run: `grep -r "footer-tagline" .next/static/css/*.css`
Expected: at least one match (confirms the utility was generated, not silently dropped).

- [ ] **Step 4: Revert the throwaway probe**

```bash
git checkout -- app/page.tsx
```

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: add footer typography tokens"
```

---

### Task 2: Point Book Appointment at /book

**Files:**

- Modify: `content/site.ts:78`

**Interfaces:**

- Produces: `siteConfig.bookingCta.href === "/book"`. Task 4 (Navbar) and the drawer both render this value directly — no other change needed on their end.

- [ ] **Step 1: Update the href**

In `content/site.ts`, change:

```ts
  bookingCta: { label: "Book Appointment", href: "#" },
```

to:

```ts
  bookingCta: { label: "Book Appointment", href: "/book" },
```

- [ ] **Step 2: Verify typecheck and lint**

Run: `npm run typecheck`
Expected: exits 0, no output.

Run: `npm run lint`
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add content/site.ts
git commit -m "feat: point booking CTA at /book"
```

---

### Task 3: Footer component

**Files:**

- Create: `components/layout/footer.tsx`
- Modify: `app/layout.tsx`
- Delete: `components/layout/.gitkeep`

**Interfaces:**

- Consumes: `siteConfig` from `@/content/site` (`business`, `footer` fields); `text-footer-tagline` / `text-footer-heading` / `text-footer-copy` from Task 1.
- Produces: `Footer` named export from `components/layout/footer.tsx`. Mounted once in `app/layout.tsx`.

- [ ] **Step 1: Write `components/layout/footer.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-navy-900">
      <div className="container flex flex-col gap-16 py-20 md:flex-row md:justify-between">
        <div className="flex flex-col gap-6 md:max-w-sm">
          <Image
            src="/figma-exports/logo_blue.png"
            alt={siteConfig.business.name}
            width={97}
            height={97}
          />
          <p className="text-footer-tagline text-mute-300">{siteConfig.footer.tagline}</p>
        </div>

        <div className="flex flex-col gap-12 sm:flex-row sm:gap-24">
          <div className="flex flex-col gap-4">
            <h2 className="text-footer-heading uppercase text-white">Contact</h2>
            <a
              href={siteConfig.business.phoneHref}
              className="text-footer-copy text-mute-300 hover:text-white"
            >
              {siteConfig.business.phone}
            </a>
            <address className="text-footer-copy not-italic text-mute-300">
              {siteConfig.business.address.line1}, {siteConfig.business.address.suite}
              <br />
              {siteConfig.business.address.city}, {siteConfig.business.address.state}{" "}
              {siteConfig.business.address.zip}
            </address>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-footer-heading uppercase text-white">Site</h2>
            <nav className="flex flex-col gap-2">
              {siteConfig.footer.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-footer-copy text-mute-300 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="container border-t border-white/10 py-6">
        <p className="text-footer-copy text-mute-300">
          {year} {siteConfig.footer.copyrightName}. Licensed in the State of Florida.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Remove the now-unneeded `components/layout/.gitkeep`**

```bash
rm components/layout/.gitkeep
```

- [ ] **Step 3: Mount `Footer` in `app/layout.tsx`**

Current `app/layout.tsx` body:

```tsx
<html
  lang="en"
  className={`${newsreader.variable} ${poppins.variable} ${geist.variable} h-full antialiased`}
>
  <body className="min-h-full flex flex-col">{children}</body>
</html>
```

Change to:

```tsx
<html
  lang="en"
  className={`${newsreader.variable} ${poppins.variable} ${geist.variable} h-full antialiased`}
>
  <body className="flex min-h-full flex-col">
    <main className="flex-1">{children}</main>
    <Footer />
  </body>
</html>
```

And add the import at the top of the file, alongside the existing imports:

```tsx
import { Footer } from "@/components/layout/footer";
```

- [ ] **Step 4: Verify typecheck, lint, build**

Run: `npm run typecheck`
Expected: exits 0, no output.

Run: `npm run lint`
Expected: exits 0, no errors.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Manual verification**

Run: `npm run dev`, open `http://localhost:3000`.

Confirm:

- A navy footer renders at the bottom of the page with the logo, tagline, CONTACT column (phone as a clickable `tel:` link, address text), SITE column (Accident Care / About Dr. Abe / Reviews, each a working link), and the bottom copyright line showing the current year.
- Resize the viewport below 768px wide — confirm the columns stack vertically instead of sitting side-by-side.

- [ ] **Step 6: Commit**

```bash
git add components/layout/footer.tsx components/layout/.gitkeep app/layout.tsx
git commit -m "feat: add footer component"
```

---

### Task 4: Navbar (desktop states, scroll transition, mobile drawer)

**Files:**

- Create: `components/ui/icons/menu.tsx`
- Create: `components/ui/icons/close.tsx`
- Create: `components/layout/use-focus-trap.ts`
- Create: `components/layout/navbar-links.tsx`
- Create: `components/layout/navbar-drawer.tsx`
- Create: `components/layout/navbar.tsx`
- Modify: `app/layout.tsx`
- Delete: `components/ui/.gitkeep`

**Interfaces:**

- Consumes: `siteConfig` (`nav`, `bookingCta`, `business.name`) from `@/content/site`; `text-nav` / `text-button` tokens (existing); `bg-navy-900` / `bg-navy-900/20` (existing).
- Produces: `Navbar` named export, `SOLID_NAV_ROUTES: string[]` named export, both from `components/layout/navbar.tsx`. `Navbar` accepts an optional `variant?: "transparent" | "solid"` prop; when omitted, it's derived from the current route against `SOLID_NAV_ROUTES`. Mounted once in `app/layout.tsx`.

- [ ] **Step 1: Write `components/ui/icons/menu.tsx`**

```tsx
import type { SVGProps } from "react";

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}
```

- [ ] **Step 2: Write `components/ui/icons/close.tsx`**

```tsx
import type { SVGProps } from "react";

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}
```

- [ ] **Step 3: Remove the now-unneeded `components/ui/.gitkeep`**

```bash
rm components/ui/.gitkeep
```

- [ ] **Step 4: Write `components/layout/use-focus-trap.ts`**

```ts
"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    triggerRef.current = document.activeElement as HTMLElement | null;
    const container = containerRef.current;
    if (!container) return;

    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    getFocusable()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [active]);

  return containerRef;
}
```

- [ ] **Step 5: Write `components/layout/navbar-links.tsx`**

```tsx
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
```

- [ ] **Step 6: Write `components/layout/navbar-drawer.tsx`**

```tsx
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
    <div className="md:hidden" aria-hidden={!open} inert={!open}>
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
          className="self-end text-white"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        <ul className="flex flex-col gap-6">
          {siteConfig.nav.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={onClose} className="text-nav uppercase text-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={siteConfig.bookingCta.href}
          onClick={onClose}
          className="mt-auto flex h-[52px] items-center justify-center rounded-40 bg-white px-6 text-button text-navy-900"
        >
          {siteConfig.bookingCta.label}
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Write `components/layout/navbar.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MenuIcon } from "@/components/ui/icons/menu";
import { siteConfig } from "@/content/site";

import { NavbarDrawer } from "./navbar-drawer";
import { NavbarLinks } from "./navbar-links";

export const SOLID_NAV_ROUTES = ["/book", "/privacy", "/home-visits"];

const SCROLL_THRESHOLD = 40;

type NavbarVariant = "transparent" | "solid";

export function Navbar({ variant }: { variant?: NavbarVariant } = {}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const resolvedVariant: NavbarVariant =
    variant ?? (SOLID_NAV_ROUTES.includes(pathname) ? "solid" : "transparent");
  const isGlass = resolvedVariant === "solid" || scrolled;

  useEffect(() => {
    if (resolvedVariant === "solid") return;

    const onScroll = () => setScrolled(window.scrollY >= SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [resolvedVariant]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[100px] items-center">
      <div className="container flex items-center justify-between">
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
```

- [ ] **Step 8: Mount `Navbar` in `app/layout.tsx`**

Add the import:

```tsx
import { Navbar } from "@/components/layout/navbar";
```

Update the body (from Task 3's version) to:

```tsx
<body className="flex min-h-full flex-col">
  <Navbar />
  <main className="flex-1">{children}</main>
  <Footer />
</body>
```

- [ ] **Step 9: Verify typecheck, lint, build**

Run: `npm run typecheck`
Expected: exits 0, no output.

Run: `npm run lint`
Expected: exits 0, no errors.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 10: Manual verification — desktop states and scroll transition**

Run: `npm run dev`, open `http://localhost:3000` at a desktop viewport width (≥768px).

Confirm:

- Navbar renders fixed at the top, transparent, with the white logo, uppercase white nav links, and a translucent navy "Book Appointment" pill.
- Scrolling down past ~40px smoothly transitions the links onto a light glass pill and turns the Book Appointment button solid navy; scrolling back up reverts it.
- All nav links and the Book Appointment button are real links (inspect `href`s: `/services`, `/about`, `/reviews`, `/auto-accidents`, `/book`).

- [ ] **Step 11: Manual verification — solid variant (temporary probe)**

Temporarily change `app/layout.tsx`'s `<Navbar />` to `<Navbar variant="solid" />`, save, and reload `http://localhost:3000`.

Confirm: the navbar renders in the glass/sticky look immediately at the top of the page (scrollY = 0), with no transparent phase.

Revert:

```bash
git checkout -- app/layout.tsx
```

(This only reverts the temporary prop edit — Task 3/4's `app/layout.tsx` changes are already committed at this point, so `checkout` restores the last commit, not the probe.)

- [ ] **Step 12: Manual verification — mobile drawer and accessibility**

In the browser devtools, switch to a mobile viewport (<768px wide). Confirm the center links and Book Appointment pill are hidden and a hamburger button is visible.

Using only the keyboard (Tab to reach the hamburger, Enter/Space to activate):

- Confirm the drawer slides in from the right and the backdrop dims.
- Confirm focus lands on the first focusable element inside the drawer.
- Confirm repeatedly pressing Tab cycles only through elements inside the drawer (close button, nav links, Book Appointment) and never reaches content behind it.
- Confirm Shift+Tab from the first element wraps to the last element.
- Confirm pressing Escape closes the drawer and returns focus to the hamburger button.
- Reopen the drawer, click the backdrop (mouse), and confirm it closes.
- Reopen the drawer and confirm the page behind it does not scroll while it's open.
- Confirm every visible focus target has a visible focus ring (default browser outline is not suppressed anywhere in these components).

- [ ] **Step 13: Commit**

```bash
git add components/ui/icons/menu.tsx components/ui/icons/close.tsx components/ui/.gitkeep components/layout/use-focus-trap.ts components/layout/navbar-links.tsx components/layout/navbar-drawer.tsx components/layout/navbar.tsx app/layout.tsx
git commit -m "feat: add navbar with scroll transition and mobile drawer"
```

---

## Manual follow-up (not part of this ticket)

- **Top padding for solid-variant pages:** the navbar is `fixed` and overlaps page content by design (hero pages want this). Pages rendered with `variant="solid"` (or added to `SOLID_NAV_ROUTES`) will need their own top padding/margin to clear the 100px-tall navbar — that's a page-content concern for whichever ticket builds `/book`, `/privacy`, `/home-visits`, etc.
- **`SOLID_NAV_ROUTES` maintenance:** update this list as new non-hero pages ship. It currently only reflects the pages named in the footer ticket.
- **Active-link styling:** can't be fully exercised until real routes exist beyond `/` — re-check visually once `/services`, `/about`, `/reviews`, `/auto-accidents` are built.
- **Figma re-verification:** once the MCP rate limit resets, re-check the sticky-state link text color and exact glass-bar sizing against Figma node `1:369` (both are documented assumptions in the design spec, not confirmed values). Also re-check whether hand-drawn hamburger/close icons should be swapped for real Figma icon exports.
