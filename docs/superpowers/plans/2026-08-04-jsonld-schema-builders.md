# JSON-LD Schema Builders Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a safe JSON-LD serializer and a typed `lib/schema.ts` set of schema.org builders (MedicalBusiness, Organization, WebSite, Person, BreadcrumbList, Service, FAQPage), then wire them onto every page per Implementation Plan §5.4 — rendering only verified configuration, with no fake ratings, no unverified hours, and no `#` placeholder URLs.

**Architecture:** `components/seo/json-ld.tsx` replaces the existing `components/seo/json-ld-script.tsx` as the one `<script type="application/ld+json">` renderer, adding a recursive guard that throws if any field is a literal `"#"` placeholder. `lib/schema.ts` replaces `lib/seo/local-business.ts` and absorbs `components/seo/faq-json-ld.tsx`'s inline shape as typed builder functions, each returning a plain schema.org object. Two new gating flags — `siteConfig.hoursVerified` and `SocialLink.verified` — plus a new `content/doctor-profile.ts` export (`doctorCredentials.verified`) let the builders omit `openingHoursSpecification`, `sameAs`, and Person credential fields until a human flips the flag; no other code changes are needed when that day comes. `MedicalBusiness`/`Organization`/`WebSite` move off the root layout (where `localBusinessJsonLd` currently renders site-wide) onto `/` and `/contact-us` specifically, per the ticket's "Homepage + contact schema" scope. `BreadcrumbList` is added fresh (nothing existed before) across every interior page, mirroring actual site navigation (no fabricated "Conditions" hub, since none exists). `Service` schema goes on `/services` — there is no `/services/[slug]` route in this codebase (all services render as a single grid on one page), so each service in `content/services.ts` gets its own `Service` entity keyed by `#{slug}` on that one page instead.

**Tech Stack:** Next.js 16 App Router, TypeScript, Vitest, `@/` path alias.

## Global Constraints

