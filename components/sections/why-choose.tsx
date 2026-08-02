import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { StarIcon } from "@/components/ui/icons/star";
import { Section } from "@/components/ui/section";
import type { WhyChooseContent } from "@/content/why-choose";

export interface WhyChooseProps {
  content: WhyChooseContent;
}

/** "Why Choose Align the Spine Chiropractic" value-prop block per homepage
 * artboard (96:496–96:503), ATS-072: copy + CTA left, treatment-room photo
 * with a rating-chip overlay right (same pattern as DoctorProfile's portrait). */
export function WhyChoose({ content }: WhyChooseProps) {
  const { heading, body, cta, rating, image } = content;
  return (
    <Section spacing="lg">
      <Container className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
          <h2 className="font-display text-h2 text-navy-800">{heading}</h2>
          <p className="font-sans text-body-lg text-ink-900">{body}</p>
          <Button variant="cta" href={cta.href}>
            {cta.label}
          </Button>
        </div>

        <div className="relative aspect-[913/685] w-full shrink-0 md:w-[45%]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-6 bottom-6 flex items-center justify-between gap-3 bg-overlay-ink-20 px-6 py-4 backdrop-blur-sm">
            <span className="font-sans text-stat-label text-white">{rating.location}</span>
            <span
              className="inline-flex items-center gap-2"
              role="img"
              aria-label={`Rated ${rating.value} out of 5 stars from ${rating.count} reviews`}
            >
              <span className="inline-flex gap-1">
                {Array.from({ length: rating.value }, (_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-white" />
                ))}
              </span>
              <span aria-hidden="true" className="font-sans text-stat-label text-white">
                {rating.count}
              </span>
            </span>
          </div>
        </div>
      </Container>
    </Section>
  );
}
