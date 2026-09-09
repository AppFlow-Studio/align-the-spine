import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AccidentBanner } from "@/components/sections/accident-banner";
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
import { htAutoAccidentAccident } from "@/content/ht/auto-accident";
import { htLeadFormVariants } from "@/content/ht/lead-forms";
import { htDoctorProfileContent } from "@/content/ht/pages";
import { buildHtRelatedLinks } from "@/content/ht/related-links";
import { getHtRoute } from "@/content/ht/seo";
import {
  htDecompressionConditions,
  htDecompressionFaq,
  htDecompressionHero,
  htDecompressionHowItWorks,
  htDecompressionRelatedConfig,
  htServicePageCopy,
} from "@/content/ht/services-pages";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildHtRouteMetadata } from "@/lib/seo/metadata";

const route = getHtRoute("/ht/sevis/dekonpresyon-kolon");

export const metadata: Metadata = buildHtRouteMetadata(route);

const breadcrumbs = [
  { name: "Akèy", path: "/ht" },
  { name: "Sèvis", path: "/ht/sevis" },
  { name: "Dekonpresyon kolòn", path: route.path },
];

/** /ht/sevis/dekonpresyon-kolon — Haitian Creole counterpart of
 * /services/spinal-decompression and /es/servicios/descompresion-espinal.
 * `status: "draft"` in content/ht/seo.ts, mirroring the English/Spanish
 * originals: it carries clinical guidance about disc injuries and PIP claim
 * timing that hasn't had a clinician's sign-off. */
export default function HtSpinalDecompressionPage() {
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
        background={htDecompressionHero.backgroundImage}
        eyebrow={htDecompressionHero.eyebrowChip}
        title={htDecompressionHero.h1}
        subhead={htDecompressionHero.subhead}
        callPill={{ eyebrow: "Ann pale jodi a", phone: `Rele ${siteConfig.business.phone}` }}
        form={{
          heading: "Mande evalyasyon ou",
          submitLabel: htLeadFormVariants.heroEval.submitLabel,
          variant: htLeadFormVariants.heroEval.variant,
          fields: htLeadFormVariants.heroEval.fields,
        }}
      />

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="ht" />

      <ServiceIntro
        eyebrow="Konprann tretman an"
        heading="Retire presyon sou disk la, se pa sèlman miskilati a"
        divider
        cta={{ href: "#kijan-sa-fonksyone", label: "Konprann dekonpresyon an" }}
        image={{
          src: "/figma-exports/spinal-decompression-hero.png",
          alt: "Sal tretman ki prepare pou terapi dekonpresyon kolòn",
        }}
      >
        Dekonpresyon kolòn aplike yon traksyon lan e kontinyèl ki kreye presyon negatif anndan disk
        la, olye pou l fè poze rapid yon{" "}
        <Link href="/ht/sevis/ajisteman-kiwopratik" className="underline">
          ajisteman kiwopratik
        </Link>
        . Sa fè l apwopriye lè pwoblèm nan se nan disk la limenm, se pa sèlman tisi mou ki antoure
        li a — pa egzanp lè doulè a gaye nan yon bra oswa yon janm apre yon{" "}
        <Link href="/ht/kiwoprate-pou-aksidan-machin" className="underline">
          aksidan machin
        </Link>
        . Yon evalyasyon, ak revizyon egzamen imaj ki apwopriye, detèmine si li apwopriye pou ka ou
        a.
      </ServiceIntro>

      <div id="kijan-sa-fonksyone" className="scroll-mt-[120px]">
        <Section>
          <Container className="flex flex-col gap-14">
            <SectionHeading eyebrow="Kijan sa fonksyone">
              Soti nan chòk la pou bouje san doulè
            </SectionHeading>
            <div className="grid grid-cols-1 gap-10 border-t border-mute-300 pt-10 sm:grid-cols-3">
              {htDecompressionHowItWorks.map((step) => (
                <div key={step.title} className="group flex flex-col gap-3">
                  <h3 className="font-display text-3xl text-navy-900 transition-colors duration-200 group-hover:text-teal-500">
                    {step.title}
                  </h3>
                  <hr className="border-t border-navy-900 transition-colors duration-200 group-hover:border-teal-500" />
                  <p className="font-sans text-body-lg text-ink-500">{step.description}</p>
                  {step.learnMoreHref && step.learnMoreHref !== route.path && (
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

      <Section>
        <Container className="flex flex-col gap-14">
          <SectionHeading eyebrow="Sa nou evalye" className="items-center text-center">
            {htServicePageCopy.conditionsHeading}
          </SectionHeading>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {htDecompressionConditions.map((condition) => (
              <div key={condition.name} className="group flex flex-col gap-4">
                <div className="relative aspect-[507/360] w-full overflow-hidden">
                  <Image
                    src={condition.image.src}
                    alt={condition.image.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-display text-card-title text-navy-800">{condition.name}</h3>
                <p className="font-sans text-card-body text-ink-900">{condition.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <ComparisonTable locale="ht" />

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
        items={buildHtRelatedLinks({ currentPath: route.path, ...htDecompressionRelatedConfig })}
      />

      <ConditionFaq faq={htDecompressionFaq} locale="ht" />
    </>
  );
}
