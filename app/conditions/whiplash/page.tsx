import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { AccidentInjuries } from "@/components/sections/accident-injuries";
import { CausesAndTypes } from "@/components/sections/causes-and-types";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ConditionFaq } from "@/components/sections/condition-faq";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { SymptomWarningCard } from "@/components/sections/feels-like";
import { FeelsLikeBand } from "@/components/sections/feels-like-band";
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
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import {
  whiplashAccident,
  whiplashFaq,
  whiplashFeelsLike,
  whiplashHero,
  whiplashHowWeTreat,
  whiplashRelatedBottom,
  whiplashRelatedMidPage,
  whiplashSymptoms,
  whiplashWarning,
} from "@/content/whiplash-page";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata(getRoute("/conditions/whiplash"));

const whiplashTypes = [
  {
    items: [
      {
        name: "Grade I–II",
        description:
          "Muscle and ligament strain without nerve involvement — the majority of cases, responsive to conservative care.",
      },
      {
        name: "Grade III",
        description:
          "Involves neurological symptoms like numbness or weakness — needs a full evaluation",
        highlighted: true,
      },
      {
        name: "Grade IV",
        description:
          "Fracture or dislocation — rare but critical; requires immediate emergency imaging before any chiropractic care.",
      },
      {
        name: "Cervicogenic headache",
        description:
          "Headaches originating from the cervical spine after impact — very common in the days following a collision.",
      },
      {
        name: "Post-traumatic neck syndrome",
        description:
          "Chronic stiffness and restricted motion that develops when whiplash goes untreated in the initial weeks.",
      },
    ],
  },
];

/** /conditions/whiplash — dedicated, hand-built page (ATS-137 full-fidelity
 * rework, fourth and final condition off the generic [slug] template).
 * All 4 conditions are now dedicated pages — the [slug] template and its
 * Condition-schema content files are removed in the same change.
 *
 * Section order per the Figma `whiplash` frame (file 4mb4VDHszsaj2KEZzyjOjf,
 * node 96:2629), verified against 11 design screenshots + 1 follow-up
 * screenshot for FeelsLikeBand: Hero → HeroReviewsCarousel → Understanding
 * intro (diagram LEFT, heading/body RIGHT — the only condition page with
 * this side flipped from back-pain/neck-pain/sciatica) → FeelsLikeBand
 * (full-bleed dark "What Whiplash Feels Like" photo band — Figma's actual
 * position for this content, unlike every other condition page's plain
 * FeelsLike grid lower on the page) → CausesAndTypes (Classic Whiplash
 * Symptoms + 6 related pills left, a flat 5-item Types list right) →
 * ComparisonTable → HowWeTreat → SymptomWarningCard (the "See a doctor
 * promptly" photo+bullets card — same content FeelsLike's `warning` prop
 * renders elsewhere, extracted so it can sit here on its own since the
 * grid it normally pairs with moved into FeelsLikeBand) → AccidentBanner →
 * PatientReviews → DoctorProfile → PointToWhereItHurts → AccidentInjuries
 * → "Still have questions?" band → RelatedConditions → FAQ. No
 * LocationIntro/LocationFooter/ContactSection — same as the other
 * dedicated condition pages, the Figma frame goes straight to the standard
 * footer (rendered by RootShell).
 *
 * Unlike back-pain/neck-pain, most of this frame's copy is genuinely
 * whiplash-specific (see content/whiplash-page.ts's header comment for the
 * one exception, the FAQ's first answer). */
export default function WhiplashPage() {
  return (
    <>
      <Hero
        variant="condition"
        background={whiplashHero.backgroundImage}
        eyebrow={whiplashHero.eyebrowChip}
        title={whiplashHero.h1}
        subhead={whiplashHero.subhead}
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        bilingualNote="¿Habla español? Dr. Abe habla su idioma."
        form={{
          heading: "Schedule Your Evaluation",
          submitLabel: leadFormVariants.heroEval.submitLabel,
          variant: leadFormVariants.heroEval.variant,
          fields: leadFormVariants.heroEval.fields,
          footerNote:
            "Serving Deerfield Beach, Boca Raton, Fort Lauderdale, and surrounding South Florida communities.",
        }}
      />

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} />

      <Section>
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="relative mx-auto aspect-[573/731] w-full max-w-sm overflow-hidden lg:mx-0">
            <Image
              src="/figma-exports/whiplash-anatomy-diagram.png"
              alt="Illustration of the cervical spine highlighting cervical nerve pain, disc herniation, and the spinal cord"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col gap-6">
            <Eyebrow>Understanding whiplash</Eyebrow>
            <h2 className="font-display text-h2 text-navy-900">
              Whiplash is a soft-tissue neck injury from rapid motion — usually a car accident, but
              not always.
            </h2>
            <div className="flex flex-col gap-4 font-sans text-body-lg text-ink-500">
              <p>
                Whiplash is most commonly caused by{" "}
                <Link href="/auto-accidents" className="underline">
                  rear-end collisions
                </Link>{" "}
                — the sudden force snaps the head forward and back faster than the neck muscles can
                brace for. Symptoms often appear 24–72 hours after impact, which is why many people
                feel fine at the scene. Florida law gives you{" "}
                <Link href="/auto-accidents" className="underline">
                  14 days
                </Link>{" "}
                to get evaluated and protect your{" "}
                <Link href="/auto-accidents" className="underline">
                  PIP benefits
                </Link>{" "}
                — don&apos;t wait for symptoms to peak before calling.
              </p>
              <p>
                Left untreated, whiplash can involve the{" "}
                <Link href="/services#adjustments" className="underline">
                  cervical spine
                </Link>{" "}
                and in more severe cases contribute to a{" "}
                <Link href="/services#spinal-decompression" className="underline">
                  herniated disc
                </Link>
                . Early evaluation is what determines whether whiplash resolves in weeks or becomes
                chronic.
              </p>
            </div>
            <a
              href="#types-of-whiplash"
              className="inline-flex w-fit items-center gap-2 border-t border-mute-300 pt-4 font-sans text-stat-label uppercase tracking-[1.25px] text-navy-900 transition-colors hover:text-navy-700"
            >
              Understand Whiplash
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
        </Container>
      </Section>

      <FeelsLikeBand
        eyebrow="What Whiplash Feels Like"
        heading="Symptoms that show up days later"
        items={whiplashFeelsLike}
        background={{
          src: "/figma-exports/whiplash-feels-band-bg.png",
          alt: "Close-up of a hand reaching toward a shoulder in soft, warm light",
        }}
      />

      <div id="types-of-whiplash" className="scroll-mt-[120px]">
        <CausesAndTypes
          causesHeading="Classic Whiplash Symptoms"
          causes={whiplashSymptoms}
          relatedHeading="Related Whiplash conditions"
          relatedLinks={whiplashRelatedMidPage}
          typesHeading="Types"
          categories={whiplashTypes}
        />
      </div>

      <ComparisonTable />

      <HowWeTreat items={whiplashHowWeTreat} />

      <Section>
        <Container>
          <SymptomWarningCard warning={whiplashWarning} />
        </Container>
      </Section>

      <AccidentBanner accident={whiplashAccident} />

      <PatientReviews featured={homeFeaturedTestimonial} reviews={homeReviews} />

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

      <RelatedConditions items={whiplashRelatedBottom} />

      <ConditionFaq faq={whiplashFaq} />
    </>
  );
}
