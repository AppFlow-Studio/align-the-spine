# Baseline — SEO Foundation Phase 1

Captured 2026-08-11, before any Phase 1 changes, on branch `seo-foundation-phase-1`.

## Environment

- Git HEAD at branch start: `12a01025ef832a429b39522f8f802191a72ba06d`
- Branch: `seo-foundation-phase-1` (cut from `main`)
- `git status --porcelain`: clean
- Node: `v22.13.1`
- npm: `11.4.2`
- Lockfile: `package-lock.json` (npm, `lockfileVersion: 3`)

## `npm run typecheck`

```
> align-the-spine@0.1.0 typecheck
> tsc --noEmit

(no output — exit 0)
```

## `npm run lint`

```
> align-the-spine@0.1.0 lint
> eslint

C:\Users\Bilal\AppflowS\align-the-spine\app\services\chiropractic-adjustments\page.tsx
  27:10  warning  'cn' is defined but never used  @typescript-eslint/no-unused-vars

C:\Users\Bilal\AppflowS\align-the-spine\app\services\spinal-decompression\page.tsx
  191:51  warning  'idx' is defined but never used  @typescript-eslint/no-unused-vars
  230:54  warning  'idx' is defined but never used  @typescript-eslint/no-unused-vars

C:\Users\Bilal\AppflowS\align-the-spine\components\layout\navbar-links.tsx
  10:31  warning  'isGlass' is defined but never used  @typescript-eslint/no-unused-vars

C:\Users\Bilal\AppflowS\align-the-spine\components\sections\comparison-table.tsx
  91:36  warning  'isLast' is defined but never used  @typescript-eslint/no-unused-vars

C:\Users\Bilal\AppflowS\align-the-spine\components\sections\hero.tsx
  81:3  warning  'spineOverlay' is assigned a value but never used  @typescript-eslint/no-unused-vars

C:\Users\Bilal\AppflowS\align-the-spine\lib\schema.test.ts
  3:10  warning  'servicesGrid' is defined but never used  @typescript-eslint/no-unused-vars

✖ 7 problems (0 errors, 7 warnings)
```

Pre-existing warnings, not touched by this phase. Exit 0 (warnings don't fail lint).

## `npx vitest run` — pre-fix state

**This is the critical finding of this phase.** No `vitest.config.ts` exists, so Vitest cannot resolve the `@/*` path alias defined in `tsconfig.json`. 11 of 14 test files fail to even load (`Cannot find package '@/content/...'`), including the claim-guard test's own dependents. Of the 3 files that _do_ run (because they happen to have no `@/` imports), `content/content-safety.test.ts` fails 2 of 10 assertions:

```
 Test Files  11 failed | 3 passed (14)
      Tests  2 failed | 34 passed (36)
   Start at  19:25:25
   Duration  1.16s

Failed suites (all "Cannot find package '@/...'"):
  app/robots.test.ts
  app/sitemap.test.ts
  content/doctor-profile.test.ts
  content/seo.test.ts
  content/site.test.ts
  content/verified-value.test.ts
  lib/schema.test.ts
  app/services/page.test.ts
  lib/seo/local-business.test.ts
  lib/seo/metadata.test.ts

Failed assertions (content/content-safety.test.ts, which did load):
  × does not contain the forbidden string "$0" (unverified $0/PIP insurance claim)
    → found in content/site.ts
  × does not contain the forbidden string "Maria G." (placeholder testimonial author)
    → found in content/testimonials.ts
```

`.github/workflows/ci.yml` never runs `npm run test` — only `typecheck`, `lint`, `build` — so none of this is visible in CI today.

## `npm run build`

Succeeds (exit 0), Turbopack, 8.0s compile + 8.1s typecheck + all 26 routes statically generated. One pre-existing warning, not related to this phase:

```
⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of C:\Users\Bilal\package-lock.json as the root directory.
 Detected additional lockfiles:
   * C:\Users\Bilal\AppflowS\align-the-spine\package-lock.json
```

Routes generated (26): `/`, `/_not-found`, `/about`, `/api/lead` (dynamic), `/auto-accidents`, `/book`, `/conditions/{back-pain,cervicogenic-headache,concussion,neck-pain,sciatica,tmj-jaw-pain,whiplash}`, `/contact-us`, `/home-visits`, `/privacy-policy`, `/reviews`, `/robots.txt`, `/services`, `/services/{chiropractic-adjustments,massage-soft-tissue,spinal-decompression}`, `/sitemap.xml`, `/thank-you`.

## Two live sites (brief §1.4)

`alignthespinechiropractic.com` (legacy) stays live alongside this site (`chirobackpain.com`). Decision, recorded here rather than in code:

- Each domain canonicalizes to itself; this codebase's `SITE_URL` always points at `chirobackpain.com` in production (see Phase 1's canonical-host hardening) and never cross-canonicalizes to the legacy domain.
- NAP (name/address/phone) must stay character-identical across both domains — this phase aligns `content/site.ts` to the client-confirmed values (`811 SE 8th Ave Ste 101, Deerfield Beach, FL 33441`, geo `26.30678730, -80.09447780`).
- Copy on this site must stay original, not duplicated from the legacy domain — not verified in this phase (would require access to the legacy site's content), flagged for whoever owns the on-page rewrite phase (brief §3).
- Both domains should be verified as separate Google Search Console properties — an account-level action item, outside this repo.

## Manual production check still owed

`proxy.ts` (added this phase — named per Next.js 16's middleware→proxy rename) sets `X-Robots-Tag: noindex, nofollow` outside production. This can only be verified against a real deploy — after the next production deploy, run:

```
curl -sI https://chirobackpain.com/ | grep -i x-robots-tag
```

Expect **no** `X-Robots-Tag` header on production. Run the same against a preview deployment URL and expect the header to be present.
