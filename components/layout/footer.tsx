import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-navy-900">
      <div className="container flex flex-col gap-16 py-20 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-6 lg:max-w-xs xl:max-w-lg">
          <Image
            src="/figma-exports/logo_blue.png"
            alt={siteConfig.business.name}
            width={97}
            height={97}
          />
          <p className="text-footer-tagline text-mute-300">{siteConfig.footer.tagline}</p>
        </div>

        <div className="flex flex-col gap-12 sm:flex-row sm:gap-24">
          <div className="flex flex-col gap-4 sm:w-80 sm:shrink-0">
            <h2 className="text-footer-heading uppercase text-white">Contact</h2>
            <a
              href={siteConfig.business.phoneHref}
              className="text-footer-copy text-mute-300 hover:text-white"
            >
              {siteConfig.business.phone}
            </a>
            <address className="text-footer-copy not-italic text-mute-300">
              {siteConfig.business.address.line1}, {siteConfig.business.address.suite}
              <br />
              {siteConfig.business.address.city}, {siteConfig.business.address.state}{" "}
              {siteConfig.business.address.zip}
            </address>
          </div>

          <div className="flex flex-col gap-4 sm:w-40 sm:shrink-0">
            <h2 className="text-footer-heading uppercase text-white">Site</h2>
            <nav className="flex flex-col gap-2">
              {siteConfig.footer.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-footer-copy text-mute-300 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="container flex flex-col gap-2 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-footer-copy text-mute-300">
          {year} {siteConfig.footer.copyrightName}. Licensed in the State of Florida.
        </p>
        <Link href="/privacy-policy" className="text-footer-copy text-mute-300 hover:text-white">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
