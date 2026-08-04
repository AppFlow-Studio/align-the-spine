import type { Metadata } from "next";
import Link from "next/link";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { ContactSection } from "@/components/sections/contact-section";
import { GoogleIcon } from "@/components/ui/icons/google";
import { Rating } from "@/components/ui/rating";
import { Section } from "@/components/ui/section";
import { externalReviewProfile, reviews } from "@/content/reviews";
import { getRoute } from "@/content/seo";
import { isVerified } from "@/content/verified-value";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata(getRoute("/reviews"));

const publishedReviews = reviews.filter((review) => review.publicationStatus === "published");

/** /reviews (ATS-E3 3.2). No approved review data exists yet — see
 * content/reviews.ts. Ships a neutral empty state (not fake reviews, not
 * a blank page) plus a link to a verified external review profile, gated
 * behind the same VerifiedValue pattern as every other unconfirmed claim
 * (ATS-E4). No aggregate-rating structured data is emitted until real,
 * published reviews exist — see content/seo.ts's "/reviews" entry, which
 * stays status: "draft" (noindex, out of the sitemap) until then too. */
export default function ReviewsPage() {
  return (
    <>
      <div className="-mt-[460px] bg-navy-900 pb-16 pt-[340px] min-[400px]:-mt-[392px] min-[400px]:pt-[280px] sm:-mt-[304px] md:-mt-[240px] md:pt-[220px] lg:-mt-[176px] lg:pt-[260px]">
        <div className="container">
          <h1 className="font-display text-hero text-white">
            Patient Reviews for Align the Spine Chiropractic
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-body-lg text-mute-300">
            We only publish reviews we can verify against their original source.
          </p>
        </div>
      </div>

      <Section spacing="lg" className="container">
        {publishedReviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {publishedReviews.map((review) => (
              <div
                key={review.sourceUrl}
                className="flex flex-col gap-3 border-t border-mute-300 pt-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <Rating value={review.rating} />
                  <span className="inline-flex items-center gap-2 font-sans text-stat-label uppercase text-mute-400">
                    {review.source}
                    <GoogleIcon className="h-4 w-4" />
                  </span>
                </div>
                <p className="font-sans text-card-body text-ink-900">
                  &ldquo;{review.excerpt}&rdquo;
                </p>
                <a
                  href={review.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="font-sans text-stat-label uppercase text-navy-900 hover:text-navy-700"
                >
                  View original review
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
            <p className="font-sans text-body-lg text-ink-500">
              We&apos;re in the process of collecting verified patient reviews to publish here.
              Check back soon.
            </p>
            {isVerified(externalReviewProfile) && (
              <Link
                href={externalReviewProfile.value.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="font-sans text-stat-label uppercase text-navy-900 hover:text-navy-700"
              >
                Read reviews on {externalReviewProfile.value.label}
              </Link>
            )}
          </div>
        )}
      </Section>

      <LocationIntro />
      <LocationFooter />
      <ContactSection />
    </>
  );
}
