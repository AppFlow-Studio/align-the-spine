import { sciaticaCondition } from "@/content/conditions/sciatica";
import type { Condition } from "@/content/conditions/types";
import { whiplashCondition } from "@/content/conditions/whiplash";

/** The remaining condition-page routes still served by the generic [slug]
 * template (ATS-061). auto-accident.ts is intentionally excluded — /auto-
 * accident is a separate, already-built top-level route, not part of this
 * dynamic [slug] group. back-pain and neck-pain are also excluded as of
 * ATS-137's full-fidelity pass: each is now its own dedicated page
 * (app/conditions/back-pain/page.tsx, app/conditions/neck-pain/page.tsx),
 * per the user's request to move every condition off this shared template
 * one at a time rather than force them all through one generic schema.
 * whiplash/sciatica will move the same way once their own design
 * screenshots arrive. */
export const conditionsBySlug: Record<string, Condition | undefined> = {
  [whiplashCondition.slug]: whiplashCondition,
  [sciaticaCondition.slug]: sciaticaCondition,
};
