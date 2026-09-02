import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { AccidentInjuries } from "@/components/sections/accident-injuries";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { ServicesSection } from "@/components/sections/services-section";
import { WhyChoose } from "@/components/sections/why-choose";
import { JsonLd } from "@/components/seo/json-ld";
import { PracticeJsonLd } from "@/components/seo/practice-json-ld";
import {
  htAccidentInjuries,
  htHomeHero,
  htHomeSections,
  htServices,
  htSpineOverviewContent,
  htWhyChooseContent,
} from "@/content/ht/home";
import { htLeadFormVariants } from "@/content/ht/lead-forms";
import { htDoctorProfileContent } from "@/content/ht/pages";
import { getHtRoute } from "@/content/ht/seo";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildHtRouteMetadata } from "@/lib/seo/metadata";

const SpineOverview = dynamic(() =>
  import("@/components/sections/spine-overview").then((m) => m.SpineOverview),
);

const route = getHtRoute("/ht");

export const metadata: Metadata = buildHtRouteMetadata(route);

/** /ht — Haitian Creole counterpart of the home page (ATS-SEO-136).
 * Composition mirrors app/(pt)/pt/page.tsx exactly; only the content
 * modules and `locale="ht"` change. */
export default function HtHome() {
  return (
    <>
      <PracticeJsonLd />
      <JsonLd
        data={buildWebPage({
          path: route.path,
          name: route.title,
          description: route.description,
          inLanguage: HREFLANG.ht,
        })}
      />
      <HeroSolidPanel
        locale="ht"
        background={{
          src: "/figma-exports/interior-reception.png",
          alt: "Resepsyon Align the Spine nan Deerfield Beach",
        }}
        title={
          <>
            {htHomeHero.titleLines[0]}
            <br />
            {htHomeHero.titleLines[1]}
          </>
        }
        badge={htHomeHero.badge}
        subhead={htHomeHero.subhead}
        callPill={{
          eyebrow: htHomeHero.callPillEyebrow,
          phone: `Rele ${siteConfig.business.phone}`,
        }}
        form={{
          heading: htHomeHero.form.heading,
          submitLabel: htLeadFormVariants.heroEval.submitLabel,
          variant: htLeadFormVariants.heroEval.variant,
          fields: htLeadFormVariants.heroEval.fields,
          footerNote: htHomeHero.form.footerNote,
        }}
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="ht" />
      <ServicesSection
        items={htServices}
        heading={htHomeSections.servicesHeading}
        locale="ht"
        hubLinks={[{ href: "/ht/sevis", label: "Wè tout sèvis yo" }]}
      />
      <WhyChoose content={htWhyChooseContent} />
      <AccidentInjuries
        items={htAccidentInjuries}
        eyebrow={htHomeSections.accidentInjuriesEyebrow}
        heading={htHomeSections.accidentInjuriesHeading}
        locale="ht"
        accidentPageLink={{
          href: "/ht/kiwoprate-pou-aksidan-machin",
          label: "Gade paj konplè nou an sou aksidan machin",
        }}
      />
      <SpineOverview content={htSpineOverviewContent} />
      <DoctorProfile
        variant="short"
        content={htDoctorProfileContent}
        doctorLink={{ href: "/ht/dr-abe-nasser", label: "Fè konesans ak Dr. Abe" }}
      />
      <PatientReviews
        featured={homeFeaturedTestimonial}
        reviews={homeReviews.slice(1, 4)}
        locale="ht"
        reviewsLink={{ href: "/ht/komante-pasyan", label: "Wè tout kòmantè yo" }}
      />
      <LocationIntro locale="ht" />
      <LocationFooter locale="ht" />
      <ContactSection locale="ht" />
    </>
  );
}
