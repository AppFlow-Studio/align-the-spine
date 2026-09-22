import type { PainAreaId } from "@/content/point-to-where-it-hurts";

export interface PainAreaMedia {
  src: string;
  poster: string;
  /** Describes the motion for screen readers and for the no-video fallback. */
  description: string;
  captions?: string;
}

/** ATS-E15a is blocked on the E25 video-asset dependency: as of this file's
 * last audit, the Bunny CDN storage zone (`align-the-spine`) contains no
 * per-region clinical demonstration clips — only generic clinic/marketing
 * footage (hallway.mp4, waiting-room.mp4, massage.mp4, the pre-existing
 * shared spine-straight.mp4 intro, car-accident.mp4) and static PNG stills.
 * None of those are a real clip of the specific motion for a specific pain
 * area, so every entry below is intentionally empty rather than wired to a
 * substitute asset — this ticket explicitly forbids that ("a visitor
 * selecting 'neck' and seeing a lower-back treatment clip is a
 * clinical-accuracy problem, not a cosmetic one"). PainAreaMediaPanel
 * treats an empty `src` as "missing" and renders the fallback state.
 *
 * Suggested unblock (from the ticket): request one region's asset first —
 * H.264 MP4, 1280x960, under 6s, seamless loop, no audio track — to de-risk
 * the format before producing all 6. Fill in a region's `src`/`poster`
 * (and `captions`, if provided) here once its real asset is approved and
 * uploaded; no other code needs to change. */
export const painAreaMedia: Record<PainAreaId, PainAreaMedia> = {
  headaches: { src: "", poster: "", description: "" },
  whiplash: { src: "", poster: "", description: "" },
  "shoulder-pain": { src: "", poster: "", description: "" },
  "back-pain": { src: "", poster: "", description: "" },
  "herniated-disc": { src: "", poster: "", description: "" },
  sciatica: { src: "", poster: "", description: "" },
};

export function hasPainAreaMedia(media: PainAreaMedia): boolean {
  return media.src !== "";
}
