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
import { HREFLANG } from "@/content/i18n";
import { ptAutoAccidentAccident } from "@/content/pt/auto-accident";
import { ptLeadFormVariants } from "@/content/pt/lead-forms";
import { ptDoctorProfileContent } from "@/content/pt/pages";
import { buildPtRelatedLinks } from "@/content/pt/related-links";
import { getPtRoute } from "@/content/pt/seo";
import {
  ptDecompressionConditions,
  ptDecompressionFaq,
  ptDecompressionHero,
  ptDecompressionHowItWorks,
  ptDecompressionRelatedConfig,
  ptServicePageCopy,
} from "@/content/pt/services-pages";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildPtRouteMetadata } from "@/lib/seo/metadata";

const route = getPtRoute("/pt/servicos/descompressao-da-coluna");

export const metadata: Metadata = buildPtRouteMetadata(route);

const breadcrumbs = [
  { name: "Início", path: "/pt" },
  { name: "Serviços", path: "/pt/servicos" },
  { name: "Descompressão da coluna", path: route.path },
];

/** /pt/servicos/descompressao-da-coluna — Brazilian Portuguese counterpart
 * of /services/spinal-decompression and /es/servicios/descompresion-espinal.
 * `status: "draft"` in content/pt/seo.ts, mirroring the English/Spanish
 * originals: it carries clinical guidance about disc injuries and PIP claim
 * timing that hasn't had a clinician's sign-off. */
export default function PtSpinalDecompressionPage() {
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
        breadcrumbs={breadcrumbs}
        background={ptDecompressionHero.backgroundImage}
        eyebrow={ptDecompressionHero.eyebrowChip}
        title={ptDecompressionHero.h1}
        subhead={ptDecompressionHero.subhead}
        callPill={{
          eyebrow: "Vamos conversar hoje",
          phone: `Ligar para ${siteConfig.business.phone}`,
        }}
        form={{
          heading: "Solicite sua avaliação",
          submitLabel: ptLeadFormVariants.heroEval.submitLabel,
          variant: ptLeadFormVariants.heroEval.variant,
          fields: ptLeadFormVariants.heroEval.fields,
        }}
      />

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="pt" />

      <ServiceIntro
        eyebrow="Entender o tratamento"
        heading="Tirar a pressão do disco, não só do músculo"
        divider
        cta={{ href: "#como-funciona", label: "Entender a descompressão" }}
        image={{
          src: "/figma-exports/spinal-decompression-hero.png",
          alt: "Sala de tratamento preparada para terapia de descompressão da coluna",
        }}
      >
        A descompressão da coluna aplica uma tração lenta e sustentada que gera pressão negativa
        dentro do disco, em vez do impulso rápido de um{" "}
        <Link href="/pt/servicos/ajustes-quiropraticos" className="underline">
          ajuste quiroprático
        </Link>
        . Isso a torna indicada quando o problema está no próprio disco e não apenas no tecido mole
        ao redor — por exemplo, quando a dor irradia para um braço ou uma perna depois de um{" "}
        <Link href="/pt/quiropratico-acidentes-de-carro" className="underline">
          acidente de carro
        </Link>
        . Uma avaliação, e a revisão dos exames de imagem adequados, determina se é indicada para o
        seu caso.
      </ServiceIntro>

      <div id="como-funciona" className="scroll-mt-[120px]">
        <Section>
          <Container className="flex flex-col gap-14">
            <SectionHeading eyebrow="Como funciona">Da colisão a se mover sem dor</SectionHeading>
            <div className="grid grid-cols-1 gap-10 border-t border-mute-300 pt-10 sm:grid-cols-3">
              {ptDecompressionHowItWorks.map((step) => (
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
                      Saiba mais
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
          <SectionHeading eyebrow="O que avaliamos" className="items-center text-center">
            {ptServicePageCopy.conditionsHeading}
          </SectionHeading>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ptDecompressionConditions.map((condition) => (
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

      <ComparisonTable locale="pt" />

      <DoctorProfile
        variant="short"
        content={ptDoctorProfileContent}
        doctorLink={{ href: "/pt/dr-abe-nasser", label: "Conheça o Dr. Abe" }}
      />

      <AccidentBanner
        accident={ptAutoAccidentAccident}
        locale="pt"
        eyebrow="Foi por causa de um acidente?"
      />

      <PatientReviews
        featured={homeFeaturedTestimonial}
        reviews={homeReviews.slice(1, 4)}
        variant="light"
        locale="pt"
        reviewsLink={{ href: "/pt/avaliacoes", label: "Ver todas as avaliações" }}
      />

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 font-normal text-white">
              {ptServicePageCopy.readyHeading}
            </h2>
            <p className="w-[65%] font-sans text-body-lg text-mute-300">
              {ptServicePageCopy.readyBody}
            </p>
          </div>
          <Button variant="teal" href="/pt/solicitar-consulta" className="w-fit shrink-0">
            {ptServicePageCopy.readyCta}
          </Button>
        </Container>
      </Section>

      <RelatedConditions
        heading={ptServicePageCopy.relatedHeading}
        items={buildPtRelatedLinks({ currentPath: route.path, ...ptDecompressionRelatedConfig })}
      />

      <ConditionFaq faq={ptDecompressionFaq} locale="pt" />
    </>
  );
}
