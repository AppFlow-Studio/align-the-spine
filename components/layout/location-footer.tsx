import Link from "next/link";

import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { siteConfig } from "@/content/site";

function buildMapEmbedSrc(): string {
  const { line1, suite, city, state, zip } = siteConfig.business.address;
  const fullAddress = `${line1} ${suite}, ${city}, ${state} ${zip}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;
}

/** Larger location/contact block per ATS-013: map + address + hours table +
 * dual CTAs. Used as the "location" footer variant on Home, Services, About. */
export function LocationFooter() {
  return (
    <footer className="border-t border-white/10 bg-navy-900">
      <div className="container flex flex-col gap-14 py-20 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-6 lg:max-w-md">
          <Eyebrow>Location</Eyebrow>
          <h2 className="font-display text-display text-white">Our Location</h2>
          <p className="text-footer-copy text-mute-300">
            Find us inside Palm Plaza, just off Southeast 8th Avenue in Deerfield Beach.
          </p>
          <address className="text-footer-copy not-italic text-mute-300">
            {siteConfig.business.address.line1}, {siteConfig.business.address.suite}
            <br />
            {siteConfig.business.address.city}, {siteConfig.business.address.state}{" "}
            {siteConfig.business.address.zip}
          </address>

          <table className="w-full text-footer-copy text-mute-300">
            <tbody>
              {siteConfig.hours.map((hours) => (
                <tr key={hours.day} className="border-t border-white/10">
                  <th scope="row" className="py-2 text-left font-normal text-white">
                    {hours.day}
                  </th>
                  <td className="py-2 text-right">
                    {hours.open} – {hours.close}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-footer-copy text-mute-300">{siteConfig.hoursNote}</p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={siteConfig.bookingCta.href}
              className="flex h-16 items-center justify-center gap-3 rounded-40 bg-white px-8 font-sans text-button text-navy-900 transition-colors hover:bg-mute-300"
            >
              Book Your Visit
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/#contact"
              className="flex items-center gap-2 font-alt text-alt-label text-white transition-colors hover:text-mute-300"
            >
              Send Message
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <iframe
          title={`Map to ${siteConfig.business.name}`}
          src={buildMapEmbedSrc()}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[360px] w-full rounded-20 border-0 lg:w-[560px]"
        />
      </div>
    </footer>
  );
}
