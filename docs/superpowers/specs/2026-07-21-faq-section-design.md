# FaqSection — Design

**Ticket:** Epic 4 – Sections · Track: Dev A · Est: S · Depends on: ATS-023
**Source:** ticket text (pasted directly). References condition-page-spec §B11, §C (not present in this repo — §B11 was already treated as the ticket text by ATS-023's own `FaqAccordion` doc comment; §C's "header tail + questions vary per page" has no concrete per-page copy available, so this design introduces the minimal structure to hold it rather than guessing content).

## Summary

`FaqSection`: heading (eyebrow + centered "Everything you need to know about [tail]") + `FaqAccordion` (ATS-023), fed by a per-page entry in `content/faqs.ts`. Emits a `FAQPage` JSON-LD `<script>` tag inline, sourced from the same per-page data so structured data can never drift from visible content.

## Resolved open decisions

- **`faqs.ts` restructuring:** currently a flat `FAQ[]` with no per-page keying, and no condition-page routes exist yet in `app/` (only `app/page.tsx` for home). Restructured to `Record<pageKey, PageFaqs>` now, seeded with a single `"home"` entry carrying the existing 6 placeholder FAQs. Future condition pages add their own key — no migration needed later.
- **Home page tail text:** `"your spine health"` → renders "Everything you need to know about your spine health".
- **JSON-LD placement:** rendered inline inside `FaqSection` itself (not a separate hook called from page-level metadata) — keeps the visible accordion and the structured data reading from the exact same `items` array, so they can't diverge. This is the first structured-data implementation in the repo; no library installed or needed, hand-rolled per schema.org's `FAQPage` shape.
- **Centering:** no changes to `SectionHeading`/`Eyebrow` — `SectionHeading` already forwards `className` to its root `flex flex-col` div, so `className="items-center text-center"` at the call site centers eyebrow + heading without touching the shared component (which currently has zero other consumers, so this is also its first real usage).
- **Homepage wiring:** `<FaqSection pageKey="home" />` mounted in `app/page.tsx` below `<Hero variant="home" ... />`, so the section is live and visually verifiable, matching how ATS-023's `FaqAccordion` was manually verified.

## Architecture

```
content/faqs.ts                    — restructured: FAQ, PageFaqs, faqsByPage (keyed record)
components/sections/faq-section.tsx — new: <FaqSection pageKey />
app/page.tsx                        — mount FaqSection below Hero
```

- `FaqSection` is a server component (no `"use client"`) — only its child `FaqAccordion` needs interactivity, unchanged from ATS-023.
- No new npm dependencies.

## `content/faqs.ts` (restructured)

```ts
export interface FAQ {
  question: string;
  answer: string;
}

export interface PageFaqs {
  /** Header tail: "Everything you need to know about {tail}" */
  tail: string;
  items: FAQ[];
}

export const faqsByPage: Record<string, PageFaqs> = {
  home: {
    tail: "your spine health",
    items: [
      // existing 6 FAQ entries, unchanged
    ],
  },
};
```

`FaqAccordion` (`components/ui/faq-accordion.tsx`) already imports `FAQ` from this file and only depends on that type — untouched, still compiles against the restructured file.

## `FaqSection` props and markup

```ts
export interface FaqSectionProps {
  pageKey: keyof typeof faqsByPage;
}
```

```tsx
export function FaqSection({ pageKey }: FaqSectionProps) {
  const { tail, items } = faqsByPage[pageKey];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <Section>
      <SectionHeading
        eyebrow="Frequently asked questions"
        className="mx-auto max-w-2xl items-center text-center"
      >
        Everything you need to know about {tail}
      </SectionHeading>
      <FaqAccordion items={items} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </Section>
  );
}
```

- `SectionHeading`'s default `tone="navy-800"` resolves to `text-navy-800` = `#2b3565`, and `text-display` is already the "Newsreader Medium 65/68" token — both reused as-is, satisfying the ticket's typography spec without hardcoding.
- The `<` escape on serialization is defense-in-depth against `</script>` breakout if FAQ copy ever contains a literal `<`; current content is static and trusted, but this costs nothing and removes the concern permanently.

## `app/page.tsx` change

- Import `FaqSection`, render `<FaqSection pageKey="home" />` immediately after `<Hero variant="home" ... />`.

## Acceptance criteria mapping

- [x] Questions/answers from faqs.ts per page key — `faqsByPage[pageKey].items` passed to `FaqAccordion`.
- [x] Header tail swaps per page — `faqsByPage[pageKey].tail` interpolated into the heading; adding a page is adding a record entry, no component change.
- [x] Structured-data hook exposed — `FAQPage` JSON-LD rendered inline, derived from the same `items` used for display.

## Out of scope

- Any condition-page routes/content — none exist yet in this repo; `pageKey` is a manually-passed prop rather than derived from a route.
- Fixing `FaqAccordion`'s internal `faq-button-${index}`/`faq-panel-${index}` id collision risk if two instances were ever mounted on one page — not a live bug today (one `FaqSection` per page), left alone per YAGNI.
- Any SEO/metadata library installation — hand-rolled JSON-LD is sufficient for a single script tag.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build`.
- No test framework configured in this repo (confirmed: only `node_modules`-internal test files exist). Manual, dev server: confirm eyebrow + heading render centered with correct tone/size, accordion behaves as it did under ATS-023, and the rendered HTML contains a `<script type="application/ld+json">` tag whose JSON parses to the same 6 Q/A pairs shown on screen.
