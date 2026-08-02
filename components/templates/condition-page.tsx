import dynamic from "next/dynamic";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { AccidentBanner } from "@/components/sections/accident-banner";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { Hero } from "@/components/sections/hero";
import { HowWeHelpSteps } from "@/components/sections/how-we-help-steps";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { UnderstandingCondition } from "@/components/sections/understanding-condition";
import { WhatWeTreat } from "@/components/sections/what-we-treat";
import { Section } from "@/components/ui/section";
import { autoAccidentSteps } from "@/content/auto-accident";
import type { Condition } from "@/content/conditions/types";
import { doctorProfileContent } from "@/content/doctor-profile";
import { pointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
import { siteConfig } from "@/content/site";
import { homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";

/** Code-split (Epic 12): keep these interactive, below-the-fold sections
 * (body-diagram selector; ConditionFaq's FaqAccordion/Framer Motion) out of
 * the initial page JS bundle. */
const PointToWhereItHurts = dynamic(() =>
  import("@/components/sections/point-to-where-it-hurts").then((m) => m.PointToWhereItHurts),
);
const ConditionFaq = dynamic(() =>
  import("@/components/sections/condition-faq").then((m) => m.ConditionFaq),
);

export interface ConditionPageProps {
  condition: Condition;
}

/** Shared section composition every condition page renders, per
 * condition-page-spec §C — extracted from app/conditions/[slug]/page.tsx
 * (ATS-061) so /auto-accident can reuse it with the accident-only
 * HowWeHelpSteps band gated on condition.flags.isAccidentVariant. Section
 * order: Hero → UnderstandingCondition → PointToWhereItHurts →
 * AccidentBanner → ComparisonTable → DoctorProfile → PatientReviews →
 * [HowWeHelpSteps, accident-variant only] → WhatWeTreat → ConditionFaq →
 * LocationIntro/LocationFooter/ContactSection. */
export function ConditionPage({ condition }: ConditionPageProps) {
  return (
    <>
      <Hero
        variant="condition"
        background={condition.hero.backgroundImage}
        conditionChip={condition.hero.eyebrowChip}
        title={condition.hero.h1}
        subhead={condition.hero.subhead}
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
      />
      <UnderstandingCondition condition={condition} />
      <PointToWhereItHurts content={pointToWhereItHurtsContent} />
      <AccidentBanner condition={condition} />
      <ComparisonTable
        variant={condition.flags.extraComparisonRows ? "auto-accident" : "default"}
      />
      <DoctorProfile variant="short" content={doctorProfileContent} />
      <PatientReviews featured={homeFeaturedTestimonial} reviews={homeReviews} />
      {condition.flags.isAccidentVariant && (
        <Section spacing="lg" className="container">
          <HowWeHelpSteps
            heading="Three steps, no waiting room for accident care"
            steps={autoAccidentSteps}
            cta={{ label: "Schedule My Car Accident Evaluation", href: siteConfig.bookingCta.href }}
          />
        </Section>
      )}
      <WhatWeTreat condition={condition} />
      <ConditionFaq condition={condition} />
      <LocationIntro />
      <LocationFooter />
      <ContactSection />
    </>
  );
}
