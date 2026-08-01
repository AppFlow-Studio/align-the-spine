import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ConditionRelatedLink } from "@/content/conditions/types";

export interface RelatedConditionsProps {
  items: ConditionRelatedLink[];
  className?: string;
}

/** "Related Conditions and treatments" pill-link row per the Figma
 * condition-page frames — a flat wrap of links to other condition/service
 * pages, styled as bordered pills. */
export function RelatedConditions({ items, className }: RelatedConditionsProps) {
  return (
    <Section className={className}>
      <Container className="flex flex-col gap-8">
        <SectionHeading as="h2" className="text-left">
          Related Conditions and treatments
        </SectionHeading>
        <div className="flex flex-wrap gap-3">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-40 border border-mute-300 px-6 py-3 font-sans text-stat-label uppercase text-navy-900 transition-colors hover:border-navy-900"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
