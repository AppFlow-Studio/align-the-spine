# Layout Shell, LocationFooter & FaqAccordion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build three independent pieces of shared chrome/primitives: (1) `RootShell`, a layout component composing `TopStatsBar` + `Navbar` + `<main>` + a swappable `Footer`/`LocationFooter`, mounted once in `app/layout.tsx`; (2) `LocationFooter`, the larger location/contact block (map, hours table, dual CTAs) used as one of the two footer variants; (3) `FaqAccordion`, an animated single-open accordion primitive.

**Architecture:** All three live under `components/layout/` (chrome) and `components/ui/` (primitive), following the existing split established by `Footer`/`Navbar` vs `Button`/`Card`. `RootShell` and `FaqAccordion` are client components (route/scroll-driven state, interactive toggle); `LocationFooter` is a server component, mirroring `Footer`. No test framework exists in this repo (confirmed in the navbar/footer plan already); verification is `npm run typecheck` / `lint` / `build` plus manual dev-server QA, same convention as every prior plan in `docs/superpowers/plans/`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind CSS v4. One new dependency: `framer-motion` (required by the FAQ ticket's spec — no other component in this repo uses an animation library, this is the first exception to that posture).

## Global Constraints

- Figma MCP is rate-limited on this session's plan (same issue as the existing `2026-07-14-navbar-footer-design.md` spec) — no fresh Figma pull was possible. Every visual detail not explicitly stated in the ticket text below is a flagged assumption, not a confirmed value.
- **Map embed:** Google Maps `iframe` built from `siteConfig.business.address` via `https://www.google.com/maps?q=<encoded address>&output=embed` — no API key, no new dependency.
- **FAQ content:** `content/faqs.ts` gets real placeholder chiropractic Q&A copy (insurance, first visit, walk-ins, auto accidents, treatment length, home visits) — swappable later once real copy exists. Not sourced from Figma.
- **TopStatsBar placement:** renders in normal document flow (scrolls away), directly above `Navbar`. `Navbar` changes from `fixed inset-x-0 top-0` to `sticky top-0` — its internal transparent→glass scroll-threshold logic (`components/layout/navbar.tsx`) is untouched, only the positioning strategy changes.
- **Footer variant selection:** follows the exact pattern `SOLID_NAV_ROUTES` already established for `Navbar` — a route list (`LOCATION_FOOTER_ROUTES = ["/", "/services", "/about"]`) with an optional `footerVariant` prop override, not a new React Context.
- **LocationFooter CTAs:** hand-styled to match the existing "white pill on navy" precedent already in `components/layout/navbar-drawer.tsx` (not the `Button` primitive, whose variants assume light-surface contexts and would have poor/zero contrast directly on `bg-navy-900`).
- **"Send Message" target:** `/#contact` — no contact form page/ticket exists yet, this is a placeholder consistent with `siteConfig.social` using `"#"` placeholders elsewhere in `content/site.ts`.
- Colors/tokens: `bg-navy-900` (`#253067`), `text-mute-300` (`#cdcdcd`), `text-faq-q`/`text-faq-a` (already in `tailwind.config.ts`), `text-footer-copy`, `font-alt` (Geist), `font-display` (Newsreader), `font-sans` (Poppins) — all existing, reused as-is.
- No automated tests exist in this repo; verification is `npm run typecheck`, `npm run lint`, `npm run build`, plus explicit manual dev-server QA steps per task.
- **Only one `<main>` landmark per page.** `app/page.tsx`'s untouched boilerplate already renders its own `<main>` tag — the prior navbar/footer plan's final review flagged this exact collision and deferred it to "whichever ticket replaces page.tsx boilerplate." `RootShell` (Task 5) is that ticket: it must rename `app/page.tsx`'s existing `<main>`/`</main>` tags to `<div>`/`</div>` (classes and content unchanged) so `RootShell`'s own `<main id="main-content">` is the page's single main landmark. This is the only edit `app/page.tsx` gets in this plan — no other boilerplate content changes.

---

### Task 1: FAQ toggle typography token

**Files:**

- Modify: `tailwind.config.ts`

**Interfaces:**

- Produces: Tailwind utility `text-faq-toggle`, consumed directly by Task 3 (`FaqAccordion`).

- [ ] **Step 1: Add the token**

In `tailwind.config.ts`, the `fontSize` block currently has this line:

```ts
        "faq-a": ["25px", { lineHeight: "40px", fontWeight: "400" }],
```

Add a new entry directly after it:

```ts
        "faq-a": ["25px", { lineHeight: "40px", fontWeight: "400" }],
        "faq-toggle": ["33px", { lineHeight: "40px", fontWeight: "400" }],
```

(Size and weight are given by the ticket — "Geist 33". Line-height isn't specified; `40px` is inferred to match every other token in this scale, which all use `40px` line-height at this font size band.)

- [ ] **Step 2: Verify typecheck and lint**

Run: `npm run typecheck`
Expected: exits 0, no output.

Run: `npm run lint`
Expected: exits 0, no errors.

- [ ] **Step 3: Verify the utility generates — throwaway probe**

Temporarily add to `app/page.tsx`, inside the returned JSX:

```tsx
<span className="text-faq-toggle hidden">+</span>
```

Run: `npm run build`
Expected: build succeeds.

Run: `grep -r "faq-toggle" .next/static/css/*.css`
Expected: at least one match.

- [ ] **Step 4: Revert the throwaway probe**

```bash
git checkout -- app/page.tsx
```

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: add FAQ toggle typography token"
```

---

### Task 2: FAQ placeholder content

**Files:**

- Modify: `content/faqs.ts`

**Interfaces:**

- Consumes: existing `FAQ` interface (`question: string; answer: string;`) already in this file.
- Produces: `faqs: FAQ[]` named export, consumed by Task 3's manual verification.

- [ ] **Step 1: Add the data export**

`content/faqs.ts` currently contains only:

```ts
export interface FAQ {
  question: string;
  answer: string;
}
```

Append below it:

```ts
export const faqs: FAQ[] = [
  {
    question: "Do you accept insurance?",
    answer:
      "Yes — we work with most major insurance providers, and if you were in an auto accident, PIP coverage often reduces your out-of-pocket cost to $0. Call us and we'll verify your benefits before your first visit.",
  },
  {
    question: "What should I expect at my first visit?",
    answer:
      "Your first visit includes a full consultation, a hands-on exam, and — if needed — imaging to pinpoint the cause of your pain. We'll walk you through a treatment plan before any adjustment begins.",
  },
  {
    question: "Do I need an appointment, or can I walk in?",
    answer:
      "We recommend booking ahead so we can hold time for a full exam, but we keep same-day slots open for urgent cases — call the office and we'll fit you in when we can.",
  },
  {
    question: "I was just in a car accident. How soon should I come in?",
    answer:
      "As soon as possible, even if you feel fine. Whiplash and soft-tissue injuries often don't show symptoms for days. Early evaluation also creates the documentation your PIP claim needs.",
  },
  {
    question: "How many visits will I need?",
    answer:
      "It depends on the injury and how long you've had it. Many patients feel relief within a few visits, while more complex or long-standing issues may need several weeks of care. We'll reassess and adjust the plan as you progress.",
  },
  {
    question: "Do you offer home visits?",
    answer:
      "Yes, home visits are available when it applies — ask our team when you call and we'll let you know if it's a fit for your situation.",
  },
];
```

- [ ] **Step 2: Verify typecheck and lint**

Run: `npm run typecheck`
Expected: exits 0, no output.

Run: `npm run lint`
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add content/faqs.ts
git commit -m "feat: add placeholder FAQ content"
```

---

### Task 3: FaqAccordion component

**Files:**

- Create: `components/ui/faq-accordion.tsx`
- Modify: `package.json` (via `npm install`)

**Interfaces:**

- Consumes: `FAQ` type from `@/content/faqs`; `faqs` data from Task 2 (verification only); `text-faq-q` / `text-faq-a` (existing) and `text-faq-toggle` (Task 1) tokens; `cn` from `@/lib/cn`.
- Produces: `FaqAccordion` named export from `components/ui/faq-accordion.tsx`, props `{ items: FAQ[] }`.

- [ ] **Step 1: Install framer-motion**

Run: `npm install framer-motion`
Expected: exits 0; `framer-motion` appears under `dependencies` in `package.json` and `package-lock.json` is updated.

- [ ] **Step 2: Write `components/ui/faq-accordion.tsx`**

```tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { FAQ } from "@/content/faqs";
import { cn } from "@/lib/cn";

export interface FaqAccordionProps {
  items: FAQ[];
}

/** Single-open FAQ accordion per condition-page-spec §B11: hairline-divided
 * rows, "+" glyph rotates -45deg into an "x" on open, first item open by
 * default, Framer Motion height animation that respects prefers-reduced-motion. */
export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(items.length > 0 ? 0 : null);
  const reduceMotion = useReducedMotion();

  return (
    <div className="divide-y divide-mute-300">
      {items.map((item, index) => {
        const open = openIndex === index;
        const buttonId = `faq-button-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div key={item.question} className="py-6">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-center justify-between gap-6 text-left"
              >
                <span className="font-alt text-faq-q text-navy-900">{item.question}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "font-alt text-faq-toggle text-navy-900 transition-transform duration-300",
                    open && "-rotate-45",
                  )}
                >
                  +
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="pt-4 font-alt text-faq-a text-black">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Verify typecheck, lint, build**

