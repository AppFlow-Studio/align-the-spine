import { Container } from "@/components/ui/container";
import { LeadForm } from "@/components/ui/lead-form";
import { Section } from "@/components/ui/section";
import { leadFormVariants } from "@/content/lead-forms";

/** Homepage "Contact us" block per artboard (96:326–96:346): copy left,
 * `contact` LeadForm variant right. Sits above LocationIntro/LocationFooter,
 * which RootShell mounts automatically for the "location" footer variant. */
export function ContactSection() {
  return (
    <Section id="contact" spacing="lg">
      <Container className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-h2 text-navy-800">Contact us</h2>
          <p className="font-sans text-body-lg text-ink-900">
            Injured or just have a question? Reach out anytime — we respond fast, no call center.
          </p>
        </div>

        <LeadForm
          heading="Send us a message"
          fieldVariant="light"
          submitLabel={leadFormVariants.contact.submitLabel}
          variant={leadFormVariants.contact.variant}
          fields={leadFormVariants.contact.fields}
        />
      </Container>
    </Section>
  );
}
