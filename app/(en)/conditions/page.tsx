import type { Metadata } from "next";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceGrid } from "@/components/ui/service-grid";
import {
  conditionsHubCards,
  conditionsHubHero,
  conditionsHubIntro,
} from "@/content/conditions-hub";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { buildCollectionPage } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo/metadata";

const route = getRoute("/conditions");
export const metadata: Metadata = buildMetadata(route);

const breadcrumbs = [
  { name: "Home", path: "" },
  { name: "Conditions", path: "/conditions" },
];

// ATS-SEO-126: CollectionPage's itemListElement mirrors the exact 7 cards
// ServiceGrid renders below — never a hand-typed duplicate list that could
// drift from what's actually on the page.
const collectionPage = buildCollectionPage({
  path: route.path,
  name: route.title,
  description: route.description,
  // .filter/type-guard rather than `?? bookingCta.href`: falling back to the
  // booking CTA (ServiceGrid's own display fallback for a missing href)
  // would make the ItemList assert a wrong URL for that condition, not a
  // reasonable default — every current conditionsHubCards entry does set
  // href, so this is defensive, not presently dropping any real item.
  items: conditionsHubCards
    .filter((card): card is typeof card & { href: string } => Boolean(card.href))
    .map((card) => ({ name: card.name, path: card.href })),
});

/** ATS-SEO-040: crawlable discovery hub for the 7 /conditions/* routes.
 * Previously the only path into them was the "Conditions" nav mega-menu,
 * which is client-side-rendered (absent from raw HTML until hover/focus)
 * and whose own trigger link pointed at /car-accident-chiropractor instead
 * of a real hub — see navbar-dropdown.tsx and content/site.ts's nav entry.
 * Hero → concise intro → ServiceGrid (reused as-is; its own doc comment
 * anticipated exactly this use) → LocationIntro/LocationFooter (shared
 * with Home/Services/About/Book) → contact LeadForm. */
export default function ConditionsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <JsonLd data={collectionPage} />
      <HeroSolidPanel
        breadcrumbs={breadcrumbs}
        background={conditionsHubHero.backgroundImage}
        eyebrow={conditionsHubHero.eyebrowChip}
        title={conditionsHubHero.h1}
        subhead={conditionsHubHero.subhead}
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
      />
      <Section>
        <Container className="flex flex-col gap-10">
          <div className="max-w-3xl">
            <SectionHeading as="h2" className="text-left">
              Conditions we treat
            </SectionHeading>
            <p className="mt-4 font-sans text-body-lg text-ink-900">{conditionsHubIntro}</p>
          </div>
          <ServiceGrid items={conditionsHubCards} />
        </Container>
      </Section>
      <LocationIntro />
      <LocationFooter />
      <ContactSection />
    </>
  );
}
