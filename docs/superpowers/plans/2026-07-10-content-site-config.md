# Content: Site Config + Content Type Stubs Implementation Plan (ATS-002)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `content/site.ts` as the single typed source of truth for business info (phone, email, address, hours, nav, footer, service areas, social/booking URLs), plus minimal type-only stubs for `content/conditions/*`, `content/services.ts`, `content/faqs.ts` so later tickets can add real data without inventing an import path.

**Architecture:** Two content files/areas, no consuming components yet (that's later tickets). `content/site.ts` exports interfaces + one populated `siteConfig` const. The three content-type stubs export interface-only types (no data — ticket defers schemas). Verification is typecheck/lint/build plus a throwaway import probe, matching the pattern already used in `docs/superpowers/plans/2026-07-10-foundation-scaffold.md` Task 3 Step 2 (no unit-testable behavior exists yet — these are static data/type declarations).

**Tech Stack:** TypeScript 5 (strict), path alias `@/*` → repo root (already configured, `tsconfig.json:21-23`).

## Global Constraints

- Canonical phone number is `(954) 573-7192` — this resolves the ticket's flagged conflict with the stale `(954) 123-4576` hero number. Do not use the `123-4576` number anywhere.
- Email: `abenasser@alignthespinechiropractic.com`. Address: 811 SE 8th Ave (Southeast 8th Avenue), Suite #101, Deerfield Beach, FL 33441.
- Hours: all 7 days, 9:00 AM–7:00 PM, with note "Priority for emergency cases" (per Figma "Hours of operation" panel).
- Copyright year must be computed at render time (`new Date().getFullYear()`), never hardcoded.
- Service areas and social/booking URLs are placeholders (explicitly approved as such) — do not invent real-looking URLs; use `"#"` for URLs not yet provided.
- Content type stubs (`content/services.ts`, `content/faqs.ts`, `content/conditions/types.ts`) contain **only** interfaces — no data arrays, no speculative fields beyond `slug`/`name`/`summary` (or `question`/`answer` for FAQ). Full schemas are out of scope per the ticket.
- Full design reference: `docs/superpowers/specs/2026-07-10-content-site-config-design.md`.

---

### Task 1: `content/site.ts` — typed business config

**Files:**

- Create: `content/site.ts`

**Interfaces:**

- Produces: `SiteConfig`, `Address`, `DayHours`, `NavLink`, `SocialLink` interfaces and the `siteConfig: SiteConfig` const, all exported from `content/site.ts`. Later tickets (header/footer/forms) import via `import { siteConfig } from "@/content/site"`.

- [ ] **Step 1: Write `content/site.ts`**

```ts
export interface Address {
  line1: string;
  suite: string;
  city: string;
  state: string;
  zip: string;
}

export interface DayHours {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  open: string;
  close: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteConfig {
  business: {
    name: string;
    phone: string;
    phoneHref: string;
    email: string;
    address: Address;
  };
  hours: DayHours[];
  hoursNote: string;
  nav: NavLink[];
  bookingCta: NavLink;
  footer: {
    tagline: string;
    links: NavLink[];
    copyrightName: string;
  };
  serviceAreas: string[];
  social: SocialLink[];
}

const businessHours: DayHours[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
].map((day) => ({ day: day as DayHours["day"], open: "9:00 AM", close: "7:00 PM" }));

export const siteConfig: SiteConfig = {
  business: {
    name: "Align the Spine Chiropractic",
    phone: "(954) 573-7192",
    phoneHref: "tel:+19545737192",
    email: "abenasser@alignthespinechiropractic.com",
    address: {
      line1: "811 Southeast 8th Avenue",
      suite: "Suite #101",
      city: "Deerfield Beach",
      state: "FL",
      zip: "33441",
    },
  },
  hours: businessHours,
  hoursNote: "Priority for emergency cases",
  nav: [
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Reviews", href: "/reviews" },
    { label: "Auto Accidents", href: "/auto-accidents" },
  ],
  bookingCta: { label: "Book Appointment", href: "#" },
  footer: {
    tagline:
      "Premium chiropractic care delivered with medical excellence and patient-first convenience across South Florida.",
    links: [
      { label: "Accident Care", href: "/auto-accidents" },
      { label: "About Dr. Abe", href: "/about" },
      { label: "Reviews", href: "/reviews" },
    ],
    copyrightName: "Align the Spine Chiropractic",
  },
  serviceAreas: ["Deerfield Beach", "Boca Raton", "Pompano Beach", "Coconut Creek"],
  social: [
    { platform: "Facebook", url: "#" },
    { platform: "Instagram", url: "#" },
  ],
};
```

- [ ] **Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: exits 0, no output.

- [ ] **Step 3: Verify lint**

Run: `npm run lint`
Expected: exits 0, no errors.

- [ ] **Step 4: Verify the `@/*` alias resolves and the shape is usable — throwaway probe**

Temporarily add to `app/page.tsx` (top of the file, alongside existing imports):

```ts
import { siteConfig } from "@/content/site";
```

And temporarily add this inside the default-exported component's returned JSX (anywhere valid, e.g. right after the opening tag):

```tsx
{
  process.env.NODE_ENV === "development" && console.log(siteConfig.business.phone);
}
```

Run: `npm run typecheck`
Expected: exits 0 (no "Cannot find module '@/content/site'" error, no type errors on `siteConfig.business.phone`).

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Revert the throwaway probe**

```bash
git checkout -- app/page.tsx
```

- [ ] **Step 6: Commit**

```bash
git add content/site.ts
git commit -m "feat: add typed site config as canonical business info source"
```

---

### Task 2: Content type stubs for conditions/services/faqs

**Files:**

- Create: `content/services.ts`
- Create: `content/faqs.ts`
- Create: `content/conditions/types.ts`

**Interfaces:**

- Consumes: nothing from Task 1 (independent content areas).
- Produces: `Service` (from `content/services.ts`), `FAQ` (from `content/faqs.ts`), `Condition` (from `content/conditions/types.ts`) — later tickets import these types when adding real data files (e.g. `content/conditions/sciatica.ts` importing `Condition` from `@/content/conditions/types`).

- [ ] **Step 1: Write `content/services.ts`**

```ts
export interface Service {
  slug: string;
  name: string;
  summary: string;
}
```

- [ ] **Step 2: Write `content/faqs.ts`**

```ts
export interface FAQ {
  question: string;
  answer: string;
}
```

- [ ] **Step 3: Write `content/conditions/types.ts`**

```ts
export interface Condition {
  slug: string;
  name: string;
  summary: string;
}
```

- [ ] **Step 4: Remove the now-unneeded `content/.gitkeep`**

The directory now has real files in it, so the placeholder is no longer needed.

```bash
rm content/.gitkeep
```

- [ ] **Step 5: Verify typecheck and lint**

Run: `npm run typecheck`
Expected: exits 0, no output.

Run: `npm run lint`
Expected: exits 0, no errors.

- [ ] **Step 6: Verify the `@/*` alias resolves for the new nested path — throwaway probe**

Temporarily add to `app/page.tsx`:

```ts
import type { Condition } from "@/content/conditions/types";
```

Run: `npm run typecheck`
Expected: exits 0 (no "Cannot find module" error). Unused-import lint may fire — that's expected for a throwaway probe; don't fix it, just revert next step.

- [ ] **Step 7: Revert the throwaway probe**

```bash
git checkout -- app/page.tsx
```

- [ ] **Step 8: Commit**

```bash
git add content/services.ts content/faqs.ts content/conditions/types.ts content/.gitkeep
git commit -m "feat: add content type stubs for services, faqs, conditions"
```

Note: `git add content/.gitkeep` stages its deletion since it was removed in Step 4 — this is correct, `git add` stages deletions of tracked files too.

---

## Manual follow-up (not part of this ticket)

- Nav `href` values (`/services`, `/about`, `/reviews`, `/auto-accidents`) are placeholders for routes that don't exist yet — later page-building tickets should confirm these slugs match the actual App Router routes they create, and update `content/site.ts` if they diverge.
- Service areas and social URLs are explicit placeholders — replace with real values once the client provides them.
