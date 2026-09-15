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
import { htConditions } from "@/content/ht/conditions";
import { getHtRoute } from "@/content/ht/seo";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { buildWebPage } from "@/lib/schema";
import { buildHtRouteMetadata } from "@/lib/seo/metadata";

const route = getHtRoute("/ht/kondisyon-nou-trete");

export const metadata: Metadata = buildHtRouteMetadata(route);

/** /ht/kondisyon-nou-trete — Haitian Creole counterpart of the /conditions
 * and /pt/condicoes hubs.
 *
 * Built entirely from each Haitian Creole condition page's own hero
 * content, same as the Spanish/Portuguese hubs — a real directory of the
 * seven Haitian Creole condition pages (ATS-SEO-070 follow-up), not a
 * placeholder linking elsewhere. Every card links directly to a
 * `status: "draft"` page, exactly as the English/Spanish/Portuguese hubs
 * do: real, finished pages awaiting clinical review, not broken ones —
 * their own `draft` status still forces noindex on each target.
 */
const cards: ServiceCardItem[] = htConditions.map((condition) => ({
  slug: condition.slug,
  name: condition.hero.h1,
  duration: "",
  summary: condition.hero.subhead,
  image: condition.hero.backgroundImage,
  href: condition.path,
  ctaLabel: "Aprann plis",
}));

export default function HtConditionsHubPage() {
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
          { name: "Kondisyon", path: route.path },
        ]}
        background={{
          src: "/figma-exports/dr-abe-neck.png",
          alt: "Dr. Abe Nasser ap evalye kou yon pasyan",
        }}
        eyebrow="Kondisyon nou evalye ak trete"
        title="Kondisyon Nou Trete nan Deerfield Beach, FL"
        subhead="Dr. Abe Nasser evalye e trete diferan kondisyon kiwopratik nan Deerfield Beach, depi blesi aksidan machin jiska doulè do ak kou chak jou."
        callPill={{ eyebrow: "Ann pale jodi a", phone: `Rele ${siteConfig.business.phone}` }}
      />

      <Section>
        <Container className="flex flex-col gap-10">
          <div className="max-w-3xl">
            <SectionHeading as="h2" className="text-left">
              Kondisyon nou trete
            </SectionHeading>
            <p className="mt-4 font-sans text-body-lg text-ink-900">
              Dekouvri kondisyon Dr. Abe Nasser evalye e trete nan Align the Spine Chiropractic, nan
              Deerfield Beach. Chak paj eksplike sa ki evalye, sa pou tann nan konsiltasyon an, ak
              sa ki chanje lè yon aksidan machin enplike.
            </p>
          </div>
          <ServiceGrid items={cards} locale="ht" />
        </Container>
      </Section>

      <LocationIntro locale="ht" />
      <LocationFooter locale="ht" />
      <ContactSection locale="ht" />
    </>
  );
}
