import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ConditionTreatmentItem } from "@/content/conditions/types";
import { siteConfig } from "@/content/site";

export interface HowWeTreatProps {
  items: ConditionTreatmentItem[];
  className?: string;
}

/** Condition-specific "HOW WE TREAT" detailed grid per the Figma
 * condition-page frames — distinct from the generic AccidentInjuries grid:
 * 2-up image cards with a longer description, a session-length/eligibility
 * note, and a per-item CTA (e.g. "Book now" vs. "Check eligibility" for the
 * home-visit option). */
export function HowWeTreat({ items, className }: HowWeTreatProps) {
  return (
    <Section className={className}>
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="How we treat"
          sub="Treatment focused on the source, not the symptom."
        >
          How we treat it
        </SectionHeading>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="flex flex-col gap-6">
              <div className="relative aspect-[772/500] w-full overflow-hidden">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-3 border-t border-mute-300 pt-6">
                <h3 className="font-display text-h2 text-navy-900">{item.title}</h3>
                <p className="font-sans text-card-body">
                  <span className="text-ink-500">
                    {item.meta} | Contact us {siteConfig.business.phone}
                  </span>
                  <br />
                  <span className="text-ink-900">{item.desc}</span>
                </p>
              </div>
              <Button variant="ghost" href={item.ctaHref} className="w-fit">
                {item.ctaLabel}
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
