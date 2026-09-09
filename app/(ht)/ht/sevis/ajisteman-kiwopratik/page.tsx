import type { Metadata } from "next";
import Link from "next/link";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { AccidentInjuries } from "@/components/sections/accident-injuries";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ConditionFaq } from "@/components/sections/condition-faq";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { RelatedConditions } from "@/components/sections/related-conditions";
import { ServiceIntro } from "@/components/sections/service-intro";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  htAutoAccidentAccident,
  htAutoAccidentCoordinationQuote,
} from "@/content/ht/auto-accident";
import { htAccidentInjuries, htHomeSections } from "@/content/ht/home";
import { htLeadFormVariants } from "@/content/ht/lead-forms";
import { htDoctorProfileContent } from "@/content/ht/pages";
import { buildHtRelatedLinks } from "@/content/ht/related-links";
import { getHtRoute } from "@/content/ht/seo";
import {
  htAdjustmentsFaq,
  htAdjustmentsHero,
  htAdjustmentsHowItWorks,
  htAdjustmentsRelatedConfig,
  htServicePageCopy,
} from "@/content/ht/services-pages";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildHtRouteMetadata } from "@/lib/seo/metadata";

const route = getHtRoute("/ht/sevis/ajisteman-kiwopratik");

export const metadata: Metadata = buildHtRouteMetadata(route);

const breadcrumbs = [
  { name: "Akèy", path: "/ht" },
  { name: "Sèvis", path: "/ht/sevis" },
  { name: "Ajisteman kiwopratik", path: route.path },
];

/** /ht/sevis/ajisteman-kiwopratik — Haitian Creole counterpart of
 * /services/chiropractic-adjustments and /es/servicios/ajustes-quiropracticos.
 *
 * `status: "draft"` in content/ht/seo.ts, mirroring the English/Spanish
 * originals — noindex and out of the sitemap until a clinician signs off on
 * the medical content, but reachable from the Haitian Creole nav.
 */
