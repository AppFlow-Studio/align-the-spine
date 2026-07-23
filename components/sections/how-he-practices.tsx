import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { homeVisitCallout, howHePracticesCards } from "@/content/how-he-practices";

/** "HOW HE PRACTICES" section per the about-drabe artboard (96:3244–96:4348),
 * ATS-090/091: a 3-card "What patients actually notice" row (image, title,
 * one-line description — no CTA, per artboard), then a full-width
 * home-vs-office callout image under "The office, when you'd rather come
 * to us". */
export function HowHePractices() {
  return (
    <Section spacing="lg">
      <Container className="flex flex-col gap-14">
        <div className="flex flex-col items-center gap-3 text-center">
          <Eyebrow>How he practices</Eyebrow>
          <h2 className="font-display text-h2 text-navy-800">What patients actually notice</h2>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {howHePracticesCards.map((card) => (
            <div key={card.title} className="flex flex-col gap-4">
              <div className="relative aspect-[507/283] w-full shrink-0">
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  fill
                  className="rounded-15 object-cover"
                />
              </div>
              <div className="flex flex-col gap-2 border-t border-mute-300 pt-4">
                <h3 className="break-words font-display text-card-title text-navy-800">
                  {card.title}
                </h3>
                <p className="font-sans text-card-body text-ink-900">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="font-display text-h2 text-navy-800">{homeVisitCallout.heading}</h2>
            <p className="max-w-2xl font-sans text-body-lg text-ink-900">{homeVisitCallout.body}</p>
          </div>
          <div className="relative aspect-[1566/874] w-full">
            <Image
              src={homeVisitCallout.image.src}
              alt={homeVisitCallout.image.alt}
              fill
              className="rounded-30 object-cover"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
