import { Fragment } from "react";

import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceListRow } from "@/components/ui/service-list-row";
import { services } from "@/content/services";

/** Homepage services list per condition-page-spec §B9 (services-3 /
 * homepage list layout): alternating ServiceListRow entries separated by
 * Divider hairlines, fed by content/services.ts. */
export function ServicesSection() {
  return (
    <Section>
      <Container className="flex flex-col gap-2">
        <SectionHeading
          eyebrow="Our services"
          className="mx-auto max-w-2xl items-center text-center"
        >
          How we help you move without pain
        </SectionHeading>
        {services.map((service, i) => (
          <Fragment key={service.slug}>
            {i > 0 && <Divider />}
            <ServiceListRow item={service} reverse={i % 2 === 1} />
          </Fragment>
        ))}
      </Container>
    </Section>
  );
}
