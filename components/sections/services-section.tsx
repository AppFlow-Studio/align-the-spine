import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceListRow } from "@/components/ui/service-list-row";
import { services } from "@/content/services";

/** Homepage services list per Figma (file NHwBqbGepOspY0GrCnECnj, node
 * 96:155, "Online Appointment" section): left-aligned heading (no eyebrow),
 * then rows fed by content/services.ts — each row carries its own Divider
 * under the title (see ServiceListRow), not between rows. */
export function ServicesSection() {
  return (
    <Section>
      <Container className="flex flex-col gap-2">
        <SectionHeading tone="navy-800">Online Appointment</SectionHeading>
        <Divider />
        {services.map((service) => (
          <ServiceListRow key={service.slug} item={service} />
        ))}
      </Container>
    </Section>
  );
}
