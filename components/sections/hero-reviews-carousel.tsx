"use client";

import { useEffect, useId, useState, type KeyboardEvent } from "react";

import { TopStatsBar } from "@/components/layout/top-stats-bar";
import { StarIcon } from "@/components/ui/icons/star";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import { resolveTestimonialQuote } from "@/content/testimonials";
import type { Testimonial } from "@/content/testimonials";
import { cn } from "@/lib/cn";
import { highlightReviewKeywords } from "@/lib/highlight-review-keywords";

/** Tablist label/per-tab name — previously hardcoded English regardless of
 * `locale` (ATS-SEO-124 review finding), same gap fixed in
 * reviews-carousel.tsx's CAROUSEL_LABELS. */
const CAROUSEL_LABELS: Record<Locale, { tablist: string; showReview: (n: number) => string }> = {
  en: { tablist: "Featured reviews", showReview: (n) => `Show review ${n}` },
  es: { tablist: "Reseñas destacadas", showReview: (n) => `Mostrar reseña ${n}` },
  pt: { tablist: "Avaliações em destaque", showReview: (n) => `Mostrar avaliação ${n}` },
  ht: { tablist: "Kòmantè enpòtan", showReview: (n) => `Montre kòmantè ${n}` },
};

export interface HeroReviewsCarouselProps {
  testimonials: Testimonial[];
  /** Language for the embedded TopStatsBar's labels. Without this the
   * Spanish pages rendered the English stat row ("Reviews / Visits / When
   * it applies / ...") under Spanish headings. */
  locale?: Locale;
}

const AUTO_ADVANCE_MS = 7000;

/** Floating review-card carousel that overlaps Hero's bottom edge, per the
 * homepage artboard: a rotating star-rated quote + author (dot pagination)
 * over the same five-stat row TopStatsBar renders (Reviews/Visits/When it
 * applies/Bilingual care/Insurance) — TopStatsBar itself stays hidden behind
 * Hero's negative top margin on every page, so this is what actually makes
 * that stat row visible. Quote/author slide via a translateX track (current
 * exits left, next enters from the right) — pagination dots sit outside the
 * sliding viewport so they never move. */
export function HeroReviewsCarousel({
  testimonials,
  locale = DEFAULT_LOCALE,
}: HeroReviewsCarouselProps) {
  const [index, setIndex] = useState(0);
  // WCAG 2.2.2 (Pause, Stop, Hide): auto-advance stops while a pointer or
  // keyboard focus is anywhere in the carousel, and never starts at all for
  // prefers-reduced-motion (ATS-134).
  const [paused, setPaused] = useState(false);
  const baseId = useId();
  const labels = CAROUSEL_LABELS[locale];

  useEffect(() => {
    if (testimonials.length <= 1 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [testimonials.length, paused]);

  // See reviews-carousel.tsx's identical onTabKeyDown for why (APG tabs
  // pattern: arrow keys move both selection and focus among tabs).
  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    let next: number | null = null;
    if (event.key === "ArrowRight") next = index + 1;
    else if (event.key === "ArrowLeft") next = index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = testimonials.length - 1;
    if (next === null) return;
    event.preventDefault();
    const normalized = (next + testimonials.length) % testimonials.length;
    setIndex(normalized);
    const tabs =
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[normalized]?.focus();
  }

  return (
    <div
      className="bg-white py-2 relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-white via-white/80 to-transparent"
      />

      <div className="container">
        <div className="bg-white py-8">
          {/* ATS-E4 (4.11): omitted entirely when there are no real,
           * client-approved testimonials — an empty bordered row with
           * nothing in it read as a layout bug, not "nothing to show yet". */}
          {testimonials.length > 0 && (
            <div className="flex flex-col gap-4 border-b border-mute-300 pb-6 sm:flex-row sm:items-center sm:justify-between">
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
                      role="tabpanel"
                      id={`${baseId}-panel-${i}`}
                      aria-labelledby={`${baseId}-tab-${i}`}
                      aria-hidden={i !== index}
                      className="flex shrink-0 flex-col gap-2 pr-4 sm:flex-row sm:items-center sm:gap-3"
                      style={{ width: `${100 / testimonials.length}%` }}
                    >
                      <span className="inline-flex shrink-0 gap-1" aria-hidden="true">
                        {Array.from({ length: 5 }, (_, s) => (
                          <StarIcon key={s} className="h-4 w-4 text-yellow-400" />
                        ))}
                      </span>
                      <p
                        className="min-w-0 font-sans text-card-body text-ink-900"
                        lang={resolveTestimonialQuote(testimonial, locale).lang}
                      >
                        &ldquo;
                        {highlightReviewKeywords(resolveTestimonialQuote(testimonial, locale).text)}
                        &rdquo;
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
                  className="flex shrink-0 items-center justify-center gap-1.5 sm:justify-start"
                  role="tablist"
                  aria-label={labels.tablist}
                >
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      id={`${baseId}-tab-${i}`}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-controls={`${baseId}-panel-${i}`}
                      aria-label={labels.showReview(i + 1)}
                      tabIndex={i === index ? 0 : -1}
                      onClick={() => setIndex(i)}
                      onKeyDown={onTabKeyDown}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-colors",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500",
                        i === index ? "bg-navy-900" : "bg-mute-300",
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <TopStatsBar locale={locale} className="pt-6" />
        </div>
      </div>
    </div>
  );
}
