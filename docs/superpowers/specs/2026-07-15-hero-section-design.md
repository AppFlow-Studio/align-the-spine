# Hero — Design

**Ticket:** Epic 4 – Sections · Track: Dev A · Est: L · Depends on: ATS-020, ATS-021, ATS-030 (contract)
**Source:** ticket text (pasted directly) + a screenshot of the rendered Home variant (headline "Align the Spine / South Florida's Chiropractor", "Office visits are $50" badge, "Schedule Your Car Accident Evaluation" form). No Figma node was fetched for this ticket — the screenshot plus the ticket's own written spec (condition-page-spec §B1) are the source of truth. Gaps are called out explicitly below rather than guessed silently.

## Resolved open decisions

- **ATS-030 (LeadForm) doesn't exist yet.** Rather than block, this spec includes building a minimal `LeadForm` alongside Hero: the four fields visible in the screenshot (First Name, Last Name, Phone, Email) plus a submit button, using `react-hook-form` (already an unused dependency, clearly staged for this) and the existing `Input`/`FieldWrapper` primitives. Submission goes through an injected `onSubmit?: (data) => Promise<void>` prop so a later ATS-030 ticket can swap in real submission logic without touching Hero's contract.
- **Nav/TopStatsBar overlap.** `Navbar` is currently `fixed inset-x-0 top-0` (uncommitted local edit already in the working tree), which floats over whatever is at the top of the document — currently `TopStatsBar`, rendered in normal flow directly above `main` in `RootShell`. For the Hero photo to bleed to the true top of the viewport (matching the screenshot, which shows no stats bar above the nav), Hero pulls itself up with a negative top margin sized to `TopStatsBar`'s rendered height so its background stack starts at `y=0`, sitting behind the fixed transparent nav. This means `TopStatsBar` is visually covered on any page that leads with Hero. This tension was already flagged as unresolved in the prior layout-shell plan doc ("whoever builds the Home page hero should know..."); resolving it here is in scope for Hero, not a change to `RootShell`/`Navbar` themselves.
- **"White content sheet" at the band's bottom.** Not visible in the reference screenshot (cropped at the trust line). Treated as a self-contained decorative cap: an `absolute bottom-0 inset-x-0 h-20 rounded-t-[50px] bg-white` element sitting above the background stack, so it renders correctly per the acceptance criterion even before any real next-section exists to hand off to.
- **Spine illustration asset:** `public/figma-exports/spine-skeloton.png`, confirmed with the user, `object-contain` centered, `opacity-30`, toggleable via a `spineOverlay?: boolean` prop (default `true`) for variants/instances that don't want it.
- **Background stack applies to both variants**, not just condition — the ticket's "Specs (condition variant)" section describes the shared shell's background treatment (per the ticket Summary: "Shared 2-column hero shell... Home and Condition variants"), and the reference screenshot (Home variant) shows the same darkened-photo treatment. The "Home variant" bullet only calls out _content_ differences (badge/CTAs/trust chips vs. condition chip), not a different background.
- **Black overlay opacity:** ticket gives a range (0.39–0.56); mid-point `bg-black/[.47]` used, called out as a tunable constant, not a hardcoded one-off.
- **Phone number:** sourced from `siteConfig.business.phone`/`phoneHref` (`(954) 573-7192`), not the stale `(954) 123-4576` visible in the screenshot/Figma mock — matches the existing convention (ATS-002 content/site design) of never hardcoding business data in components.
- **`components/sections/` vs `components/layout/`:** Hero is a page-content section (differs per page/instance), not global chrome, so it goes in `components/sections/hero.tsx` — the first real use of that directory (currently `.gitkeep` only).

## Architecture

```
components/sections/
  hero.tsx            — server component, <Hero variant="home" | "condition" ...props>
components/ui/
  lead-form.tsx        — client component, <LeadForm heading submitLabel footerNote? onSubmit?>
```

- `Hero` itself needs no interactivity (no `"use client"`); it renders the client `LeadForm` as a child, same composition pattern as `RootShell` rendering client `Navbar`.
- No new npm dependencies beyond the already-installed `react-hook-form`.
- No new icons needed — `PhoneIcon` (via `Button variant="glass"`) and `ArrowRightIcon` (via `Button` primary/teal/cta variants) already exist.

## `Hero` props

```ts
interface HeroCta {
  label: string;
  href: string;
  variant?: "primary" | "teal" | "cta"; // Button variants
}

interface HeroFormConfig {
  heading: string;
  submitLabel: string;
  footerNote?: string; // e.g. "Serving Deerfield Beach, Boca Raton, Fort Lauderdale..."
}

interface HeroProps {
  variant: "home" | "condition";
  background: { src: string; alt: string };
  spineOverlay?: boolean; // default true
  eyebrow?: string; // condition variant
  title: ReactNode; // supports <br /> for the multi-line headline
  subhead: string;
  conditionChip?: string; // condition variant only
  badge?: string; // home variant, e.g. "Office visits are $50"
  ctas?: HeroCta[]; // home variant
  callPill?: { eyebrow: string; phone: string }; // "Speak with us today" / formatted phone
  bilingualNote?: string; // condition variant, "¿Habla español?..."
  form: HeroFormConfig;
}
```

