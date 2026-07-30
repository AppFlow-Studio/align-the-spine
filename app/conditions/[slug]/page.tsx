import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { AccidentBanner } from "@/components/sections/accident-banner";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ConditionFaq } from "@/components/sections/condition-faq";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { Hero } from "@/components/sections/hero";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { PointToWhereItHurts } from "@/components/sections/point-to-where-it-hurts";
import { UnderstandingCondition } from "@/components/sections/understanding-condition";
import { WhatWeTreat } from "@/components/sections/what-we-treat";
import { conditionsBySlug } from "@/content/conditions";
import { doctorProfileContent } from "@/content/doctor-profile";
import { pointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
import { siteConfig } from "@/content/site";
import { homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";

type ConditionPageProps = { params: Promise<{ slug: string }> };

/** Static params for the 4 in-scope condition routes (ATS-061). auto-accidents
 * intentionally excluded — see Global Constraints. */
export function generateStaticParams() {
  return Object.keys(conditionsBySlug).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ConditionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const condition = conditionsBySlug[slug];
  if (!condition) return {};

  const title = `${condition.hero.h1} | ${siteConfig.business.name}`;
  const description = condition.hero.subhead;
  const url = `${siteConfig.siteUrl}/conditions/${condition.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [
        { url: condition.hero.backgroundImage.src, alt: condition.hero.backgroundImage.alt },
      ],
    },
  };
}

/** /conditions/[slug] template (ATS-061) per condition-page-spec §B (full),
 * §C: the single data-driven template every condition page renders through.
 * Section order: Hero → UnderstandingCondition → PointToWhereItHurts →
 * AccidentBanner → ComparisonTable → DoctorProfile → PatientReviews →
 * WhatWeTreat → ConditionFaq → LocationIntro/LocationFooter/ContactSection.
 * StillHaveQuestions intentionally omitted and auto-accidents intentionally
 * excluded from generateStaticParams — both are explicit scope decisions,
 * see docs/superpowers/specs/2026-07-30-condition-page-template-design.md. */
export default async function ConditionPage({ params }: ConditionPageProps) {
  const { slug } = await params;
  const condition = conditionsBySlug[slug];
  if (!condition) notFound();

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
      <WhatWeTreat condition={condition} />
      <ConditionFaq condition={condition} />
      <LocationIntro />
      <LocationFooter />
      <ContactSection />
    </>
  );
}