export default function HtAdjustmentsPage() {
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
        breadcrumbs={breadcrumbs}
        background={htAdjustmentsHero.backgroundImage}
        eyebrow={htAdjustmentsHero.eyebrowChip}
        title={htAdjustmentsHero.h1}
        subhead={htAdjustmentsHero.subhead}
        callPill={{ eyebrow: "Ann pale jodi a", phone: `Rele ${siteConfig.business.phone}` }}
        form={{
          heading: "Mande evalyasyon ou",
          submitLabel: htLeadFormVariants.heroEval.submitLabel,
          variant: htLeadFormVariants.heroEval.variant,
          fields: htLeadFormVariants.heroEval.fields,
          footerNote:
            "Yon sèl kabinè verifye nan Deerfield Beach; rele pou konfime si yon vizit nan kabinè a oswa yon vizit lakay ki gen rapò ak yon aksidan apwopriye.",
        }}
      />

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="ht" />

      <ServiceIntro
        eyebrow="Konprann tretman an"
        heading="Remèt mouvman kolizyon an te pran"
        divider
        cta={{ href: "#kijan-sa-fonksyone", label: "Konprann ajisteman yo" }}
        image={{
          src: "https://align-the-spine.b-cdn.net/images/chiro-help.png",
          alt: "Dr. Abe ap fè yon ajisteman kiwopratik",
        }}
      >
        Yon ajisteman kiwopratik aplike presyon manyèl presi pou remèt mouvman nan yon jwenti ki
        pèdi li apre yon chòk — sa nou rele yon fiksasyon. Lè yon vètèb sispann bouje byen apre yon
        kolizyon, miskilati ak nève ozanviwon li konpanse, epi sa souvan se vrè orijin doulè nan
        antòs kou, doulè kou, doulè do, ak syatik apre yon{" "}
        <Link href="/ht/kiwoprate-pou-aksidan-machin" className="underline">
          aksidan
        </Link>
        . Yon ajisteman pa sèlman soulaje jèn nan: li retabli mekanik la pou kò ou sispann travay
        pou evite blesi a.
      </ServiceIntro>

      <div id="kijan-sa-fonksyone" className="scroll-mt-[120px]">
        <Section>
          <Container className="flex flex-col gap-14">
            <SectionHeading eyebrow="Kijan sa fonksyone">
              Soti nan kolizyon an pou santi w tounen ou menm ankò
            </SectionHeading>
            <div className="grid grid-cols-1 gap-10 border-t border-mute-300 pt-10 sm:grid-cols-3">
              {htAdjustmentsHowItWorks.map((step) => (
                <div key={step.title} className="group flex flex-col gap-3">
                  <h3 className="font-display text-3xl text-navy-900 transition-colors duration-200 group-hover:text-teal-500">
                    {step.title}
                  </h3>
                  <hr className="border-t border-navy-900 transition-colors duration-200 group-hover:border-teal-500" />
                  <p className="font-sans text-body-lg text-ink-500">{step.description}</p>
                  {step.learnMoreHref && (
                    <Link
                      href={step.learnMoreHref}
                      className="inline-flex w-fit items-center gap-2 pt-4 font-sans text-stat-label uppercase tracking-[1.25px] text-navy-900 underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:text-navy-700 hover:decoration-navy-700 group-hover:text-teal-500 group-hover:decoration-teal-500"
                    >
                      Aprann plis
                      <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </Section>
      </div>

      <AccidentInjuries
        items={htAccidentInjuries}
        eyebrow={htHomeSections.accidentInjuriesEyebrow}
        heading={htHomeSections.accidentInjuriesHeading}
        locale="ht"
        accidentPageLink={{
          href: "/ht/kiwoprate-pou-aksidan-machin",
          label: "Gade paj konplè aksidan machin nou an",
        }}
      />

      <ComparisonTable locale="ht" />

      <ServiceIntro
        eyebrow={htServicePageCopy.isItRightHeading}
        heading="Endike pou pifò blesi kolizyon — pa pou tout"
        divider
        image={{
          src: "/figma-exports/adjustments-right-for-you.png",
          alt: "Dr. Abe ap ajiste kou yon pasyan nan kabinè a",
        }}
      >
        Ajisteman yo endike pou pifò blesi mekanik yon kolizyon, ki se sa nou wè pi souvan. Yo pa
        premye etap ki apwopriye devan yon fraktur, yon dejwente, oswa yon antòs kou gwo pousantaj
        IV, ki egzije egzamen imaj ijan anvan nenpòt tretman manyèl. Pou yon gwo èni disk ak
        konpresyon nève enpòtan,{" "}
        <Link href="/ht/sevis/dekonpresyon-kolon" className="underline">
          dekonpresyon kolòn
        </Link>{" "}
        ka yon pi bon pwen depa, pafwa konbine ak ajisteman an apre presyon ijan an fin soulaje. Règ
        PIP Florid yo ka gen egzijans sou delè pou kòmanse swen an; kouvèti ak elijibilite depann de
        kontra asirans lan ak sikonstans yo. Yon evalyasyon pa garanti{" "}
        <Link href="/ht/kiwoprate-pou-aksidan-machin" className="underline">
          benefis PIP yo
        </Link>
        .
      </ServiceIntro>

      <DoctorProfile
        variant="short"
        content={htDoctorProfileContent}
        doctorLink={{ href: "/ht/dr-abe-nasser", label: "Konnen Dr. Abe" }}
      />

      <AccidentBanner
        accident={htAutoAccidentAccident}
        locale="ht"
        eyebrow="Èske se te akoz yon aksidan?"
      />

      <PatientReviews
        featured={homeFeaturedTestimonial}
        reviews={homeReviews.slice(1, 4)}
        variant="light"
        locale="ht"
        reviewsLink={{ href: "/ht/komante-pasyan", label: "Gade tout kòmantè yo" }}
      />

      <Section spacing="sm" className="bg-[#E4F9F4]">
        <p className="container text-center font-sans text-body-lg text-navy-900">
          {htAutoAccidentCoordinationQuote}
        </p>
      </Section>

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 font-normal text-white">
              {htServicePageCopy.readyHeading}
            </h2>
            <p className="w-[65%] font-sans text-body-lg text-mute-300">
              {htServicePageCopy.readyBody}
            </p>
          </div>
          <Button variant="teal" href="/ht/mande-yon-randevou" className="w-fit shrink-0">
            {htServicePageCopy.readyCta}
          </Button>
        </Container>
      </Section>

      <RelatedConditions
        heading={htServicePageCopy.relatedHeading}
        items={buildHtRelatedLinks({ currentPath: route.path, ...htAdjustmentsRelatedConfig })}
      />

      <ConditionFaq faq={htAdjustmentsFaq} locale="ht" />
    </>
  );
}
