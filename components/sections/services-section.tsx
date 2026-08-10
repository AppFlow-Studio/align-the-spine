import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceListRow } from "@/components/ui/service-list-row";
import { StaggerGroup, StaggerItem } from "@/components/ui/stagger-reveal";
import { services } from "@/content/services";

/** Homepage services list per Figma (file NHwBqbGepOspY0GrCnECnj, node
 * 96:155, "Online Appointment" section): left-aligned heading (no eyebrow),
 * then rows fed by content/services.ts — each row carries its own Divider
 * under the title (see ServiceListRow), not between rows. Heading fades in
 * on its own; rows reveal as a subtle stagger once the list scrolls into
 * view (see components/ui/stagger-reveal.tsx). */
export function ServicesSection() {
  return (
    <Section reveal={false}>
      <Container className="flex flex-col gap-2">
        <FadeIn whenInView className="flex flex-col gap-2">
          <SectionHeading tone="navy-800">Online Appointment</SectionHeading>
        </FadeIn>
        <StaggerGroup className="flex flex-col gap-2">
          {services.map((service) => (
            <StaggerItem key={service.slug}>
              <ServiceListRow item={service} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
