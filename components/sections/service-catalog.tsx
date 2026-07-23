import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceGrid } from "@/components/ui/service-grid";
import { servicesGrid } from "@/content/services-grid";

/** "/services" ServiceGrid section (ATS-081): reuses ServiceGrid/ServiceCard
 * — same pattern as the homepage's AccidentInjuries grid — fed by
 * content/services-grid.ts's 6 core services. */
export function ServiceCatalog() {
  return (
    <Section>
      <Container className="flex flex-col gap-14">
        <SectionHeading eyebrow="Our services" className="items-center text-center">
          Comprehensive care, tailored to you
        </SectionHeading>
        <ServiceGrid items={servicesGrid} />
      </Container>
    </Section>
  );
}
