import type { ComparisonRow } from "@/content/comparison-table";

/** Shared default for `accident.smallprint` — every condition currently
 * uses this exact wording; keep it exported so a future compliance edit
 * is a one-file change instead of five. Individual conditions may still
 * override `smallprint` with condition-specific wording if ever needed. */
export const DEFAULT_ACCIDENT_SMALLPRINT =
  "Missing this window means you may have to pay thousands for medical care out of your own pocket.";

export interface ConditionHero {
  /** Plain-text eyebrow line above the H1 (Hero's `eyebrow` prop — not the
   * colored `conditionChip` badge, despite the field's name; the actual
   * Figma condition-page heroes render this as a full sentence, e.g. "Back
   * pain after a car accident?", matching the same Eyebrow treatment
   * /auto-accidents and /about already use). Field name kept for backward
   * compatibility with existing condition content. */
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
  /** Short H2, e.g. "Back pain has a lot of possible causes. Finding yours
   * is the first step to fixing it." Optional — when present, the top of
   * UnderstandingCondition switches to the fuller Figma layout (heading +
   * body two-up against a labeled anatomy diagram, plus an "UNDERSTAND X"
   * jump link) instead of the older single `intro` paragraph standing in
   * as both heading and body. */
  heading?: string;
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

export interface ConditionFeelsLikeItem {
  title: string;
  desc: string;
  /** Optional "LEARN MORE →" jump/link target under the card. */
  learnMoreHref?: string;
}

export interface ConditionWarningBullet {
  label: string;
  /** Omitted for the most severe bullet (e.g. "seek emergency care") —
   * rendered as plain text with no link, matching the Figma treatment
   * where only the non-emergency symptoms are clickable. */
  href?: string;
}

export interface ConditionWarning {
  heading: string;
  image: { src: string; alt: string };
  bullets: ConditionWarningBullet[];
}

export interface ConditionWhenToSee {
  heading: string;
  body: string;
  image: { src: string; alt: string };
}

export interface ConditionTreatmentItem {
  title: string;
  desc: string;
  image: { src: string; alt: string };
  /** Short session/logistics note, e.g. "1 hr" or "Check eligibility". */
  meta: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ConditionRelatedLink {
  label: string;
  href: string;
  /** Renders the solid navy pill instead of the bordered default — the
   * Figma related-conditions row highlights one link per page (e.g. "Auto
   * Accident Injuries" on /conditions/back-pain) rather than styling them
   * all identically. */
  highlighted?: boolean;
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
  /** The following 4 are optional additions (ATS-137) matching the fuller
   * Figma condition-page frames — undefined on conditions that haven't been
   * authored to this depth yet (neck-pain, whiplash, sciatica), whose
   * sections are conditionally skipped by ConditionPage in that case. */
  feelsLike?: ConditionFeelsLikeItem[];
  whenToSee?: ConditionWhenToSee;
  /** Condition-specific detailed treatment cards ("HOW WE TREAT" in Figma —
   * distinct from `whatWeTreat`, which ConditionPage no longer renders
   * directly now that the generic "Common accident injuries we treat" grid
   * is just the shared AccidentInjuries component). */
  howWeTreat?: ConditionTreatmentItem[];
  relatedConditions?: ConditionRelatedLink[];
}
