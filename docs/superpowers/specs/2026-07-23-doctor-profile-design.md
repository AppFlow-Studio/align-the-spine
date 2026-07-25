# DoctorProfile ("The Doctor Behind Your Care") — Design

**Ticket:** Epic 4 – Sections · Track: Dev A · Est: M · Depends on: ATS-020, ATS-024
**Source:** ticket text (pasted directly) + Figma file `NHwBqbGepOspY0GrCnECnj`, nodes `96:471`–`96:495` (homepage instance) and `96:2442` (`about-drabe` frame, same block at `96:2599`–`96:2623`). References condition-page-spec §B6 (not present in this repo — reconstructed from ticket text + Figma, same gap noted by every prior spec in this repo).

## Summary

A 2-column "meet the doctor" block: portrait with an overlaid rating chip on one side, eyebrow/name/bio/CTA on the other. Built as a single reusable `DoctorProfile` component driven by a `variant: "short" | "long"` prop, mounted on the Home page for this ticket.

## Resolved open decisions

- **Image side**: Figma shows the portrait on the **left** and text on the **right** in both instances checked (homepage `96:471`–`96:495`, `about-drabe` `96:2599`–`96:2623` — identical coordinates modulo y-offset). This is the opposite of the ticket text's "Left: eyebrow→name...CTA, Right: portrait," but matches the actual design and this repo's established image-left convention (`ServiceListRow`). Going with what Figma shows.
- **Short vs. long content is currently identical**: the profile-block copy, sizes, and positions are pixel-identical between the homepage and `about-drabe` Figma instances — same bio text verbatim in both. The ticket's "long variant adds extended bio + history + HOW HE PRACTICES cards" refers to content that lives in a separate History section below this block on the About page (Figma text `96:2569`–`96:2589`), tracked under ATS-091 (About page), not this block itself.
- **Scope: profile block only, not History/cards** (user decision) — acceptance criteria list only variant-switching, the rating chip, and responsive stack, not a history/cards section. `DoctorProfile` takes an optional `extended?: ReactNode` prop, rendered only when `variant === "long"`, as a reserved slot for ATS-091 to fill later without touching this component again. Nothing is passed to it in this ticket.
- **Mount point: Home page only** (user decision) — no `/about`, `/services`, or condition-page route exists yet. `variant="long"` is plumbed but unexercised until a future page ticket mounts it.
- **Reused tokens confirmed via Figma `get_design_context`**: eyebrow text is `#58a0a0` Poppins Medium 25/40, tracking 1.25 — exactly the existing `Eyebrow` component, reused as-is. Name is Newsreader Medium 65/100 `#253067`, confirmed exact match to the ticket text but not an existing token — new `doctor-name` fontSize added. Bio color `#1a1a1a` Poppins 25/40 matches the existing `text-body-lg` token exactly, reused. CTA "r80, h99" matches the existing `Button variant="cta"` exactly, reused. Portrait `r30` and chip `r20` both match existing `radius-30`/`radius-20` tokens, reused.
- **New tokens required**: `doctor-name` fontSize (`65px` / `100px` line-height / `500` weight) and `overlay-ink-20` color (`rgba(26, 26, 26, 0.2)`, per ticket) — no existing token covers a translucent near-black overlay (only `overlay-navy-20`/`white-15`/`white-16` exist).
- **Rating chip is hand-built, not a `<Rating>` reuse**: `Rating` hardcodes `teal-500`/`mute-300` stars and `ink-500` count text, tuned for use on a plain white/light background (`ReviewsStrip`). The chip sits on a photo behind a 20%-opacity dark overlay and needs light text/stars for legibility — overriding `Rating`'s internal colors isn't exposed via props, and bolting on a color-variant prop for one caller isn't worth it. `DoctorProfile` renders the chip directly with `StarIcon` (white fill) + plain text, matching Figma's element order: location text → stars → count.
- **Chip text/star color is a judgment call**: Figma's exact chip text color wasn't confirmed (MCP rate-limited mid-lookup for that specific node). White was chosen for contrast against a photo + dark 20%-opacity overlay, consistent with how `Button variant="glass"` and other photo-overlay chips in this codebase already use white text.
- **Portrait image**: `public/figma-exports/portrait.png` — visually confirmed as Dr. Abe's headshot, closest match to the Figma layer name `AbeUpdated 1` (no exact filename match exists in the export folder).
- **Content values**: `count: 152` and `location: "Deerfield Beach, Florida"` are literal strings in the new content file (matching Figma exactly), not derived from `siteConfig.stats`/`siteConfig.business.address` — consistent with how `content/cta-bands.ts` hardcodes its copy rather than deriving it.
- **Placement on Home**: `Hero → ServicesSection → DoctorProfile → FaqSection → StillHaveQuestions → CtaBand` — inserted between Services and FAQ (introduce the practice, then meet the doctor, then answer questions), a judgment call since this repo's section order doesn't strictly follow Figma's page-level sequencing (established already by ATS-121's placement of `StillHaveQuestions`/`CtaBand`).

## Architecture

