import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { AccidentInjuries } from "@/components/sections/accident-injuries";
import { CausesAndTypes } from "@/components/sections/causes-and-types";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ConditionFaq } from "@/components/sections/condition-faq";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { FeelsLike } from "@/components/sections/feels-like";
import { Hero } from "@/components/sections/hero";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HowWeTreat } from "@/components/sections/how-we-treat";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { PointToWhereItHurts } from "@/components/sections/point-to-where-it-hurts";
import { RelatedConditions } from "@/components/sections/related-conditions";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
import { pointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
import {
  sciaticaAccident,
  sciaticaFaq,
  sciaticaFeelsLike,
  sciaticaHero,
  sciaticaHowWeTreat,
  sciaticaRelatedBottom,
  sciaticaRelatedMidPage,
  sciaticaSymptoms,
  sciaticaWarning,
} from "@/content/sciatica-page";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata(getRoute("/conditions/sciatica"));

const sciaticaTypes = [
  {
    items: [
      {
        name: "Herniated disc",
        description: (
          <>
            A{" "}
            <Link href="/services/spinal-decompression" className="underline">
              herniated or bulging disc
            </Link>{" "}
            pressing directly on the nerve root. The most common cause.
          </>
        ),
      },
      {
        name: "Stenotic sciatica",
        description:
          "Spinal stenosis narrows the canal and compresses the nerve. More common with age.",
        highlighted: true,
      },
      {
        name: "Piriformis syndrome",
        description:
          "The piriformis muscle compresses the nerve — not a disc issue. Common in athletes and people who sit all day.",
      },
      {
        name: "Lumbar radiculopathy",
        description:
          'Nerve root compression specifically at L4–L5 or L5–S1. The clinical diagnosis behind most sciatica cases — when a doctor says "sciatica," this is usually what they mean.',
      },
    ],
  },
];

/** /conditions/sciatica — dedicated, hand-built page (ATS-137 full-fidelity
 * rework, third condition off the generic [slug] template after back-pain
 * and neck-pain). whiplash stays on the old [slug] template until its own
 * screenshots arrive.
 *
 * Section order per the Figma `sciatica` frame (file 4mb4VDHszsaj2KEZzyjOjf,
 * node 96:813), verified against 12 design screenshots: Hero →
 * HeroReviewsCarousel → Understanding intro (heading/body/diagram) →
 * CausesAndTypes (Classic Sciatica Symptoms + Related pills left, a FLAT
 * Types list right — no "From an accident"/"Everyday causes" subheadings
 * like neck-pain has, just 4 items with one highlighted) → ComparisonTable
 * → HowWeTreat → FeelsLike (+ warning card) → AccidentBanner →
 * PatientReviews → DoctorProfile → PointToWhereItHurts → AccidentInjuries
 * → "Still have questions?" band → RelatedConditions → FAQ. No
 * LocationIntro/LocationFooter/ContactSection — same as the other
 * dedicated condition pages, the Figma frame goes straight to the standard
 * footer (rendered by RootShell).
 *
 * Unlike back-pain/neck-pain, this frame's accident-banner and FAQ copy is
 * NOT a mismatch (this genuinely is the Sciatica page) — kept verbatim,
 * see content/sciatica-page.ts's header comment. */
export default function SciaticaPage() {
  return (
    <>
      <Hero
        variant="condition"
        background={sciaticaHero.backgroundImage}
        eyebrow={sciaticaHero.eyebrowChip}
        title={sciaticaHero.h1}
        subhead={sciaticaHero.subhead}
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
            <Eyebrow>How sciatica escalates</Eyebrow>
            <h2 className="font-display text-h2 text-navy-900">
              Sciatica isn&apos;t a condition on its own — it&apos;s a symptom of nerve pressure
            </h2>
            <p className="max-w-md font-sans text-body-lg text-ink-500">
              Sciatica after a car accident may qualify for Florida PIP coverage — Dr. Abe Nasser
              uses a full evaluation to pinpoint the source of nerve compression and build a plan to
              relieve your leg pain. Sciatica itself is often caused by a{" "}
              <Link href="/services/spinal-decompression" className="underline">
                herniated disc
              </Link>{" "}
              or{" "}
              <Link href="/services/spinal-decompression" className="underline">
                spinal stenosis
              </Link>{" "}
              compressing the nerve root, whether that compression came from sudden impact or built
              up over time.
            </p>
            <a
              href="#types-of-sciatica"
              className="inline-flex w-fit items-center gap-2 border-t border-mute-300 pt-4 font-sans text-stat-label uppercase tracking-[1.25px] text-navy-900 transition-colors hover:text-navy-700"
            >
              Understand Sciatica
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
          <div className="relative mx-auto aspect-[439/787] w-full max-w-sm overflow-hidden lg:mx-0">
            <Image
              src="/figma-exports/sciatica-anatomy-diagram.png"
              alt="Illustration of the lumbar spine and sciatic nerve pathway highlighting the sacroiliac joint, pelvis, and femur"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
        </Container>
      </Section>

      <div id="types-of-sciatica" className="scroll-mt-[120px]">
        <CausesAndTypes
          causesHeading="Classic Sciatica Symptoms"
          causes={sciaticaSymptoms}
          relatedHeading="Related Sciatica Conditions"
          relatedLinks={sciaticaRelatedMidPage}
          typesHeading="Types"
          categories={sciaticaTypes}
        />
      </div>

      <ComparisonTable />

      <HowWeTreat items={sciaticaHowWeTreat} />

      <FeelsLike
        items={sciaticaFeelsLike}
        heading="Four signs it's sciatica, not just soreness."
        warning={sciaticaWarning}
      />

      <AccidentBanner accident={sciaticaAccident} />

      <PatientReviews
        featured={homeFeaturedTestimonial}
        reviews={homeReviews.slice(0, 3)}
        variant="light"
      />

      <DoctorProfile variant="short" content={doctorProfileContent} />

      <PointToWhereItHurts content={pointToWhereItHurtsContent} />

      <AccidentInjuries />

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 text-white">Still have questions? Just Call</h2>
            <p className="font-sans text-body-lg text-mute-300">
              Dr. Abe Answers the phone. No call center, no hold music.
            </p>
          </div>
          <Button
            variant="glass"
            href={siteConfig.business.phoneHref}
            eyebrow="Speak with us today"
            className="w-fit shrink-0"
          >
            Call {siteConfig.business.phone}
          </Button>
        </Container>
      </Section>

      <RelatedConditions items={sciaticaRelatedBottom} />

      <ConditionFaq faq={sciaticaFaq} />
    </>
  );
}
