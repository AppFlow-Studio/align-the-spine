import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { MailIcon } from "@/components/ui/icons/mail";
import { PhoneIcon } from "@/components/ui/icons/phone";
import { PinIcon } from "@/components/ui/icons/pin";
import { siteConfig } from "@/content/site";

export interface LocationIntroProps {
  /** Defaults to the homepage's embedded contact form. Override on pages
   * with their own hero-level contact form (e.g. /contact-us) so "Send"
   * jumps there instead of navigating away. */
  sendHref?: string;
}

/** Intro/contact section per ATS-013: heading + address/phone/email + a
 * "Send Message" CTA on the left, an exterior building photo with a caption
 * overlay on the right. Rendered directly above LocationFooter on Home,
 * Services, About, Book, Contact Us. */
export function LocationIntro({ sendHref = "/#contact" }: LocationIntroProps) {
  return (
    <section className="bg-white">
      <div className="container grid gap-10 py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="flex flex-col gap-8">
          <h2 className="font-display text-h2 text-navy-900 leading-12">
            Serving
            <br />
            South Florida
          </h2>

          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <PinIcon className="size-8 shrink-0 bg-[#58A0A0] rounded-full px-2 text-white" />
              <address className="font-alt text-footer-copy not-italic text-navy-900">
                {siteConfig.business.address.line1} {siteConfig.business.address.suite}
                <br />
                {siteConfig.business.address.city}, {siteConfig.business.address.state}{" "}
                {siteConfig.business.address.zip}
              </address>
            </div>

            <a
              href={siteConfig.business.phoneHref}
              className="flex items-center gap-3 font-alt text-footer-copy text-navy-900 transition-colors hover:text-navy-700"
            >
              <PhoneIcon className="size-8 shrink-0 bg-[#58A0A0] rounded-full px-2 text-white" />
              {siteConfig.business.phone}
            </a>

            <a
              href={`mailto:${siteConfig.business.email}`}
              className="flex min-w-0 items-center gap-3 break-all font-alt text-footer-copy text-navy-900 transition-colors hover:text-navy-700"
            >
              <MailIcon className="size-8 shrink-0 bg-[#58A0A0] rounded-full px-2 text-white" />
              {siteConfig.business.email}
            </a>
          </div>

          <Link
            href={sendHref}
            className="flex h-12 w-fit items-center justify-center gap-3  bg-navy-900 px-8 font-sans text-button text-white transition-colors hover:bg-navy-700"
          >
            <span className="pr-10">Send</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>

        <div className="relative h-105 overflow-hidden  lg:h-130">
          <Image
            src="/figma-exports/exterior-img.png"
            alt="Palm Plaza exterior, home of Align the Spine Chiropractic"
            fill
            className="object-cover"
          />
          <div className="absolute p-7 w-[90%] mx-auto  inset-x-0 bottom-7 bg-overlay-white-16 backdrop-brightness-75 backdrop-blur-md border border-white">
            <h2 className="font-display text-3xl text-button text-white">Palm Plaza</h2>
            <p className="mt-1 font-alt text-footer-copy text-white text-lg">
              After you enter the plaza, we are the building on the far-right corner.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
