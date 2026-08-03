import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CheckIcon } from "@/components/ui/icons/check";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/content/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: `Thank You | ${siteConfig.business.name}`,
  description: "We've received your request and will be in touch shortly.",
  path: "/thank-you",
  robots: { index: false },
});

/** Lead-form confirmation page (ATS-031). No Figma design exists for this
 * route — simple branded layout proposed per the ticket. */
export default function ThankYouPage() {
  return (
    <Section spacing="lg" className="container pt-40 md:pt-48">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-500">
          <CheckIcon className="h-8 w-8 text-white" />
        </span>

        <Eyebrow>Request received</Eyebrow>

        <h1 className="font-display text-display text-navy-900">Thank you!</h1>

        <p className="font-sans text-body-lg text-ink-500">
          Your request is in — a member of our team will reach out shortly to confirm your
          appointment. If you need us sooner, give us a call and we&apos;ll take care of you right
          away.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href={siteConfig.business.phoneHref} variant="teal">
            Call {siteConfig.business.phone}
          </Button>
          <Button href="/" variant="primary">
            Back to Home
          </Button>
        </div>
      </div>
    </Section>
  );
}
