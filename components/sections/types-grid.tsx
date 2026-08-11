import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";

export interface TypesGridItem {
  name: string;
  description: ReactNode;
}

export interface TypesGridProps {
  heading: string;
  items: TypesGridItem[];
  className?: string;
}

/** "Types of X" full-width section per the Figma condition-page frames
 * (e.g. back-pain's "Types of Back Pain"): centered H2, then a 2-col grid
 * of type name (underlined, decorative — not a link) + description, where
 * descriptions carry their own inline links to specific phrases. Each item
 * highlights on hover to surface callout styling. */
export function TypesGrid({ heading, items, className }: TypesGridProps) {
  return (
    <Section className={className}>
      <Container className="flex flex-col gap-12">
        <h2 className="mx-auto max-w-2xl text-center font-display text-h2 text-navy-900 md:text-understanding-intro">
          {heading}
        </h2>
        <div className="grid grid-cols-1 gap-x-16 gap-y-10 border-t border-mute-300 pt-10 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.name}
              className="group flex flex-col gap-2 rounded-2xl p-6 transition-colors duration-300 hover:bg-overlay-teal-12 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex flex-col gap-2">
                <h3 className="font-sans text-type-name text-navy-900 underline decoration-navy-900 underline-offset-4">
                  {item.name}
                </h3>
                <p className="font-alt text-faq-a text-ink-500">{item.description}</p>
              </div>
              <ArrowRightIcon className="h-6 w-6 shrink-0 text-navy-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
