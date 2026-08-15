"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { SpineOverviewContent, SpineSegment } from "@/content/spine-overview";
import { cn } from "@/lib/cn";

export interface SpineOverviewProps {
  content: SpineOverviewContent;
}

/** The straightening clip, layered into a spine slot. Plays once, hunched→
 * aligned at 2× (~3s), the first time it scrolls into view; it's warmed as the
 * section approaches (so the start is smooth) and starts from the hunched
 * poster (so there's no jump). Calls `onSettled` when it finishes — or right
 * away for reduced-motion, where it just holds the straightened last frame. */
function SpineClip({
  src,
  poster,
  alt,
  onSettled,
}: {
  src: string;
  poster: string;
  alt: string;
  onSettled: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onSettled();
      video.preload = "auto";
      const toEnd = () => {
        try {
          video.currentTime = video.duration || 0;
        } catch {
          /* metadata not ready yet */
        }
      };
      if (video.readyState >= 1) toEnd();
      else video.addEventListener("loadedmetadata", toEnd, { once: true });
      return;
    }

    // Warm the clip as the section approaches so playback starts without a stall.
    const warm = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && video.preload !== "auto") {
            video.preload = "auto";
            video.load();
          }
        }
      },
      { rootMargin: "600px 0px" },
    );
    // Play once, at 2× (~3s), when it's actually on screen.
    const play = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || playedRef.current) continue;
          playedRef.current = true;
          warm.disconnect();
          play.disconnect();
          video.playbackRate = 2;
          video.currentTime = 0;
          void video.play().catch(onSettled);
        }
      },
      { threshold: 0.4 },
    );
    warm.observe(video);
    play.observe(video);
    return () => {
      warm.disconnect();
      play.disconnect();
    };
  }, [onSettled]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      aria-label={alt}
      muted
      playsInline
      preload="none"
      onEnded={onSettled}
      onError={onSettled}
      className="absolute inset-0 size-full object-cover"
    />
  );
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
      <span
        aria-hidden="true"
        className="h-px w-10 shrink-0 bg-[#58A0A0] sm:w-20 md:w-32 lg:w-44"
      />
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

/** "Understanding the spine" overview (ATS-071) — the Home page's calmer
 * counterpart to the interactive PointToWhereItHurts diagram the condition
 * pages use. A single centered spine illustration with 4 leader-line callouts
 * alternating left/right, matching the "Your spine controls everything" Figma
 * frame. When a clip is provided it plays the hunched→aligned straightening
 * once on scroll-in and the callouts fade in as it settles on the straightened
 * frame (the callouts are pinned to that frame, so they can't be shown until
 * the body stops moving); otherwise the still image shows with callouts
 * visible from the start. Client component for that scroll-triggered intro. */
export function SpineOverview({ content }: SpineOverviewProps) {
  const { eyebrow, heading, image, video, videoPoster, segments } = content;
  // Callouts wait for the clip to settle on the straightened frame; with no
  // clip they're visible immediately.
  const [ready, setReady] = useState(!video);
  const revealCallouts = useCallback(() => setReady(true), []);
  const poster = videoPoster ?? image.src;

  return (
    <Section spacing="lg">
      <Container className="flex flex-col items-center gap-14 text-center">
        <SectionHeading eyebrow={eyebrow} className="items-center max-w-md font-semibold">
          {heading}
        </SectionHeading>

        {/* Leader-line diagram needs room for labels on both sides of the
         * image — below lg that space doesn't exist, so a plain image +
         * stacked list (mirroring the pre-redesign layout) takes over. */}
        <div className="relative mx-auto hidden aspect-[1080/1920] w-full max-w-[340px] lg:block">
          {video ? (
            <SpineClip src={video} poster={poster} alt={image.alt} onSettled={revealCallouts} />
          ) : (
            <Image src={image.src} alt={image.alt} fill sizes="340px" className="object-cover" />
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white to-transparent"
          />

          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              ready ? "opacity-100" : "opacity-0",
            )}
          >
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
        </div>

        <div className="flex flex-col items-center gap-10 lg:hidden">
          <div className="relative mx-auto aspect-[1080/1920] w-full max-w-[240px]">
            {video ? (
              <SpineClip src={video} poster={poster} alt={image.alt} onSettled={revealCallouts} />
            ) : (
              <Image src={image.src} alt={image.alt} fill sizes="240px" className="object-cover" />
            )}
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
