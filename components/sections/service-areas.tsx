import Image from "next/image";

import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { siteConfig } from "@/content/site";

export interface ServiceAreasProps {
  image: { src: string; alt: string };
}

/** Photo + service-areas list per the Home-visits-v2 artboard (ATS-111):
 * a clinic-visit photo alongside a teal panel listing covered cities.
 * ATS-E4 (4.6): the city list was asserted as guaranteed home-visit
 * coverage with no confirmation it's accurate — renders nothing until
 * content/site.ts's `serviceAreas` is marked verified. */
export function ServiceAreas({ image }: ServiceAreasProps) {
  if (!siteConfig.serviceAreasVerified) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
      <div className="relative h-[300px] overflow-hidden lg:h-auto">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="bg-[#e4f9f4] p-8 lg:p-10">
        <h3 className="font-sans text-body-lg uppercase tracking-[1.25px] text-ink-900">
          Service Areas
        </h3>
        <div className="mt-4 h-px w-full bg-teal-500/30" />
        <ul className="mt-2">
          {siteConfig.serviceAreas.map((area) => (
            <li
              key={area}
              className="flex items-center justify-between border-b border-teal-500/20 py-3 font-display text-2xl text-navy-800 last:border-b-0"
            >
              {area}
              <ArrowRightIcon className="h-5 w-5 shrink-0 text-teal-500" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
