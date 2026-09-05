import type { Metadata } from "next";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { ServiceCatalog } from "@/components/sections/service-catalog";
import { JsonLd } from "@/components/seo/json-ld";
import { HREFLANG } from "@/content/i18n";
import { ptLeadFormVariants } from "@/content/pt/lead-forms";
import { ptDoctorProfileContent, ptServicesGrid, ptServicesPage } from "@/content/pt/pages";
import { getPtRoute } from "@/content/pt/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildPtRouteMetadata } from "@/lib/seo/metadata";

const route = getPtRoute("/pt/servicos");

export const metadata: Metadata = buildPtRouteMetadata(route);

/** /pt/servicos — Brazilian Portuguese counterpart of /services and
 * /es/servicios (ATS-SEO-135). Emits a WebPage entity pointing `about` at
 * the shared MedicalBusiness, same reasoning as the Spanish page: one
 * connected practice described across three languages, not per-service
 * JSON-LD duplicated a third time. */
export default function PtServicesPage() {
  return (
    <>
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
        breadcrumbs={[
          { name: "Início", path: "/pt" },
          { name: ptServicesPage.breadcrumb, path: route.path },
        ]}
        background={{
          src: "/figma-exports/dr-abe-neck.png",
          alt: "Dr. Abe Nasser avaliando o pescoço de um paciente",
        }}
        eyebrow={ptServicesPage.hero.eyebrow}
        title={
          <>
            {ptServicesPage.hero.titleLines[0]}
            <br />
            {ptServicesPage.hero.titleLines[1]}
          </>
        }
        subhead={ptServicesPage.hero.subhead}
        callPill={{
          eyebrow: ptServicesPage.hero.callPillEyebrow,
          phone: `Ligar para ${siteConfig.business.phone}`,
        }}
        form={{
          heading: ptServicesPage.hero.form.heading,
          submitLabel: ptLeadFormVariants.heroEval.submitLabel,
          variant: ptLeadFormVariants.heroEval.variant,
          fields: ptLeadFormVariants.heroEval.fields,
          footerNote: ptServicesPage.hero.form.footerNote,
        }}
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="pt" />
      <ServiceCatalog
        items={ptServicesGrid}
        eyebrow={ptServicesPage.catalog.eyebrow}
        heading={ptServicesPage.catalog.heading}
        locale="pt"
        // /conditions is English-only and its child pages are draft — a
        // Portuguese reader following this link would land in English.
        conditionsLink={null}
      />
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
