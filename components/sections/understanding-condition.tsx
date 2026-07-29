import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Eyebrow } from "@/components/ui/eyebrow";
import { RedFlagCard } from "@/components/ui/red-flag-card";
import { Section } from "@/components/ui/section";
import { TypeCard } from "@/components/ui/type-card";
import type { Condition } from "@/content/conditions/types";

export interface UnderstandingConditionProps {
  condition: Condition;
  className?: string;
}

/** Static per condition-page-spec §B3 — the red-flag card's call-to-action
 * title never varies by condition, only its bullet list does. */
const RED_FLAGS_TITLE = "See a doctor promptly if you notice:";

/** "Understanding [condition]" educational block per condition-page-spec §B3, §C:
 * eyebrow + intro + supporting image, then a hairline-divided Types/Common Causes
 * split, then a RedFlagCard callout. Fully data-driven off Condition.understanding
 * so every condition page can reuse this one component. */
export function UnderstandingCondition({ condition, className }: UnderstandingConditionProps) {
  const { understanding } = condition;
  const { eyebrow, intro, image, types, causes, redFlags } = understanding;

  return (
    <Section className={className}>
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <p className="font-display text-understanding-intro text-navy-900">{intro}</p>
        </div>

        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image src={image.src} alt={image.alt} fill className="object-cover" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-white" />
        </div>

        <div className="flex flex-col gap-10 md:flex-row md:items-stretch">
          <div className="flex flex-1 flex-col gap-6">
            <h3 className="font-display text-h2 text-navy-900">Types</h3>
            <div className="flex flex-col gap-6">
              {types.map((type) => (
                <TypeCard key={type.name} name={type.name} description={type.desc} />
              ))}
            </div>
          </div>

          <Divider orientation="vertical" className="hidden md:block" />

          <div className="flex flex-1 flex-col gap-6">
            <h3 className="font-display text-h2 text-navy-900">Common Causes</h3>
            <ul className="flex flex-col">
              {causes.map((cause) => (
                <li key={cause}>
                  <Divider />
                  <div className="flex items-center gap-3 py-4">
                    <span
                      aria-hidden="true"
                      className="h-[11px] w-[11px] shrink-0 rounded-full bg-teal-500"
                    />
                    <span className="font-alt text-faq-a text-ink-900">{cause}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <RedFlagCard title={RED_FLAGS_TITLE} bullets={redFlags} />
      </Container>
    </Section>
  );
}
