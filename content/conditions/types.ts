import type { ComparisonRow } from "@/content/comparison-table";

/** Shared default for `accident.smallprint` — every condition currently
 * uses this exact wording; keep it exported so a future compliance edit
 * is a one-file change instead of five. Individual conditions may still
 * override `smallprint` with condition-specific wording if ever needed. */
export const DEFAULT_ACCIDENT_SMALLPRINT =
  "Missing this window means you may have to pay thousands for medical care out of your own pocket.";

export interface ConditionHero {
  /** Small uppercase chip above the H1 (Hero's `conditionChip`), e.g. "NECK PAIN". */
  eyebrowChip: string;
  h1: string;
  subhead: string;
  backgroundImage: { src: string; alt: string };
}

export interface ConditionType {
  name: string;
  desc: string;
}

export interface ConditionUnderstanding {
  /** Full eyebrow line, e.g. "Understanding Neck Pain" — rendered as-is. */
  eyebrow: string;
  intro: string;
  image: { src: string; alt: string };
  types: ConditionType[];
  causes: string[];
  /** Flat list of warning symptoms. The card's static "See a doctor
   * promptly if you notice:" title lives in UnderstandingCondition, not
   * here — it never varies by condition. */
  redFlags: string[];
}

export interface ConditionAccident {
  headline: string;
  body: string;
  smallprint: string;
}

export interface ConditionFaqItem {
  q: string;
  a: string;
}

export interface ConditionFaq {
  /** Header tail: "Everything you need to know about {headerTail}" */
  headerTail: string;
  items: ConditionFaqItem[];
}

export interface ConditionWhatWeTreatItem {
  title: string;
  desc: string;
  image: { src: string; alt: string };
  href: string;
}

export interface ConditionFlags {
  /** True only for the auto-accident page — gates the extra comparison
   * rows, the PIP stat, and (in the future ConditionPage template,
   * ATS-061) the HOW WE HELP section already built in
   * `content/auto-accident.ts` / `components/sections/how-we-help-steps.tsx`. */
  isAccidentVariant: boolean;
  /** True when `comparisonRows` includes the auto-accident-only rows.
   * See the note on `Condition.comparisonRows` — this flag and
   * `ComparisonTable`'s own `variant` prop currently overlap and should
   * be reconciled by whichever template consumes this schema. */
  extraComparisonRows: boolean;
  /** Florida PIP coverage stat, shown in Hero's left column on the
   * auto-accident page only (Hero's `stat` prop) — value + the full
   * descriptive sentence per the Figma hero, e.g. "$10,000" / "in PIP
   * coverage available with an Emergency Medical Condition determination —
   * $2,500 without one". */
  pipStat?: { value: string; description: string };
}

export interface Condition {
  slug: string;
  name: string;
  hero: ConditionHero;
  understanding: ConditionUnderstanding;
  accident: ConditionAccident;
  /** Pre-resolved rows this condition's comparison table should render
   * (base rows, plus the auto-accident extras when applicable — see
   * auto-accident.ts). Note: `components/sections/comparison-table.tsx`
   * currently resolves its own rows internally via a `variant` prop
   * rather than accepting a `rows` prop — the future ConditionPage
   * template should reconcile these two representations (adopt one),
   * not wire both. */
  comparisonRows: ComparisonRow[];
  faq: ConditionFaq;
  whatWeTreat: ConditionWhatWeTreatItem[];
  flags: ConditionFlags;
}