```
content/doctor-profile.ts               — new: DoctorProfileContent + doctorProfileContent config object
components/sections/doctor-profile.tsx  — new: <DoctorProfile variant content extended? />
tailwind.config.ts                      — add fontSize.doctor-name, colors.overlay["ink-20"]
app/globals.css                         — add --overlay-ink-20
app/page.tsx                            — mount <DoctorProfile variant="short" .../> between ServicesSection and FaqSection
```

- Server component, no `"use client"` — no interactivity beyond the existing `Button`/`Image`.
- No new npm dependencies. Reuses `Eyebrow`, `Button` (`variant="cta"`), `StarIcon`, `next/image`, `Section`/`Container`.

## New design tokens

`tailwind.config.ts`:

```ts
fontSize: {
  // ...
  "doctor-name": ["65px", { lineHeight: "100px", fontWeight: "500" }],
},
colors: {
  overlay: {
    // ...
    "ink-20": "var(--overlay-ink-20)",
  },
},
```

`app/globals.css`:

```css
--overlay-ink-20: rgba(26, 26, 26, 0.2);
```

## `content/doctor-profile.ts` (new)

```ts
import { siteConfig } from "@/content/site";

export interface DoctorProfileContent {
  eyebrow: string;
  name: string;
  bio: string;
  cta: { label: string; href: string };
  rating: { value: number; count: number; location: string };
  portrait: { src: string; alt: string };
}

export const doctorProfileContent: DoctorProfileContent = {
  eyebrow: "THE DOCTOR BEHIND YOUR CARE",
  name: "Dr. Abe Nasser",
  bio: "Dr. Abe is pleased to serve the Deerfield and surrounding areas. Dr. Abe began his chiropractic career serving the Broward county and Palm Beach County area working with many different patients from pre and post pregnancy, post-surgical, geriatric, and athletes.",
  cta: { label: "Book with Dr. Abe", href: siteConfig.bookingCta.href },
  rating: { value: 5, count: 152, location: "Deerfield Beach, Florida" },
  portrait: { src: "/figma-exports/portrait.png", alt: "Dr. Abe Nasser" },
};
```

## `DoctorProfile` props and markup

```ts
export interface DoctorProfileProps {
  variant: "short" | "long";
  content: DoctorProfileContent;
  /** Rendered below the profile block only when variant is "long" — reserved for
   * ATS-091's History + HOW HE PRACTICES cards, unused by this ticket. */
  extended?: ReactNode;
}
```

```tsx
export function DoctorProfile({ variant, content, extended }: DoctorProfileProps) {
  const { eyebrow, name, bio, cta, rating, portrait } = content;
  return (
    <Section spacing="lg">
      <Container className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
        <div className="relative aspect-[639/833] w-full shrink-0 md:w-[45%]">
          <Image src={portrait.src} alt={portrait.alt} fill className="rounded-30 object-cover" />
          <div className="absolute inset-x-6 bottom-6 flex items-center justify-between gap-3 rounded-20 bg-overlay-ink-20 px-6 py-4 backdrop-blur-sm">
            <span className="font-sans text-stat-label text-white">{rating.location}</span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex gap-1">
                {Array.from({ length: rating.value }, (_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-white" />
                ))}
              </span>
              <span className="font-sans text-stat-label text-white">{rating.count}</span>
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-start gap-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-display text-doctor-name text-navy-900">{name}</h2>
          <p className="font-sans text-body-lg text-ink-900">{bio}</p>
          <Button variant="cta" href={cta.href}>
            {cta.label}
          </Button>
        </div>
      </Container>
      {variant === "long" && extended}
    </Section>
  );
}
```

## `app/page.tsx` change

- Import `DoctorProfile` and `doctorProfileContent` from `content/doctor-profile`.
- Render `<DoctorProfile variant="short" content={doctorProfileContent} />` between `<ServicesSection />` and `<FaqSection pageKey="home" />`.

## Acceptance criteria mapping

- [x] Short + long variants via prop — `variant: "short" | "long"` plus an `extended` slot gated on `variant === "long"`; both variants render the identical profile block today (matches Figma), `extended` is the seam ATS-091 will use to actually differentiate them.
- [x] Rating chip overlay on portrait — absolutely positioned `rounded-20 bg-overlay-ink-20` chip over the bottom of the portrait, stars + count + location.
- [x] Responsive stack — `flex-col md:flex-row`, portrait full-width on mobile, `md:w-[45%]` at tablet+, matching `ServiceListRow`'s established pattern.

## Out of scope

- History section + HOW HE PRACTICES cards (ATS-091) — `extended` slot reserved, not implemented.
- Mounting on `/about`, `/services`, or any condition page — none of those routes exist yet.
- Any animation/entrance treatment — no established pattern in `components/` for this.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build`.
- No test framework configured in this repo. Manual, dev server: confirm portrait/chip render correctly, chip text is legible over the photo, CTA button matches its appearance elsewhere (`Button variant="cta"`), and layout looks correct at mobile (375px), tablet, and desktop (1728px) widths, with the column order (portrait first) preserved when stacked.
