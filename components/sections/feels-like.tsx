import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ConditionFeelsLikeItem, ConditionWarning } from "@/content/conditions/types";
import { cn } from "@/lib/cn";

export interface FeelsLikeProps {
  items: ConditionFeelsLikeItem[];
  /** "Not all X feels the same" heading — condition name is interpolated by
   * the caller since this component has no Condition dependency itself. */
  heading: string;
  /** Optional photo + "See a doctor promptly if you notice:" card below the
   * grid, per the Figma condition-page frames — most bullets link out,
   * the most severe one (emergency-care) renders as plain text. */
  warning?: ConditionWarning;
  className?: string;
}

/** "What [condition] feels like" 4-card grid per the Figma condition-page
 * frames (e.g. back-pain's "Not all back pain feels the same"): a short
 * title + one-line description + optional "LEARN MORE" link per card, no
 * image — same TypeCard text treatment reused for the title/description
 * pairing. Whiplash is the one exception: its equivalent 4-card grid is a
 * full-bleed dark photo band (see FeelsLikeBand) positioned right after
 * Understanding, not this light in-flow section — only its warning card
 * (via SymptomWarningCard, rendered separately by the page) reuses this
 * file's layout. */
export function FeelsLike({ items, heading, warning, className }: FeelsLikeProps) {
  return (
    <Section className={className}>
      <Container className="flex flex-col gap-14">
        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow="What it feels like">{heading}</SectionHeading>
          <div className="grid grid-cols-1 gap-5 border-t border-mute-300 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-3 hover:bg-[#f8f8f8] p-2 group transition-colors duration-300"
              >
                <h3 className="font-display text-type-name text-navy-900 group-hover:text-teal-500 transition-colors duration-300">
                  {item.title}
                </h3>
                <div className="w-full h-px bg-navy-900 group-hover:bg-[#58A0A0] transition-colors duration-300" />
                <p className="font-alt text-faq-a text-ink-500">{item.desc}</p>
                {item.learnMoreHref && (
                  <Link
                    href={item.learnMoreHref}
                    className="inline-flex w-fit items-center gap-2 font-sans text-stat-label uppercase text-navy-900 group-hover:text-teal-500 hover:text-navy-700 underline decoration-transparent group-hover:decoration-navy-700 underline-offset-4 transition-colors duration-300"
                  >
                    Learn more
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {warning && <SymptomWarningCard warning={warning} />}
      </Container>
    </Section>
  );
}

export interface SymptomWarningCardProps {
  warning: ConditionWarning;
  className?: string;
}

/** Photo + "See a doctor promptly if you notice:" card per the Figma
 * condition-page frames — most bullets link out, the most severe one
 * (emergency-care) renders as plain text. Extracted from FeelsLike so
 * pages that position this card separately from the feels-like grid (e.g.
 * whiplash, where the grid moved into FeelsLikeBand right after
 * Understanding) can still render it in its own spot on the page. */
export function SymptomWarningCard({ warning, className }: SymptomWarningCardProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-0 overflow-hidden lg:grid-cols-2", className)}>
      <div className="relative aspect-[4/3] w-full lg:aspect-auto">
        <Image src={warning.image.src} alt={warning.image.alt} fill className="object-cover" />
      </div>
      <div className="flex flex-col justify-center gap-6 bg-overlay-teal-12 p-8 md:p-12">
        <h3 className="font-display text-3xl text-navy-900">{warning.heading}</h3>
        <ul className="flex flex-col gap-4">
          {warning.bullets.map((bullet) =>
            bullet.href ? (
              <li key={bullet.label}>
                <Link
                  href={bullet.href}
                  className="group inline-flex items-center gap-2 font-sans text-body-lg text-teal-500 transition-colors hover:text-teal-500/80"
                >
                  {bullet.label}
                  <ArrowRightIcon className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            ) : (
              <li key={bullet.label} className="font-sans text-body-lg text-ink-900">
                {bullet.label}
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}
