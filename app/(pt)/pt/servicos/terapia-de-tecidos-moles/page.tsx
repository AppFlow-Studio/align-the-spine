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
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { HREFLANG } from "@/content/i18n";
import { ptAutoAccidentAccident } from "@/content/pt/auto-accident";
import { ptLeadFormVariants } from "@/content/pt/lead-forms";
import { ptDoctorProfileContent } from "@/content/pt/pages";
import { buildPtRelatedLinks } from "@/content/pt/related-links";
import { getPtRoute } from "@/content/pt/seo";
import {
  ptMassageConditions,
  ptMassageFaq,
  ptMassageHero,
  ptMassageRelatedConfig,
  ptMassageTechniques,
  ptServicePageCopy,
} from "@/content/pt/services-pages";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildPtRouteMetadata } from "@/lib/seo/metadata";

const route = getPtRoute("/pt/servicos/terapia-de-tecidos-moles");

export const metadata: Metadata = buildPtRouteMetadata(route);

const breadcrumbs = [
  { name: "Início", path: "/pt" },
  { name: "Serviços", path: "/pt/servicos" },
  { name: "Terapia de tecidos moles", path: route.path },
];

/** /pt/servicos/terapia-de-tecidos-moles — Brazilian Portuguese counterpart
 * of /services/soft-tissue-therapy and /es/servicios/terapia-de-tejidos-blandos.
 * `status: "draft"` in content/pt/seo.ts, mirroring the English/Spanish
 * originals: it carries clinical guidance about technique selection that
 * hasn't had a clinician's sign-off. */
export default function PtSoftTissuePage() {
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
        background={ptMassageHero.backgroundImage}
        eyebrow={ptMassageHero.eyebrowChip}
        title={ptMassageHero.h1}
        subhead={ptMassageHero.subhead}
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
        heading="A técnica é escolhida de acordo com o tecido, não por rotina"
        divider
        cta={{ href: "#tecnicas", label: "Ver as técnicas" }}
        image={{
          src: "/figma-exports/massage-soft-tissue-hero.png",
          alt: "Sala de tratamento de massagem e terapia de tecidos moles",
        }}
      >
        Uma massagem comum busca relaxamento geral. Isto é diferente: o trabalho é direcionado ao
        tecido específico afetado pela colisão — tecido cicatricial, rigidez da fáscia ou contusão
        profunda — e a técnica é escolhida a partir da sua avaliação. Com frequência acompanha um{" "}
        <Link href="/pt/servicos/ajustes-quiropraticos" className="underline">
          ajuste quiroprático
        </Link>{" "}
        quando a articulação e o músculo estão envolvidos ao mesmo tempo. Se o seu caso vem de um{" "}
        <Link href="/pt/quiropratico-acidentes-de-carro" className="underline">
          acidente de carro
        </Link>
        , cada sessão fica documentada para o seu sinistro.
      </ServiceIntro>

      <div id="tecnicas" className="scroll-mt-[120px]">
        <Section>
          <Container className="flex flex-col gap-14">
            <SectionHeading eyebrow="Como trabalhamos" className="items-center text-center">
              {ptServicePageCopy.techniquesHeading}
            </SectionHeading>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              {ptMassageTechniques.map((technique) => (
                <div key={technique.title} className="group flex flex-col gap-4">
                  <div className="relative aspect-[507/360] w-full overflow-hidden">
                    <Image
                      src={technique.image.src}
                      alt={technique.image.alt}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-display text-card-title text-navy-800">{technique.title}</h3>
                  <hr className="border-t border-navy-900" />
                  <p className="font-sans text-card-body text-ink-900">{technique.description}</p>
                  <p className="font-sans text-stat-label uppercase tracking-[1.25px] text-mute-400">
                    {ptServicePageCopy.bestForLabel}: {technique.bestFor}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      </div>

      <Section>
        <Container className="flex flex-col gap-14">
          <SectionHeading eyebrow="O que tratamos" className="items-center text-center">
            {ptServicePageCopy.conditionsHeading}
          </SectionHeading>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ptMassageConditions.map((condition) => (
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
        items={buildPtRelatedLinks({ currentPath: route.path, ...ptMassageRelatedConfig })}
      />

      <ConditionFaq faq={ptMassageFaq} locale="pt" />
    </>
  );
}
