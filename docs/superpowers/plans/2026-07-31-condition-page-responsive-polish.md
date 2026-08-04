# Condition page responsive polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the mobile/tablet responsive pass on the `/conditions/[slug]` template — consistent 2-col stacking below `lg` (1024px), fluid `clamp()` type scaling on the remaining fixed-px headline tokens, and a real-browser verification pass at 1440/1024/768/375.

**Architecture:** Pure CSS/Tailwind-token changes to already-shipped, already-composed components (no new components, no prop/API changes). Three fixed-px `fontSize` tokens in `tailwind.config.ts` become `clamp()` (matching the linear-interpolation formula already used for `display`/`h2`/`card-title`); one component's breakpoint prefix changes from `md:` to `lg:`; everything else is verified, not modified, unless the live-browser pass finds a real overflow/clipping bug.

**Tech Stack:** Next.js 16 / React 19 / Tailwind v4 (config-based, `tailwind.config.ts` + `@config` in `app/globals.css`). No test framework covers visual/CSS behavior in this repo (`vitest` exists but has zero test files under `app/`, `components/`, `content/`, or `lib/` today) — verification here is `typecheck`/`lint`/`build` plus real-browser QA via a connected Chrome tab, matching every prior plan's convention in this repo's `.superpowers/sdd/progress.md` ledger.

## Global Constraints

- Colors, border-radii, and shadows must not change (ticket: "keep colors/radii/shadows fixed").
- No new npm dependencies, no new components.
- Stack-below/split-at boundary for 2-col blocks is `lg` (1024px) — matches Hero's and AccidentBanner's existing, unmodified behavior.
- `clamp()` tokens use the same linear-interpolation formula already shipped for `display`/`h2`/`card-title` in `tailwind.config.ts`: given a target `min` px at 375px viewport width and `max` px at 1728px viewport width, `slope% = round(((max-min) / 1353) * 100, 2)` (unrounded intermediate value used for the intercept calc below), `intercept = round(min - slope%_unrounded * 3.75, 2)`, producing `clamp(minpx, slope%vw + interceptpx, maxpx)`.
- Full design rationale: `docs/superpowers/specs/2026-07-31-condition-page-responsive-polish-design.md`.

---

### Task 1: Convert `hero`/`understanding-intro`/`doctor-name` fontSize tokens to `clamp()`

**Files:**

- Modify: `tailwind.config.ts:62-119` (the `fontSize` block)
- Modify: `components/sections/hero.tsx:116-123` (the `<h1>` className)

**Interfaces:**

- Consumes: nothing new — `text-hero`/`text-understanding-intro`/`text-doctor-name` are existing Tailwind utility classes already referenced by `Hero`, `UnderstandingCondition`, `AccidentBanner`, `DoctorProfile`, and `app/privacy-policy/page.tsx`.
- Produces: the same 3 utility class names, now backed by fluid `clamp()` values instead of fixed px. No signature/prop changes anywhere — this task is pure token-value substitution plus one className simplification.

- [ ] **Step 1: Edit `tailwind.config.ts` — replace the 3 fixed-px fontSize entries**

In `tailwind.config.ts`, find:

```ts
        hero: ["64px", { lineHeight: "68px", fontWeight: "300" }],
```

Replace with:

```ts
        // Fluid clamp() per condition-page-spec §E: same 375->1728px
        // interpolation as display/h2/card-title below. Endpoints are the
        // real values this token already shipped with — 32px was Hero's
        // own hand-rolled mobile override, 64px was (and remains) the
        // desktop value — so this only smooths the curve between them,
        // it doesn't invent new sizes at either extreme.
        hero: [
          "clamp(32px, 2.37vw + 23.13px, 64px)",
          { lineHeight: "clamp(38px, 2.22vw + 29.69px, 68px)", fontWeight: "300" },
        ],
```

Find:

```ts
        "doctor-name": ["40px", { lineHeight: "48px", fontWeight: "500" }],
        "understanding-intro": ["30px", { lineHeight: "40px", fontWeight: "400" }],
```

Replace with:

```ts
        // Fluid clamp() per condition-page-spec §E. 40px/48px is the
        // existing (desktop-sourced) value, kept as the max; 28px/34px is
        // a judgment-call mobile minimum, not spec-confirmed — no
        // breakpoint frames exist in Figma to sample (same caveat as the
        // display token above).
        "doctor-name": [
          "clamp(28px, 0.89vw + 24.67px, 40px)",
          { lineHeight: "clamp(34px, 1.03vw + 30.12px, 48px)", fontWeight: "500" },
        ],
        // Fluid clamp() per condition-page-spec §E. 30px/40px is the
        // existing (desktop-sourced) value, kept as the max; 22px/30px is
        // a judgment-call mobile minimum (same caveat as doctor-name above).
        "understanding-intro": [
          "clamp(22px, 0.59vw + 19.78px, 30px)",
          { lineHeight: "clamp(30px, 0.74vw + 27.23px, 40px)", fontWeight: "400" },
        ],
```