- **Vocabulary (non-negotiable):** `"@type": "MedicalBusiness"` for the practice — never `Chiropractic`, never `LocalBusiness`/`MedicalClinic` (the current `lib/seo/local-business.ts` uses `["MedicalClinic", "LocalBusiness"]` — this plan replaces it). `"@type": "Person"` for Dr. Abe — never `Physician` (that requires explicit owner confirmation this plan doesn't have).
- **No AggregateRating / Review markup anywhere.** `content/doctor-profile.ts`'s `rating: { value: 5, count: 152 }` is UI-only (star display) — it must never be read by any function in `lib/schema.ts`. Grep for `AggregateRating` and `"Review"` across `lib/schema.ts` and `components/seo/` in the final task and confirm zero matches.
- **No `#` placeholder URLs in any JSON-LD payload.** `components/seo/json-ld.tsx`'s `JsonLd` component throws if it finds one (defense in depth — the schema builders should already filter these out via the `verified` flags below, but the serializer enforces it regardless of which builder called it).
- **Every conditional field is gated by an explicit, named boolean** — `siteConfig.hoursVerified`, `SocialLink.verified`, `doctorCredentials.verified` — defaulted to `false`/absent today. Flipping a flag later is a content change, not a code change. Do not invent a fourth ad-hoc gating mechanism.
- **`@id` anchors are stable and reused, not re-derived per call site:** `${siteConfig.siteUrl}/#organization`, `${siteConfig.siteUrl}/#business`, `${siteConfig.siteUrl}/#website`, `${siteConfig.siteUrl}/about#dr-abe`. Export these as named constants from `lib/schema.ts` so every builder and every future consumer references the same string.
- Don't fabricate an approved asset that doesn't exist. `/figma-exports/logo_blue.png` is already a real, shipping asset (used in `components/layout/navbar.tsx` and `components/layout/footer.tsx`) — safe to reference as `Organization.logo`. Nothing else in this plan introduces a new asset.
- Follow existing repo conventions: `@/` path alias, co-located `*.test.ts`/`*.test.tsx` files, Vitest (`describe`/`it`/`expect`), Prettier/ESLint via the pre-commit hook (don't hand-format — let `lint-staged` fix import order on commit).
- Run `npx vitest run` and `npx tsc --noEmit` after every task; run `npm run build` (production build) as the final gate in the last task.

---

### Task 1: `components/seo/json-ld.tsx` — safe serializer with placeholder-URL guard

**Files:**

- Create: `components/seo/json-ld.tsx`
- Test: `components/seo/json-ld.test.tsx` (new)

**Interfaces:**

- Produces: `export interface JsonLdProps { data: object }`, `export function JsonLd({ data }: JsonLdProps): JSX.Element` — consumed by every task from here on (2 onward), replacing `components/seo/json-ld-script.tsx`'s `JsonLdScript`.

- [ ] **Step 1: Write the failing test**

Create `components/seo/json-ld.test.tsx`. `JsonLd` is a plain function component — calling it directly (not rendering it) returns the `<script>` element object, so these tests read its props without needing jsdom or a rendering library (neither exists in this repo today; every other test here is a pure-function test run under Vitest's default node environment):

```tsx
import { describe, expect, it } from "vitest";

import { JsonLd } from "./json-ld";

describe("JsonLd", () => {
  it("renders a script[type=application/ld+json] with the serialized data", () => {
    const element = JsonLd({ data: { "@type": "Thing", name: "Test" } });
    expect(element.type).toBe("script");
    expect(element.props.type).toBe("application/ld+json");
    expect(JSON.parse(element.props.dangerouslySetInnerHTML.__html)).toEqual({
      "@type": "Thing",
      name: "Test",
    });
  });

  it("escapes '<' so a closing </script> can't be injected via string content", () => {
    const element = JsonLd({ data: { name: "</script><script>alert(1)</script>" } });
    const html = element.props.dangerouslySetInnerHTML.__html;
    expect(html).not.toContain("</script><script>");
    expect(html).toContain("\\u003c/script\\u003e");
  });

  it("throws when a string field is exactly the '#' placeholder", () => {
    expect(() => JsonLd({ data: { url: "#" } })).toThrow(/placeholder/i);
  });

  it("throws when a nested field is the '#' placeholder", () => {
    expect(() => JsonLd({ data: { sameAs: ["https://facebook.com/real", "#"] } })).toThrow(
      /placeholder/i,
    );
  });

  it("does not throw for a real anchor-style @id containing '#'", () => {
    expect(() => JsonLd({ data: { "@id": "https://example.com/#organization" } })).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/seo/json-ld.test.tsx`
Expected: FAIL — `@/components/seo/json-ld` does not exist.

- [ ] **Step 3: Implement**

Create `components/seo/json-ld.tsx`:

```tsx
export interface JsonLdProps {
  data: object;
}

/** Walks a JSON-LD payload and throws if any string field is exactly the
 * "#" placeholder (e.g. an unconfirmed social URL) — a fragment like
 * "https://x.com/#organization" is fine, only a bare "#" is rejected. Every
 * builder in lib/schema.ts should already omit unverified fields, but this
 * is the last line of defense before anything reaches the page. */
function assertNoPlaceholderUrls(value: unknown, path = "$"): void {
  if (typeof value === "string") {
    if (value.trim() === "#") {
      throw new Error(
        `JsonLd: placeholder "#" URL at ${path} — omit the field until a real URL is confirmed.`,
      );
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoPlaceholderUrls(item, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      assertNoPlaceholderUrls(nested, `${path}.${key}`);
    }
  }
}

/** Renders a schema.org JSON-LD `<script>` tag. The one place every
 * structured-data block (lib/schema.ts's builders) gets serialized, so
 * script-closing escaping and placeholder-URL rejection stay consistent —
 * replaces the old components/seo/json-ld-script.tsx. */
export function JsonLd({ data }: JsonLdProps) {
  assertNoPlaceholderUrls(data);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/seo/json-ld.test.tsx`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add components/seo/json-ld.tsx components/seo/json-ld.test.tsx
git commit -m "feat(seo): add safe JSON-LD serializer with placeholder-URL guard"
```

---

### Task 2: `content/site.ts` — verification gates for hours and social links

**Files:**

- Modify: `content/site.ts`
- Modify: `content/site.test.ts`

**Interfaces:**

- Produces: `SiteConfig.hoursVerified: boolean`, `SocialLink.verified: boolean` — consumed by Task 5 (`buildMedicalBusiness`) and Task 4 (`buildOrganization`).

- [ ] **Step 1: Write the failing test**

Add to `content/site.test.ts` (append a new `describe` block; keep the existing `isProduction` tests):

```ts
describe("hoursVerified / social.verified gates", () => {
  it("defaults hoursVerified to false until the client confirms real hours", () => {
    expect(siteConfig.hoursVerified).toBe(false);
  });

  it("marks every current social link as unverified (all are '#' placeholders today)", () => {
    for (const social of siteConfig.social) {
      expect(social.verified).toBe(false);
    }
  });
});
```

Add `siteConfig` to the existing `import { isProduction } from "@/content/site";` line so it reads `import { isProduction, siteConfig } from "@/content/site";`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run content/site.test.ts`
Expected: FAIL — `hoursVerified` and `verified` don't exist yet.

- [ ] **Step 3: Implement**

In `content/site.ts`, change the `SocialLink` interface:

```ts
export interface SocialLink {
  platform: string;
  url: string;
}
```

to:

```ts
export interface SocialLink {
  platform: string;
  url: string;
  /** True only once marketing has confirmed this is the correct, live GBP/
   * social URL for the practice. lib/schema.ts's buildOrganization() omits
   * unverified entries from `sameAs` entirely rather than publish a guess. */
  verified: boolean;
}
```

Change the `SiteConfig` interface's `hours`/`hoursNote` fields:

```ts
  hours: DayHours[];
  hoursNote: string;
```

to:

```ts
  hours: DayHours[];
  /** True only once the client has confirmed these are the practice's
   * actual, current hours. lib/schema.ts's buildMedicalBusiness() omits
   * openingHoursSpecification entirely while this is false. */
  hoursVerified: boolean;
  hoursNote: string;
```

In the `siteConfig` object, change:

```ts
  hours: businessHours,
  hoursNote: "Priority for emergency cases",
```

to:

```ts
  hours: businessHours,
  hoursVerified: false,
  hoursNote: "Priority for emergency cases",
```

Change the `social` array:

```ts
  social: [
    { platform: "Facebook", url: "#" },
    { platform: "Instagram", url: "#" },
  ],
```

to:

```ts
  social: [
    { platform: "Facebook", url: "#", verified: false },
    { platform: "Instagram", url: "#", verified: false },
  ],
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run content/site.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add content/site.ts content/site.test.ts
git commit -m "feat(seo): add hoursVerified and social.verified gates to site config"
```

---

### Task 3: `content/doctor-profile.ts` — gated credentials scaffold for Dr. Abe's Person schema

**Files:**

- Modify: `content/doctor-profile.ts`
- Test: `content/doctor-profile.test.ts` (new)

**Interfaces:**

- Produces: `export interface DoctorCredentials { verified: boolean; alumniOf?: string[]; hasCredential?: string[] }`, `export const doctorCredentials: DoctorCredentials` — consumed by Task 6 (`buildPerson`).

- [ ] **Step 1: Write the failing test**

Create `content/doctor-profile.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { doctorCredentials } from "@/content/doctor-profile";

describe("doctorCredentials", () => {
  it("defaults to unverified until Dr. Abe confirms his degree/education/license", () => {
    expect(doctorCredentials.verified).toBe(false);
  });

  it("has no alumniOf/hasCredential claims while unverified", () => {
    expect(doctorCredentials.alumniOf).toBeUndefined();
    expect(doctorCredentials.hasCredential).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run content/doctor-profile.test.ts`
Expected: FAIL — `doctorCredentials` is not exported.

- [ ] **Step 3: Implement**

Append to `content/doctor-profile.ts` (after the `doctorProfileContent` export):

```ts
export interface DoctorCredentials {
  /** True only once Dr. Abe has confirmed these fields himself. Until then
   * lib/schema.ts's buildPerson() omits alumniOf/hasCredential entirely
   * rather than publish an unverified degree/license claim (ATS schema
   * ticket §2.4). */
  verified: boolean;
  alumniOf?: string[];
  hasCredential?: string[];
}

export const doctorCredentials: DoctorCredentials = {
  verified: false,
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run content/doctor-profile.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add content/doctor-profile.ts content/doctor-profile.test.ts
git commit -m "feat(seo): add gated credentials scaffold for Dr. Abe's Person schema"
```

---

### Task 4: `lib/schema.ts` — Organization + WebSite builders

**Files:**

- Create: `lib/schema.ts`
- Test: `lib/schema.test.ts` (new)

**Interfaces:**

- Consumes: `siteConfig` from `@/content/site` (Tasks 2).
- Produces: `ORGANIZATION_ID`, `WEBSITE_ID` (string constants), `buildOrganization()`, `buildWebSite()` — consumed by Task 10.

- [ ] **Step 1: Write the failing test**

Create `lib/schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { siteConfig } from "@/content/site";

import { buildOrganization, buildWebSite, ORGANIZATION_ID, WEBSITE_ID } from "./schema";

describe("buildOrganization", () => {
  it("uses the stable #organization @id", () => {
    expect(buildOrganization()["@id"]).toBe(`${siteConfig.siteUrl}/#organization`);
    expect(ORGANIZATION_ID).toBe(`${siteConfig.siteUrl}/#organization`);
  });

  it("has no sameAs when no social link is verified", () => {
    expect(buildOrganization().sameAs).toBeUndefined();
  });

  it("references the real, already-shipping logo asset", () => {
    expect(buildOrganization().logo).toBe(`${siteConfig.siteUrl}/figma-exports/logo_blue.png`);
  });
});

