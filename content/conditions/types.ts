import type { ComparisonRow } from "@/content/comparison-table";

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
  /** True when `comparisonRows` includes the auto-accident-only rows. */
  extraComparisonRows: boolean;
  /** Florida PIP coverage stat, shown only on the auto-accident page. */
  pipStat?: { label: string; value: string };
}

export interface Condition {
  slug: string;
  name: string;
  hero: ConditionHero;
  understanding: ConditionUnderstanding;
  accident: ConditionAccident;
  comparisonRows: ComparisonRow[];
  faq: ConditionFaq;
  whatWeTreat: ConditionWhatWeTreatItem[];
  flags: ConditionFlags;
}
