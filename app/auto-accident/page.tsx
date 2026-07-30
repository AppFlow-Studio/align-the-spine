import type { Metadata } from "next";

import { ConditionPage } from "@/components/templates/condition-page";
import { autoAccidentCondition } from "@/content/conditions/auto-accident";
import { siteConfig } from "@/content/site";

const condition = autoAccidentCondition;
const title = `${condition.hero.h1} | ${siteConfig.business.name}`;
const description = condition.hero.subhead;
const url = `${siteConfig.siteUrl}/auto-accident`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    images: [{ url: condition.hero.backgroundImage.src, alt: condition.hero.backgroundImage.alt }],
  },
};

/** /auto-accident page: renders the shared ConditionPage template
 * (components/templates/condition-page.tsx) fed with autoAccidentCondition,
 * whose flags.isAccidentVariant/extraComparisonRows/pipStat gate the
 * accident-only extras (HowWeHelpSteps band, extra comparison rows, PIP
 * stat chip) automatically. */
export default function AutoAccidentPage() {
  return <ConditionPage condition={condition} />;
}
