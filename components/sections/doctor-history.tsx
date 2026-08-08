import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import type { DoctorHistoryContent } from "@/content/doctor-profile";

export interface DoctorHistoryProps {
  content: DoctorHistoryContent;
}

/** "HISTORY" long-form bio per the about-drabe artboard (96:2575–96:2586,
 * ATS-090): full-bleed navy band, its own <Section> — rendered as
 * DoctorProfile's `extended` slot (variant="long"), which places it as a
 * sibling of (not nested inside) that component's own white <Section>. */
export function DoctorHistory({ content }: DoctorHistoryProps) {
  const { eyebrow, heading, paragraphs } = content;
  return (
    <Section className="bg-navy-900">
      <Container className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Eyebrow variant="onDark">{eyebrow}</Eyebrow>
          <h2 className="font-display text-h2 text-white">{heading}</h2>
        </div>
        <div className="flex flex-col gap-4">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="font-sans text-body-lg text-mute-300">
              {paragraph}
            </p>
          ))}
        </div>
      </Container>
    </Section>
  );
}
