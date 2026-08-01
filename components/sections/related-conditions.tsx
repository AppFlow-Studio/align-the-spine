import Link from "next/link";

import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ConditionRelatedLink } from "@/content/conditions/types";
import { cn } from "@/lib/cn";

export interface RelatedConditionsProps {
  items: ConditionRelatedLink[];
  className?: string;
}

/** "Related Conditions and treatments" pill-link row per the Figma
 * condition-page frames — a flat wrap of links to other condition/service
 * pages, styled as bordered pills, each with a trailing arrow. One item per
 * page comes through with `highlighted: true` and renders as a solid navy
 * pill instead. */
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
              className={cn(
                "inline-flex items-center gap-2 rounded-40 border px-6 py-3 font-sans text-stat-label uppercase transition-colors",
                item.highlighted
                  ? "border-navy-900 bg-navy-900 text-white hover:bg-navy-700"
                  : "border-mute-300 text-navy-900 hover:border-navy-900",
              )}
            >
              {item.label}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
