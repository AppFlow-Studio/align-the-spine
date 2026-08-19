"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

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
  selectedId: string | null,
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

function RegionLabel({
  region,
  side,
  isSelected,
}: {
  region: BodyRegion;
  side: "left" | "right";
  isSelected: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute top-1/2 flex -translate-y-1/2 items-center gap-3 whitespace-nowrap ",
        side === "left" ? "right-full flex-row-reverse pr-3" : "left-full pl-3",
      )}
    >
      <span aria-hidden="true" className="flex shrink-0 items-center gap-2">
        <span className={cn("h-px bg-mute-300", region.labelLineWidth ?? "w-16")} />
        <span
          className={cn(
            "h-2 w-2 shrink-0 rounded-full",
            isSelected ? "bg-[#58A0A0]" : "bg-mute-300",
          )}
        />
      </span>
      <span
        className={cn("font-sans text-body-lg", isSelected ? "text-teal-500" : "text-navy-800")}
      >
        {region.name}
      </span>
    </div>
  );
}

/** Detail panel for the selected region. Always rendered in one dedicated slot — beside the
 * diagram on desktop, below the list on mobile — rather than floating next to the selected
 * hotspot: with real copy the panel (~400px+ tall) dwarfs the 56-130px gaps between hotspots,
 * so a per-region floating position overlaps neighboring labels and the section heading.
 *
 * Both the desktop and mobile branches mount their own copy of this panel once a region is
 * selected (only CSS/`hidden md:flex`/`md:hidden` toggles which is visible), so `headingAs`
 * defaults to "h3" for the mobile instance (mobile-first: what mobile-first indexing sees)
 * and the desktop call site passes "p" — otherwise selecting a region would put the same
 * region name into the DOM as two identical <h3>s at once. */
