import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ConditionFaq } from "@/components/sections/condition-faq";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { Hero } from "@/components/sections/hero";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { RelatedConditions } from "@/components/sections/related-conditions";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { autoAccidentAttorneyQuote } from "@/content/auto-accident";
import { autoAccidentCondition } from "@/content/conditions/auto-accident";
import type { ConditionRelatedLink } from "@/content/conditions/types";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import {
  decompressionConditions,
  decompressionFaq,
  decompressionHowItWorks,
  spinalDecompressionHero,
} from "@/content/spinal-decompression-page";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { cn } from "@/lib/cn";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata(getRoute("/services/spinal-decompression"));

const relatedMidPageHeading = "Often needed alongside other post-accident care";

const relatedMidPage: ConditionRelatedLink[] = [
  { label: "Lower Back Pain", href: "/conditions/back-pain" },
  { label: "Auto Accident Injuries", href: "/auto-accidents", highlighted: true },
  { label: "Neck Pain", href: "/conditions/neck-pain" },
  { label: "Spinal Decompression", href: "/services/spinal-decompression" },
  { label: "Whiplash", href: "/conditions/whiplash" },
  { label: "Home Visit Care", href: "/home-visits" },
  { label: "Herniated Disc", href: "/services/spinal-decompression" },
  { label: "View All Treatments", href: "/services" },
];

/** /services/spinal-decompression — dedicated, hand-built page, same
 * per-page pattern as the condition pages (ATS-137) and
 * /services/chiropractic-adjustments (ATS-141 follow-up). Pulled from the
 * Figma `services-spinal-decompression` frame (file 3oNk0hDle8VMrPJQ0W0pDG,
 * node 135:326).
 *
 * Section order: Hero → HeroReviewsCarousel → Understanding intro
 * (heading/body with links to sciatica/back-pain/neck-pain, photo right) →
 * How It Works (3-step, dark navy per this frame — unlike the
 * adjustments page's white "How it works") → Conditions decompression
 * relieves (bespoke 4-row list, reuses the condition pages' existing
 * anatomy diagrams) → ComparisonTable (reused) → RelatedConditions mid-page
 * band ("Often needed alongside other post-accident care", light gray
 * background) → DoctorProfile (reused —
 * the Figma bio here has an unverified "handles the documentation and
 * billing directly with your PIP claim" claim, see
 * content/spinal-decompression-page.ts) → AccidentBanner (reuses
 * autoAccidentCondition.accident — identical copy in this frame) →
 * PatientReviews (reused) → attorney quote strip (reuses
 * autoAccidentAttorneyQuote, already compliance-scrubbed) → CTA band →
 * FAQ (bespoke — this frame's FAQ heading is the same "...chiropractic
 * adjustments" copy-paste bug found elsewhere). No bottom RelatedConditions
 * pill row or LocationIntro/LocationFooter/ContactSection — matches
 * /auto-accidents' and /services/chiropractic-adjustments' pattern. */
