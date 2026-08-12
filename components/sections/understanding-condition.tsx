import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
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
 * so every condition page can reuse this one component.
 *
 * The top block has two layouts depending on whether `understanding.heading`
 * is set: with it (currently only back-pain, ATS-137), a two-column heading
 * + body + "Understand X" jump link against a labeled anatomy diagram,
 * matching the actual Figma frame; without it, the older single `intro`
 * paragraph doubling as both heading and body, over a full-width photo —
 * kept so neck-pain/whiplash/sciatica (not authored to the fuller layout
 * yet) render exactly as before. */
export function UnderstandingCondition({ condition, className }: UnderstandingConditionProps) {
  const { understanding, name } = condition;
  const { eyebrow, heading, intro, image, types, causes, redFlags } = understanding;

  return (
    <Section className={className}>
      <Container className="flex flex-col gap-10">
        {heading ? (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div className="flex flex-col gap-6">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h2 className="font-display text-h2 text-navy-900">{heading}</h2>
              <p className="max-w-md font-sans text-body-lg text-ink-500">{intro}</p>
              <a
                href="#types"
                className="group inline-flex w-fit items-center gap-2 border-t border-mute-300 pt-4 font-sans text-stat-label uppercase tracking-[1.25px] text-navy-900 transition-colors hover:text-navy-700"
              >
                Understand {name}
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
            <div className="relative mx-auto aspect-[551/660] w-full max-w-md overflow-hidden lg:mx-0">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6">
              <Eyebrow>{eyebrow}</Eyebrow>
              <p className="font-display text-understanding-intro text-navy-900">{intro}</p>
            </div>

            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image src={image.src} alt={image.alt} fill className="object-cover" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-white" />
            </div>
          </>
        )}

        <div
          id="types"
          className="flex flex-col gap-10 scroll-mt-[120px] lg:flex-row lg:items-stretch"
        >
          <div className="flex flex-1 flex-col gap-6">
            <h3 className="font-display text-h2 text-navy-900">Types</h3>
            <div className="flex flex-col gap-6">
              {types.map((type) => (
                <TypeCard key={type.name} name={type.name} description={type.desc} />
              ))}
            </div>
          </div>

          <Divider orientation="vertical" className="hidden lg:block" />

          <div className="flex flex-1 flex-col gap-6">
            <h3 className="font-display text-h2 text-navy-900">Common Causes</h3>
            <ul className="flex flex-col">
              {causes.map((cause) => (
                <li key={cause}>
                  <Divider />
                  <div className="flex items-center gap-3 py-4">
                    <span
                      aria-hidden="true"
                      className="h-[11px] w-[11px] shrink-0 rounded-full bg-[#58A0A0]"
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
