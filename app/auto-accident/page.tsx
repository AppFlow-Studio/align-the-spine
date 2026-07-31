import type { Metadata } from "next";

import { ConditionPage } from "@/components/templates/condition-page";
import { autoAccidentCondition } from "@/content/conditions/auto-accident";
import { siteConfig } from "@/content/site";
import { buildMetadata } from "@/lib/seo/metadata";

const condition = autoAccidentCondition;

export const metadata: Metadata = buildMetadata({
  title: `Auto Accident Chiropractor in Deerfield Beach, FL | ${siteConfig.business.name}`,
  description: condition.hero.subhead,
  path: "/auto-accident",
  image: condition.hero.backgroundImage,
});

/** /auto-accident page: renders the shared ConditionPage template
 * (components/templates/condition-page.tsx) fed with autoAccidentCondition,
 * whose flags.isAccidentVariant/extraComparisonRows/pipStat gate the
 * accident-only extras (HowWeHelpSteps band, extra comparison rows, PIP
 * stat chip) automatically. */
export default function AutoAccidentPage() {
  return <ConditionPage condition={condition} />;
}
