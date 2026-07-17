import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { MailIcon } from "@/components/ui/icons/mail";
import { PhoneIcon } from "@/components/ui/icons/phone";
import { PinIcon } from "@/components/ui/icons/pin";
import { siteConfig } from "@/content/site";

/** Intro/contact section per ATS-013: heading + address/phone/email + a
 * "Send Message" CTA on the left, an exterior building photo with a caption
 * overlay on the right. Rendered directly above LocationFooter on Home,
 * Services, About. */
export function LocationIntro() {
  return (
    <section className="bg-white">
      <div className="container grid gap-10 py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="flex flex-col gap-8">
          <h2 className="font-display text-h2 text-navy-900">
            Serving
            <br />
            South Florida
          </h2>

          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <PinIcon className="mt-1 h-5 w-5 shrink-0 text-navy-900" />
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
              <PhoneIcon className="h-5 w-5 shrink-0" />
              {siteConfig.business.phone}
            </a>

            <a
              href={`mailto:${siteConfig.business.email}`}
              className="flex min-w-0 items-center gap-3 break-all font-alt text-footer-copy text-navy-900 transition-colors hover:text-navy-700"
            >
              <MailIcon className="h-5 w-5 shrink-0" />
              {siteConfig.business.email}
            </a>
          </div>

          <Link
            href="/#contact"
            className="flex h-16 w-fit items-center justify-center gap-3  bg-navy-900 px-8 font-sans text-button text-white transition-colors hover:bg-navy-700"
          >
            Send Message
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>

        <div className="relative h-[420px] overflow-hidden  lg:h-[480px]">
          <Image
            src="/figma-exports/exterior-img.png"
            alt="Palm Plaza exterior, home of Align the Spine Chiropractic"
            fill
            className="object-cover"
          />
          <div className="absolute p-7 w-[90%] mx-auto  inset-x-0 bottom-7 bg-overlay-white-16 backdrop-blur-md">
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
