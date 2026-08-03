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
import {
  neckPainAccident,
  neckPainCauses,
  neckPainFaq,
  neckPainFeelsLike,
  neckPainHero,
  neckPainHowWeTreat,
  neckPainRelatedBottom,
  neckPainRelatedMidPage,
  neckPainWarning,
} from "@/content/neck-pain-page";
import { pointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata(getRoute("/conditions/neck-pain"));

const neckPainTypeCategories = [
  {
    label: "From an accident",
    items: [
      {
        name: "Post-traumatic neck pain",
        description:
          "Neck pain following a collision or sudden impact — often delayed in onset, sometimes accompanied by headaches or restricted motion that builds over the days after",
      },
      {
        name: "Cervical herniated disc",
        description:
          "A disc in the neck pressing on a nerve root, which can happen from the force of a collision — may cause pain radiating into the shoulder or arm.",
        highlighted: true,
      },
      {
        name: "Facet joint syndrome",
        description:
          "Joint inflammation from impact or wear — a common source of persistent neck pain after a collision that doesn't resolve on its own.",
      },
    ],
  },
  {
    label: "Everyday causes",
    items: [
      {
        name: "Cervical muscle strain",
        description:
          "The most common type — tension from posture, stress, or sleep position. Responds well to adjustment and soft-tissue work.",
      },
      {
        name: "Cervical stenosis",
        description:
          "Narrowing of the spinal canal in the neck, often age-related — more common with age but can be aggravated by trauma.",
      },
    ],
  },
];

/** /conditions/neck-pain — dedicated, hand-built page (ATS-137 full-fidelity
 * rework, second condition off the generic [slug] template after
 * back-pain). whiplash/sciatica stay on the old [slug] template until
 * their own screenshots arrive.
 *
 * Section order per the Figma `neck-pain` frame (file 4mb4VDHszsaj2KEZzyjOjf,
 * node 96:3094), verified against 10 design screenshots: Hero →
 * HeroReviewsCarousel → Understanding intro (heading/body/diagram) →
 * CausesAndTypes (causes+related pills left, category-grouped Types right —
 * neck-pain has no separate When-to-see section, unlike back-pain) →
 * ComparisonTable → HowWeTreat → FeelsLike (+ warning card) →
 * AccidentBanner → PatientReviews → DoctorProfile → PointToWhereItHurts →
 * AccidentInjuries → "Still have questions?" band → RelatedConditions →
 * FAQ. No LocationIntro/LocationFooter/ContactSection — same as
 * /auto-accidents and /conditions/back-pain, the Figma frame goes straight
 * to the standard footer (rendered by RootShell). */
export default function NeckPainPage() {
  return (
    <>
      <Hero
        variant="condition"
        background={neckPainHero.backgroundImage}
        eyebrow={neckPainHero.eyebrowChip}
        title={neckPainHero.h1}
        subhead={neckPainHero.subhead}
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
            <Eyebrow>Understanding Neck Pain</Eyebrow>
            <h2 className="font-display text-h2 text-navy-900">
              Neck pain ranges from a stiff morning to something worth a real evaluation.
            </h2>
            <p className="max-w-md font-sans text-body-lg text-ink-500">
              Neck pain after a car accident needs a different evaluation than an everyday stiff
              morning. If your neck pain started after a collision, Florida gives you{" "}
              <Link href="/auto-accidents" className="underline">
                14 days
              </Link>{" "}
              to get evaluated and protect your{" "}
              <Link href="/auto-accidents" className="underline">
                PIP benefits
              </Link>{" "}
              — it may be{" "}
              <Link href="/conditions/whiplash" className="underline">
                whiplash
              </Link>{" "}
              or something structural in the{" "}
              <Link href="/services#adjustments" className="underline">
                cervical spine
              </Link>
              . Everyday neck pain is usually muscular — tension from posture, stress, or sleep
              position — and responds well to conservative care.
            </p>
            <a
              href="#types-of-neck-pain"
              className="inline-flex w-fit items-center gap-2 border-t border-mute-300 pt-4 font-sans text-stat-label uppercase tracking-[1.25px] text-navy-900 transition-colors hover:text-navy-700"
            >
              Understand Neck Pain
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
          <div className="relative mx-auto aspect-[411/737] w-full max-w-sm overflow-hidden lg:mx-0">
            <Image
              src="/figma-exports/neck-pain-anatomy-diagram.png"
              alt="Illustration of the cervical spine highlighting the cervical nerves, muscle strain/spasm, and neck pain pathway into the shoulder"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
        </Container>
      </Section>

      <div id="types-of-neck-pain" className="scroll-mt-[120px]">
        <CausesAndTypes
          causesHeading="Common Causes"
          causes={neckPainCauses}
          relatedHeading="Related Neck Pain conditions"
          relatedLinks={neckPainRelatedMidPage}
          typesHeading="Types"
          categories={neckPainTypeCategories}
        />
      </div>

      <ComparisonTable />

      <HowWeTreat items={neckPainHowWeTreat} />

      <FeelsLike
        items={neckPainFeelsLike}
        heading="More than just a stiff morning"
        warning={neckPainWarning}
      />

      <AccidentBanner accident={neckPainAccident} />

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

      <RelatedConditions items={neckPainRelatedBottom} />

      <ConditionFaq faq={neckPainFaq} />
    </>
  );
}
