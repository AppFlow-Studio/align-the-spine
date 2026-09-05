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
import { htLeadFormVariants } from "@/content/ht/lead-forms";
import { htDoctorProfileContent, htServicesGrid, htServicesPage } from "@/content/ht/pages";
import { getHtRoute } from "@/content/ht/seo";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildHtRouteMetadata } from "@/lib/seo/metadata";

const route = getHtRoute("/ht/sevis");

export const metadata: Metadata = buildHtRouteMetadata(route);

/** /ht/sevis — Haitian Creole counterpart of /services and /pt/servicos
 * (ATS-SEO-136). Emits a WebPage entity pointing `about` at the shared
 * MedicalBusiness, same reasoning as the Spanish/Portuguese pages: one
 * connected practice described across four languages, not per-service
 * JSON-LD duplicated a fourth time. */
export default function HtServicesPage() {
  return (
    <>
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
        breadcrumbs={[
          { name: "Paj Prensipal", path: "/ht" },
          { name: htServicesPage.breadcrumb, path: route.path },
        ]}
        background={{
          src: "/figma-exports/dr-abe-neck.png",
          alt: "Dr. Abe Nasser ap evalye kou yon pasyan",
        }}
        eyebrow={htServicesPage.hero.eyebrow}
        title={
          <>
            {htServicesPage.hero.titleLines[0]}
            <br />
            {htServicesPage.hero.titleLines[1]}
          </>
        }
        subhead={htServicesPage.hero.subhead}
        callPill={{
          eyebrow: htServicesPage.hero.callPillEyebrow,
          phone: `Rele ${siteConfig.business.phone}`,
        }}
        form={{
          heading: htServicesPage.hero.form.heading,
          submitLabel: htLeadFormVariants.heroEval.submitLabel,
          variant: htLeadFormVariants.heroEval.variant,
          fields: htLeadFormVariants.heroEval.fields,
          footerNote: htServicesPage.hero.form.footerNote,
        }}
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="ht" />
      <ServiceCatalog
        items={htServicesGrid}
        eyebrow={htServicesPage.catalog.eyebrow}
        heading={htServicesPage.catalog.heading}
        locale="ht"
        conditionsLink={null}
      />
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
