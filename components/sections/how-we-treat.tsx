import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ConditionTreatmentItem } from "@/content/conditions/types";
import { siteConfig } from "@/content/site";

export interface HowWeTreatProps {
  items: ConditionTreatmentItem[];
  /** Main heading text. Defaults to back-pain's own copy, where it's a
   * short title with a separate `sub` line below it. Some pages' Figma
   * frames (e.g. concussion) instead render the "Treatment focused on the
   * source..." line itself as this heading, with no `sub` at all. */
  heading?: string;
  sub?: string;
  className?: string;
}

/** Condition-specific "HOW WE TREAT" detailed grid per the Figma
 * condition-page frames — distinct from the generic AccidentInjuries grid:
 * 2-up image cards with a longer description, a session-length/eligibility
 * note, and a per-item CTA (e.g. "Book now" vs. "Check eligibility" for the
 * home-visit option). */
export function HowWeTreat({
  items,
  heading = "How we treat it",
  sub = "Treatment focused on the source, not the symptom.",
  className,
}: HowWeTreatProps) {
  return (
    <Section className={className}>
      <Container className="flex flex-col gap-14">
        <SectionHeading eyebrow="How we treat" sub={sub}>
          {heading}
        </SectionHeading>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="group flex flex-col gap-6">
              <div className="relative aspect-[772/500] w-full overflow-hidden">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-h2 text-navy-900 transition-colors duration-300 group-hover:text-teal-500">
                  {item.title}
                </h3>
                <hr className="border-t border-navy-900 transition-colors duration-300 group-hover:border-teal-500" />
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
