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
    <span aria-hidden="true" className="hidden shrink-0 items-center gap-2 lg:flex">
      <span className="h-px w-12 bg-mute-300" />
      <span className="h-2 w-2 shrink-0 rounded-full bg-teal-500" />
    </span>
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-2 text-left lg:flex-row lg:items-center lg:gap-4",
        side === "left" ? "lg:flex-row-reverse lg:text-right" : "lg:text-left",
      )}
    >
      {leader}
      <div>
        <h3 className="break-words font-display text-card-title text-navy-800">
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
 * with a hairline "leader" toward the image on lg+, collapsing to a single
 * stacked column below lg. Was `md:` (768px) — ATS-073 responsive pass found
 * the 3-column `[1fr_320px_1fr]` grid too cramped at 768–1023px (a fixed
 * 35px "Thoracic" heading was clipping past the viewport edge in that
 * column width); the fixed 320px middle column needs the extra room `lg`
 * gives it, same threshold Hero already uses for its own 2-column split. */
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

        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_320px_1fr] lg:gap-8">
          <div className="flex flex-col gap-10 lg:items-end">
            <RegionBlock region={cervical} side="left" />
            <RegionBlock region={lumbar} side="left" />
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[380px]">
            <Image src={image.src} alt={image.alt} fill className="object-contain" />
          </div>

          <div className="flex flex-col gap-10 lg:items-start">
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
