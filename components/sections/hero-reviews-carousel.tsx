"use client";

import { useEffect, useState } from "react";

import { TopStatsBar } from "@/components/layout/top-stats-bar";
import { StarIcon } from "@/components/ui/icons/star";
import type { Testimonial } from "@/content/testimonials";
import { cn } from "@/lib/cn";

export interface HeroReviewsCarouselProps {
  testimonials: Testimonial[];
}

const AUTO_ADVANCE_MS = 6000;

/** Floating review-card carousel that overlaps Hero's bottom edge, per the
 * homepage artboard: a rotating star-rated quote + author (dot pagination)
 * over the same five-stat row TopStatsBar renders (Reviews/Visits/When it
 * applies/Bilingual care/Insurance) — TopStatsBar itself stays hidden behind
 * Hero's negative top margin on every page, so this is what actually makes
 * that stat row visible. Quote/author slide via a translateX track (current
 * exits left, next enters from the right) — pagination dots sit outside the
 * sliding viewport so they never move. */
export function HeroReviewsCarousel({ testimonials }: HeroReviewsCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [testimonials.length]);

  return (
    <div className="bg-white py-5 relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-panel-100 via-panel-100/80 to-transparent"
      />

      <div className="container">
        <div className="bg-white py-18">
          <div className="flex items-center justify-between gap-4 border-b border-mute-300 pb-6">
            <div className="relative min-w-0 flex-1 overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  width: `${testimonials.length * 100}%`,
                  transform: `translateX(-${index * (100 / testimonials.length)}%)`,
                }}
              >
                {testimonials.map((testimonial, i) => (
                  <div
                    key={i}
                    className="flex shrink-0 flex-col gap-2 pr-4 sm:flex-row sm:items-center sm:gap-3"
                    style={{ width: `${100 / testimonials.length}%` }}
                  >
                    <span className="inline-flex shrink-0 gap-1" aria-hidden="true">
                      {Array.from({ length: 5 }, (_, s) => (
                        <StarIcon key={s} className="h-4 w-4 text-[#EFBD3F]" />
                      ))}
                    </span>
                    <p className="min-w-0 font-sans text-card-body text-ink-900">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <span className="shrink-0 font-sans text-stat-label uppercase text-mute-400 sm:ml-auto">
                      –{testimonial.author}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {testimonials.length > 1 && (
              <div
                className="flex shrink-0 items-center gap-1.5"
                role="tablist"
                aria-label="Featured reviews"
              >
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Show review ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-colors",
                      i === index ? "bg-navy-900" : "bg-mute-300",
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          <TopStatsBar className="pt-6" />
        </div>
      </div>
    </div>
  );
}
