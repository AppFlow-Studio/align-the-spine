import type { ReactNode } from "react";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import type { ConditionRelatedLink } from "@/content/conditions/types";
import { cn } from "@/lib/cn";

export interface TypeCategoryItem {
  name: string;
  /** ReactNode, not string — some conditions' descriptions carry their own
   * inline links (e.g. sciatica's "Herniated disc" item). */
  description: ReactNode;
  /** Renders as a bordered, left-accented callout with a trailing arrow
   * instead of plain stacked text — matches the Figma "Cervical herniated
   * disc" treatment on neck-pain. */
  highlighted?: boolean;
}

export interface TypeCategory {
  /** Omit for a flat, ungrouped Types list (e.g. sciatica's "Types" has no
   * "From an accident"/"Everyday causes" subheadings, unlike neck-pain's). */
  label?: string;
  items: TypeCategoryItem[];
}

export interface CausesAndTypesProps {
  causesHeading: string;
  causes: string[];
  relatedHeading: string;
  relatedLinks: ConditionRelatedLink[];
  typesHeading: string;
  categories: TypeCategory[];
  className?: string;
}

/** Mid-page "Common Causes" + "Related [Condition] Conditions" + "Types"
 * section per the neck-pain Figma frame — distinct from back-pain's
 * equivalent section (CausesAndWhenToSee pairs causes/related with a
 * When-to-see block; neck-pain instead pairs causes/related with a
 * category-grouped Types list, and has no separate when-to-see section).
 * Left column: arrow-bulleted causes list over stacked related-condition
 * pills (one highlighted). Right column: "Types" heading, then each
 * category (e.g. "From an accident", "Everyday causes") as a labeled
 * group of name/description pairs, with one item per page rendered as a
 * highlighted callout. */
export function CausesAndTypes({
  causesHeading,
  causes,
  relatedHeading,
  relatedLinks,
  typesHeading,
  categories,
  className,
}: CausesAndTypesProps) {
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

        <div className="flex flex-col gap-10 bg-[#F8F8F8]">
          <h2 className="font-display text-h2 text-navy-900 px-6">{typesHeading}</h2>
          {categories.map((category, index) => (
            <div key={category.label ?? index} className="flex flex-col gap-6 pt-6">
              {category.label && (
                <h3 className="font-display text-type-name text-navy-900">{category.label}</h3>
              )}
              <div className="flex flex-col">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col gap-2 border-y border-mute-300 bg-[#F8F8F8] px-6 py-6 transition-all duration-300 hover:border-l-4 hover:border-l-teal-500 hover:bg-white hover:shadow-lg group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <h4 className="group-hover:text-teal-500 group-hover:decoration-teal-500 font-sans text-type-name text-navy-900 underline decoration-navy-900 underline-offset-4">
                          {item.name}
                        </h4>
                        <p className="font-alt text-faq-a text-ink-500">{item.description}</p>
                      </div>
                      <ArrowRightIcon className="h-6 w-6 shrink-0 text-[#F8F8F8] group-hover:text-teal-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
        "group flex items-center justify-between gap-3 rounded-full border px-6 py-4 font-sans text-stat-label uppercase transition-colors border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white duration-500",
      )}
    >
      {link.label}
      <ArrowRightIcon className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
