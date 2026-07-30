import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ServiceCardItem } from "@/components/ui/service-card";
import { ServiceGrid } from "@/components/ui/service-grid";
import type { Condition } from "@/content/conditions/types";

export interface WhatWeTreatProps {
  condition: Condition;
  className?: string;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Condition page's "What we treat" grid per condition-page-spec §B9:
 * reuses the existing ServiceGrid/ServiceCard pair (already built generic
 * for this exact reuse — see ServiceGrid's own doc comment) via a field
 * adapter. ConditionWhatWeTreatItem has no slug/duration and ServiceCard
 * doesn't render either (confirmed by reading the component), so both are
 * synthesized here rather than widening ServiceCardItem for one caller. */
export function WhatWeTreat({ condition, className }: WhatWeTreatProps) {
  const items: ServiceCardItem[] = condition.whatWeTreat.map((item) => ({
    slug: slugify(item.title),
    name: item.title,
    duration: "",
    summary: item.desc,
    image: item.image,
  }));

  return (
    <Section className={className}>
      <Container className="flex flex-col gap-14">
        <SectionHeading eyebrow="What we treat" className="items-center text-center">
          How we treat {condition.name}
        </SectionHeading>
        <ServiceGrid items={items} />
      </Container>
    </Section>
  );
}
