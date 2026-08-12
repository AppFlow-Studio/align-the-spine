import type { Metadata } from "next";
import Image from "next/image";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { ContactSection } from "@/components/sections/contact-section";
import { ReviewsCarousel } from "@/components/sections/reviews-carousel";
import { Container } from "@/components/ui/container";
import { LeadForm } from "@/components/ui/lead-form";
import { Rating } from "@/components/ui/rating";
import { Section } from "@/components/ui/section";
import { leadFormVariants } from "@/content/lead-forms";
import { getRoute } from "@/content/seo";
import { getVerifiedStats, siteConfig } from "@/content/site";
import { testimonials } from "@/content/testimonials";
import { isVerified } from "@/content/verified-value";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata(getRoute("/reviews"));

/** /reviews: real, client-supplied Google reviews (content/testimonials.ts)
 * in the ReviewsCarousel spotlight. This is the smaller, already-approved
 * slice of the UI-08 brief (docs/UI_CHANGE_REQUESTS.md) — the full build
 * (live Places API rating, tag filtering, "what patients mention most"
 * chart) stays a separate, still-unapproved project; content/reviews.ts's
 * sourceUrl-gated model is what that future build will use once individual
 * review permalinks are available, so it's left as-is, just unused here
 * for now.
 *
 * Hero mirrors hero-solid-panel.tsx's photo-left/navy-panel-right
 * composition (down to the same `min-w-0` fix on the photo column — see
 * that file's history for why it's load-bearing) rather than the flat
 * navy-only band this page launched with, so it reads as a page of this
 * site instead of a generic stub. */
export default function ReviewsPage() {
  const reviews = siteConfig.reviewsRating;
  const otherStats = getVerifiedStats().filter((stat) => stat.label !== "Reviews");

  return (
    <>
      <section className="relative flex flex-col overflow-hidden lg:-mt-[176px] lg:min-h-[860px] lg:flex-row">
        <div className="relative min-h-[560px] min-w-0 lg:min-h-full lg:flex-1">
          <Image
            src="https://align-the-spine.b-cdn.net/images/review-page-hero.png"
            alt="Align the Spine Chiropractic and Wellness Center"
            fill
            priority
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="object-cover object-[75%_center]"
          />
          {/* Warm charcoal (not flat black) wash. Below `lg` the photo is
           * full-bleed and the text column spans its full width, so it
           * needs even coverage; at `lg`+ the photo narrows to its own
           * column and the text sits well clear of the subject on the
           * right, so the wash can bias left (heaviest over the text,
           * fading out toward her) instead of flattening her out of the
           * shot for no reason. */}
          <div className="absolute inset-0 bg-[#2a2318]/45 lg:bg-gradient-to-r lg:from-[#2a2318]/70 lg:via-[#2a2318]/35 lg:to-transparent" />
          <Container>
            <div className="container relative z-10 flex h-full flex-col justify-start pt-[120px] pb-16 lg:pb-16 lg:pt-[170px] lg:pr-12">
              {/* max-w-lg caps the whole text column, not just the H1 — at
               * lg+ the photo is wide enough that an unconstrained subhead
               * (previously max-w-xl on its own) reached far enough right to
               * run into her. */}
              <div className="max-w-lg">
                <h1 className="font-display text-hero font-medium text-white">
                  Patient Reviews for Align the Spine Chiropractic
                </h1>
                <p className="mt-4 font-sans text-body-lg text-white">
                  A perfect 5.0 rating from 164 real patients speaks for itself — see why South
                  Florida trusts Dr. Abe with their recovery, then start yours today.
                </p>

                {/* Big rating callout — the page's central trust signal, per
                 * the CRO brief: a 5.0/164-review social-proof anchor sized
                 * to actually stop the scroll, not just another small pill
                 * in a row. */}
                {isVerified(reviews) && (
                  <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
                    <span className="font-display text-hero text-gold-400">
                      {reviews.value.rating.toFixed(1)}
                    </span>
                    <div className="flex flex-col gap-2">
                      <Rating
                        value={reviews.value.rating}
                        filledClassName="text-gold-400 h-6 w-6 sm:h-7 sm:w-7"
                        emptyClassName="text-white/20 h-6 w-6 sm:h-7 sm:w-7"
                      />
                      <span className="font-sans text-body-lg text-white">
                        <strong className="font-semibold">
                          {reviews.value.count} five-star reviews
                        </strong>{" "}
                        and counting
                      </span>
                    </div>
                  </div>
                )}

                {otherStats.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {otherStats.map((stat) => (
                      <span
                        key={stat.label}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 py-1.5 pl-3 pr-3.5 font-sans text-stat-label text-white"
                      >
                        {stat.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Container>
        </div>

        <div className="relative flex flex-col bg-navy-900 px-6 pb-16 pt-10 sm:px-10 lg:w-[640px] lg:shrink-0 lg:px-16 lg:pb-0 lg:pt-[170px] xl:w-[760px] 2xl:w-[800px]">
          <LeadForm
            heading="Experience 5-Star Care Yourself"
            variant={leadFormVariants.reviewsEval.variant}
            fields={leadFormVariants.reviewsEval.fields}
            submitLabel={leadFormVariants.reviewsEval.submitLabel}
            submitVariant="teal"
            fieldOutline
            labelCase="none"
            headingClassName="mb-4 font-display text-h2 !leading-[1.15] text-white"
            className="gap-y-4"
          />
          <p className="mt-6 font-sans text-body-lg text-mute-300">
            Same-day appointments often available. Serving Deerfield Beach, Boca Raton, Fort
            Lauderdale, and surrounding South Florida communities.
          </p>
        </div>
      </section>

      <Section spacing="lg" className="container">
        <ReviewsCarousel reviews={testimonials} />
      </Section>

      <LocationIntro />
      <LocationFooter />
      <ContactSection />
    </>
  );
}
