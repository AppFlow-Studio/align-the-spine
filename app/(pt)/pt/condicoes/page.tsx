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
import { ptConditions } from "@/content/pt/conditions";
import { getPtRoute } from "@/content/pt/seo";
import { siteConfig } from "@/content/site";
import { buildWebPage } from "@/lib/schema";
import { buildPtRouteMetadata } from "@/lib/seo/metadata";

const route = getPtRoute("/pt/condicoes");

export const metadata: Metadata = buildPtRouteMetadata(route);

/** /pt/condicoes — Brazilian Portuguese counterpart of the /conditions and
 * /es/condiciones hubs.
 *
 * Built entirely from each Portuguese condition page's own hero content,
 * same as the Spanish hub — a real directory of the seven Portuguese
 * condition pages (ATS-SEO-070 follow-up), not a placeholder linking
 * elsewhere. Every card links directly to a `status: "draft"` page, exactly
 * as the English/Spanish hubs do: real, finished pages awaiting clinical
 * review, not broken ones — their own `draft` status still forces noindex
 * on each target.
 */
const cards: ServiceCardItem[] = ptConditions.map((condition) => ({
  slug: condition.slug,
  name: condition.hero.h1,
  duration: "",
  summary: condition.hero.subhead,
  image: condition.hero.backgroundImage,
  href: condition.path,
  ctaLabel: "Saiba mais",
}));

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
              Explore as condições que o Dr. Abe Nasser avalia e trata na Align the Spine
              Chiropractic, em Deerfield Beach. Cada página explica o que é avaliado, o que esperar
              na consulta e o que muda quando um acidente de carro está envolvido.
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
