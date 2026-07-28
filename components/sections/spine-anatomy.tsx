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

/** Vertical position (% of the spine image's height) each region's marker
 * sits at, measured against the actual spine-skeloton.png asset: base of
 * neck ~27%, mid-ribcage ~46%, waist ~70%, sacrum/hip ~87%. Order matches
 * content/spine-anatomy.ts's fixed [cervical, thoracic, lumbar, sacral]. */
const REGION_TOP_PERCENT = [27, 46, 70, 87] as const;

function RegionText({ region, align }: { region: SpineRegion; align: "left" | "right" }) {
  return (
    <div className={cn("max-w-[280px]", align === "left" ? "text-right" : "text-left")}>
      <h3 className="break-words font-display text-card-title text-navy-800">
        {region.name} <span className="font-sans text-body-lg text-ink-500">{region.subtitle}</span>
      </h3>
      <p className="mt-2 font-sans text-card-body text-ink-900">{region.description}</p>
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
  const regionsWithTop = regions.map((region, i) => ({
    ...region,
    top: REGION_TOP_PERCENT[i],
  }));
  const leftRegions = regionsWithTop.filter((r) => r.position.startsWith("left"));
  const rightRegions = regionsWithTop.filter((r) => r.position.startsWith("right"));

  return (
    <Section spacing="lg">
      <Container className="flex flex-col items-center gap-14 text-center">
        <div className="flex flex-col items-center gap-3">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-display text-h2 text-navy-800">{heading}</h2>
        </div>

        <div className="relative w-full">
          {/* Left-flanking labels (Cervical, Lumbar), lg+ only. */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-1/2 lg:block">
            {leftRegions.map((region) => (
              <div
                key={region.name}
                className="pointer-events-auto absolute inset-x-0 flex -translate-y-1/2 items-center gap-4"
                style={{ top: `${region.top}%` }}
              >
                <RegionText region={region} align="left" />
                <span aria-hidden="true" className="h-px flex-1 bg-[#58A0A0]" />
              </div>
            ))}
          </div>

          {/* Right-flanking labels (Thoracic, Sacral), lg+ only. */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-1/2 lg:block">
            {rightRegions.map((region) => (
              <div
                key={region.name}
                className="pointer-events-auto absolute inset-x-0 flex -translate-y-1/2 items-center gap-4"
                style={{ top: `${region.top}%` }}
              >
                <span aria-hidden="true" className="h-px flex-1 bg-[#58A0A0]" />
                <RegionText region={region} align="right" />
              </div>
            ))}
          </div>

          <div className="relative mx-auto w-full max-w-3xl">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy-900/20 blur-3xl"
            />
            <Image
              src={image.src}
              alt={image.alt}
              width={800}
              height={800}
              className="relative mx-auto h-auto w-full object-contain"
              draggable={false}
            />
            {regionsWithTop.map((region) => (
              <span
                key={region.name}
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 hidden h-8.25 w-8.25 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/70 bg-blue-400/25 shadow-[0_0_16px_rgba(59,130,246,0.65)] backdrop-blur-[1px] lg:block"
                style={{ top: `${region.top}%` }}
              />
            ))}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-panel-100 via-panel-100/80 to-transparent"
            />
          </div>

          {/* Stacked fallback below lg, where there's no room to flank the image. */}
          <div className="mt-10 grid gap-8 text-left sm:grid-cols-2 lg:hidden">
            {regions.map((region) => (
              <div key={region.name}>
                <h3 className="break-words font-display text-card-title text-navy-800">
                  {region.name}{" "}
                  <span className="font-sans text-body-lg text-ink-500">{region.subtitle}</span>
                </h3>
                <p className="mt-2 font-sans text-card-body text-ink-900">{region.description}</p>
              </div>
            ))}
          </div>
        </div>

        <Button variant="cta" href={cta.href} className="mt-6">
          {cta.label}
        </Button>
      </Container>
    </Section>
  );
}
