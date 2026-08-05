import { TopStatsBar } from "@/components/layout/top-stats-bar";
import { Rating } from "@/components/ui/rating";
import type { Testimonial } from "@/content/testimonials";
import { cn } from "@/lib/cn";

export interface ReviewsStripProps {
  /** ATS-E4 (4.11): optional — content/testimonials.ts has no real,
   * client-approved reviews yet. The quote row is omitted entirely when
   * absent (TopStatsBar still renders below it, and is itself a no-op
   * until its own claims are verified — see TopStatsBar's doc comment). */
  testimonial?: Testimonial;
}

/** Featured-review + stat-grid strip directly under the hero on
 * /home-visits (ATS-110). TopStatsBar is normally hidden behind Hero's
 * negative top margin, so this page renders its own visible copy. */
export function ReviewsStrip({ testimonial }: ReviewsStripProps) {
  return (
    <div className="flex flex-col gap-8">
      {testimonial && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-mute-300 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Rating value={5} />
            <p className="font-alt text-alt-label text-ink-900">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-sans text-stat-label uppercase text-mute-400">
              -{testimonial.author.toUpperCase()}
            </span>
            <span className="flex items-center gap-1.5" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    i === 0 ? "bg-navy-900" : "bg-mute-300",
                  )}
                />
              ))}
            </span>
          </div>
        </div>
      )}

      <TopStatsBar />
    </div>
  );
}
