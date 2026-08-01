import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ConditionFeelsLikeItem } from "@/content/conditions/types";

export interface FeelsLikeProps {
  items: ConditionFeelsLikeItem[];
  /** "Not all X feels the same" heading — condition name is interpolated by
   * the caller since this component has no Condition dependency itself. */
  heading: string;
  className?: string;
}

/** "What [condition] feels like" 4-card grid per the Figma condition-page
 * frames (e.g. back-pain's "Not all back pain feels the same"): a short
 * title + one-line description per card, no image — same TypeCard text
 * treatment reused for the title/description pairing. */
export function FeelsLike({ items, heading, className }: FeelsLikeProps) {
  return (
    <Section className={className}>
      <Container className="flex flex-col gap-10">
        <SectionHeading eyebrow="What it feels like">{heading}</SectionHeading>
        <div className="grid grid-cols-1 gap-8 border-t border-mute-300 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.title} className="flex flex-col gap-2">
              <h3 className="font-sans text-type-name text-navy-900">{item.title}</h3>
              <p className="font-alt text-faq-a text-ink-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
