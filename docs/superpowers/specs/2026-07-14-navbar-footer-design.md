# Navbar & Footer — Design

**Tickets:** Epic 1 – Layout · Track: Dev A · Navbar Est: L (depends on content/site config, blocks: all pages) · Footer Est: M (depends on content/site config + design tokens)
**Source:** ticket text (pasted directly, not re-fetched from a tracker) + Figma "Align the spine - Chiro (Copy)" file (`7p8hHjzZVy6MgpP6RAnmU1`), node `1:369` ("onscroll-navbar") referenced by the navbar ticket. Figma MCP hit its per-plan rate limit again this session (same issue documented in the ATS-002 design-tokens spec) before any node could be fetched, so this doc is built from the ticket's own written specs plus values already tokenized in `tailwind.config.ts` / `globals.css`, not a fresh Figma pull. Gaps are called out explicitly below rather than guessed silently.

Combined into one spec per the ticket-author's preference (both are small layout-chrome components with no shared logic, built together for one review pass) — diverges from the one-doc-per-ticket pattern used for ATS-001/ATS-002, noted here so it isn't mistaken for an oversight.

## Resolved open decisions

- **Nav font conflict (navbar ticket's ⚠️ Resolve):** already resolved by ATS-002 — `text-nav` (Poppins 17px / 0.85px tracking / 400 weight) is the single token for both transparent and sticky states. No new decision needed here.
- **Logo asset:** `public/figma-exports/logo_blue.png` (visually a light/white monochrome mark, despite the filename) is used for both navbar states and the footer, since all three sit on dark, glass, or navy surfaces. `logo.png` (full-color, navy/teal) is not used by either component. Inferred by opening both files, not Figma-confirmed.
- **Navbar variant mechanism:** `Navbar` is mounted once in `app/layout.tsx` and internally derives its variant from `usePathname()` against an exported `SOLID_NAV_ROUTES` list, defaulting to `"transparent"` (fades to glass on scroll) for everything not in that list. Starting list: `["/book", "/privacy", "/home-visits"]`, per the footer ticket's page list. An optional `variant` prop can still override this per-instance. This keeps future page tickets from having to remember to configure it — one list to update as new non-hero routes ship.
- **Sticky-state link text color:** kept white (only the Book button's color change is specified in the ticket; link color isn't called out as changing). Flagged as an assumption pending Figma access.
- **Focus trap:** hand-rolled hook (`use-focus-trap.ts`), no new dependency — matches this repo's zero-extra-UI-deps posture so far.
- **Book Appointment destination:** `siteConfig.bookingCta.href` changes from the ATS-002 placeholder `"#"` to `"/book"` in `content/site.ts` (data-driven, not hardcoded in the component) to satisfy the navbar AC.
- **Footer height:** "~510 tall" treated as a padding target on desktop, not a hardcoded height — footer content must still reflow on mobile per its own AC.
- **Footer social icons:** out of scope. `siteConfig.social` exists but the footer ticket's spec doesn't include a social row.
- **"Licensed in the State of Florida":** static legal copy in the footer component, not added to `SiteConfig` — it's a disclaimer, not business data.
- **Copyright year:** computed via `new Date().getFullYear()` at render (matches the ATS-002 decision not to hardcode "2026").

## Architecture

```
components/layout/
  navbar.tsx          — client component, default export <Navbar variant?: "transparent" | "solid">
  navbar-links.tsx     — center link list + active-link styling (usePathname exact match)
  navbar-drawer.tsx    — mobile slide-in drawer (client)
  use-focus-trap.ts    — Tab/Shift+Tab cycling, Escape, restores focus to trigger on close
  footer.tsx           — server component, reads siteConfig directly
```

- `Navbar` and `Footer` are both mounted once in `app/layout.tsx` — global page chrome, per `README.md`'s description of `components/layout/`. This is a real integration, not a throwaway probe: `app/page.tsx` stays untouched boilerplate (per the ATS-001/002 convention of not redesigning it ahead of its own ticket), but the root layout now renders real chrome around it.
- No new npm dependencies. The transparent→glass transition is `useState` + a passive `scroll` listener (threshold 40px) driving Tailwind class swaps with `transition-colors duration-300` — no animation library.
- No generic `Button` UI primitive yet. "Book Appointment" is the only button-styled element in scope here, so it's inline in `Navbar` as a styled `<Link>` rather than a new abstraction with a single caller.

## Navbar

- **Container:** `fixed top-0 inset-x-0 z-50`, height 100px in transparent state. Logo (`logo_blue.png`, 65×65, `next/image`) left, center links, Book Appointment pill right — all sourced from `siteConfig.nav` / `siteConfig.bookingCta`.
- **Transparent state** (`scrollY < 40` and route not in `SOLID_NAV_ROUTES`): no background; links white, uppercase, `text-nav`. Book pill: `bg-navy-900/20` (existing `--overlay-navy-20` token), `rounded-40`, height 52.
- **Sticky/glass state** (`scrollY >= 40`, or route in `SOLID_NAV_ROUTES` from load): links sit on a `rgba(255,255,255,0.13)` pill (`rounded-40`) with `backdrop-blur`; text stays white (see assumption above). Book button becomes solid `bg-navy-900` (`#253067`), white text.
- **Active link:** `usePathname()` exact match per `NavLink.href`. Active link renders full-opacity + underline; inactive links render at ~70% opacity. Not specified in the ticket beyond "active-link state" — kept minimal, no new tokens.
- **Book Appointment → `/book`:** via the `content/site.ts` change above.
- **Mobile (`<md`):** hamburger replaces center links + pill. Opens `NavbarDrawer`: fixed slide-in panel (`translate-x-full` → `translate-x-0` CSS transition) with the same links + CTA. Closes on backdrop click, Escape, or route change. `useFocusTrap` cycles Tab within the open drawer and returns focus to the hamburger button on close. Body scroll is locked (`overflow-hidden` on `<body>`) while open.

## Footer

- Server component, `bg-navy-900` (`#253067`), top hairline border, vertical padding targeting ~510px tall on desktop.
- Logo `logo_blue.png` 97×97, tagline below (`siteConfig.footer.tagline`) in a new `text-footer-tagline` token (Poppins 23/39, `#cdcdcd`).
- **CONTACT column:** heading style `text-footer-heading` (Poppins Medium 25, tracking 1.25, white) — `siteConfig.business.phone` as a `tel:` link (`phoneHref`) and the formatted `Address`.
- **SITE column:** `siteConfig.footer.links` (Accident Care / About Dr. Abe / Reviews) — already correct in `site.ts`, no data change needed.
- **Bottom line:** `"{currentYear} {siteConfig.footer.copyrightName}. Licensed in the State of Florida."` in a new `text-footer-copy` token (Poppins 20, `#cdcdcd`, line-height inferred since the ticket doesn't give one).
- **Responsive:** columns stack vertically below `md`.

## New design tokens

Added to `tailwind.config.ts` `fontSize` + corresponding CSS vars in `globals.css`, following the existing token-first pattern (no arbitrary values hardcoded in components):

| Token                 | Size / line-height | Weight | Tracking | Color (applied at component level) |
| --------------------- | ------------------ | ------ | -------- | ---------------------------------- |
| `text-footer-tagline` | 23px / 39px        | 400    | —        | `mute-300` (`#cdcdcd`)             |
| `text-footer-heading` | 25px / 40px        | 500    | 1.25px   | white                              |
| `text-footer-copy`    | 20px / 32px        | 400    | —        | `mute-300` (`#cdcdcd`)             |

`text-nav` already exists (ATS-002) and is reused as-is for both navbar states.

## `content/site.ts` change

```diff
-  bookingCta: { label: "Book Appointment", href: "#" },
+  bookingCta: { label: "Book Appointment", href: "/book" },
```

## Acceptance criteria mapping

**Navbar**

- [x] Transparent→glass transition on scroll — scroll-listener state + Tailwind transition classes.
- [x] Mobile drawer opens/closes, traps focus, closes on route change — `NavbarDrawer` + `useFocusTrap` + `usePathname` effect.
- [x] Keyboard accessible; visible focus — native focusable elements, no custom tabindex tricks beyond the trap, default focus rings preserved (not suppressed).
- [x] Book Appointment routes to `/book` — `content/site.ts` change.

**Footer**

- [x] Columns + links pull from config — `siteConfig.footer`, `siteConfig.business`.
- [x] Matches type/color spec — new footer-specific tokens.
- [x] Responsive stack on mobile — column stack below `md`.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build`.
- Manual, dev server: scroll home page to confirm transparent→glass transition and smoothness; resize below `md` to confirm hamburger/drawer (open, Tab-cycle stays trapped, Escape closes, backdrop click closes, focus returns to hamburger); full keyboard-only pass (Tab through header, Enter/Space activates links and the drawer toggle, visible focus rings throughout); confirm Book Appointment navigates to `/book`; confirm footer renders from `site.ts` data and stacks at mobile widths.

## Out of scope

- Fetching fresh Figma values once the MCP rate limit resets (sticky-state link color, exact sticky bar height, and any other visual details not stated in the ticket text remain assumptions until then).
- A generic `Button` UI primitive (single caller today).
- Footer social icons (`siteConfig.social` exists but isn't part of this ticket's spec).
- Real page content for `/`, `/book`, `/privacy`, `/home-visits`, or condition pages — those are later tickets; this work only lands the shared chrome.
