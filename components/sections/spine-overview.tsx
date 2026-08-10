import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { SpineOverviewContent } from "@/content/spine-overview";

export interface SpineOverviewProps {
  content: SpineOverviewContent;
}

/** Static "Understanding the spine" overview (ATS-071) — the Home page's calmer
 * counterpart to the interactive PointToWhereItHurts diagram the condition pages
 * use. A back-view spine illustration beside a top-to-bottom walk of the four
 * spinal regions and where accident injuries land, ending in a booking CTA.
 * Deliberately a server component: no interactivity, so nothing ships to the
 * client bundle (it's code-split in app/page.tsx purely for section ordering). */
export function SpineOverview({ content }: SpineOverviewProps) {
  const { eyebrow, heading, intro, image, segments, cta } = content;

  return (
    <Section spacing="lg">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative mx-auto aspect-square w-full max-w-[460px] lg:order-first">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 460px, 100vw"
            className="object-contain"
          />
        </div>

        <div className="flex flex-col gap-8">
          <SectionHeading eyebrow={eyebrow} sub={intro}>
            {heading}
          </SectionHeading>

          <ul className="flex flex-col gap-6">
            {segments.map((segment) => (
              <li key={segment.id} className="border-l-2 border-teal-500 pl-5">
                <h3 className="font-display text-card-title text-navy-800">{segment.name}</h3>
                <p className="mt-1 font-sans text-body-lg text-ink-500">{segment.description}</p>
              </li>
            ))}
          </ul>

          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 font-sans text-body-lg uppercase tracking-[1.25px] text-teal-500 transition-colors hover:text-teal-500/80"
          >
            {cta.label}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