Run: `npm run typecheck`
Expected: exits 0, no output.

Run: `npm run lint`
Expected: exits 0, no errors.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Manual verification — throwaway mount**

Temporarily edit `app/page.tsx`: add the imports

```tsx
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { faqs } from "@/content/faqs";
```

and render `<FaqAccordion items={faqs} />` anywhere inside the returned JSX.

Run: `npm run dev`, open `http://localhost:3000`.

Confirm:

- The first FAQ row is open by default; all others are closed.
- Clicking a closed row's question opens it and closes whichever was open (single-open behavior); clicking an open row's question closes it.
- The "+" glyph rotates into an "×" shape when its row is open, and back when closed.
- Using only the keyboard (Tab to a question, Enter or Space to activate), each row toggles the same way, and `aria-expanded` on the button reflects state (check via devtools Accessibility/Elements panel).
- In Chrome devtools, enable "Emulate CSS media feature prefers-reduced-motion: reduce" (Rendering tab), reload, and confirm the panel opens/closes instantly with no animation.

Revert:

```bash
git checkout -- app/page.tsx
```

- [ ] **Step 5: Commit**

```bash
git add components/ui/faq-accordion.tsx package.json package-lock.json
git commit -m "feat: add FaqAccordion component"
```

---

### Task 4: LocationFooter component

