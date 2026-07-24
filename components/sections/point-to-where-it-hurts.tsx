"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { BodyRegion, PointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";

export interface PointToWhereItHurtsProps {
  content: PointToWhereItHurtsContent;
}

/** Roving-tabindex radiogroup: arrow keys move focus AND selection, Home/End jump to the
 * first/last region — the native single-select radio-group pattern, shared by the desktop
 * diagram and the mobile region list. */
function useRovingRadioGroup(
  regions: BodyRegion[],
  selectedId: string,
  onSelect: (id: string) => void,
) {
  const containerRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = regions.findIndex((region) => region.id === selectedId);
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      nextIndex = (index + 1) % regions.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      nextIndex = (index - 1 + regions.length) % regions.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = regions.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    onSelect(regions[nextIndex].id);
    containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[nextIndex]?.focus();
  }

  return { containerRef, handleKeyDown };
}

function RegionLabel({ region, side }: { region: BodyRegion; side: "left" | "right" }) {
  return (
    <div
      className={cn(
        "absolute top-1/2 flex -translate-y-1/2 items-center gap-2 whitespace-nowrap",
        side === "left" ? "right-full flex-row-reverse pr-2" : "left-full pl-2",
      )}
    >
      <span aria-hidden="true" className="flex shrink-0 items-center gap-2">
        <span className="h-px w-12 bg-mute-300" />
        <span className="h-2 w-2 shrink-0 rounded-full bg-teal-500" />
      </span>
      <span className="font-sans text-body-lg text-navy-800">{region.name}</span>
    </div>
  );
}

function SelectedPanel({
  region,
  ctaLabel,
  layout,
  side,
}: {
  region: BodyRegion;
  ctaLabel: string;
  layout: "floating" | "static";
  side?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "rounded-20 border-2 border-teal-500 bg-white p-6 text-left shadow-card",
        layout === "floating" && "absolute top-1/2 w-[300px] -translate-y-1/2",
        layout === "floating" && side === "left" && "right-full mr-4",
        layout === "floating" && side === "right" && "left-full ml-4",
        layout === "static" && "mt-2 w-full",
      )}
    >
      <p className="font-sans text-selected-label uppercase text-teal-500">Selected</p>
      <h3 className="mt-2 font-display text-card-title text-navy-800">{region.name}</h3>
      <p className="mt-2 font-sans text-panel-body text-ink-500">{region.description}</p>
      <Link
        href={region.href ?? siteConfig.bookingCta.href}
        className="mt-4 inline-flex items-center gap-2 font-sans text-body-lg uppercase tracking-[1.25px] text-teal-500 transition-colors hover:text-teal-500/80"
      >
        {ctaLabel}
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}

/** "Point to where it hurts" interactive body diagram (Epic 4). Replaces SpineAnatomy on the
 * Home page. 6 hotspots over a shared body illustration; selecting one swaps that region's
 * label for a detail panel in place. Below md, the diagram is replaced by a tappable list
 * (mobile fallback per spec) sharing the same selection state. */
export function PointToWhereItHurts({ content }: PointToWhereItHurtsProps) {
  const { eyebrow, heading, instruction, image, regions, ctaLabel } = content;
  const [selectedId, setSelectedId] = useState(regions[0].id);
  const selected = regions.find((region) => region.id === selectedId) ?? regions[0];

  const desktop = useRovingRadioGroup(regions, selectedId, setSelectedId);
  const mobile = useRovingRadioGroup(regions, selectedId, setSelectedId);

  return (
    <Section spacing="lg">
      <Container className="flex flex-col items-center gap-14 text-center">
        <SectionHeading eyebrow={eyebrow} sub={instruction}>
          {heading}
        </SectionHeading>

        <div
          // eslint-disable-next-line react-hooks/refs -- ref object passed to the `ref` prop, not a `.current` read
          ref={desktop.containerRef}
          role="radiogroup"
          aria-label="Body regions"
          // eslint-disable-next-line react-hooks/refs -- event handler reference, not a ref read during render
          onKeyDown={desktop.handleKeyDown}
          className="relative mx-auto hidden aspect-square w-full max-w-[560px] md:block"
        >
          <Image src={image.src} alt={image.alt} fill className="object-contain" />

          {regions.map((region) => {
            const isSelected = region.id === selectedId;
            return (
              <div
                key={region.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${region.position.y}%`, left: `${region.position.x}%` }}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={region.name}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setSelectedId(region.id)}
                  style={{ width: region.size, height: region.size }}
                  className={cn(
                    "relative rounded-full bg-white/25 ring-1 ring-white/50 transition-colors hover:bg-white/40",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500",
                  )}
                >
                  {isSelected && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full ring-2 ring-teal-500 ring-offset-2 motion-safe:animate-pulse motion-reduce:animate-none"
                    />
                  )}
                </button>

                {isSelected ? (
                  <SelectedPanel
                    region={region}
                    ctaLabel={ctaLabel}
                    layout="floating"
                    side={region.labelSide}
                  />
                ) : (
                  <RegionLabel region={region} side={region.labelSide} />
                )}
              </div>
            );
          })}
        </div>

        <div
          // eslint-disable-next-line react-hooks/refs -- ref object passed to the `ref` prop, not a `.current` read
          ref={mobile.containerRef}
          role="radiogroup"
          aria-label="Body regions"
          // eslint-disable-next-line react-hooks/refs -- event handler reference, not a ref read during render
          onKeyDown={mobile.handleKeyDown}
          className="flex w-full flex-col gap-3 md:hidden"
        >
          {regions.map((region) => {
            const isSelected = region.id === selectedId;
            return (
              <button
                key={region.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelectedId(region.id)}
                className={cn(
                  "rounded-20 border-2 px-6 py-4 text-left font-sans text-body-lg transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500",
                  isSelected ? "border-teal-500 text-teal-500" : "border-mute-300 text-ink-900",
                )}
              >
                {region.name}
              </button>
            );
          })}
          <SelectedPanel region={selected} ctaLabel={ctaLabel} layout="static" />
        </div>
      </Container>
    </Section>
  );
}
