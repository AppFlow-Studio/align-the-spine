import Link from "next/link";

import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import type { ConditionRelatedLink } from "@/content/conditions/types";

export interface ConditionCauseCategoryItem {
  name: string;
  description: string;
}

export interface ConditionCauseCategory {
  label: string;
  items: ConditionCauseCategoryItem[];
}

export interface ConditionTypesWithCausesProps {
  heading: string;
  symptomsHeading: string;
  symptoms: string[];
  relatedHeading: string;
  relatedLinks: ConditionRelatedLink[];
  categories: ConditionCauseCategory[];
  className?: string;
}

/** "Types of [condition] trauma" section per the concussion Figma frame:
 * one full-width heading over a 2-col layout — arrow-bulleted symptoms list
 * + outlined related-condition pills on the left, a light card of grouped
 * causes (each a label over underlined name/description pairs, split by a
 * thin divider between groups) on the right. */
export function ConditionTypesWithCauses({
  heading,
  symptomsHeading,
  symptoms,
  relatedHeading,
  relatedLinks,
  categories,
  className,
}: ConditionTypesWithCausesProps) {
  return (
    <Section className={className}>
      <Container className="flex flex-col gap-12">
        <h2 className="font-display text-h2 text-navy-900">{heading}</h2>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-14">
            <div className="flex flex-col gap-6">
              <h3 className="font-display text-h2 text-navy-900">{symptomsHeading}</h3>
              <ul className="flex flex-col gap-4">
                {symptoms.map((symptom) => (
                  <li key={symptom} className="flex items-center gap-3">
                    <ArrowRightIcon className="h-4 w-4 shrink-0 text-teal-500" />
                    <span className="font-alt text-faq-a text-ink-900">{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-display text-h2 text-navy-900">{relatedHeading}</h3>
              <div className="flex flex-col gap-4">
                {relatedLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between gap-3 border border-navy-900 px-6 py-4 font-sans text-body-lg text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
                  >
                    {link.label}
                    <ArrowRightIcon className="h-4 w-4 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 rounded-30 bg-[#F5F6F8] p-10 md:p-12">
            {categories.map((category, index) => (
              <div
                key={category.label}
                className={
                  index === 0
                    ? "flex flex-col gap-6"
                    : "flex flex-col gap-6 border-t border-mute-300 pt-8"
                }
              >
                <h3 className="font-display text-h2 text-navy-900">{category.label}</h3>
                <div className="flex flex-col gap-6">
                  {category.items.map((item) => (
                    <div key={item.name} className="flex flex-col gap-2">
                      <h4 className="font-sans text-type-name text-navy-900 underline decoration-navy-900 underline-offset-4">
                        {item.name}
                      </h4>
                      <p className="font-alt text-faq-a text-ink-500">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
