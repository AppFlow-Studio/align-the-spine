import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { AccidentBanner } from "@/components/sections/accident-banner";
import { AccidentInjuries } from "@/components/sections/accident-injuries";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ConditionFaq } from "@/components/sections/condition-faq";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { FeelsLike } from "@/components/sections/feels-like";
import { Hero } from "@/components/sections/hero";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HowWeHelpSteps } from "@/components/sections/how-we-help-steps";
import { HowWeTreat } from "@/components/sections/how-we-treat";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { PointToWhereItHurts } from "@/components/sections/point-to-where-it-hurts";
import { RelatedConditions } from "@/components/sections/related-conditions";
import { UnderstandingCondition } from "@/components/sections/understanding-condition";
import { WhenToSee } from "@/components/sections/when-to-see";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { autoAccidentSteps } from "@/content/auto-accident";
import type { Condition } from "@/content/conditions/types";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
import { pointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";

export interface ConditionPageProps {
  condition: Condition;
}

/** Shared section composition every condition page renders, per the actual
 * Figma condition-page frames (verified against `back-pain`, ATS-137 — the
 * original ATS-061 version of this template was a simplified first pass
 * that didn't match Figma's fuller section set). Section order: Hero (with
 * lead form) → HeroReviewsCarousel → UnderstandingCondition → ComparisonTable
 * → WhenToSee → HowWeTreat → FeelsLike → AccidentBanner →
 * [HowWeHelpSteps, accident-variant only] → PatientReviews → DoctorProfile →
 * PointToWhereItHurts → AccidentInjuries ("Common accident injuries we
 * treat" — same generic grid Figma reuses per condition, not
 * condition.whatWeTreat) → StillHaveQuestions band → RelatedConditions →
 * ConditionFaq → LocationIntro/LocationFooter/ContactSection.
 *
 * WhenToSee/HowWeTreat/FeelsLike/RelatedConditions are optional on
 * `Condition` and conditionally rendered — only back-pain has this content
 * authored so far (ATS-137); neck-pain/whiplash/sciatica render without
 * them until they're authored to the same depth. */
export function ConditionPage({ condition }: ConditionPageProps) {
  return (
    <>
      <Hero
        variant="condition"
        background={condition.hero.backgroundImage}
        eyebrow={condition.hero.eyebrowChip}
        title={condition.hero.h1}
        subhead={condition.hero.subhead}
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

      <UnderstandingCondition condition={condition} />

      <ComparisonTable
        variant={condition.flags.extraComparisonRows ? "auto-accident" : "default"}
      />

      {condition.whenToSee && <WhenToSee data={condition.whenToSee} />}

      {condition.howWeTreat && <HowWeTreat items={condition.howWeTreat} />}

      {condition.feelsLike && (
        <FeelsLike
          items={condition.feelsLike}
          heading={`Not all ${condition.name.toLowerCase()} feels the same`}
        />
      )}

      <AccidentBanner condition={condition} />

      {condition.flags.isAccidentVariant && (
        <Section spacing="lg" className="container">
          <HowWeHelpSteps
            heading="Three steps, no waiting room for accident care"
            steps={autoAccidentSteps}
            cta={{ label: "Schedule My Car Accident Evaluation", href: siteConfig.bookingCta.href }}
          />
        </Section>
      )}

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

      {condition.relatedConditions && <RelatedConditions items={condition.relatedConditions} />}

      <ConditionFaq condition={condition} />
      <LocationIntro />
      <LocationFooter />
      <ContactSection />
    </>
  );
}
