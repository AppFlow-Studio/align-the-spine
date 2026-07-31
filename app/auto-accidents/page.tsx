import type { Metadata } from "next";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { AccidentInjuries } from "@/components/sections/accident-injuries";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { Hero } from "@/components/sections/hero";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HowWeHelpSteps } from "@/components/sections/how-we-help-steps";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { PointToWhereItHurts } from "@/components/sections/point-to-where-it-hurts";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { autoAccidentAttorneyQuote, autoAccidentSteps } from "@/content/auto-accident";
import { autoAccidentCondition } from "@/content/conditions/auto-accident";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
import { pointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";

const { hero, faq, flags } = autoAccidentCondition;
// FaqAccordion/FaqJsonLd expect {question, answer} (content/faqs.ts' FAQ
// shape); Condition.faq.items uses {q, a} (content/conditions/types.ts'
// ConditionFaqItem) — map between the two.
const faqItems = faq.items.map((item) => ({ question: item.q, answer: item.a }));

// Splits hero.subhead's "Florida PIP insurance" into an in-page link to the
// PIPCalculator further down, matching the underline shown in the Figma hero.
const [subheadBeforePip, subheadAfterPip] = hero.subhead.split("Florida PIP insurance");

export const metadata: Metadata = {
  title: `Auto Accident Chiropractor in Deerfield Beach, FL | ${siteConfig.business.name}`,
  description:
    "Same-day auto accident evaluations, billed directly to Florida PIP. Full exam, treatment, and documentation for your claim — in-home visits available. Call (954) 573-7192.",
};

/** /auto-accidents page assembly (ATS-141) per the Figma "auto-accident"
 * frame (file 4mb4VDHszsaj2KEZzyjOjf): Hero (condition variant, PIP stat
 * callout) → HeroReviewsCarousel (incl. TopStatsBar) → ComparisonTable
 * (default 3-row variant — the Figma frame doesn't show the pre-built
 * auto-accident-only extra rows, see conversation notes) → AccidentBanner
 * w/ PIPCalculator → HowWeHelpSteps (no cta — this design's steps have no
 * button directly under them) → attorney-referral quote strip → "Ready when
 * you are" CTA band (inline, matching home-visits' established pattern) →
 * PatientReviews → DoctorProfile (short) → PointToWhereItHurts →
 * AccidentInjuries → "Still have questions? Just Call" CTA band (same
 * inline pattern) → FAQ. No LocationIntro/LocationFooter/ContactSection —
 * the Figma frame goes straight from FAQ to the standard footer. Navbar/
 * TopStatsBar-slot and the standard navy footer come from RootShell. */
export default function AutoAccidentsPage() {
  return (
    <>
      <Hero
        variant="condition"
        background={hero.backgroundImage}
        eyebrow={hero.eyebrowChip}
        title={hero.h1}
        subhead={
          <>
            {subheadBeforePip}
            <a href="#pip-calculator" className="underline">
              Florida PIP insurance
            </a>
            {subheadAfterPip}
          </>
        }
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        bilingualNote="¿Habla español? Dr. Abe habla su idioma."
        stat={flags.pipStat}
        form={{
          heading: "Schedule Your Evaluation",
          submitLabel: leadFormVariants.accidentEval.submitLabel,
          variant: leadFormVariants.accidentEval.variant,
          fields: leadFormVariants.accidentEval.fields,
          footerNote:
            "Serving Deerfield Beach, Boca Raton, Fort Lauderdale, and surrounding South Florida communities.",
        }}
      />

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} />

      <ComparisonTable />

      <div id="pip-calculator">
        <AccidentBanner condition={autoAccidentCondition} />
      </div>

      <Section spacing="lg" className="container">
        <HowWeHelpSteps
          heading="From the call to feeling like yourself again"
          steps={autoAccidentSteps}
        />
      </Section>

      <Section spacing="sm" className="bg-[#E4F9F4]">
        <p className="container text-center font-sans text-body-lg text-navy-900">
          {autoAccidentAttorneyQuote}
        </p>
      </Section>

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 text-white">Ready when you are</h2>
            <p className="font-sans text-body-lg text-mute-300">
              Same-day visits, seven days a week — no waiting room, no driving in pain.
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

      <PatientReviews featured={homeFeaturedTestimonial} reviews={homeReviews} variant="light" />

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

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow="Frequently asked questions" className="items-center text-center">
            Everything you need to know about <br /> {faq.headerTail}
          </SectionHeading>
          <FaqAccordion items={faqItems} />
          <FaqJsonLd items={faqItems} />
        </div>
      </Section>
    </>
  );
}
