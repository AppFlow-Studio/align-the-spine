import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { AccidentInjuries } from "@/components/sections/accident-injuries";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { HowWeHelpSteps } from "@/components/sections/how-we-help-steps";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { autoAccidentAttorneyQuote, autoAccidentSteps } from "@/content/auto-accident";
import { autoAccidentCondition } from "@/content/conditions/auto-accident";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
import { pointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { isVerified } from "@/content/verified-value";
import { buildMetadata } from "@/lib/seo/metadata";

/** Code-split (Epic 12): keep these interactive, below-the-fold sections
 * (body-diagram selector; FaqAccordion's Framer Motion) out of the initial
 * page JS bundle. */
const PointToWhereItHurts = dynamic(() =>
  import("@/components/sections/point-to-where-it-hurts").then((m) => m.PointToWhereItHurts),
);
const FaqAccordion = dynamic(() =>
  import("@/components/ui/faq-accordion").then((m) => m.FaqAccordion),
);

const { hero, faq, flags } = autoAccidentCondition;
// FaqAccordion/FaqJsonLd expect {question, answer} (content/faqs.ts' FAQ
// shape); Condition.faq.items uses {q, a} (content/conditions/types.ts'
// ConditionFaqItem) — map between the two.
const faqItems = faq.items.map((item) => ({ question: item.q, answer: item.a }));

// Splits hero.subhead's "PIP insurance" into an in-page link to the
// PIPCalculator further down, matching the underline shown in the Figma hero.
const [subheadBeforePip, subheadAfterPip] = hero.subhead.split("PIP insurance");
// ATS-E4 (4.5): flags.pipStat is a specific PIP-coverage dollar claim —
// only pass it to Hero once it's been client-verified.
const pipStat = flags.pipStat && isVerified(flags.pipStat) ? flags.pipStat.value : undefined;

export const metadata: Metadata = buildMetadata(getRoute("/auto-accidents"));

/** /auto-accidents page assembly (ATS-141) per the Figma "auto-accident"
 * frame (file 4mb4VDHszsaj2KEZzyjOjf): HeroSolidPanel (PIP stat callout)
 * → HeroReviewsCarousel (incl. TopStatsBar) → ComparisonTable
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
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "" },
          { name: "Auto Accidents", path: "/auto-accidents" },
        ]}
      />
      <HeroSolidPanel
        background={hero.backgroundImage}
        eyebrow={hero.eyebrowChip}
        title={
          <>
            Injured in an
            <br />
            Accident?
          </>
        }
        subhead={
          <>
            {subheadBeforePip}
            <a href="#pip-calculator" className="underline">
              PIP insurance
            </a>
            {subheadAfterPip}
          </>
        }
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        bilingualNote="¿Habla español? Dr. Abe habla su idioma."
        stat={pipStat}
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

      <ComparisonTable />

      <div id="pip-calculator">
        <AccidentBanner accident={autoAccidentCondition.accident} />
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
              No waiting room, no driving in pain — call and we&apos;ll find a time that works.
            </p>
          </div>
          <Button variant="teal" href={siteConfig.bookingCta.href} className="w-fit shrink-0">
            Schedule my Evaluation
          </Button>
        </Container>
      </Section>

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
