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
import { HREFLANG } from "@/content/i18n";
import {
  ptAutoAccidentAccident,
  ptAutoAccidentCoordinationQuote,
} from "@/content/pt/auto-accident";
import { ptAccidentInjuries, ptHomeSections } from "@/content/pt/home";
import { ptLeadFormVariants } from "@/content/pt/lead-forms";
import { ptDoctorProfileContent } from "@/content/pt/pages";
import { buildPtRelatedLinks } from "@/content/pt/related-links";
import { getPtRoute } from "@/content/pt/seo";
import {
  ptAdjustmentsFaq,
  ptAdjustmentsHero,
  ptAdjustmentsHowItWorks,
  ptAdjustmentsRelatedConfig,
  ptServicePageCopy,
} from "@/content/pt/services-pages";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildPtRouteMetadata } from "@/lib/seo/metadata";

const route = getPtRoute("/pt/servicos/ajustes-quiropraticos");

export const metadata: Metadata = buildPtRouteMetadata(route);

const breadcrumbs = [
  { name: "Início", path: "/pt" },
  { name: "Serviços", path: "/pt/servicos" },
  { name: "Ajustes quiropráticos", path: route.path },
];

/** /pt/servicos/ajustes-quiropraticos — Brazilian Portuguese counterpart of
 * /services/chiropractic-adjustments and
 * /es/servicios/ajustes-quiropracticos, section-for-section.
 *
 * `status: "draft"` in content/pt/seo.ts, mirroring the English/Spanish
 * originals — noindex and out of the sitemap until a clinician signs off on
 * the medical content, but reachable from the Portuguese nav.
 */
export default function PtAdjustmentsPage() {
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
        background={ptAdjustmentsHero.backgroundImage}
        eyebrow={ptAdjustmentsHero.eyebrowChip}
        title={ptAdjustmentsHero.h1}
        subhead={ptAdjustmentsHero.subhead}
        callPill={{
          eyebrow: "Vamos conversar hoje",
          phone: `Ligar para ${siteConfig.business.phone}`,
        }}
        form={{
          heading: "Solicite sua avaliação",
          submitLabel: ptLeadFormVariants.heroEval.submitLabel,
          variant: ptLeadFormVariants.heroEval.variant,
          fields: ptLeadFormVariants.heroEval.fields,
          footerNote:
            "Um único consultório verificado em Deerfield Beach; ligue para confirmar se é indicada uma visita ao consultório ou uma visita domiciliar relacionada a um acidente.",
        }}
      />

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="pt" />

      <ServiceIntro
        eyebrow="Entender o tratamento"
        heading="Devolver o movimento que a colisão levou"
        divider
        cta={{ href: "#como-funciona", label: "Entender os ajustes" }}
        image={{
          src: "https://align-the-spine.b-cdn.net/images/chiro-help.png",
          alt: "Dr. Abe realizando um ajuste quiroprático",
        }}
      >
        Um ajuste quiroprático aplica pressão manual precisa para devolver o movimento a uma
        articulação que o perdeu depois do impacto — o que chamamos de fixação. Quando uma vértebra
        para de se mover bem depois de uma colisão, os músculos e nervos ao redor compensam, e isso
        costuma ser a verdadeira origem da dor no torcicolo cervical, na dor no pescoço, na dor nas
        costas e na ciática depois de um{" "}
        <Link href="/pt/quiropratico-acidentes-de-carro" className="underline">
          acidente
        </Link>
        . Um ajuste não apenas alivia o desconforto: ele restaura a mecânica para que o seu corpo
        pare de trabalhar contornando a lesão.
      </ServiceIntro>

      <div id="como-funciona" className="scroll-mt-[120px]">
        <Section>
          <Container className="flex flex-col gap-14">
            <SectionHeading eyebrow="Como funciona">
              Da colisão a se sentir você mesmo outra vez
            </SectionHeading>
            <div className="grid grid-cols-1 gap-10 border-t border-mute-300 pt-10 sm:grid-cols-3">
              {ptAdjustmentsHowItWorks.map((step) => (
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

      <AccidentInjuries
        items={ptAccidentInjuries}
        eyebrow={ptHomeSections.accidentInjuriesEyebrow}
        heading={ptHomeSections.accidentInjuriesHeading}
        locale="pt"
        accidentPageLink={{
          href: "/pt/quiropratico-acidentes-de-carro",
          label: "Veja nossa página completa de acidentes de carro",
        }}
      />

      <ComparisonTable locale="pt" />

      <ServiceIntro
        eyebrow={ptServicePageCopy.isItRightHeading}
        heading="Indicado para a maioria das lesões de colisão — não para todas"
        divider
        image={{
          src: "/figma-exports/adjustments-right-for-you.png",
          alt: "Dr. Abe ajustando o pescoço de um paciente no consultório",
        }}
      >
        Os ajustes são indicados para a maioria das lesões mecânicas de uma colisão, que é o que
        mais vemos. Não são o primeiro passo adequado diante de uma fratura, uma luxação ou um
        torcicolo cervical de grau IV, que exigem exames de imagem urgentes antes de qualquer
        tratamento manual. Para uma hérnia de disco grave com compressão nervosa significativa, a{" "}
        <Link href="/pt/servicos/descompressao-da-coluna" className="underline">
          descompressão da coluna
        </Link>{" "}
        pode ser um melhor ponto de partida, às vezes combinada com o ajuste depois que a pressão
        aguda é aliviada. As regras do PIP da Flórida podem incluir requisitos de prazo para iniciar
        o atendimento; a cobertura e a elegibilidade dependem da apólice e das circunstâncias. Uma
        avaliação não garante{" "}
        <Link href="/pt/quiropratico-acidentes-de-carro" className="underline">
          os benefícios do PIP
        </Link>
        .
      </ServiceIntro>

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

      <Section spacing="sm" className="bg-[#E4F9F4]">
        <p className="container text-center font-sans text-body-lg text-navy-900">
          {ptAutoAccidentCoordinationQuote}
        </p>
      </Section>

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
        items={buildPtRelatedLinks({ currentPath: route.path, ...ptAdjustmentsRelatedConfig })}
      />

      <ConditionFaq faq={ptAdjustmentsFaq} locale="pt" />
    </>
  );
}
