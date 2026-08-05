"use client";

import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";

function buildMapEmbedSrc(): string {
  const { line1, suite, city, state, zip } = siteConfig.business.address;
  const fullAddress = `${line1} ${suite}, ${city}, ${state} ${zip}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;
}

/** Larger location/contact block per ATS-013: map with a floating glass
 * address card + an hours table (today's row highlighted) + dual CTAs.
 * Used as the "location" footer variant on Home, Services, About. */
export function LocationFooter() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <section className=" bg-white">
      <div className="container flex flex-col lg:flex-row lg:items-stretch">
        <div className="relative min-h-[420px] flex-1 lg:min-h-[560px]">
          <iframe
            title={`Map to ${siteConfig.business.name}`}
            src={buildMapEmbedSrc()}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
          <div className="absolute inset-x-4 bottom-4 bg-overlay-white-16 p-6 backdrop-blur-md backdrop-brightness-85 border border-white sm:inset-x-8 sm:bottom-8 sm:p-8">
            <h2 className="font-display text-h2 text-navy-900">Our Location</h2>
            <address className="mt-2 font-alt text-footer-copy not-italic text-navy-900">
              {siteConfig.business.address.line1}, {siteConfig.business.address.suite}
              <br />
              {siteConfig.business.address.city}, {siteConfig.business.address.state}{" "}
              {siteConfig.business.address.zip}
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-6 px-6 py-10 lg:w-[420px] lg:shrink-0 lg:py-16 lg:pl-14">
          <div>
            <h3 className="font-display text-h2 text-navy-900">Hours of operation</h3>
            <div className="mt-2 h-px w-full bg-mute-300" />
          </div>

          {siteConfig.hoursVerified ? (
            <table className="w-full font-alt text-footer-copy">
              <tbody>
                {siteConfig.hours.map((hours) => {
                  const isToday = hours.day === today;
                  return (
                    <tr key={hours.day} className="border-t border-gray-200 first:border-t-0">
                      <th
                        scope="row"
                        className={cn(
                          "py-2 text-left font-normal text-navy-900",
                          isToday && "text-teal-500",
                        )}
                      >
                        {hours.day}
                      </th>
                      <td
                        className={cn(
                          "py-2 text-right font-bold text-navy-900",
                          isToday && "text-teal-500",
                        )}
                      >
                        {hours.open} – {hours.close}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            // ATS-E4 (4.2): hours aren't confirmed yet — show a neutral
            // call-to-confirm instead of asserting unverified daily hours.
            <p className="font-alt text-footer-copy text-mute-400">
              Call {siteConfig.business.phone} to confirm today&apos;s hours.
            </p>
          )}

          <div className=" gap-4 pt-4 sm:flex-row sm:items-center">
            <Link
              href={siteConfig.bookingCta.href}
              className="flex h-12 items-center justify-center gap-3 bg-navy-900 px-8 font-sans text-button text-white transition-colors hover:bg-navy-700"
            >
              Book Your Visit
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