(Leave every other `fontSize` entry untouched — this task only replaces these 3 keys' values, not their position in the object, not any other key.)

- [ ] **Step 2: Simplify `Hero`'s `<h1>` className**

In `components/sections/hero.tsx`, find:

```tsx
          <h1
            className={cn(
              "font-display text-[32px] leading-[38px] text-white sm:text-[44px] sm:leading-[50px] lg:text-hero",
              variant === "home" && badge ? "mb-10" : "mb-8 lg:mb-20",
            )}
          >
```

Replace with:

```tsx
          <h1
            className={cn(
              "font-display text-hero text-white",
              variant === "home" && badge ? "mb-10" : "mb-8 lg:mb-20",
            )}
          >
```

(Only the font-size classes change — the `mb-*` conditional stays exactly as-is.)

- [ ] **Step 3: Typecheck and lint**

Run: `npm run typecheck`
Expected: exits 0, no errors.

Run: `npm run lint`
Expected: exits 0, same pre-existing warning count as `main` (no new warnings introduced — this task touches no logic, only CSS values and one className string).

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: exits 0. This is the real correctness check for a Tailwind/Next.js change like this — confirms `text-hero`/`text-understanding-intro`/`text-doctor-name` still resolve to valid CSS and every page that uses them (`/`, `/services`, `/about`, `/book`, `/home-visits`, `/privacy-policy`, and all 4 condition routes) still builds.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts components/sections/hero.tsx
git commit -m "$(cat <<'EOF'
feat: apply clamp() fluid scaling to hero/understanding-intro/doctor-name

Finishes the condition-page-spec §E clamp() conversion started for
display/h2/card-title — these 3 tokens were still fixed-px with manual
breakpoint jumps (or no scaling at all).
EOF
)"
```

---

### Task 2: Stack UnderstandingCondition's Types/Common Causes split through tablet

**Files:**

- Modify: `components/sections/understanding-condition.tsx:41,51`

**Interfaces:**

- Consumes: nothing new.
- Produces: nothing new — same component, same props, only the breakpoint prefix on 2 existing classes changes from `md:` to `lg:`, moving the split point from 768px to 1024px so it matches Hero/AccidentBanner's existing stack-below-1024 behavior.

- [ ] **Step 1: Edit the Types/Causes wrapper's breakpoint**

In `components/sections/understanding-condition.tsx`, find:

```tsx
        <div className="flex flex-col gap-10 md:flex-row md:items-stretch">
```

Replace with:

```tsx
        <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch">
```

- [ ] **Step 2: Edit the vertical divider's breakpoint**

Find:

```tsx
<Divider orientation="vertical" className="hidden md:block" />
```

Replace with:

```tsx
<Divider orientation="vertical" className="hidden lg:block" />
```

- [ ] **Step 3: Typecheck and lint**

Run: `npm run typecheck`
Expected: exits 0.

Run: `npm run lint`
Expected: exits 0, no new warnings.

- [ ] **Step 4: Commit**

```bash
git add components/sections/understanding-condition.tsx
git commit -m "$(cat <<'EOF'
fix: stack UnderstandingCondition's Types/Causes split through tablet

Was splitting to 2 columns at md: (768px), out of step with
Hero/AccidentBanner's existing stack-below-1024 behavior — moved to lg:
(1024px) so all 4 condition-page 2-col blocks stack consistently through
tablet width.
EOF
)"
```

---

### Task 3: Real-browser verification at 1440/1024/768/375, DoctorProfile breakpoint decision, and any fixes it surfaces

**Files:**

- Modify (conditionally — only if the live pass finds a real bug): `components/sections/doctor-profile.tsx`, or any other section file if overflow/clipping is found.

**Interfaces:**

- Consumes: the finished template from Task 1 + Task 2, running on `npm run dev`.
- Produces: a verified-clean condition page at all 4 required widths, and a resolved decision on DoctorProfile's `xl:` vs `lg:` split (recorded in a commit message either way, per the design doc's "user decision" framing).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (background/separate terminal — needed for the browser steps below)
Expected: server up on `http://localhost:3000` (or whatever port it reports).

- [ ] **Step 2: Load `/conditions/neck-pain` in a connected Chrome tab and check DoctorProfile at 1024px and 768px**

