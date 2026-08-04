import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import type { ConditionRelatedLink, ConditionWhenToSee } from "@/content/conditions/types";
import { cn } from "@/lib/cn";

export interface CausesAndWhenToSeeProps {
  causesHeading: string;
  causes: string[];
  relatedHeading: string;
  relatedLinks: ConditionRelatedLink[];
  whenToSee: ConditionWhenToSee;
  className?: string;
}

/** Mid-page "Common Causes" + "Related [Condition] Conditions" + "When to
 * See a Chiropractor for X" section per the Figma condition-page frames —
 * a merged two-column layout distinct from both UnderstandingCondition
 * (top intro block) and the full-width RelatedConditions row at the
 * bottom of the page: left column stacks the arrow-bulleted causes list
 * over 3 stacked related-condition pills (one highlighted), right column
 * is the when-to-see heading/body/photo. */
export function CausesAndWhenToSee({
  causesHeading,
  causes,
  relatedHeading,
  relatedLinks,
  whenToSee,
  className,
}: CausesAndWhenToSeeProps) {
  return (
    <Section className={className}>
      <Container className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-14">
          <div className="flex flex-col gap-6">
            <h3 className="font-display text-h2 text-navy-900">{causesHeading}</h3>
            <ul className="flex flex-col gap-4">
              {causes.map((cause) => (
                <li key={cause} className="flex items-center gap-3">
                  <ArrowRightIcon className="h-4 w-4 shrink-0 text-teal-500" />
                  <span className="font-alt text-faq-a text-ink-900">{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="font-display text-h2 text-navy-900">{relatedHeading}</h3>
            <div className="flex flex-col gap-4">
              {relatedLinks.map((link) => (
                <RelatedPill key={link.label} link={link} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="font-display text-h2 text-navy-900">{whenToSee.heading}</h2>
          <p className="font-sans text-body-lg text-ink-500">{whenToSee.body}</p>
          <div className="relative aspect-[906/506] w-full overflow-hidden">
            <Image
              src={whenToSee.image.src}
              alt={whenToSee.image.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}

function RelatedPill({ link }: { link: ConditionRelatedLink }) {
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-between gap-3 border px-6 py-4 font-sans text-stat-label uppercase transition-colors",
        link.highlighted
          ? "border-navy-900 bg-navy-900 text-white hover:bg-navy-700"
          : "border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white",
      )}
    >
      {link.label}
      <ArrowRightIcon className="h-4 w-4 shrink-0" />
    </Link>
  );
}
