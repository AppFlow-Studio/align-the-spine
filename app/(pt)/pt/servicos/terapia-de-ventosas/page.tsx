import type { Metadata } from "next";
import Link from "next/link";

import { ConditionFaq } from "@/components/sections/condition-faq";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { RelatedConditions } from "@/components/sections/related-conditions";
import { ServiceIntro } from "@/components/sections/service-intro";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { HREFLANG } from "@/content/i18n";
import { ptLeadFormVariants } from "@/content/pt/lead-forms";
import { ptDoctorProfileContent } from "@/content/pt/pages";
import { buildPtRelatedLinks } from "@/content/pt/related-links";
import { getPtRoute } from "@/content/pt/seo";
import {
  ptCuppingFaq,
  ptCuppingHero,
  ptCuppingRelatedConfig,
  ptServicePageCopy,
} from "@/content/pt/services-pages";
import { siteConfig } from "@/content/site";
import { buildWebPage } from "@/lib/schema";
import { buildPtRouteMetadata } from "@/lib/seo/metadata";

const route = getPtRoute("/pt/servicos/terapia-de-ventosas");

export const metadata: Metadata = buildPtRouteMetadata(route);

const breadcrumbs = [
  { name: "Início", path: "/pt" },
  { name: "Serviços", path: "/pt/servicos" },
  { name: "Terapia de ventosas", path: route.path },
];

/** /pt/servicos/terapia-de-ventosas — Brazilian Portuguese counterpart of
 * /services/cupping-therapy and /es/servicios/terapia-de-ventosas.
 *
 * Deliberately the leanest of the four Portuguese service pages, exactly as
 * the English/Spanish ones are: cupping is a single technique, not a full
 * treatment category, so this doesn't carry the comparison table, accident
 * banner or reviews band the other three do.
 *
 * `status: "draft"` in content/pt/seo.ts, mirroring the English original. */
export default function PtCuppingTherapyPage() {
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
        background={ptCuppingHero.backgroundImage}
        eyebrow={ptCuppingHero.eyebrowChip}
        title={ptCuppingHero.h1}
        subhead={ptCuppingHero.subhead}
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

      <ServiceIntro
        eyebrow="Entender o tratamento"
        heading="Sucção localizada para áreas específicas de tensão"
        divider
        image={{
          src: "/figma-exports/cupping-drabe.png",
          alt: "Sessão de terapia de ventosas",
        }}
      >
        A terapia de ventosas coloca copos sobre a pele para aplicar sucção em áreas selecionadas de
        tensão muscular. Pode ser incluída junto com outro trabalho de{" "}
        <Link href="/pt/servicos/terapia-de-tecidos-moles" className="underline">
          tecidos moles
        </Link>{" "}
        quando indicado para desconfortos no pescoço, nas costas ou em outras áreas. O Dr. Abe
        decide se é adequado para o seu caso a partir da avaliação, não de uma rotina fixa — e vai
        dizer quando outra técnica é um melhor ponto de partida. Se o seu caso vem de um{" "}
        <Link href="/pt/quiropratico-acidentes-de-carro" className="underline">
          acidente de carro
        </Link>
        , cada sessão fica documentada para o seu sinistro.
      </ServiceIntro>

      <DoctorProfile
        variant="short"
        content={ptDoctorProfileContent}
        doctorLink={{ href: "/pt/dr-abe-nasser", label: "Conheça o Dr. Abe" }}
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
        items={buildPtRelatedLinks({ currentPath: route.path, ...ptCuppingRelatedConfig })}
      />

      <ConditionFaq faq={ptCuppingFaq} locale="pt" />
    </>
  );
}
