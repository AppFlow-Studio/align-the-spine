import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import type { StillHaveQuestionsContent } from "@/content/cta-bands";

export interface StillHaveQuestionsProps {
  content: StillHaveQuestionsContent;
}

/** Full-bleed navy "Still have questions? Just Call" band per
 * condition-page-spec §B10 (ATS-121): heading + ATS-020 glass call-pill +
 * muted note, background bled edge-to-edge via Section, text gutter-aligned
 * via the nested Container. */
export function StillHaveQuestions({ content }: StillHaveQuestionsProps) {
  return (
    <Section spacing="lg" className="bg-navy-900">
      <Container className="flex flex-col items-center gap-8 text-center">
        <h2 className="font-display text-display text-white">{content.heading}</h2>
        <Button
          variant="glass"
          href={content.phoneHref}
          eyebrow={content.eyebrow}
          className="w-fit"
        >
          {content.phone}
        </Button>
        <p className="font-sans text-body-lg text-mute-300">{content.note}</p>
      </Container>
    </Section>
  );
}