`variant` gates which optional props are meaningful (e.g. `conditionChip` only rendered for `"condition"`, `badge`/`ctas` only for `"home"`) but all content stays prop-driven per the acceptance criteria — no hardcoded copy branching beyond which slots render.

## `LeadForm` props

```ts
interface LeadFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface LeadFormProps {
  heading: string;
  submitLabel: string;
  onSubmit?: (values: LeadFormValues) => Promise<void>;
  className?: string;
}
```

- `react-hook-form` for field state + validation (required fields; basic email/phone pattern checks), errors rendered through the existing `FieldWrapper`/`Input` `error` prop (already styled).
- Submit button uses `Button`'s existing `loading` prop while `onSubmit` resolves; if `onSubmit` is omitted, the form simulates a brief pending state and resets — keeps Hero demoable before ATS-030 lands without a dangling promise.
- Fields render with `variant="dark"` (already built in `field.tsx` specifically for glass surfaces).

## Background stack

Layered `absolute inset-0` children inside a `relative min-h-[975px] overflow-hidden` band, in paint order:

1. `Image` (`background.src`, `fill`, `object-cover`)
2. `bg-black/[.47]` overlay
3. `bg-gradient-to-b from-navy-900/0 to-navy-700` gradient (uses the already-tokenized `navy-900`→`navy-700` pair; `navy-700` is explicitly commented `/* hero gradient end */` in `globals.css`)
4. `spine-skeloton.png`, `object-contain`, `opacity-30` (when `spineOverlay`)
5. White cap: `absolute inset-x-0 bottom-0 h-20 rounded-t-[50px] bg-white`

Content grid (`container grid gap-10 lg:grid-cols-2 lg:items-center`) renders in a `relative z-10` layer above all of the above. The whole `<section>` gets a negative top margin (`-mt-[<TopStatsBar height>]`, computed from `TopStatsBar`'s actual rendered padding/gap, not guessed) so the background stack starts at the viewport's true top under the fixed transparent `Navbar`.

## Layout

- **Left column** (`from left: 64` → `pl-16` equivalent via the existing `.container` fluid padding, not a literal magic number):
  - `H1`: `font-display text-hero text-white` (87/90/300)
  - Subhead: `font-sans text-body-lg text-mute-300` (25/40, `#cdcdcd`)
  - `Button variant="glass"` call-pill (`eyebrow` + phone), only when `callPill` is passed
  - Condition: `bilingualNote` in `font-alt text-alt-label text-mute-300` (Geist 22)
  - Home: `badge` (reuses `Badge` or a simple `bg-teal-500` pill matching the screenshot) + trust chips (`Badge variant="tag"`)
- **Right column:** `LeadForm` wrapped in a card — `bg-overlay-white-15 rounded-15 shadow-card p-8` (both `overlay-white-15` and `shadow-card` are exact existing tokens, not new values) — `form.footerNote` rendered below the card in `text-white`/`text-mute-300`.
- **Responsive:** grid collapses to a single column below `lg`; because the form card is the second grid child in source order, it naturally stacks below the headline block on tablet/mobile without extra logic, satisfying the acceptance criterion directly.

## Acceptance criteria mapping

- [x] Both variants driven by props — `HeroProps` above; no hardcoded per-variant copy.
- [x] Background layering + gradient + overlay correct — five-layer stack described above, using existing tokens only.
- [x] White sheet overlap renders — bottom cap element.
- [x] Responsive: form drops below headline on tablet/mobile — grid source order, no JS.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build`.
- Manual, dev server: temporarily mount `<Hero variant="home" .../>` in `app/page.tsx` with the screenshot's content (`figma-exports/interior-reception.png`, "Office visits are $50", "Schedule Your Car Accident Evaluation" form) to visually compare against the reference screenshot; resize down to tablet/mobile widths to confirm the form drops below the headline; keyboard-only pass through the form (Tab order, visible focus, error announcements via `role="alert"`); confirm the call-pill `tel:` link and CTA hrefs work. Revert `app/page.tsx` after QA unless the user wants Hero left wired in as the real homepage content (flagged to ask at that point).

## Out of scope

- Real ATS-030 submission logic (API route, backend integration) — `LeadForm`'s `onSubmit` contract is built to accept it later without changes to Hero.
- Condition-page routing/content (which condition pages exist, their copy) — this ticket only builds the shared shell.
- Changing `RootShell`/`Navbar`/`TopStatsBar` themselves — Hero works within their current (uncommitted, in-flux) state rather than modifying them.
