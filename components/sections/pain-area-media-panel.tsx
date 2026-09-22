"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { InfoIcon } from "@/components/ui/icons/info";
import { hasPainAreaMedia, painAreaMedia } from "@/content/pain-area-media";
import type { PainAreaId } from "@/content/point-to-where-it-hurts";
import { cn } from "@/lib/cn";

const PAIN_AREA_IDS = Object.keys(painAreaMedia) as PainAreaId[];

/** Rendered instead of a clip when a region has no approved video yet.
 * Never substitutes another region's footage — see content/pain-area-media.ts. */
function PainAreaMediaFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-mute-100 px-6 text-center">
      <InfoIcon className="h-6 w-6 text-mute-300" />
      <p className="font-sans text-[13px] text-ink-500">Video coming soon for this area</p>
    </div>
  );
}

/** Poster + explicit play control, shown instead of autoplay under
 * `prefers-reduced-motion: reduce` (ATS-E15a Step 9). The crossfade itself
 * stays (an opacity transition under 260ms is within the acceptable
 * range) — only the looping motion is opt-in.
 *
 * Mounted with `key={regionId}` by the parent so its own local `playing`
 * state resets to false on every region switch via remount, rather than
 * syncing a parent-owned flag from an effect. */
function ReducedMotionGate({
  poster,
  description,
  onPlay,
}: {
  poster: string;
  description: string;
  onPlay: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  if (playing) return null;
  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element -- poster-only, no next/image fill needed for a single static frame behind a play control */}
      <img src={poster} alt={description} className="h-full w-full object-cover" />
      <button
        type="button"
        onClick={() => {
          setPlaying(true);
          onPlay();
        }}
        aria-label="Play video"
        className="absolute inset-0 flex items-center justify-center bg-navy-800/20 transition-colors hover:bg-navy-800/30"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90">
          <span
            aria-hidden="true"
            className="ml-0.5 h-0 w-0 border-y-[8px] border-l-[12px] border-y-transparent border-l-navy-800"
          />
        </span>
      </button>
    </div>
  );
}

/** Per-region video panel for "point to where it hurts" (ATS-E15a). Fixed
 * aspect-ratio container, all clips mounted and crossfaded by opacity
 * (avoids the load flash a single swapped `<video src>` would cause);
 * `preload="none"` on inactive clips keeps initial page weight down.
 *
 * Blocked on the E25 asset dependency: every entry in painAreaMedia is
 * currently empty, so this always renders PainAreaMediaFallback today.
 * The panel is still fully wired (crossfade, pause-on-switch, reduced
 * motion, missing-asset warning) so nothing else needs to change once real
 * assets land — see content/pain-area-media.ts. */
export function PainAreaMediaPanel({ regionId }: { regionId: PainAreaId }) {
  const media = painAreaMedia[regionId];
  const hasMedia = hasPainAreaMedia(media);
  const reduceMotion = useReducedMotion();
  const videoRefs = useRef<Partial<Record<PainAreaId, HTMLVideoElement | null>>>({});

  useEffect(() => {
    if (!hasMedia) {
      console.warn("[pain-area] missing media", { regionId });
    }
  }, [hasMedia, regionId]);

  // Pause every outgoing clip: opacity 0 does not stop playback, and
  // without this every region a visitor has touched keeps decoding in the
  // background. Under reduced motion, the active clip is only started by
  // ReducedMotionGate's explicit play control below, not here.
  useEffect(() => {
    for (const [id, el] of Object.entries(videoRefs.current)) {
      if (!el) continue;
      if (id === regionId) {
        el.currentTime = 0;
        if (!reduceMotion) {
          void el.play().catch(() => {}); // Safari autoplay rejection is not an error worth surfacing
        }
      } else {
        el.pause();
      }
    }
  }, [regionId, reduceMotion]);

  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-20 bg-mute-100"
      aria-live="polite"
    >
      {PAIN_AREA_IDS.map((id) => {
        const regionMedia = painAreaMedia[id];
        // Never render a <video> with an empty src, and never substitute
        // another region's clip for a missing one — an empty slot renders
        // nothing here; PainAreaMediaFallback below covers the active slot.
        if (!hasPainAreaMedia(regionMedia)) return null;
        const isActive = id === regionId;
        return (
          <video
            key={id}
            ref={(el) => {
              videoRefs.current[id] = el;
            }}
            src={regionMedia.src}
            poster={regionMedia.poster}
            aria-label={regionMedia.description}
            muted
            playsInline
            loop
            preload={isActive ? "auto" : "none"}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-200",
              isActive ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          />
        );
      })}

      {hasMedia && reduceMotion && (
        <ReducedMotionGate
          key={regionId}
          poster={media.poster}
          description={media.description}
          onPlay={() => videoRefs.current[regionId]?.play().catch(() => {})}
        />
      )}

      {!hasMedia && <PainAreaMediaFallback />}
    </div>
  );
}
