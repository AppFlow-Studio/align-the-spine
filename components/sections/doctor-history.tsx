import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { DoctorHistoryContent } from "@/content/doctor-profile";

export interface DoctorHistoryProps {
  content: DoctorHistoryContent;
}

/** "HISTORY" long-form bio per the about-drabe artboard (96:2575–96:2586),
 * ATS-090. Passed as DoctorProfile's `extended` slot (variant="long"), so it
 * renders inside DoctorProfile's own <Section> — no Section of its own,
 * just the Container this needs for horizontal max-width/gutters. */
export function DoctorHistory({ content }: DoctorHistoryProps) {
  const { eyebrow, heading, body } = content;
  return (
    <Container className="mt-14 flex flex-col gap-4">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display text-h2 text-navy-900">{heading}</h2>
      <p className="font-sans text-body-lg text-ink-900">{body}</p>
    </Container>
  );
}
