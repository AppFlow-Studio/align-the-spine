import { backPainCondition } from "@/content/conditions/back-pain";
import { neckPainCondition } from "@/content/conditions/neck";
import { sciaticaCondition } from "@/content/conditions/sciatica";
import type { Condition } from "@/content/conditions/types";
import { whiplashCondition } from "@/content/conditions/whiplash";

/** The 4 condition-page routes this ticket covers (ATS-061). auto-accident.ts
 * is intentionally excluded — /auto-accidents is a separate top-level route
 * for a future ticket, not part of this dynamic [slug] group (see
 * docs/superpowers/specs/2026-07-30-condition-page-template-design.md). */
export const conditionsBySlug: Record<string, Condition | undefined> = {
  [neckPainCondition.slug]: neckPainCondition,
  [whiplashCondition.slug]: whiplashCondition,
  [backPainCondition.slug]: backPainCondition,
  [sciaticaCondition.slug]: sciaticaCondition,
};
