# Service presentation components — Design

**Ticket:** Epic 4 – Sections · Track: Dev A · Est: M · Depends on: ATS-022, ATS-020
**Source:** ticket text (pasted directly). References condition-page-spec §B9 and "services artboards" — neither present in this repo. No Figma file was opened for this ticket; layout/sizing decisions below are inferred from the ticket's numeric specs plus this repo's existing tokens/components, and confirmed with the user (see "Resolved open decisions").

## Summary

Three presentational components fed by `content/services.ts`: `ServiceCard` (image + title + description + "Book now" link, used in a grid), `ServiceGrid` (responsive 3×2 grid of cards), and `ServiceListRow` (single alternating list row with a "Book" link). A new `ServicesSection` composes `ServiceListRow` + `Divider` into the homepage's services list — the concrete, live usage that exercises all three components end to end.

## Resolved open decisions

- **Page-wiring scope:** no `/services` route or condition-page route exists yet in `app/` (only `app/page.tsx`). `ServiceGrid`/`ServiceCard` are built fully generic and content-driven (ready for a future Services page and for condition's "What we treat" grid) but are **not** mounted anywhere by this ticket. `ServiceListRow` **is** wired into a real `ServicesSection` on the home page, since the ticket itself notes ServiceListRow is the "homepage list layout" — this is the concrete usage that satisfies "implemented from data" without inventing a page that doesn't exist yet.
- **Generic item shape:** `ServiceGrid`/`ServiceCard`/`ServiceListRow` accept a small structural type (`slug`, `name`, `summary`, `image: { src, alt }`), not the `Service` interface by name — so a later ticket can pass `Condition` data (once it grows an `image` field) into the same components for the "What we treat" grid, per AC bullet 2, with zero changes to these components.
- **Content model:** `content/services.ts`'s `Service` gains an `image: { src: string; alt: string }` field; `slug`/`name`/`summary` unchanged (`summary` doubles as the card/row description — no separate `description` field, avoids duplicate copy). Populated with 6 real services backed by existing images in `public/figma-exports/`: Chiropractic Adjustments (`drabeadjust.png`), Spinal Decompression & Traction (`drabe-traction_compression.png`), Cupping Therapy (`cupping-drabe.png`), Soft Tissue Therapy (`drabe-softtissue.png`), At-Home Visits (`athome-drabe.png`), New Patient Exam & X-Ray (`drabe-xray-newpt.png`).
- **Booking link:** no per-service booking route exists. Both "Book now" (card) and "Book" (list row) link to the existing `siteConfig.bookingCta.href` ("/book") — same pattern as the nav's booking CTA.
- **"Book now" / "Book" styling:** reuses the **existing** `Button variant="ghost"` (`components/ui/button.tsx`) — already Geist/`alt-label` 22, `text-navy-900` (`#253067`), trailing arrow. No new button variant needed; only the label text differs ("Book now" vs "Book").
- **New type tokens:** `card-title` (35px/42px, weight 500 — Newsreader Medium; kept distinct from the existing `h2` token, which is weight 600) and `card-body` (22px/38px, weight 400 — Poppins, matches spec exactly).
- **Card sizing:** the spec's "~507×618" is treated as a proportion reference at one breakpoint, not a hard pixel lock — `ServiceCard` uses a fixed-ish aspect ratio for the image plus fluid width, so `ServiceGrid` can actually collapse responsively (AC bullet 3) instead of overflowing fixed-width cards.
- **Alternating direction (`ServiceListRow`):** image side alternates left/right per row index (row 0 image-left, row 1 image-right, ...), not background tint — user's choice.

## Architecture

```
content/services.ts                    — Service gains `image`; 6 real entries added
components/ui/service-card.tsx         — new: <ServiceCard item />
components/ui/service-grid.tsx         — new: <ServiceGrid items />
components/ui/service-list-row.tsx     — new: <ServiceListRow item reverse? />
components/sections/services-section.tsx — new: <ServicesSection /> (ServiceListRow × 6 + Divider)
tailwind.config.ts                     — add card-title, card-body fontSize tokens
app/page.tsx                           — mount <ServicesSection /> below <FaqSection />
```

All new components are server components (no interactivity, no `"use client"`), consistent with `FaqSection`/`Hero`.

## Shared item type

Declared once in `service-card.tsx` and imported by `service-grid.tsx` / `service-list-row.tsx`, so any object with this shape works (not coupled to `content/services.ts`'s `Service` by name):

```ts
export interface ServiceCardItem {
  slug: string;
  name: string;
  summary: string;
  image: { src: string; alt: string };
}
```

`content/services.ts`:

```ts
export interface Service {
  slug: string;
  name: string;
  summary: string;
  image: { src: string; alt: string };
}

export const services: Service[] = [
  // 6 entries — Chiropractic Adjustments, Spinal Decompression & Traction,
  // Cupping Therapy, Soft Tissue Therapy, At-Home Visits, New Patient Exam & X-Ray
];
```

## `ServiceCard`

```ts
export interface ServiceCardProps {
  item: ServiceCardItem;
  className?: string;
}
```

```tsx
<Card radius={20} shadow="card" className="flex flex-col overflow-hidden">
  <div className="relative aspect-[507/360] w-full">
    <Image src={item.image.src} alt={item.image.alt} fill className="rounded-15 object-cover" />
  </div>
  <div className="flex flex-1 flex-col gap-3 p-8">
    <h3 className="font-display text-card-title text-navy-800">{item.name}</h3>
    <p className="font-sans text-card-body text-ink-900">{item.summary}</p>
    <Button variant="ghost" href={siteConfig.bookingCta.href} className="mt-auto w-fit">
      Book now
    </Button>
  </div>
</Card>
```

## `ServiceGrid`

```ts
export interface ServiceGridProps {
  items: ServiceCardItem[];
  className?: string;
}
```

```tsx
<div className={cn("grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3", className)}>
  {items.map((item) => (
    <ServiceCard key={item.slug} item={item} />
  ))}
</div>
```

Responsive collapse: 1 col (mobile) → 2 col (`sm:`) → 3 col (`lg:`), matching the ticket's "3×2 responsive grid" at desktop and satisfying AC bullet 3.

## `ServiceListRow`

```ts
export interface ServiceListRowProps {
  item: ServiceCardItem;
  reverse?: boolean;
  className?: string;
}
```

```tsx
<div
  className={cn(
    "flex flex-col gap-6 py-8 md:flex-row md:items-center md:gap-10",
    reverse && "md:flex-row-reverse",
    className,
  )}
>
  <div className="relative aspect-[4/3] w-full shrink-0 md:w-[360px]">
    <Image src={item.image.src} alt={item.image.alt} fill className="rounded-15 object-cover" />
  </div>
  <div className="flex flex-1 flex-col items-start gap-3">
    <h3 className="font-display text-card-title text-navy-800">{item.name}</h3>
    <p className="font-sans text-card-body text-ink-900">{item.summary}</p>
    <Button variant="ghost" href={siteConfig.bookingCta.href}>
      Book
    </Button>
  </div>
</div>
```

No `Divider` inside the row itself — the consumer renders one between rows, matching how `Divider` is used as a standalone primitive elsewhere in the repo.

## `ServicesSection` (new, homepage wiring)

```tsx
export function ServicesSection() {
  return (
    <Section>
      <Container className="flex flex-col gap-2">
        <SectionHeading
          eyebrow="Our services"
          className="mx-auto max-w-2xl items-center text-center"
        >
          How we help you move without pain
        </SectionHeading>
        {services.map((service, i) => (
          <Fragment key={service.slug}>
            {i > 0 && <Divider />}
            <ServiceListRow item={service} reverse={i % 2 === 1} />
          </Fragment>
        ))}
      </Container>
    </Section>
  );
}
```

Mounted in `app/page.tsx` immediately after `<FaqSection pageKey="home" />`.

## Acceptance criteria mapping

- [x] Grid + card + list-row all implemented from data — all three read from `content/services.ts` via the shared `ServiceCardItem` shape.
- [x] Used by condition "What we treat" grid (spec §B9) — `ServiceGrid`/`ServiceCard` depend only on the structural `ServiceCardItem` type, not `Service` by name, so a future condition page can pass condition data (once it has an `image` field) with no component changes. No condition route exists yet to mount it in, so this ticket cannot demonstrate live condition-page usage — that's the follow-up page-composition ticket's job.
- [x] Responsive grid collapse — `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.

## Out of scope

- Any `/services` page route or condition-page route — neither exists in `app/` yet.
- Per-service booking deep links — all "Book"/"Book now" point at the single site-wide `siteConfig.bookingCta.href`.
- Adding an `image` field to `content/conditions/types.ts` / seeding condition content — that belongs to the ticket that actually builds the condition page.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build`.
- No test framework configured in this repo. Manual, dev server: confirm `ServicesSection` renders 6 alternating rows with dividers between them on the home page, images/titles/descriptions/Book links match `content/services.ts`, and the grid collapses 3→2→1 columns when resizing (verify by temporarily rendering `<ServiceGrid items={services} />` in the browser, since it isn't mounted on any page by this ticket).
