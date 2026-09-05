import type { Metadata } from "next";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ServiceCardItem } from "@/components/ui/service-card";
import { ServiceGrid } from "@/components/ui/service-grid";
import { HREFLANG } from "@/content/i18n";
import { getPtRoute } from "@/content/pt/seo";
import { siteConfig } from "@/content/site";
import { buildWebPage } from "@/lib/schema";
import { buildPtRouteMetadata } from "@/lib/seo/metadata";

const route = getPtRoute("/pt/condicoes");

export const metadata: Metadata = buildPtRouteMetadata(route);

/** /pt/condicoes — Brazilian Portuguese counterpart of the /conditions and
 * /es/condiciones hubs (ATS-SEO-135).
 *
 * Unlike the English/Spanish hubs, this one does NOT link out to individual
 * condition pages: those pages are still `status: "draft"` even in English
 * (awaiting clinician review — content/seo.ts), so no Portuguese condition
 * page exists to build a real directory from. Rather than fabricate cards
 * pointing at pages that don't exist, this hub links to the two published
 * Portuguese pages that actually cover condition-adjacent content today —
 * the accident page and the services hub — matching the strategy documented
 * in content/pt/seo.ts's header comment and docs/multilingual-seo-baseline.md.
 * Individual Portuguese condition pages are a documented follow-up once
 * their English/Spanish originals are reviewed and published.
 */
const cards: ServiceCardItem[] = [
  {
    slug: "acidentes-de-carro",
    name: "Acidentes de carro",
    duration: "",
    summary:
      "Avaliação quiroprática após um acidente de carro para dor no pescoço, dor nas costas, rigidez e torcicolo cervical, com orientação sobre o prazo de 14 dias do PIP na Flórida.",
    image: { src: "/figma-exports/drabe-whiplash.png", alt: "Tratamento após acidente de carro" },
    href: "/pt/quiropratico-acidentes-de-carro",
    ctaLabel: "Saiba mais",
  },
  {
    slug: "servicos",
    name: "Serviços quiropráticos",
    duration: "",
    summary:
      "Ajustes, descompressão da coluna e terapia de tecidos moles — o serviço indicado depende da sua avaliação com o Dr. Abe.",
    image: { src: "/figma-exports/dr-abe-neck.png", alt: "Dr. Abe Nasser avaliando um paciente" },
    href: "/pt/servicos",
    ctaLabel: "Ver serviços",
  },
];

export default function PtConditionsHubPage() {
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
          { name: "Condições", path: route.path },
        ]}
        background={{
          src: "/figma-exports/dr-abe-neck.png",
          alt: "Dr. Abe Nasser avaliando o pescoço de um paciente",
        }}
        eyebrow="Condições que avaliamos e tratamos"
        title="Condições que Tratamos em Deerfield Beach, FL"
        subhead="O Dr. Abe Nasser avalia e trata diferentes condições quiropráticas em Deerfield Beach, desde lesões por acidente de carro até dor nas costas e no pescoço do dia a dia."
        callPill={{
          eyebrow: "Vamos conversar hoje",
          phone: `Ligar para ${siteConfig.business.phone}`,
        }}
      />

      <Section>
        <Container className="flex flex-col gap-10">
          <div className="max-w-3xl">
            <SectionHeading as="h2" className="text-left">
              Condições que tratamos
            </SectionHeading>
            <p className="mt-4 font-sans text-body-lg text-ink-900">
              Explore o que o Dr. Abe Nasser avalia e trata na Align the Spine Chiropractic, em
              Deerfield Beach. Páginas específicas por condição em português estão a caminho — por
              enquanto, os links abaixo levam ao atendimento após acidente e à página de serviços.
            </p>
          </div>
          <ServiceGrid items={cards} locale="pt" />
        </Container>
      </Section>

      <LocationIntro locale="pt" />
      <LocationFooter locale="pt" />
      <ContactSection locale="pt" />
    </>
  );
}
