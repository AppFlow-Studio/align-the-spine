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
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata(getRoute("/services/spinal-decompression"));

const relatedBottom: ConditionRelatedLink[] = [
  { label: "Lower Back Pain", href: "/conditions/back-pain" },
  { label: "Auto Accident Injuries", href: "/auto-accidents", highlighted: true },
  { label: "Neck Pain", href: "/conditions/neck-pain" },
  { label: "Chiropractic Adjustments", href: "/services/chiropractic-adjustments" },
  { label: "Whiplash", href: "/conditions/whiplash" },
  { label: "Home Visit Care", href: "/home-visits" },
  { label: "Sciatica", href: "/conditions/sciatica" },
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
 * anatomy diagrams) → ComparisonTable (reused) → DoctorProfile (reused —
 * the Figma bio here has an unverified "handles the documentation and
 * billing directly with your PIP claim" claim, see
 * content/spinal-decompression-page.ts) → AccidentBanner (reuses
 * autoAccidentCondition.accident — identical copy in this frame) →
 * PatientReviews (reused) → attorney quote strip (reuses
 * autoAccidentAttorneyQuote, already compliance-scrubbed) → CTA band →
 * RelatedConditions (8-pill bottom row) → FAQ (bespoke — this frame's FAQ
 * heading is the same "...chiropractic adjustments" copy-paste bug found
 * elsewhere). No LocationIntro/LocationFooter/ContactSection — matches
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
            <h2 className="font-display text-h2 text-navy-900">
              The pressure a car accident leaves behind
            </h2>
            <p className="max-w-md font-sans text-body-lg text-ink-500">
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
              className="inline-flex w-fit items-center gap-2 border-t border-mute-300 pt-4 font-sans text-stat-label uppercase tracking-[1.25px] text-navy-900 transition-colors hover:text-navy-700"
            >
              Understand Decompression
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
          <div className="relative mx-auto aspect-[772/500] w-full max-w-lg overflow-hidden lg:mx-0">
            <Image
              src="/figma-exports/drabe-traction_compression.png"
              alt="Spinal traction and decompression therapy"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </Section>

      <div id="how-it-works" className="scroll-mt-[120px] bg-navy-900">
        <Section>
          <Container className="flex flex-col gap-14">
            <div className="flex flex-col gap-3">
              <Eyebrow variant="onDark">How it works</Eyebrow>
              <h2 className="font-display text-h2 text-white">
                A gradual process, not a single fix
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-10 border-t border-white/20 pt-10 sm:grid-cols-3">
              {decompressionHowItWorks.map((step) => (
                <div key={step.title} className="flex flex-col gap-3">
                  <h3 className="font-display text-h2 text-white">{step.title}</h3>
                  <p className="font-sans text-body-lg text-mute-300">{step.description}</p>
                  {step.learnMoreHref && (
                    <Link
                      href={step.learnMoreHref}
                      className="inline-flex w-fit items-center gap-2 font-sans text-stat-label uppercase text-white transition-colors hover:text-mute-300"
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
            {decompressionConditions.map((condition) => (
              <div
                key={condition.name}
                className="grid grid-cols-1 items-center gap-6 py-8 sm:grid-cols-[200px_1fr]"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden sm:w-[200px]">
                  <Image
                    src={condition.image.src}
                    alt={condition.image.alt}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-h2 text-navy-900">{condition.name}</h3>
                  <p className="font-sans text-body-lg text-ink-500">{condition.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <ComparisonTable />

      <DoctorProfile variant="short" content={doctorProfileContent} />

      <AccidentBanner accident={autoAccidentCondition.accident} />

      <PatientReviews featured={homeFeaturedTestimonial} reviews={homeReviews} />

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

      <RelatedConditions items={relatedBottom} />

      <ConditionFaq faq={decompressionFaq} />
    </>
  );
}