function SelectedPanel({
  region,
  ctaLabel,
  className,
  headingAs = "h3",
}: {
  region: BodyRegion;
  ctaLabel: string;
  className?: string;
  headingAs?: "h3" | "p";
}) {
  const HeadingTag = headingAs;
  return (
    <div
      className={cn(" border-l-4 border-teal-500 bg-white p-6 text-left shadow-card", className)}
    >
      <p className="font-sans text-[13px] font-semibold uppercase tracking-[1.25px] text-teal-500">
        Selected
      </p>
      <HeadingTag className="mt-2 font-display text-[20px] leading-[26px] font-medium text-navy-800">
        {region.name}
      </HeadingTag>
      <p className="mt-2 font-sans text-[15px] leading-[24px] text-ink-500">{region.description}</p>
      <Link
        href={region.href ?? siteConfig.bookingCta.href}
        className="group mt-4 inline-flex items-center gap-2 font-sans text-[13px] uppercase tracking-[1.25px] text-teal-500 transition-colors hover:text-teal-500/80"
      >
        {ctaLabel}
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

/** "Point to where it hurts" interactive body diagram (Epic 4). Replaces SpineAnatomy on the
 * Home page. 6 hotspots over a shared body illustration; selecting one updates a single
 * dedicated detail panel beside the diagram (see SelectedPanel doc comment for why it's not
 * positioned per-region). Below md, the diagram is replaced by a tappable list (mobile
 * fallback per spec) sharing the same selection state. */
export function PointToWhereItHurts({ content }: PointToWhereItHurtsProps) {
  const { eyebrow, heading, instruction, image, video, videoPoster, regions, ctaLabel } = content;
  // No region is selected until the visitor picks one — the diagram sits
  // centered on its own, and the detail panel animates in on first selection.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = regions.find((region) => region.id === selectedId) ?? null;
  const selectedIndex = regions.findIndex((region) => region.id === selectedId);
  // Roving tabindex still needs one tabbable control before anything is picked.
  const rovingIndex = selectedIndex === -1 ? 0 : selectedIndex;
  const reduceMotion = useReducedMotion();

  const { containerRef: desktopContainerRef, handleKeyDown: desktopHandleKeyDown } =
    useRovingRadioGroup(regions, selectedId, setSelectedId);
  const { containerRef: mobileContainerRef, handleKeyDown: mobileHandleKeyDown } =
    useRovingRadioGroup(regions, selectedId, setSelectedId);

  /** Straightening intro (desktop only). The hotspots are pinned to the
   * *straightened* spine, so they can't track the body mid-motion — instead of
   * hiding them on interaction, they start hidden and are revealed once the clip
   * settles on the aligned frame. The clip plays once, at 2× (~3s), the first
   * time the diagram scrolls into view; it's preloaded and starts from the
   * hunched poster so there's no load stutter or first-frame jump. Reduced-motion
   * and no-clip cases skip straight to the revealed, aligned state. */
  const spineVideoRef = useRef<HTMLVideoElement>(null);
  const spineHasPlayedRef = useRef(false);
  const [hotspotsRevealed, setHotspotsRevealed] = useState(false);
  useEffect(() => {
    const diagram = desktopContainerRef.current;
    const spineVideo = spineVideoRef.current;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // No clip, reduced motion, or mobile: skip the intro — reveal the aligned
    // hotspots straight away and hold the straightened frame.
    if (!video || !diagram || !spineVideo || !desktop || prefersReduced) {
      setHotspotsRevealed(true);
      if (spineVideo && video) {
        const toEnd = () => {
          try {
            spineVideo.currentTime = spineVideo.duration || 0;
          } catch {
            /* metadata not ready yet */
          }
        };
        if (spineVideo.readyState >= 1) toEnd();
        else spineVideo.addEventListener("loadedmetadata", toEnd, { once: true });
      }
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || spineHasPlayedRef.current) continue;
          spineHasPlayedRef.current = true;
          observer.disconnect();
          spineVideo.playbackRate = 2; // ~6s clip → ~3s
          spineVideo.currentTime = 0;
          void spineVideo.play().catch(() => setHotspotsRevealed(true));
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(diagram);
    return () => observer.disconnect();
  }, [video, desktopContainerRef]);

  return (
    <Section spacing="lg">
      <Container className="flex flex-col items-center gap-14 text-center">
        <SectionHeading eyebrow={eyebrow} sub={instruction}>
          {heading}
        </SectionHeading>

        <div className="hidden w-full items-center justify-center gap-20 md:flex">
          <motion.div
            ref={desktopContainerRef}
            layout
            transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
            role="radiogroup"
            aria-label="Body regions"
            onKeyDown={desktopHandleKeyDown}
            className="relative aspect-[1080/1920] w-full max-w-[360px] shrink-0"
          >
            {video ? (
              <video
                ref={spineVideoRef}
                src={video}
                poster={videoPoster ?? image.src}
                aria-label={image.alt}
                muted
                playsInline
                preload="auto"
                onEnded={() => setHotspotsRevealed(true)}
                onError={() => setHotspotsRevealed(true)}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 360px, 100vw"
                className="object-contain"
              />
            )}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-30 bg-linear-to-t from-white to-transparent"
            />

            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                hotspotsRevealed ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              {regions.map((region, index) => {
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
                      tabIndex={index === rovingIndex ? 0 : -1}
                      onClick={() => setSelectedId(region.id)}
                      style={{ width: region.size, height: region.size }}
                      className={cn(
                        "relative rounded-full ring-1 transition-colors",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500",
                        isSelected
                          ? "bg-[#58A0A0]/30 ring-teal-500/60"
                          : "bg-white/25 ring-white/50 hover:bg-white/40",
                      )}
                    >
                      {isSelected && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full ring-2 ring-teal-500 ring-offset-2 motion-safe:animate-pulse motion-reduce:animate-none"
                        />
                      )}
                    </button>

                    <RegionLabel region={region} side={region.labelSide} isSelected={isSelected} />
                  </div>
                );
              })}
            </div>
          </motion.div>

          <AnimatePresence>
            {selected && (
              <motion.div
                key="desktop-panel"
                initial={reduceMotion ? false : { opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -32 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }}
                className="shrink-0"
              >
                <SelectedPanel
                  region={selected}
                  ctaLabel={ctaLabel}
                  className="w-[380px]"
                  headingAs="p"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex w-full flex-col gap-3 md:hidden">
          <div
            ref={mobileContainerRef}
            role="radiogroup"
            aria-label="Body regions"
            onKeyDown={mobileHandleKeyDown}
            className="flex flex-col gap-3"
          >
            {regions.map((region, index) => {
              const isSelected = region.id === selectedId;
              return (
                <button
                  key={region.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={index === rovingIndex ? 0 : -1}
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
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div
                key="mobile-panel"
                initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
              >
                <SelectedPanel region={selected} ctaLabel={ctaLabel} className="mt-2 w-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </Section>
  );
}