export default function SpinalDecompressionPage() {
  return (
    <>
      <Hero
        variant="condition"
        background={spinalDecompressionHero.backgroundImage}
        eyebrow={spinalDecompressionHero.eyebrowChip}
        title={spinalDecompressionHero.h1}
        subhead={spinalDecompressionHero.subhead}
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        form={{
          heading: "Schedule Your Evaluation",
          submitLabel: leadFormVariants.heroEval.submitLabel,
          variant: leadFormVariants.heroEval.variant,
          fields: leadFormVariants.heroEval.fields,
          footerNote: "Call us to check availability in your area.",
        }}
      />

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} />

      <Section>
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="flex flex-col gap-6">
            <Eyebrow>Understanding the treatment</Eyebrow>
            <h2 className="font-display text-5xl text-navy-900">
              The pressure a car accident leaves behind
            </h2>
            <p className="font-sans text-body-lg text-ink-900">
              When a disc bulges or herniates — from a collision&apos;s impact or from years of wear
              — it can press directly on a nerve root, causing the radiating pain we see in{" "}
              <Link href="/conditions/sciatica" className="underline">
                sciatica
              </Link>{" "}
              and disc-related{" "}
              <Link href="/conditions/back-pain" className="underline">
                back pain
              </Link>{" "}
              or{" "}
              <Link href="/conditions/neck-pain" className="underline">
                neck pain
              </Link>
              . Spinal decompression uses gentle, controlled traction to create negative pressure
              inside the disc, drawing it back into place and taking pressure off the nerve —
              without surgery.
            </p>
            <a
              href="#how-it-works"
              className="inline-flex w-fit items-center gap-2 pt-4 font-sans text-stat-label uppercase tracking-[1.25px] text-navy-900 transition-colors duration-300 hover:text-navy-700 underline decoration-transparent hover:decoration-navy-700 underline-offset-4"
            >
              Understand Decompression
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
          <div className="mx-auto flex justify-end w-full max-w-4xl gap-6 lg:mx-0">
            <div className="flex flex-1 flex-col gap-4 w-full group">
              <div className="relative aspect-video w-full overflow-hidden max-w-full">
                <Image
                  src="/figma-exports/decompression-under-compression.png"
                  alt="Disc under compression, pressing on the nerve root"
                  fill
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="object-cover border border-black"
                />
              </div>
              <div className="flex flex-col gap-1 text-center">
                <span className="font-sans text-stat-label uppercase text-navy-900 transition-colors duration-300 group-hover:text-teal-500">
                  Under Compression
                </span>
                <p className="max-w-64 mx-auto font-sans text-stat-label text-ink-500">
                  Disc presses on the nerve root, causing pain
                </p>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 w-full group">
              <div className="relative aspect-video w-full overflow-hidden max-w-full">
                <Image
                  src="/figma-exports/decompression-under-decompression.png"
                  alt="Disc under decompression, space restored and pressure relieved"
                  fill
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="object-cover border border-black"
                />
              </div>
              <div className="flex flex-col gap-1 text-center">
                <span className="font-sans text-stat-label uppercase text-navy-900 transition-colors duration-300 group-hover:text-teal-500">
                  Under Decompression
                </span>
                <p className="max-w-64 mx-auto font-sans text-stat-label text-ink-500">
                  Space restored, pressure on the nerve relieved
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <div id="how-it-works" className="relative scroll-mt-[120px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/figma-exports/whiplash-feels-band-bg.png"
            alt="Close-up of a hand reaching toward a shoulder in soft, warm light"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0" />
        </div>
        <Section className="relative">
          <Container className="flex flex-col gap-14">
            <div className="flex flex-col gap-3">
              <Eyebrow variant="onDark">How it works</Eyebrow>
              <h2 className="font-display text-h2 text-white">
                A gradual process, not a single fix
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              {decompressionHowItWorks.map((step, idx) => (
                <div key={step.title} className="group flex flex-col gap-3">
                  <h3
                    className={cn(
                      "font-display text-h2 leading-10 text-white transition-colors duration-200 group-hover:text-teal-500",
                    )}
                  >
                    {step.title}
                  </h3>
                  <hr
                    className={cn(
                      "border-t border-white/20 transition-colors duration-200 group-hover:border-teal-500",
                    )}
                  />
                  <p className="font-sans text-body-lg text-mute-300">{step.description}</p>
                  {step.learnMoreHref && (
                    <Link
                      href={step.learnMoreHref}
                      className={cn(
                        "inline-flex w-fit items-center gap-2 font-sans text-stat-label uppercase transition-colors duration-200 text-white hover:text-mute-300 group-hover:text-teal-500",
                      )}
                    >
                      Learn more
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </Section>
      </div>

      <Section>
        <Container className="flex flex-col gap-14">
          <SectionHeading eyebrow="What it treats">
            Conditions decompression relieves
          </SectionHeading>
          <div className="flex flex-col divide-y divide-mute-300 border-t border-mute-300">
            {decompressionConditions.map((condition, idx) => (
              <div
                key={condition.name}
                className="grid grid-cols-1 items-center gap-6 py-8 sm:grid-cols-[200px_1fr_1fr] group"
              >
                <div className="relative aspect-3/2 w-full overflow-hidden sm:w-50">
                  <Image
                    src={condition.image.src}
                    alt={condition.image.alt}
                    fill
                    sizes="200px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3
                  className={cn(
                    "font-display text-h2 text-navy-900 group-hover:text-teal-500 transition-colors duration-300",
                  )}
                >
                  {condition.name}
                </h3>
                <p className="font-sans text-body-lg text-ink-500">{condition.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <ComparisonTable />

      <RelatedConditions
        items={relatedMidPage}
        heading={relatedMidPageHeading}
        className="bg-[#F5F6F8]"
      />

      <DoctorProfile variant="short" content={doctorProfileContent} />

      <AccidentBanner accident={autoAccidentCondition.accident} />

      <PatientReviews
        featured={homeFeaturedTestimonial}
        reviews={homeReviews.slice(0, 3)}
        variant="light"
      />

      <Section spacing="sm" className="bg-[#E4F9F4]">
        <p className="container text-center font-sans text-body-lg text-navy-900">
          {autoAccidentAttorneyQuote}
        </p>
      </Section>

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 text-white">
              Still have questions about your accident claim?
            </h2>
            <p className="font-sans text-body-lg text-mute-300">
              No waiting room, no driving in pain — call and we&apos;ll find a time that works.
            </p>
          </div>
          <Button
            variant="teal"
            href={siteConfig.bookingCta.href}
            className="w-fit shrink-0 rounded-none!"
          >
            Schedule my Evaluation
          </Button>
        </Container>
      </Section>

      <ConditionFaq faq={decompressionFaq} />
    </>
  );
}