describe("buildWebSite", () => {
  it("uses the stable #website @id and publishes to the Organization @id", () => {
    const site = buildWebSite();
    expect(site["@id"]).toBe(WEBSITE_ID);
    expect(site.publisher).toEqual({ "@id": ORGANIZATION_ID });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/schema.test.ts`
Expected: FAIL — `@/lib/schema` does not exist.

- [ ] **Step 3: Implement**

Create `lib/schema.ts`:

```ts
import { siteConfig } from "@/content/site";

/** Stable @id anchors reused across every builder in this file and every
 * page that references another entity (e.g. Person.worksFor, WebSite.
 * publisher) — per ATS schema ticket §2.8, these must never be re-derived
 * ad hoc at a call site. */
export const ORGANIZATION_ID = `${siteConfig.siteUrl}/#organization`;
export const MEDICAL_BUSINESS_ID = `${siteConfig.siteUrl}/#business`;
export const WEBSITE_ID = `${siteConfig.siteUrl}/#website`;
export const DR_ABE_PERSON_ID = `${siteConfig.siteUrl}/about#dr-abe`;

export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  "@id": string;
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
}

/** Organization entity (ATS schema ticket §2.2/§2.3) — the brand-level
 * presence, distinct from the MedicalBusiness clinic entity below. `sameAs`
 * only includes social links marketing has confirmed (SocialLink.verified,
 * content/site.ts) — every current entry is an unconfirmed "#" placeholder,
 * so it's omitted entirely today rather than publish a guess. */
export function buildOrganization(): OrganizationSchema {
  const sameAs = siteConfig.social.filter((social) => social.verified).map((social) => social.url);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.business.name,
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/figma-exports/logo_blue.png`,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  "@id": string;
  name: string;
  url: string;
  publisher: { "@id": string };
}

/** WebSite entity (ATS schema ticket §2.2/§2.3). No `potentialAction`
 * SearchAction — the site has no on-site search feature, and this ticket's
 * rule is to only render verified, real functionality. */
export function buildWebSite(): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.business.name,
    url: siteConfig.siteUrl,
    publisher: { "@id": ORGANIZATION_ID },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/schema.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/schema.ts lib/schema.test.ts
git commit -m "feat(seo): add Organization and WebSite schema.org builders"
```

---

### Task 5: `lib/schema.ts` — MedicalBusiness builder, retire `lib/seo/local-business.ts`

**Files:**

- Modify: `lib/schema.ts`
- Modify: `lib/schema.test.ts`
- Delete: `lib/seo/local-business.ts`, `lib/seo/local-business.test.ts`
- Modify: `app/layout.tsx` (drop the site-wide `localBusinessJsonLd` render — MedicalBusiness moves to `/` and `/contact-us` specifically in Task 10)

**Interfaces:**

- Produces: `MEDICAL_BUSINESS_ID` (already exported in Task 4), `buildMedicalBusiness()` — consumed by Task 10 and by Task 6's `buildPerson` (`worksFor`).

- [ ] **Step 1: Write the failing test**

In `lib/schema.test.ts`, add `buildMedicalBusiness, MEDICAL_BUSINESS_ID` to the existing `import { ... } from "./schema";` line, then append:

```ts
describe("buildMedicalBusiness", () => {
  it("uses MedicalBusiness as the sole @type — never Chiropractic or LocalBusiness", () => {
    expect(buildMedicalBusiness()["@type"]).toBe("MedicalBusiness");
  });

  it("uses the stable #business @id", () => {
    expect(buildMedicalBusiness()["@id"]).toBe(MEDICAL_BUSINESS_ID);
  });

  it("includes verified NAP and geo", () => {
    const business = buildMedicalBusiness();
    expect(business.telephone).toBe(siteConfig.business.phone);
    expect(business.address).toEqual({
      "@type": "PostalAddress",
      streetAddress: "811 Southeast 8th Avenue, Suite #101",
      addressLocality: "Deerfield Beach",
      addressRegion: "FL",
      postalCode: "33441",
      addressCountry: "US",
    });
    expect(business.geo).toEqual({
      "@type": "GeoCoordinates",
      latitude: 26.3061477,
      longitude: -80.0940209,
    });
  });

  it("omits openingHoursSpecification while hours are unverified", () => {
    expect(siteConfig.hoursVerified).toBe(false);
    expect(buildMedicalBusiness().openingHoursSpecification).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/schema.test.ts`
Expected: FAIL — `buildMedicalBusiness` is not exported yet.

- [ ] **Step 3: Implement**

Append to `lib/schema.ts`:

```ts
/** "9:00 AM" / "7:00 PM" -> "09:00" / "19:00", per schema.org's
 * openingHoursSpecification time format. Lifted from the retired
 * lib/seo/local-business.ts. */
function to24Hour(time: string): string {
  const [, hourStr, minute, meridiem] = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i) ?? [];
  let hour = Number(hourStr) % 12;
  if (meridiem?.toUpperCase() === "PM") hour += 12;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

export interface OpeningHoursSpec {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string;
  opens: string;
  closes: string;
}

export interface MedicalBusinessSchema {
  "@context": "https://schema.org";
  "@type": "MedicalBusiness";
  "@id": string;
  name: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: { "@type": "GeoCoordinates"; latitude: number; longitude: number };
  areaServed: { "@type": "City"; name: string }[];
  openingHoursSpecification?: OpeningHoursSpec[];
}

/** MedicalBusiness entity for the practice (ATS schema ticket §2.2/§2.3) —
 * "MedicalBusiness" is the required @type per the ticket's vocabulary rule
 * (never "Chiropractic", which is a medicine-system enum, not a business
 * type). Replaces the old lib/seo/local-business.ts's
 * `["MedicalClinic", "LocalBusiness"]` type array. `openingHoursSpecification`
 * only renders once siteConfig.hoursVerified is true (§2.9) — every day is
 * currently the same untouched 9-7 placeholder, unconfirmed by the client. */
export function buildMedicalBusiness(): MedicalBusinessSchema {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": MEDICAL_BUSINESS_ID,
    name: siteConfig.business.name,
    url: siteConfig.siteUrl,
    telephone: siteConfig.business.phone,
    email: siteConfig.business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.business.address.line1}, ${siteConfig.business.address.suite}`,
      addressLocality: siteConfig.business.address.city,
      addressRegion: siteConfig.business.address.state,
      postalCode: siteConfig.business.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.business.geo.latitude,
      longitude: siteConfig.business.geo.longitude,
    },
    areaServed: siteConfig.serviceAreas.map((city) => ({ "@type": "City", name: city })),
    ...(siteConfig.hoursVerified
      ? {
          openingHoursSpecification: siteConfig.hours.map((hours) => ({
            "@type": "OpeningHoursSpecification" as const,
            dayOfWeek: hours.day,
            opens: to24Hour(hours.open),
            closes: to24Hour(hours.close),
          })),
        }
      : {}),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/schema.test.ts`
Expected: PASS

- [ ] **Step 5: Delete the retired files**

```bash
git rm lib/seo/local-business.ts lib/seo/local-business.test.ts
```

- [ ] **Step 6: Update `app/layout.tsx`**

Remove these two lines:

```ts
import { JsonLdScript } from "@/components/seo/json-ld-script";
```

```ts
import { localBusinessJsonLd } from "@/lib/seo/local-business";
```

Remove this line from the JSX (MedicalBusiness/Organization/WebSite move to `/` and `/contact-us` in Task 10, not the whole site — per the ticket's "Homepage + contact schema" scope):

```tsx
<JsonLdScript data={localBusinessJsonLd} />
```

- [ ] **Step 7: Verify**

Run: `npx vitest run && npx tsc --noEmit`
Expected: PASS — no remaining references to `lib/seo/local-business` or the layout's removed import.

- [ ] **Step 8: Commit**

```bash
git add lib/schema.ts lib/schema.test.ts app/layout.tsx
git commit -m "feat(seo): add MedicalBusiness builder, retire lib/seo/local-business.ts"
```

---

### Task 6: `lib/schema.ts` — Person builder for Dr. Abe

**Files:**

- Modify: `lib/schema.ts`
- Modify: `lib/schema.test.ts`

**Interfaces:**

- Consumes: `doctorProfileContent`, `doctorCredentials` from `@/content/doctor-profile` (Task 3); `MEDICAL_BUSINESS_ID`, `DR_ABE_PERSON_ID` (already exported, Task 4).
- Produces: `buildPerson()` — consumed by Task 11.

- [ ] **Step 1: Write the failing test**

In `lib/schema.test.ts`, add `buildPerson, DR_ABE_PERSON_ID` to the existing `import { ... } from "./schema";` line (`MEDICAL_BUSINESS_ID` is already imported from Task 5), then append:

```ts
describe("buildPerson", () => {
  it("uses Person, never Physician, per the vocabulary rule", () => {
    expect(buildPerson()["@type"]).toBe("Person");
  });

  it("uses the stable /about#dr-abe @id", () => {
    expect(buildPerson()["@id"]).toBe(DR_ABE_PERSON_ID);
  });

  it("links to the practice via worksFor", () => {
    expect(buildPerson().worksFor).toEqual({ "@id": MEDICAL_BUSINESS_ID });
  });

  it("omits alumniOf/hasCredential while doctorCredentials is unverified", () => {
    const person = buildPerson();
    expect(person.alumniOf).toBeUndefined();
    expect(person.hasCredential).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/schema.test.ts`
Expected: FAIL — `buildPerson` is not exported yet.

- [ ] **Step 3: Implement**

Add this import to the top of `lib/schema.ts`:

```ts
import { doctorCredentials, doctorProfileContent } from "@/content/doctor-profile";
```

Append to `lib/schema.ts`:

```ts
export interface PersonSchema {
  "@context": "https://schema.org";
  "@type": "Person";
  "@id": string;
  name: string;
  url: string;
  image: string;
  jobTitle: string;
  worksFor: { "@id": string };
  alumniOf?: string[];
  hasCredential?: string[];
}

/** Person entity for Dr. Abe (ATS schema ticket §2.2/§2.4) — "Person", never
 * "Physician" (that requires explicit owner confirmation this codebase
 * doesn't have; "jobTitle: Chiropractor" is plain-text copy the site already
 * publishes everywhere, not a licensure @type claim). alumniOf/hasCredential
 * only render once doctorCredentials.verified is true — Dr. Abe hasn't
 * confirmed his degree/school/license yet, so today's output omits both
 * fields rather than publish an unverified claim. */
export function buildPerson(): PersonSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": DR_ABE_PERSON_ID,
    name: doctorProfileContent.name,
    url: `${siteConfig.siteUrl}/about`,
    image: `${siteConfig.siteUrl}${doctorProfileContent.portrait.src}`,
    jobTitle: "Chiropractor",
    worksFor: { "@id": MEDICAL_BUSINESS_ID },
    ...(doctorCredentials.verified
      ? {
          ...(doctorCredentials.alumniOf ? { alumniOf: doctorCredentials.alumniOf } : {}),
          ...(doctorCredentials.hasCredential
            ? { hasCredential: doctorCredentials.hasCredential }
            : {}),
        }
      : {}),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/schema.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/schema.ts lib/schema.test.ts
git commit -m "feat(seo): add Person schema.org builder for Dr. Abe"
```

---

### Task 7: `lib/schema.ts` — BreadcrumbList builder

**Files:**

- Modify: `lib/schema.ts`
- Modify: `lib/schema.test.ts`

**Interfaces:**

- Produces: `export interface BreadcrumbItemInput { name: string; path: string }`, `buildBreadcrumbList(items: BreadcrumbItemInput[])` — consumed by Task 12.

- [ ] **Step 1: Write the failing test**

In `lib/schema.test.ts`, add `buildBreadcrumbList` to the existing `import { ... } from "./schema";` line, then append:

```ts
describe("buildBreadcrumbList", () => {
  it("builds a 1-indexed ListItem per entry with absolute item URLs", () => {
    const breadcrumb = buildBreadcrumbList([
      { name: "Home", path: "" },
      { name: "Services", path: "/services" },
    ]);
    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(breadcrumb.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${siteConfig.siteUrl}/services`,
      },
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/schema.test.ts`
Expected: FAIL — `buildBreadcrumbList` is not exported yet.

- [ ] **Step 3: Implement**

Append to `lib/schema.ts`:

```ts
export interface BreadcrumbItemInput {
  /** Visible crumb label, e.g. "Services". */
  name: string;
  /** Route path from the site root, e.g. "/services". Use "" for Home. */
  path: string;
}

export interface BreadcrumbListSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: { "@type": "ListItem"; position: number; name: string; item: string }[];
}

/** BreadcrumbList entity (ATS schema ticket §2.2/§2.6). `items` must mirror
 * the page's actual navigable path — e.g. a condition page passes
 * `[{ name: "Home", path: "" }, { name: condition.name, path: "/conditions/x" }]`,
 * not a fabricated intermediate "Conditions" hub (no such page exists in
 * this site). */
export function buildBreadcrumbList(items: BreadcrumbItemInput[]): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      item: `${siteConfig.siteUrl}${item.path}`,
    })),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/schema.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/schema.ts lib/schema.test.ts
git commit -m "feat(seo): add BreadcrumbList schema.org builder"
```

---

### Task 8: `lib/schema.ts` — Service builder

**Files:**

- Modify: `lib/schema.ts`
- Modify: `lib/schema.test.ts`

**Interfaces:**

- Consumes: `Service` type from `@/content/services`.
- Produces: `buildService(service: Service)` — consumed by Task 13.

- [ ] **Step 1: Write the failing test**

In `lib/schema.test.ts`, add `buildService` to the existing `import { ... } from "./schema";` line (`MEDICAL_BUSINESS_ID` is already imported from Task 5), then append:

```ts
describe("buildService", () => {
  it("builds a Service entity keyed by #{slug}, provided by the practice", () => {
    const service = buildService({
      slug: "adjustment",
      name: "Adjustment",
      duration: "1 hr",
      summary: "Test summary.",
      image: { src: "/x.png", alt: "x" },
    });
    expect(service["@type"]).toBe("Service");
    expect(service["@id"]).toBe(`${siteConfig.siteUrl}/services#adjustment`);
    expect(service.provider).toEqual({ "@id": MEDICAL_BUSINESS_ID });
    expect(service.name).toBe("Adjustment");
    expect(service.description).toBe("Test summary.");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/schema.test.ts`
Expected: FAIL — `buildService` is not exported yet.

- [ ] **Step 3: Implement**

Add this import to the top of `lib/schema.ts`:

```ts
import type { Service } from "@/content/services";
```

Append to `lib/schema.ts`:

```ts
export interface ServiceSchema {
  "@context": "https://schema.org";
  "@type": "Service";
  "@id": string;
  name: string;
  description: string;
  provider: { "@id": string };
  areaServed: { "@type": "City"; name: string }[];
  url: string;
}

/** Service entity (ATS schema ticket §2.2/§2.5). One per verified entry in
 * content/services.ts — there is no /services/[slug] route in this
 * codebase (services render as a single grid on /services), so each gets
 * its own #{slug} anchor on that one page instead of a dedicated URL. */
export function buildService(service: Service): ServiceSchema {
  const url = `${siteConfig.siteUrl}/services#${service.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": url,
    name: service.name,
    description: service.summary,
    provider: { "@id": MEDICAL_BUSINESS_ID },
    areaServed: siteConfig.serviceAreas.map((city) => ({ "@type": "City", name: city })),
    url,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/schema.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/schema.ts lib/schema.test.ts
git commit -m "feat(seo): add Service schema.org builder"
```

---

### Task 9: `lib/schema.ts` — FAQPage builder, migrate `FaqJsonLd`, retire `json-ld-script.tsx`

**Files:**

- Modify: `lib/schema.ts`
- Modify: `lib/schema.test.ts`
- Modify: `components/seo/faq-json-ld.tsx`
- Delete: `components/seo/json-ld-script.tsx`

**Interfaces:**

- Consumes: `FAQ` type from `@/content/faqs`.
- Produces: `buildFAQPage(items: FAQ[])` — consumed by `FaqJsonLd` (unchanged public props: `{ items: FAQ[] }`), so every existing call site (`app/book/page.tsx`, `app/home-visits/page.tsx`, `app/auto-accidents/page.tsx`, `app/contact-us/page.tsx`, `components/sections/faq-section.tsx`, `components/sections/condition-faq.tsx`) needs no changes.

- [ ] **Step 1: Write the failing test**

In `lib/schema.test.ts`, add `buildFAQPage` to the existing `import { ... } from "./schema";` line, then append:

```ts
describe("buildFAQPage", () => {
  it("builds one Question/Answer pair per FAQ item", () => {
    const faqPage = buildFAQPage([{ question: "Q1?", answer: "A1." }]);
    expect(faqPage["@type"]).toBe("FAQPage");
    expect(faqPage.mainEntity).toEqual([
      {
        "@type": "Question",
        name: "Q1?",
        acceptedAnswer: { "@type": "Answer", text: "A1." },
      },
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/schema.test.ts`
Expected: FAIL — `buildFAQPage` is not exported yet.

- [ ] **Step 3: Implement the builder**

Add this import to the top of `lib/schema.ts`:

```ts
import type { FAQ } from "@/content/faqs";
```

Append to `lib/schema.ts`:

```ts
export interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: {
    "@type": "Question";
    name: string;
    acceptedAnswer: { "@type": "Answer"; text: string };
  }[];
}

/** FAQPage entity (ATS schema ticket §2.2/§2.7). Callers must only pass the
 * exact FAQ items visibly rendered on the same page (Google's requirement
 * that structured data match visible content) — every current call site
 * (components/seo/faq-json-ld.tsx) already does this. */
export function buildFAQPage(items: FAQ[]): FAQPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question" as const,
      name: item.question,
      acceptedAnswer: { "@type": "Answer" as const, text: item.answer },
    })),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/schema.test.ts`
Expected: PASS

- [ ] **Step 5: Migrate `FaqJsonLd` to the new builder + serializer**

Replace the full contents of `components/seo/faq-json-ld.tsx`:

```tsx
import { JsonLd } from "@/components/seo/json-ld";
import type { FAQ } from "@/content/faqs";
import { buildFAQPage } from "@/lib/schema";

export interface FaqJsonLdProps {
  items: FAQ[];
}

/** FAQPage JSON-LD for a set of visible on-page FAQs (ATS-131). Render this
 * alongside the FaqAccordion showing the same `items`, per Google's
 * requirement that FAQPage data match visible content. */
export function FaqJsonLd({ items }: FaqJsonLdProps) {
  return <JsonLd data={buildFAQPage(items)} />;
}
```

- [ ] **Step 6: Delete the retired serializer**

```bash
git rm components/seo/json-ld-script.tsx
```

- [ ] **Step 7: Verify no remaining references and run the full suite**

Run:

```bash
grep -rn "json-ld-script\|JsonLdScript" --include=*.ts --include=*.tsx . 2>/dev/null | grep -v node_modules | grep -v .next
npx vitest run
npx tsc --noEmit
```

Expected: no matches for the grep; tests and typecheck pass.

- [ ] **Step 8: Commit**

`components/seo/json-ld-script.tsx`'s deletion is already staged from Step 6 — just add the rest:

```bash
git add lib/schema.ts lib/schema.test.ts components/seo/faq-json-ld.tsx
git commit -m "feat(seo): add FAQPage builder, migrate FaqJsonLd, retire json-ld-script.tsx"
```

---

### Task 10: Homepage + contact schema (`PracticeJsonLd`) — 2.3

**Files:**

- Create: `components/seo/practice-json-ld.tsx`
- Modify: `app/page.tsx`
- Modify: `app/contact-us/page.tsx`

**Interfaces:**

- Consumes: `buildOrganization`, `buildWebSite`, `buildMedicalBusiness` from `@/lib/schema` (Tasks 4–5); `JsonLd` from `@/components/seo/json-ld` (Task 1).
- Produces: `export function PracticeJsonLd(): JSX.Element` — no props, used on exactly two pages.

- [ ] **Step 1: Create the component**

Create `components/seo/practice-json-ld.tsx`:

```tsx
import { JsonLd } from "@/components/seo/json-ld";
import { buildMedicalBusiness, buildOrganization, buildWebSite } from "@/lib/schema";

/** Organization + WebSite + MedicalBusiness JSON-LD (ATS schema ticket
 * §2.3) — rendered on the homepage and /contact-us only, per the ticket's
 * "Homepage + contact schema" scope (not every page, unlike the old
 * app/layout.tsx site-wide render this replaces). */
export function PracticeJsonLd() {
  return (
    <>
      <JsonLd data={buildOrganization()} />
      <JsonLd data={buildWebSite()} />
      <JsonLd data={buildMedicalBusiness()} />
    </>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`**

Add the import:

```ts
import { PracticeJsonLd } from "@/components/seo/practice-json-ld";
```

Add `<PracticeJsonLd />` as the first child inside the top-level fragment, immediately before `<Hero`:

```tsx
  return (
    <>
      <PracticeJsonLd />
      <Hero
```

- [ ] **Step 3: Wire into `app/contact-us/page.tsx`**

Add the import:

```ts
import { PracticeJsonLd } from "@/components/seo/practice-json-ld";
```

Add `<PracticeJsonLd />` as the first child inside the top-level fragment, immediately before the `<div id="contact-hero-form">`:

```tsx
  return (
    <>
      <PracticeJsonLd />
      <div id="contact-hero-form">
```

- [ ] **Step 4: Verify**

Run: `npx vitest run && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Manual check — Rich Results Test on `/`**

Run: `npm run dev` (background), then fetch `http://localhost:3000/` and confirm exactly one `<script type="application/ld+json">` each for Organization, WebSite, MedicalBusiness (3 scripts total, none containing `openingHoursSpecification` or `sameAs` yet). Stop the dev server after checking.

- [ ] **Step 6: Commit**

```bash
git add components/seo/practice-json-ld.tsx app/page.tsx app/contact-us/page.tsx
git commit -m "feat(seo): wire MedicalBusiness/Organization/WebSite JSON-LD onto / and /contact-us"
```

---

### Task 11: About page Person schema — 2.4

**Files:**

- Modify: `app/about/page.tsx`

**Interfaces:**

- Consumes: `buildPerson` from `@/lib/schema` (Task 6); `JsonLd` from `@/components/seo/json-ld` (Task 1).

- [ ] **Step 1: Wire it in**

Add these imports to `app/about/page.tsx`:

```ts
import { JsonLd } from "@/components/seo/json-ld";
import { buildPerson } from "@/lib/schema";
```

Add `<JsonLd data={buildPerson()} />` as the first child inside the top-level fragment, immediately before `<Hero`:

```tsx
  return (
    <>
      <JsonLd data={buildPerson()} />
      <Hero
```

- [ ] **Step 2: Verify**

Run: `npx vitest run && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Manual check — Rich Results Test on `/about`**

Run: `npm run dev` (background), fetch `http://localhost:3000/about`, confirm a `Person` script with `"@id": "https://alignthespinechiropractic.com/about#dr-abe"` (or the `SITE_URL` env override), `worksFor` pointing at the MedicalBusiness `@id`, and no `alumniOf`/`hasCredential` fields. Stop the dev server after checking.

- [ ] **Step 4: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat(seo): add Person JSON-LD for Dr. Abe on /about"
```

---

### Task 12: BreadcrumbList across interior pages — 2.6

**Files:**

- Create: `components/seo/breadcrumb-json-ld.tsx`
- Modify: `app/services/page.tsx`, `app/about/page.tsx`, `app/auto-accidents/page.tsx`, `app/contact-us/page.tsx`, `app/book/page.tsx`, `app/home-visits/page.tsx`, `app/privacy-policy/page.tsx`, `app/conditions/back-pain/page.tsx`, `app/conditions/neck-pain/page.tsx`, `app/conditions/[slug]/page.tsx`

**Interfaces:**

- Consumes: `buildBreadcrumbList` from `@/lib/schema` (Task 7).
- Produces: `export interface BreadcrumbJsonLdProps { items: BreadcrumbItemInput[] }`, `export function BreadcrumbJsonLd(props): JSX.Element`.

- [ ] **Step 1: Create the component**

Create `components/seo/breadcrumb-json-ld.tsx`:

```tsx
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbList, type BreadcrumbItemInput } from "@/lib/schema";

export interface BreadcrumbJsonLdProps {
  items: BreadcrumbItemInput[];
}

/** BreadcrumbList JSON-LD for an interior page (ATS schema ticket §2.6).
 * `items` must match the page's actual navigation path — always starts
 * with `{ name: "Home", path: "" }`. */
export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  return <JsonLd data={buildBreadcrumbList(items)} />;
}
```

- [ ] **Step 2: `app/services/page.tsx`**

Add import: `import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";`

Add as the first child of the top-level fragment, before `<Hero`:

```tsx
<BreadcrumbJsonLd
  items={[
    { name: "Home", path: "" },
    { name: "Services", path: "/services" },
  ]}
/>
```

- [ ] **Step 3: `app/about/page.tsx`**

Add import: `import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";`

Add immediately after the existing `<JsonLd data={buildPerson()} />` line (Task 11):

```tsx
<BreadcrumbJsonLd
  items={[
    { name: "Home", path: "" },
    { name: "About", path: "/about" },
  ]}
/>
```

- [ ] **Step 4: `app/auto-accidents/page.tsx`**

Add import: `import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";`

Add as the first child of the top-level fragment, before `<Hero`:

```tsx
<BreadcrumbJsonLd
  items={[
    { name: "Home", path: "" },
    { name: "Auto Accidents", path: "/auto-accidents" },
  ]}
/>
```

- [ ] **Step 5: `app/contact-us/page.tsx`**

Add import: `import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";`

Add immediately after the existing `<PracticeJsonLd />` line (Task 10):

```tsx
<BreadcrumbJsonLd
  items={[
    { name: "Home", path: "" },
    { name: "Contact Us", path: "/contact-us" },
  ]}
/>
```

- [ ] **Step 6: `app/book/page.tsx`**

Add import: `import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";`

Add as the first child of the top-level fragment, before `<Hero`:

```tsx
<BreadcrumbJsonLd
  items={[
    { name: "Home", path: "" },
    { name: "Book", path: "/book" },
  ]}
/>
```

- [ ] **Step 7: `app/home-visits/page.tsx`**

Add import: `import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";`

Add as the first child of the top-level fragment, before `<Hero`:

```tsx
<BreadcrumbJsonLd
  items={[
    { name: "Home", path: "" },
    { name: "Home Visits", path: "/home-visits" },
  ]}
/>
```

- [ ] **Step 8: `app/privacy-policy/page.tsx`**

Add import: `import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";`

Add as the first child of the top-level fragment, before the negative-margin navy header `<div>`:

```tsx
<BreadcrumbJsonLd
  items={[
    { name: "Home", path: "" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ]}
/>
```

- [ ] **Step 9: `app/conditions/back-pain/page.tsx`**

Add import: `import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";`

Add as the first child of the top-level fragment, before `<Hero`:

```tsx
<BreadcrumbJsonLd
  items={[
    { name: "Home", path: "" },
    { name: "Back Pain", path: "/conditions/back-pain" },
  ]}
/>
```

- [ ] **Step 10: `app/conditions/neck-pain/page.tsx`**

Add import: `import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";`

Add as the first child of the top-level fragment, before `<Hero`:

```tsx
<BreadcrumbJsonLd
  items={[
    { name: "Home", path: "" },
    { name: "Neck Pain", path: "/conditions/neck-pain" },
  ]}
/>
```

- [ ] **Step 11: `app/conditions/[slug]/page.tsx`**

This route renders via `<ConditionPage condition={condition} />` — pass the breadcrumb in from the route, not the shared template, since only this dynamic route needs the slug-derived path. Add import:

```ts
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
```

Replace:

```tsx
return <ConditionPage condition={condition} />;
```

with:

```tsx
return (
  <>
    <BreadcrumbJsonLd
      items={[
        { name: "Home", path: "" },
        { name: condition.name, path: `/conditions/${condition.slug}` },
      ]}
    />
    <ConditionPage condition={condition} />
  </>
);
```

- [ ] **Step 12: Verify**

Run: `npx vitest run && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 13: Manual check — Rich Results Test on 2–3 sample pages**

Run: `npm run dev` (background). Fetch `/services`, `/conditions/whiplash`, and `/privacy-policy`; confirm each has exactly one `BreadcrumbList` script whose `itemListElement` starts with `{ position: 1, name: "Home", item: "<siteUrl>" }`. Stop the dev server after checking.

- [ ] **Step 14: Commit**

```bash
git add components/seo/breadcrumb-json-ld.tsx app/services/page.tsx app/about/page.tsx app/auto-accidents/page.tsx app/contact-us/page.tsx app/book/page.tsx app/home-visits/page.tsx app/privacy-policy/page.tsx app/conditions/back-pain/page.tsx app/conditions/neck-pain/page.tsx "app/conditions/[slug]/page.tsx"
git commit -m "feat(seo): add BreadcrumbList JSON-LD across interior pages"
```

---

### Task 13: Service schema on `/services` — 2.5

**Files:**

- Modify: `app/services/page.tsx`

**Interfaces:**

- Consumes: `services` from `@/content/services`; `buildService` from `@/lib/schema` (Task 8); `JsonLd` from `@/components/seo/json-ld` (Task 1).

- [ ] **Step 1: Wire it in**

Add these imports to `app/services/page.tsx`:

```ts
import { JsonLd } from "@/components/seo/json-ld";
import { services } from "@/content/services";
import { buildService } from "@/lib/schema";
```

Add this immediately after the `<BreadcrumbJsonLd .../>` line added in Task 12 Step 2 (so `/services` ends up with BreadcrumbList paired with Service, per §2.5):

```tsx
{
  services.map((service) => <JsonLd key={service.slug} data={buildService(service)} />);
}
```

- [ ] **Step 2: Verify**

Run: `npx vitest run && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Manual check — Rich Results Test + Schema.org validator on `/services`**

Run: `npm run dev` (background), fetch `http://localhost:3000/services`, confirm one `Service` script per entry in `content/services.ts` (6 today), each `"@id"` ending in `/services#{slug}` and `provider` pointing at the MedicalBusiness `@id`. Stop the dev server after checking.

- [ ] **Step 4: Commit**

```bash
git add app/services/page.tsx
git commit -m "feat(seo): add Service JSON-LD for every listed service on /services"
```

---

### Task 14: Final verification — vocabulary audit, full suite, production build, PR evidence — 2.11/2.12

**Files:** none (verification only)

- [ ] **Step 1: Confirm no AggregateRating/Review markup exists anywhere**

Run:

```bash
grep -rn "AggregateRating\|\"Review\"" lib/schema.ts components/seo/ 2>/dev/null
```

Expected: no matches. `content/doctor-profile.ts`'s `rating` field is UI-only (star display in `components/sections/doctor-profile.tsx`) and must never be read by `lib/schema.ts`.

- [ ] **Step 2: Confirm no forbidden vocabulary remains**

Run:

```bash
grep -rn "\"Chiropractic\"\|\"Physician\"\|MedicalClinic" lib/schema.ts components/seo/ 2>/dev/null
```

Expected: no matches.

- [ ] **Step 3: Confirm no stray `#` placeholder reaches any JSON-LD payload**

Run:

```bash
grep -rn "json-ld-script\|JsonLdScript" . --include=*.ts --include=*.tsx 2>/dev/null | grep -v node_modules | grep -v .next
```

Expected: no matches (fully retired in Task 9).

- [ ] **Step 4: Lint, typecheck, full test suite**

Run:

```bash
npm run lint
npm run typecheck
npm test
```

Expected: no errors; all tests pass, including every new file from Tasks 1–13.

- [ ] **Step 5: Production build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Manual Rich Results Test + Schema.org validator pass — PR evidence (§2.12)**

Run `npm run dev` (background) and, for each schema-emitting route — `/`, `/about`, `/services`, `/contact-us`, `/auto-accidents`, `/book`, `/home-visits`, `/privacy-policy`, `/conditions/back-pain`, `/conditions/neck-pain`, `/conditions/whiplash`, `/conditions/sciatica`, plus every page with a visible FAQ block — paste the rendered page's `view-source:` HTML into Google's Rich Results Test and the Schema.org validator (schema.org/validator or validator.schema.org). Screenshot both a passing Rich Results Test result and a zero-warning Schema.org validator result for each route, and attach all screenshots to the PR — this is a hard requirement per ticket §2.12, not optional polish. Stop the dev server when done.

- [ ] **Step 7: Final commit (if any lint/format fixups were needed)**

```bash
git status
# If lint/format made changes:
git add -A
git commit -m "chore(seo): lint/format fixups"
```