**Files:**

- Create: `components/layout/location-footer.tsx`

**Interfaces:**

- Consumes: `siteConfig` (`business`, `hours`, `hoursNote`, `bookingCta`) from `@/content/site`; `Eyebrow` from `@/components/ui/eyebrow`; `ArrowRightIcon` from `@/components/ui/icons/arrow-right`.
- Produces: `LocationFooter` named export from `components/layout/location-footer.tsx`, no props. Consumed by Task 5's `RootShell`.

- [ ] **Step 1: Write `components/layout/location-footer.tsx`**

```tsx
import Link from "next/link";

import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { siteConfig } from "@/content/site";

function buildMapEmbedSrc(): string {
  const { line1, suite, city, state, zip } = siteConfig.business.address;
  const fullAddress = `${line1} ${suite}, ${city}, ${state} ${zip}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;
}

/** Larger location/contact block per ATS-013: map + address + hours table +
 * dual CTAs. Used as the "location" footer variant on Home, Services, About. */
export function LocationFooter() {
  return (
    <footer className="border-t border-white/10 bg-navy-900">
      <div className="container flex flex-col gap-14 py-20 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-6 lg:max-w-md">
          <Eyebrow>Location</Eyebrow>
          <h2 className="font-display text-display text-white">Our Location</h2>
          <p className="text-footer-copy text-mute-300">
            Find us inside Palm Plaza, just off Southeast 8th Avenue in Deerfield Beach.
          </p>
          <address className="text-footer-copy not-italic text-mute-300">
            {siteConfig.business.address.line1}, {siteConfig.business.address.suite}
            <br />
            {siteConfig.business.address.city}, {siteConfig.business.address.state}{" "}
            {siteConfig.business.address.zip}
          </address>

          <table className="w-full text-footer-copy text-mute-300">
            <tbody>
              {siteConfig.hours.map((hours) => (
                <tr key={hours.day} className="border-t border-white/10">
                  <th scope="row" className="py-2 text-left font-normal text-white">
                    {hours.day}
                  </th>
                  <td className="py-2 text-right">
                    {hours.open} – {hours.close}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-footer-copy text-mute-300">{siteConfig.hoursNote}</p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={siteConfig.bookingCta.href}
              className="flex h-16 items-center justify-center gap-3 rounded-40 bg-white px-8 font-sans text-button text-navy-900 transition-colors hover:bg-mute-300"
            >
              Book Your Visit
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/#contact"
              className="flex items-center gap-2 font-alt text-alt-label text-white transition-colors hover:text-mute-300"
            >
              Send Message
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <iframe
          title={`Map to ${siteConfig.business.name}`}
          src={buildMapEmbedSrc()}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[360px] w-full rounded-20 border-0 lg:w-[560px]"
        />
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify typecheck, lint, build**

Run: `npm run typecheck`
Expected: exits 0, no output.

Run: `npm run lint`
Expected: exits 0, no errors.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Manual verification — throwaway mount**

Temporarily edit `app/page.tsx`: add the import

```tsx
import { LocationFooter } from "@/components/layout/location-footer";
```

and render `<LocationFooter />` anywhere inside the returned JSX.

Run: `npm run dev`, open `http://localhost:3000`.

Confirm:

- "Our Location" heading, Palm Plaza note, and formatted address render.
- The hours table shows all seven days, each `9:00 AM – 7:00 PM`, plus the "Priority for emergency cases" note below it.
- The embedded map loads and is interactive (pan/zoom) and shows the correct address pin.
- "Book Your Visit" (white pill, navy text) links to `/book`; "Send Message" links to `/#contact`.
- Resize the viewport below Tailwind's `lg` breakpoint (1024px) — confirm the map and text column stack vertically instead of sitting side-by-side, and the hours table remains fully readable (no horizontal overflow).

Revert:

```bash
git checkout -- app/page.tsx
```

- [ ] **Step 4: Commit**

```bash
git add components/layout/location-footer.tsx
git commit -m "feat: add LocationFooter component"
```

---

### Task 5: RootShell layout composition

**Files:**

- Create: `components/layout/root-shell.tsx`
- Modify: `components/layout/navbar.tsx:48`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

**Interfaces:**

- Consumes: `TopStatsBar` from `./top-stats-bar`, `Navbar` from `./navbar`, `Footer` from `./footer`, `LocationFooter` from `./location-footer` (Task 4).
- Produces: `RootShell` named export and `LOCATION_FOOTER_ROUTES: string[]` named export from `components/layout/root-shell.tsx`. `RootShell` accepts `{ children: ReactNode; footerVariant?: "standard" | "location" }`; when `footerVariant` is omitted, it's derived from the current route against `LOCATION_FOOTER_ROUTES`. Mounted once in `app/layout.tsx`.

- [ ] **Step 1: Change `Navbar` from fixed to sticky positioning**

In `components/layout/navbar.tsx`, line 48 currently reads:

```tsx
    <header className="fixed inset-x-0 top-0 z-50 flex h-[100px] items-center">
```

Change to:

```tsx
    <header className="sticky top-0 z-50 flex h-[100px] items-center">
```

(`inset-x-0` is dropped — a `sticky` element stays in normal document flow, so it already spans the full width of its block-level parent; it isn't needed the way it was for `fixed`, which removes the element from flow.)

- [ ] **Step 2: Fix the nested `<main>` landmark in `app/page.tsx`**

`app/page.tsx` is untouched Next.js boilerplate that already renders its own `<main>` tag. Once `RootShell` (Step 3 below) adds its own `<main id="main-content">` in `app/layout.tsx`, that boilerplate `<main>` would render nested inside it — invalid HTML (only one `<main>` landmark per page) and exactly the collision flagged in the navbar/footer plan's final review. Rename `app/page.tsx`'s `<main>` tag to `<div>` — content and classes are unchanged, only the tag name:

Current (inside the outer `<div className="flex flex-col flex-1 ...">`):

```tsx
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
```

...

```tsx
      </main>
```

Change the opening and closing tags to:

```tsx
      <div className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
```

...

```tsx
      </div>
```

No other line in `app/page.tsx` changes.

- [ ] **Step 3: Write `components/layout/root-shell.tsx`**

```tsx
"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Footer } from "./footer";
import { LocationFooter } from "./location-footer";
import { Navbar } from "./navbar";
import { TopStatsBar } from "./top-stats-bar";

export const LOCATION_FOOTER_ROUTES = ["/", "/services", "/about"];

type FooterVariant = "standard" | "location";

interface RootShellProps {
  children: ReactNode;
  footerVariant?: FooterVariant;
}

/** Global chrome shell: skip link, TopStatsBar, Navbar, main landmark, and a
 * swappable Footer/LocationFooter. Mounted once in app/layout.tsx. */
export function RootShell({ children, footerVariant }: RootShellProps) {
  const pathname = usePathname();
  const resolvedVariant: FooterVariant =
    footerVariant ?? (LOCATION_FOOTER_ROUTES.includes(pathname) ? "location" : "standard");

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
      {resolvedVariant === "location" ? <LocationFooter /> : <Footer />}
    </>
  );
}
```

- [ ] **Step 4: Wire `RootShell` into `app/layout.tsx`**

Current `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Geist, Newsreader, Poppins } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${poppins.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

Replace with:

```tsx
import type { Metadata } from "next";
import { Geist, Newsreader, Poppins } from "next/font/google";

import { RootShell } from "@/components/layout/root-shell";

import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${poppins.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify typecheck, lint, build**

Run: `npm run typecheck`
Expected: exits 0, no output.

Run: `npm run lint`
Expected: exits 0, no errors.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Manual verification — chrome, sticky nav, skip link**

Run: `npm run dev`, open `http://localhost:3000`.

Confirm:

- `TopStatsBar` renders at the very top of the page (Reviews/Visits/etc. stats), above the navbar.
- Scrolling down: `TopStatsBar` scrolls out of view; `Navbar` sticks to the top of the viewport once it reaches it, and its existing transparent→glass transition still triggers correctly past the scroll threshold.
- Load the page fresh and press Tab once (before clicking anywhere): a "Skip to content" link becomes visible. Press Enter — focus moves to the page's main content region (confirm via devtools that focus lands on the `<main id="main-content">` element or its first focusable descendant).
- The page footer at `/` is `LocationFooter` (map, hours table, dual CTAs) — since `/` is in `LOCATION_FOOTER_ROUTES`.

- [ ] **Step 7: Manual verification — standard footer variant (temporary probe)**

Temporarily change `app/layout.tsx`'s `<RootShell>{children}</RootShell>` to `<RootShell footerVariant="standard">{children}</RootShell>`, save, and reload `http://localhost:3000`.

Confirm: the standard `Footer` (logo, tagline, Contact/Site columns) renders instead of `LocationFooter`, proving the override prop works independently of the route list.

Revert:

```bash
git checkout -- app/layout.tsx
```

(This only reverts the temporary prop edit — Step 4's `app/layout.tsx` change is already committed at this point, so `checkout` restores that commit, not the probe.)

- [ ] **Step 8: Commit**

```bash
git add components/layout/navbar.tsx components/layout/root-shell.tsx app/layout.tsx app/page.tsx
git commit -m "feat: add RootShell layout with TopStatsBar, sticky nav, and footer variants"
```

---

## Manual follow-up (not part of these tickets)

- **Hero overlay behavior changed:** `Navbar` no longer overlays page content by default now that it's `sticky` instead of `fixed` (previously `fixed` was noted as "overlaps page content by design (hero pages want this)" in the navbar/footer plan's follow-up section). No hero component exists yet, so nothing is broken today — but whoever builds the Home page hero should know the nav now reserves its own space above content by default. If a true image-overlay hero is still wanted, that component can pull itself up under the sticky bar with a negative top margin.
- **`SOLID_NAV_ROUTES`'s "add top padding to clear the fixed navbar" caveat is now moot** for routes that keep the default sticky behavior, since sticky elements reserve their own flow space — but re-verify once real pages exist.
- **`LOCATION_FOOTER_ROUTES` maintenance:** currently `["/", "/services", "/about"]` per the LocationFooter ticket's own page list — none of those pages have real content yet. Re-check visually once they're built.
- **"Send Message" → `/#contact`:** placeholder until a contact form/page ticket exists. Update the `href` in `location-footer.tsx` once that lands.
- **Figma re-verification:** once the MCP rate limit resets, re-check `text-faq-toggle`'s inferred line-height, the "Palm Plaza" note copy, TopStatsBar's exact spacing/border treatment, and LocationFooter's map sizing/CTA colors against the actual Figma frames — all are documented assumptions above, not confirmed values.