Navigate to `http://localhost:3000/conditions/neck-pain`, resize/inspect at 1024px and 768px viewport widths. Check specifically what ATS-092's comment in `components/sections/doctor-profile.tsx:24-29` flagged as broken at those widths: the `cta` Button variant's "Book with Dr. Abe" label wrapping or clipping against the button's fixed height, in the 45/55 text column.

- If it's still broken at 1024/768 with a 2-column (`lg:flex-row`) layout: leave `doctor-profile.tsx` unmodified — its existing `xl:flex-row` split stays, as a documented, intentional exception (this was the pre-approved fallback per the design doc's user decision).
- If it renders clean at 1024/768 with `lg:` (e.g. because the now-clamp'd `doctor-name` token shrinks slightly at those widths and relieves the crowding): edit `components/sections/doctor-profile.tsx`, changing every `xl:` breakpoint prefix in the component (the `xl:flex-row xl:items-center xl:gap-16` container, the `xl:w-[45%]` image wrapper, and the `xl:block` decorative corner-border div) to `lg:`. Re-check 1024/768 again after the edit to confirm the fix holds.

- [ ] **Step 3: Full page sweep at 1440, 1024, 768, 375 on `/conditions/neck-pain`**

At each of the 4 widths, confirm:

- Hero: form card sits beside the headline at 1440/1024 (2-col, `lg:grid-cols-2`), drops below it at 768/375.
- UnderstandingCondition: Types/Common Causes stacked (single column, no vertical divider visible) at 768/375, side-by-side with the divider at 1440/1024 (post-Task-2 `lg:` split).
- AccidentBanner: PIP calculator beside the headline/body at 1440/1024, below it at 768/375.
- DoctorProfile: matches whatever Step 2 concluded (2-col at 1440/1024 either via `lg:` or `xl:` depending on the decision; confirm it's genuinely 1-col, not accidentally 2-col-and-clipped, at 768/375).
- ComparisonTable: horizontal scroll-snap container works at 375/768 (drag/scroll reveals all 3 columns, snap points land cleanly, no vertical layout break); all 3 columns visible without scrolling at 1024/1440.
- PointToWhereItHurts (selector): tappable region list (not the diagram) renders at 768/375; interactive diagram + hotspots render at 1024/1440.
- No horizontal overflow/scrollbar anywhere on the page at any of the 4 widths (checked via `document.documentElement.scrollWidth` vs `window.innerWidth`, or visually).
- `text-hero`, `text-understanding-intro`, `text-doctor-name` text doesn't clip/overflow its container at 375px (the clamp() minimum).

If any of these fail, fix the specific broken class(es) in the relevant section file (targeted, minimal fix — not a redesign) and re-check that width.

- [ ] **Step 4: Spot-check Home (`/`) and `/privacy-policy` at 375 and 1440**

These pages also render `text-hero` (Home via `Hero`, `/privacy-policy` via its own standalone `<h1>`); Home also renders `DoctorProfile` (`text-doctor-name`). Confirm neither page regressed — headline text fits, no new overflow, nothing visibly broken compared to before this plan's changes.

- [ ] **Step 5: Stop the dev server**

Kill only the dev server process this task started (not a blanket `taskkill`/`pkill` — matches this repo's own documented past incident in `.superpowers/sdd/progress.md`'s 2026-07-21 entry about accidentally killing all `node.exe` processes).

- [ ] **Step 6: `npm run build` one more time to confirm the final state is clean**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 7: Commit any fixes found in Step 2/3 (skip this commit if nothing needed changing)**

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix: <describe the specific overflow/clipping/breakpoint bug found and fixed>

Found during the 1440/1024/768/375 real-browser verification pass.
EOF
)"
```

If Step 2 concluded DoctorProfile's `xl:` split should stay as-is (no code change), record that explicitly in the final report instead of a commit — it's a verified decision, not a no-op.

---

## Self-review notes

- **Spec coverage:** design doc's "Changes" list (1-5) maps to Task 1 (items 1-2), Task 2 (item 3), Task 3 (items 4-5 + the "Verification" section's browser sweep). The design doc's "Blast radius note" (Home/privacy-policy spot-check) is covered by Task 3 Step 4.
- **No placeholders:** every step has exact file paths, exact before/after code, and concrete pass/fail criteria. Task 3's fix steps are intentionally conditional ("if broken, fix X; if clean, no change") rather than fake-concrete, because the actual outcome depends on a live render this plan can't pre-determine — that's Task 3's whole purpose, not a gap.
- **Type/name consistency:** `text-hero`/`text-understanding-intro`/`text-doctor-name` class names and the `hero`/`understanding-intro`/`doctor-name` config keys are used identically across all 3 tasks and match the actual current source.
