# Content: Site Config + Content Type Stubs (ATS-002) — Design

**Ticket:** Epic 0 – Foundation · Dev A · Est: S · Blocks: forms, footer, condition data

## Goal

Single source of truth for business info (`content/site.ts`) so components never hardcode strings, plus typed interfaces for `content/conditions/*`, `content/services.ts`, `content/faqs.ts` (data for these lands in later tickets).

## Resolved open decisions

- **Canonical phone number:** `(954) 573-7192` (the footer/PIP-calculator number). The hero/call-pill number `(954) 123-4576` seen in the Figma mock is stale and is superseded by this canonical value once `site.ts` is consumed by components.
- **Email:** `abenasser@alignthespinechiropractic.com` — confirmed.
- **Address:** 811 SE 8th Ave (Southeast 8th Avenue), Suite #101, Deerfield Beach, FL 33441 — confirmed, matches Figma footer.
- **Hours of operation:** per Figma "Hours of operation" panel — all 7 days, 9:00 AM–7:00 PM, with note "Priority for emergency cases."
- **Nav (header):** Services, About, Reviews, Auto Accidents, + "Book Appointment" CTA button (per Figma header).
- **Footer links (SITE column):** Accident Care, About Dr. Abe, Reviews (per Figma footer — intentionally different labels than header nav; stored as a separate list, not reconciled).
- **Footer tagline:** "Premium chiropractic care delivered with medical excellence and patient-first convenience across South Florida."
- **Service areas:** no dedicated list found in the Figma file; using a placeholder list (Deerfield Beach, Boca Raton, Pompano Beach, Coconut Creek) to be refined later.
- **Social/booking URLs:** no real links yet; stored as clearly-placeholder URLs (`#`) to be filled in when the actual scheduler/social profiles are available.
- **Copyright year:** computed at render time (`new Date().getFullYear()`), not hardcoded — the Figma mock shows a static "2026" but that would go stale.

## `content/site.ts`

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

export const siteConfig: SiteConfig = {/* populated per "Resolved open decisions" above */};
```

Nav `href` values use top-level route slugs (`/services`, `/about`, `/reviews`, `/auto-accidents`) as a reasonable default since actual page routing hasn't been built yet (Epic 0 foundation only). These are content data, not routing config — later page-building tickets can update the strings in `site.ts` without touching consuming components.

## Content type stubs

Ticket explicitly defers full schemas ("schemas filled in later tickets"), so these stay minimal — just enough to unblock typed imports, not fields for content that hasn't been designed yet.

- `content/services.ts`:
  ```ts
  export interface Service {
    slug: string;
    name: string;
    summary: string;
  }
  ```
- `content/faqs.ts`:
  ```ts
  export interface FAQ {
    question: string;
    answer: string;
  }
  ```
- `content/conditions/types.ts`:
  ```ts
  export interface Condition {
    slug: string;
    name: string;
    summary: string;
  }
  ```
  (Lives under `content/conditions/` rather than a flat file since later tickets will add one data file per condition plus an aggregating `index.ts` in that directory.)

## Verification

- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm run build` passes (nothing yet imports these files, so this mainly guards against syntax/type errors).
- Manual: import `siteConfig` from a throwaway probe and confirm autocomplete/typing works via the `@/content/site` path, then remove the probe (same pattern as the Task 3 alias check in the foundation-scaffold plan).

## Out of scope

- Actual data for conditions/services/faqs (later tickets).
- Consuming `siteConfig` from real components (header/footer/forms — later tickets, this ticket only unblocks them).
- Reconciling the header vs. footer nav label mismatch (Auto Accidents vs. Accident Care) — stored as-is per the design.
