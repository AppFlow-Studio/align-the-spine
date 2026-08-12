import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { SpineOverviewContent, SpineSegment } from "@/content/spine-overview";
import { cn } from "@/lib/cn";

export interface SpineOverviewProps {
  content: SpineOverviewContent;
}

/** Leader-line callout for one spine region: a short line running from the
 * marker dot out to the label, label text on the far side — mirrors
 * PointToWhereItHurts' RegionLabel, but static (no selection state) and
 * with a longer line since these labels sit well outside the (smaller,
 * non-interactive) diagram rather than hugging its edge. */
function SegmentCallout({ segment }: { segment: SpineSegment }) {
  const { name, description, labelSide } = segment;
  const isLeft = labelSide === "left";
  // "Cervical (Neck)" -> ["Cervical", "(Neck)"], rendered on 2 lines like
  // the Figma frame so the parenthetical never collides with the diagram.
  const [regionName, regionDetail] = name.split(/\s+(?=\()/);

  return (
    <div
      className={cn(
        "absolute top-1/2 flex -translate-y-1/2 items-center gap-4",
        isLeft ? "right-full flex-row-reverse pr-4" : "left-full pl-4",
      )}
    >
      <span aria-hidden="true" className="h-px w-10 shrink-0 bg-teal-500 sm:w-20 md:w-32 lg:w-44" />
      <div className="flex w-[260px] flex-col gap-1 text-left sm:w-[380px]">
        <h3 className="font-display text-card-title text-navy-800">
          {regionName}
          {regionDetail && (
            <>
              <br />
              {regionDetail}
            </>
          )}
        </h3>
        <p className="font-sans text-body-lg text-ink-500">{description}</p>
      </div>
    </div>
  );
}

/** Static "Understanding the spine" overview (ATS-071) — the Home page's calmer
 * counterpart to the interactive PointToWhereItHurts diagram the condition pages
 * use. A single centered spine illustration with 4 leader-line callouts
 * alternating left/right, matching the "Your spine controls everything" Figma
 * frame. Deliberately a server component: no interactivity, so nothing ships to
 * the client bundle (it's code-split in app/page.tsx purely for section
 * ordering). */
export function SpineOverview({ content }: SpineOverviewProps) {
  const { eyebrow, heading, image, segments } = content;

  return (
    <Section spacing="lg">
      <Container className="flex flex-col items-center gap-14 text-center">
        <SectionHeading eyebrow={eyebrow} className="items-center max-w-md font-semibold">
          {heading}
        </SectionHeading>

        {/* Leader-line diagram needs room for labels on both sides of the
         * image — below lg that space doesn't exist, so a plain image +
         * stacked list (mirroring the pre-redesign layout) takes over. */}
        <div className="relative mx-auto hidden aspect-square w-full max-w-[460px] lg:block">
          <Image src={image.src} alt={image.alt} fill sizes="460px" className="object-contain" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white to-transparent"
          />

          {segments.map((segment) => (
            <div
              key={segment.id}
              className="absolute"
              style={{ top: `${segment.position.y}%`, left: `${segment.position.x}%` }}
            >
              <span
                aria-hidden="true"
                className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-teal-300 bg-white/60"
              />
              <SegmentCallout segment={segment} />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-10 lg:hidden">
          <div className="relative mx-auto aspect-square w-full max-w-[280px]">
            <Image src={image.src} alt={image.alt} fill sizes="280px" className="object-contain" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-white to-transparent"
            />
          </div>
          <ul className="flex flex-col gap-6 text-left">
            {segments.map((segment) => (
              <li key={segment.id} className="border-l-2 border-teal-500 pl-5">
                <h3 className="font-display text-card-title text-navy-800">{segment.name}</h3>
                <p className="mt-1 font-sans text-body-lg text-ink-500">{segment.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
