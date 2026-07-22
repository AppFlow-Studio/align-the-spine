import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import type { CtaBandContent } from "@/content/cta-bands";

export interface CtaBandProps {
  content: CtaBandContent;
}

/** Recurring generic booking CTA band per condition-page-spec §B10
 * (ATS-121): centered heading + arrow-badge "cta" button, no background
 * color so it reads distinct from the navy StillHaveQuestions band above
 * it on the home page. */
export function CtaBand({ content }: CtaBandProps) {
  return (
    <Section spacing="lg">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className="font-display text-h2 text-navy-800">{content.heading}</h2>
        <Button variant="cta" href={content.cta.href}>
          {content.cta.label}
        </Button>
      </Container>
    </Section>
  );
}
