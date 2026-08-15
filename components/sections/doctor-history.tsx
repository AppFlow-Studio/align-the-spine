import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import type { DoctorHistoryContent } from "@/content/doctor-profile";

export interface DoctorHistoryProps {
  content: DoctorHistoryContent;
}

/** "HISTORY" long-form bio per the about-drabe artboard (nodes 529:3402–3404):
 * a plain white section with a centered teal eyebrow + centered Fraunces
 * SemiBold heading (65/69, navy-900), followed by a centered, left-aligned
 * body column (Poppins 20/36, ink-900). Rendered as DoctorProfile's `extended`
 * slot (variant="long"), a sibling of that component's own white <Section>. */
export function DoctorHistory({ content }: DoctorHistoryProps) {
  const { eyebrow, heading, paragraphs } = content;
  return (
    <Section>
      <Container>
        <div className="mx-auto flex max-w-[964px] flex-col items-center">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-3 max-w-[860px] text-center font-display text-display font-semibold text-navy-900">
            {heading}
          </h2>
          <div className="mt-8 flex w-full flex-col gap-6">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="font-sans text-[20px] leading-9 text-ink-900">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
