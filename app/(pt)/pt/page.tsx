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
import { HREFLANG } from "@/content/i18n";
import {
  ptAccidentInjuries,
  ptHomeHero,
  ptHomeSections,
  ptServices,
  ptSpineOverviewContent,
  ptWhyChooseContent,
} from "@/content/pt/home";
import { ptLeadFormVariants } from "@/content/pt/lead-forms";
import { ptDoctorProfileContent } from "@/content/pt/pages";
import { getPtRoute } from "@/content/pt/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildPtRouteMetadata } from "@/lib/seo/metadata";

const SpineOverview = dynamic(() =>
  import("@/components/sections/spine-overview").then((m) => m.SpineOverview),
);

const route = getPtRoute("/pt");

export const metadata: Metadata = buildPtRouteMetadata(route);

/** /pt — Brazilian Portuguese counterpart of the home page (ATS-SEO-135).
 * Composition mirrors app/(es)/es/page.tsx exactly; only the content
 * modules and `locale="pt"` change. */
export default function PtHome() {
  return (
    <>
      <PracticeJsonLd />
      <JsonLd
        data={buildWebPage({
          path: route.path,
          name: route.title,
          description: route.description,
          inLanguage: HREFLANG.pt,
        })}
      />
      <HeroSolidPanel
        locale="pt"
        background={{
          src: "/figma-exports/interior-reception.png",
          alt: "Recepção da Align the Spine em Deerfield Beach",
        }}
        title={
          <>
            {ptHomeHero.titleLines[0]}
            <br />
            {ptHomeHero.titleLines[1]}
          </>
        }
        badge={ptHomeHero.badge}
        subhead={ptHomeHero.subhead}
        callPill={{
          eyebrow: ptHomeHero.callPillEyebrow,
          phone: `Ligar para ${siteConfig.business.phone}`,
        }}
        form={{
          heading: ptHomeHero.form.heading,
          submitLabel: ptLeadFormVariants.heroEval.submitLabel,
          variant: ptLeadFormVariants.heroEval.variant,
          fields: ptLeadFormVariants.heroEval.fields,
          footerNote: ptHomeHero.form.footerNote,
        }}
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="pt" />
      <ServicesSection
        items={ptServices}
        heading={ptHomeSections.servicesHeading}
        locale="pt"
        hubLinks={[{ href: "/pt/servicos", label: "Ver todos os serviços" }]}
      />
      <WhyChoose content={ptWhyChooseContent} />
      <AccidentInjuries
        items={ptAccidentInjuries}
        eyebrow={ptHomeSections.accidentInjuriesEyebrow}
        heading={ptHomeSections.accidentInjuriesHeading}
        locale="pt"
        accidentPageLink={{
          href: "/pt/quiropratico-acidentes-de-carro",
          label: "Veja nossa página completa sobre acidentes de carro",
        }}
      />
      <SpineOverview content={ptSpineOverviewContent} />
      <DoctorProfile
        variant="short"
        content={ptDoctorProfileContent}
        doctorLink={{ href: "/pt/dr-abe-nasser", label: "Conheça o Dr. Abe" }}
      />
      <PatientReviews
        featured={homeFeaturedTestimonial}
        reviews={homeReviews.slice(1, 4)}
        locale="pt"
        reviewsLink={{ href: "/pt/avaliacoes", label: "Ver todas as avaliações" }}
      />
      <LocationIntro locale="pt" />
      <LocationFooter locale="pt" />
      <ContactSection locale="pt" />
    </>
  );
}
