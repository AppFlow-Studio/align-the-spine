import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/content/site";

/** Simple 3-column grid (brand / contact / site links) instead of the old
 * `w-[40vw]`/`w-[60vw]` split — viewport-width units inside a max-width
 * `.container` don't track the container's own width, so those two columns
 * could drift out of proportion with it at in-between sizes. A plain
 * responsive grid keeps the columns' widths tied to the row they're
 * actually in. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-navy-900">
      <div className="container grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-8">
        <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
          <Image
            src="/figma-exports/logo_blue.png"
            alt={siteConfig.business.name}
            width={88}
            height={88}
          />
          <p className="max-w-sm text-footer-tagline text-mute-300">{siteConfig.footer.tagline}</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* h3, not h2: footer link-group labels shouldn't compete with
           * the page's real h2 content sections in the heading outline. */}
          <h3 className="text-footer-heading uppercase text-white">Contact</h3>
          <a
            href={siteConfig.business.phoneHref}
            className="inline-flex min-h-11 w-fit items-center text-footer-copy text-mute-300 transition-colors hover:text-white"
          >
            {siteConfig.business.phone}
          </a>
          <a
            href={`mailto:${siteConfig.business.email}`}
            className="-mt-2 inline-flex min-h-11 w-fit items-center text-footer-copy text-mute-300 transition-colors hover:text-white"
          >
            {siteConfig.business.email}
          </a>
          <address className="-mt-2 text-footer-copy not-italic leading-6 text-mute-300">
            {siteConfig.business.address.line1}, {siteConfig.business.address.suite}
            <br />
            {siteConfig.business.address.city}, {siteConfig.business.address.state}{" "}
            {siteConfig.business.address.zip}
          </address>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-footer-heading uppercase text-white">Site</h3>
          <nav className="flex flex-col gap-1">
            {siteConfig.footer.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 w-fit items-center text-footer-copy text-mute-300 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="container flex flex-col gap-2 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-footer-copy text-mute-300">
          {year} {siteConfig.footer.copyrightName}. Licensed in the State of Florida.
        </p>
        <Link
          href="/privacy-policy"
          className="inline-flex min-h-11 items-center text-footer-copy text-mute-300 transition-colors hover:text-white"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
