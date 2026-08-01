import { neckPainCondition } from "@/content/conditions/neck";
import { sciaticaCondition } from "@/content/conditions/sciatica";
import type { Condition } from "@/content/conditions/types";
import { whiplashCondition } from "@/content/conditions/whiplash";

/** The remaining condition-page routes still served by the generic [slug]
 * template (ATS-061). auto-accident.ts is intentionally excluded — /auto-
 * accident is a separate, already-built top-level route, not part of this
 * dynamic [slug] group. back-pain is also excluded as of ATS-137's
 * full-fidelity pass: it's now its own dedicated page at
 * app/conditions/back-pain/page.tsx (content/back-pain-page.ts), per the
 * user's request to move every condition off this shared template one at a
 * time rather than force them all through one generic schema. neck-pain/
 * whiplash/sciatica will move the same way once their own design
 * screenshots arrive. */
export const conditionsBySlug: Record<string, Condition | undefined> = {
  [neckPainCondition.slug]: neckPainCondition,
  [whiplashCondition.slug]: whiplashCondition,
  [sciaticaCondition.slug]: sciaticaCondition,
};
