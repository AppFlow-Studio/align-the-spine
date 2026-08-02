import dynamic from "next/dynamic";

import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Condition } from "@/content/conditions/types";
import type { FAQ } from "@/content/faqs";

/** Code-split (Epic 12): FaqAccordion's Framer Motion out of the initial
 * page JS bundle. */
const FaqAccordion = dynamic(() =>
  import("@/components/ui/faq-accordion").then((m) => m.FaqAccordion),
);

export interface ConditionFaqProps {
  condition: Condition;
  className?: string;
}

/** FAQ section per condition-page-spec §B11/§C, condition-data-driven
 * counterpart to FaqSection: FaqSection is keyed by a static pageKey
 * lookup with {question, answer} items, while Condition.faq.items is
 * {q, a} — mapped inline here rather than widening FaqSection's prop union
 * for one caller. Ships its own FAQPage JSON-LD from the same items shown
 * on screen, per Google's requirement that structured data match visible
 * content (same pairing FaqSection already establishes). */
export function ConditionFaq({ condition, className }: ConditionFaqProps) {
  const items: FAQ[] = condition.faq.items.map(({ q, a }) => ({ question: q, answer: a }));

  return (
    <Section className={className}>
      <Container className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Frequently asked questions"
          className="mx-auto max-w-2xl items-center text-center"
        >
          Everything you need to know about {condition.faq.headerTail}
        </SectionHeading>
        <div className="mx-auto w-full max-w-3xl">
          <FaqAccordion items={items} />
        </div>
        <FaqJsonLd items={items} />
      </Container>
    </Section>
  );
}
