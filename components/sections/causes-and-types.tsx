import Link from "next/link";

import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import type { ConditionRelatedLink } from "@/content/conditions/types";
import { cn } from "@/lib/cn";

export interface TypeCategoryItem {
  name: string;
  description: string;
  /** Renders as a bordered, left-accented callout with a trailing arrow
   * instead of plain stacked text — matches the Figma "Cervical herniated
   * disc" treatment on neck-pain. */
  highlighted?: boolean;
}

export interface TypeCategory {
  label: string;
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

        <div className="flex flex-col gap-10">
          <h2 className="font-display text-h2 text-navy-900">{typesHeading}</h2>
          {categories.map((category) => (
            <div key={category.label} className="flex flex-col gap-6 border-t border-mute-300 pt-6">
              <h3 className="font-display text-type-name text-navy-900">{category.label}</h3>
              <div className="flex flex-col">
                {category.items.map((item) =>
                  item.highlighted ? (
                    <div
                      key={item.name}
                      className="flex items-center gap-4 border-y border-mute-300 bg-overlay-teal-12 py-6 pl-6"
                    >
                      <div className="flex flex-1 flex-col gap-2">
                        <h4 className="font-sans text-type-name text-navy-900 underline decoration-navy-900 underline-offset-4">
                          {item.name}
                        </h4>
                        <p className="font-alt text-faq-a text-ink-500">{item.description}</p>
                      </div>
                      <ArrowRightIcon className="h-6 w-6 shrink-0 text-navy-900" />
                    </div>
                  ) : (
                    <div key={item.name} className="flex flex-col gap-2 py-6">
                      <h4 className="font-sans text-type-name text-navy-900 underline decoration-navy-900 underline-offset-4">
                        {item.name}
                      </h4>
                      <p className="font-alt text-faq-a text-ink-500">{item.description}</p>
                    </div>
                  ),
                )}
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
