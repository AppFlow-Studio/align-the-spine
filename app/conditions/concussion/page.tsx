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
import { SymptomChecklist } from "@/components/sections/symptom-checklist";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { autoAccidentAttorneyQuote } from "@/content/auto-accident";
import {
  concussionFaq,
  concussionHero,
  concussionRelatedBottom,
  concussionSymptomNote,
  concussionSymptoms,
} from "@/content/concussion-page";
import { autoAccidentCondition } from "@/content/conditions/auto-accident";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata(getRoute("/conditions/concussion"));

/** /conditions/concussion — dedicated, hand-built page, same per-page
 * pattern as the other condition pages (ATS-137) and the /services/*
 * pages built this pass. Pulled from the Figma `Concussion` frame (file
 * 3oNk0hDle8VMrPJQ0W0pDG, node 251:771) — see content/concussion-page.ts
 * for the full content-fidelity notes (this frame, like
 * cervicogenic-headache's, reuses large chunks of other frames'
 * boilerplate, so several sections here are shared/reused or skipped
 * rather than bespoke).
 *
 * Section order: Hero → HeroReviewsCarousel → SymptomChecklist
 * (interactive "check your symptoms" widget, bespoke and genuinely
 * concussion-specific) → Understanding intro (heading/body with a link to
 * whiplash, photo right) → ComparisonTable (reused) → DoctorProfile
 * (reused — the Figma bio here is leftover massage-page copy with an
 * unverified PIP-billing claim) → AccidentBanner (reused) → PatientReviews
 * (reused) → attorney quote strip (reused) → CTA band → RelatedConditions
 * (8-pill bottom row) → FAQ (bespoke — the Figma FAQ here is literal
 * leftover massage-soft-tissue copy). No LocationIntro/LocationFooter/
 * ContactSection — matches the other condition/services pages' pattern. */
export default function ConcussionPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "" },
          { name: "Concussion", path: "/conditions/concussion" },
        ]}
      />
      <Hero
        variant="condition"
        background={concussionHero.backgroundImage}
        eyebrow={concussionHero.eyebrowChip}
        title={concussionHero.h1}
        subhead={concussionHero.subhead}
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

      <SymptomChecklist
        heading="Check any symptoms you've noticed since your accident:"
        symptoms={concussionSymptoms}
        note={concussionSymptomNote}
      />

      <Section>
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="flex flex-col gap-6">
            <Eyebrow>Understanding concussion trauma</Eyebrow>
            <h2 className="font-display text-h2 text-navy-900">
              The injury a car accident can cause without you hitting your head
            </h2>
            <p className="max-w-md font-sans text-body-lg text-ink-500">
              A concussion doesn&apos;t require losing consciousness or striking your head directly
              — the sudden whiplash motion of a car accident alone can cause the brain to move
              inside the skull, resulting in a mild traumatic brain injury. Post-concussion syndrome
              develops when symptoms like headaches, dizziness, or brain fog persist beyond the
              first few weeks. Because concussion and{" "}
              <Link href="/conditions/whiplash" className="underline">
                whiplash
              </Link>{" "}
              frequently occur together, treating only the neck while missing the concussion is a
              common gap in accident care. Florida gives you{" "}
              <Link href="/auto-accidents" className="underline">
                14 days
              </Link>{" "}
              to get evaluated and protect your PIP benefits.
            </p>
          </div>
          <div className="relative mx-auto aspect-[772/500] w-full max-w-lg overflow-hidden lg:mx-0">
            <Image
              src="/figma-exports/dr-abe-neck.png"
              alt="Dr. Abe Nasser examining a patient's neck"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
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

      <RelatedConditions items={concussionRelatedBottom} />

      <ConditionFaq faq={concussionFaq} />
    </>
  );
}
