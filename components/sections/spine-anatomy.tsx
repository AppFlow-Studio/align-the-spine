import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import type { SpineAnatomyContent, SpineRegion } from "@/content/spine-anatomy";
import { cn } from "@/lib/cn";

export interface SpineAnatomyProps {
  content: SpineAnatomyContent;
}

function RegionBlock({ region, side }: { region: SpineRegion; side: "left" | "right" }) {
  const leader = (
    <span aria-hidden="true" className="hidden shrink-0 items-center gap-2 md:flex">
      <span className="h-px w-12 bg-mute-300" />
      <span className="h-2 w-2 shrink-0 rounded-full bg-teal-500" />
    </span>
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-2 text-left md:flex-row md:items-center md:gap-4",
        side === "left" ? "md:flex-row-reverse md:text-right" : "md:text-left",
      )}
    >
      {leader}
      <div>
        <h3 className="font-display text-card-title text-navy-800">
          {region.name}{" "}
          <span className="font-sans text-body-lg text-ink-500">{region.subtitle}</span>
        </h3>
        <p className="mt-2 font-sans text-card-body text-ink-900">{region.description}</p>
      </div>
    </div>
  );
}

/** SpineAnatomy quadrant explainer per homepage artboard (96:169–96:289),
 * ATS-072: Cervical/Thoracic/Lumbar/Sacral labels flank a spine illustration
 * with a hairline "leader" toward the image on md+, collapsing to a single
 * stacked column below md. */
export function SpineAnatomy({ content }: SpineAnatomyProps) {
  const { eyebrow, heading, regions, image, cta } = content;
  const [cervical, thoracic, lumbar, sacral] = regions;

  return (
    <Section spacing="lg">
      <Container className="flex flex-col items-center gap-14 text-center">
        <div className="flex flex-col items-center gap-3">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-display text-h2 text-navy-800">{heading}</h2>
        </div>

        <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-[1fr_320px_1fr] md:gap-8">
          <div className="flex flex-col gap-10 md:items-end">
            <RegionBlock region={cervical} side="left" />
            <RegionBlock region={lumbar} side="left" />
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[380px]">
            <Image src={image.src} alt={image.alt} fill className="object-contain" />
          </div>

          <div className="flex flex-col gap-10 md:items-start">
            <RegionBlock region={thoracic} side="right" />
            <RegionBlock region={sacral} side="right" />
          </div>
        </div>

        <Button variant="cta" href={cta.href}>
          {cta.label}
        </Button>
      </Container>
    </Section>
  );
}
