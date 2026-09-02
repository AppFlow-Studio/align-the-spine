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
import { getHtRoute } from "@/content/ht/seo";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { buildWebPage } from "@/lib/schema";
import { buildHtRouteMetadata } from "@/lib/seo/metadata";

const route = getHtRoute("/ht/kondisyon-nou-trete");

export const metadata: Metadata = buildHtRouteMetadata(route);

/** /ht/kondisyon-nou-trete — Haitian Creole counterpart of the /conditions
 * and /pt/condicoes hubs (ATS-SEO-136).
 *
 * Unlike the English/Spanish hubs, this one does NOT link out to
 * individual condition pages: those pages are still `status: "draft"`
 * even in English (awaiting clinician review — content/seo.ts), so no
 * Haitian Creole condition page exists to build a real directory from.
 * Same strategy content/pt/seo.ts's conditions hub uses — links to the two
 * published Haitian Creole pages that actually cover condition-adjacent
 * content today instead of fabricating cards for pages that don't exist.
 */
const cards: ServiceCardItem[] = [
  {
    slug: "aksidan-machin",
    name: "Aksidan machin",
    duration: "",
    summary:
      "Evalyasyon kiwopratik apre yon aksidan machin pou doulè kou, doulè do, rèd, ak blesi kou, ak konsèy sou delè 14 jou PIP nan Florid.",
    image: { src: "/figma-exports/drabe-whiplash.png", alt: "Tretman apre aksidan machin" },
    href: "/ht/kiwoprate-pou-aksidan-machin",
    ctaLabel: "Aprann plis",
  },
  {
    slug: "sevis",
    name: "Sèvis kiwopratik",
    duration: "",
    summary:
      "Ajisteman, dekonpresyon kolòn, ak terapi tisi mou — sèvis ki apwopriye a depann de evalyasyon ou ak Dr. Abe.",
    image: { src: "/figma-exports/dr-abe-neck.png", alt: "Dr. Abe Nasser ap evalye yon pasyan" },
    href: "/ht/sevis",
    ctaLabel: "Wè sèvis yo",
  },
];

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
              Dekouvri sa Dr. Abe Nasser evalye e trete nan Align the Spine Chiropractic, nan
              Deerfield Beach. Paj espesifik pou chak kondisyon an Kreyòl ap vini — pou kounye a,
              lyen anba yo mennen nan swen apre aksidan ak nan paj sèvis yo.
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
