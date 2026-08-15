# UI change requests

Format and process per the SEO/AEO/GEO/CRO implementation brief §12: anything beyond fixing objectively-broken spacing, adding animation, or reordering existing content goes here first. Nothing below is implemented. Batched together, awaiting approval before any of it is built.

---

### UI-01 — Homepage hero restructure

**Page / component:** `app/page.tsx`, `components/sections/hero-solid-panel.tsx`

**What I want to change:** The homepage H1 currently reads "Align the Spine / South Florida's / Chiropractor" and the hero form is accident-specific ("Schedule Your Car Accident Evaluation"). Restructure to a general-care H1 naming Deerfield Beach, a general-intent primary form, and add a distinct (but not dominant) accident-pathway card linking to `/auto-accidents` above the fold.

**Why (CRO/accessibility/SEO reasoning):** The homepage currently competes with `/auto-accidents` for the same accident-intent queries instead of owning general local intent ("chiropractor Deerfield Beach," "chiropractor near me"). A general-care visitor lands on a page whose primary CTA doesn't match their intent.

**What stays the same:** Navy hero treatment, serif display face, pill buttons, existing hero photography, section rhythm.

**Risk if we do not:** Homepage keeps under-serving general-care search intent and keeps cannibalizing `/auto-accidents`'s ranking for accident terms.

**Status:** AWAITING APPROVAL

---

### UI-02 — Sticky mobile action bar

**Page / component:** New component, `components/layout/` — sitewide except `/book` and `/thank-you`.

**What I want to change:** Add a two-action (call, request appointment) bar fixed to the bottom of the viewport below the tablet breakpoint, hiding while a form input is focused, respecting safe-area insets.

**Why:** The primary user (injured, on a phone, deciding in ~10 seconds) shouldn't have to scroll to find a call button. This is the highest-leverage mobile conversion change in the brief.

**What stays the same:** Existing button styling/pill geometry, brand colors — this is a new persistent element, not a redesign of anything existing.

**Risk if we do not:** Mobile visitors who don't scroll to an existing CTA have no fast path to calling.

**Status:** AWAITING APPROVAL

---

### UI-03 — Red-flag block on `/auto-accidents`

**Page / component:** `app/auto-accidents/page.tsx`, likely reusing `components/ui/red-flag-card.tsx`

**What I want to change:** A visually distinct (not accordion-hidden) block before the lead form listing emergency red flags (loss of consciousness, worsening headache, numbness/weakness, vision changes, confusion, loss of bladder/bowel control, severe neck pain after high-speed impact) directing to emergency care or 911.

**Why:** Patient-safety content that needs to be seen, not discovered — brief treats this as non-negotiable, calm, not alarm-styled.

**What stays the same:** Existing card component styling, navy/white palette, no new color introduced for "urgency."

**Risk if we do not:** A patient with an actual emergency reads accident-recovery marketing copy instead of being pointed to urgent care.

**Status:** AWAITING APPROVAL

---

### UI-04 — Convert remaining single-step forms to two-step

**Page / component:** `components/ui/lead-form.tsx` and its call sites (homepage hero, `/auto-accidents` hero, `/contact-us`, `/reviews` once built). Note: `components/sections/booking-form.tsx` (`/book`) is already two-step — not in scope here.

**What I want to change:** First step collects name + phone only; second step (optional fields) appears after. Matches the pattern `booking-form.tsx` already implements.

**Why:** Lower friction for a visitor in pain filling out a form one-handed; the brief's CRO section treats this as the default pattern sitewide.

**What stays the same:** Field set, validation rules, styling, honeypot.

**Risk if we do not:** Higher form abandonment on the pages carrying the most commercial weight.

**Status:** AWAITING APPROVAL

---

### UI-05 — Replace placeholder testimonial modules with real review modules

**Page / component:** `components/sections/patient-reviews.tsx`, `hero-reviews-carousel.tsx`, `reviews-strip.tsx` (currently rendering nothing — see SEO Foundation Phase 1, which removed the fabricated testimonial data these read from).

**What I want to change:** Once real, client-approved Google reviews exist (`content/reviews.ts`, currently empty — see the `/reviews` page build, UI-08), wire these same components to real review data instead of leaving them empty.

**Why:** Real social proof converts; empty sections where testimonials used to be is a visible gap on `/`, `/auto-accidents`, and `/home-visits`.

**What stays the same:** Existing card/carousel layout and styling — this is a data swap, not a redesign, unless the `/reviews` page work (UI-08) changes the shared component design.

**Risk if we do not:** These sections stay empty indefinitely once real reviews exist elsewhere on the site.

**Status:** AWAITING APPROVAL

---

### UI-06 — Breadcrumbs

**Page / component:** Every non-home indexable route — new nav component + `components/seo/breadcrumb-json-ld.tsx` (schema builder already exists, not yet wired to a visible nav on most pages).

**What I want to change:** Visible breadcrumb nav (`aria-label`, current page not a link) matching the `BreadcrumbList` JSON-LD exactly, on every non-home page.

**Why:** Navigation clarity, internal linking, and required for the JSON-LD to match visible content (Google's own rule for structured data).

**What stays the same:** Typography scale, spacing rhythm — a thin new nav element, not a layout change.

**Risk if we do not:** JSON-LD breadcrumbs with no matching visible breadcrumb, and weaker internal navigation.

**Status:** AWAITING APPROVAL

---

### UI-07 — Hours table on `/contact-us` and sitewide location block

**Page / component:** `app/contact-us/page.tsx`, `components/sections/contact-section.tsx`, `components/layout/location-footer.tsx`

**What I want to change:** A full weekly hours table (now client-confirmed: 7:00 AM–11:00 PM daily) on `/contact-us`, plus a real clickable directions link alongside the existing map embed and expanded Palm Plaza wayfinding.

**Why:** Hours are now verified and should be visible where visitors look for them, not just present in schema.

**What stays the same:** Existing contact section layout, map embed treatment, brand styling.

**Risk if we do not:** Client-confirmed hours only exist in metadata/schema, not where a visitor can actually see them.

**Status:** AWAITING APPROVAL

---

### UI-08 — `/reviews` page layout in full

**Page / component:** `app/reviews/page.tsx` (currently one sentence, `status: "draft"` in `content/seo.ts`)

**What I want to change:** The full page build per the brief §9: live rating/count from Places API (cached), curated verbatim reviews (`content/reviews.ts`, currently empty), tag filtering, featured accident reviews, mid-page conversion form, "what patients mention most" bar chart, sitewide nav re-entry once populated.

**Why:** Per the brief, this is one of the strongest conversion assets on the site and is currently a stub.

**What stays the same:** Navy hero treatment, serif display face, pill buttons/filter chips, existing design tokens throughout.

**Risk if we do not:** The practice's strongest proof asset (5.0 rating, 164 reviews, real accident-recovery accounts) stays unused.

**Status:** AWAITING APPROVAL
