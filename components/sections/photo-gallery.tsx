import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { interiorGalleryHero, interiorGalleryPhotos } from "@/content/photo-gallery";

/** Interior photo strip per the about-drabe artboard (96:2596–96:2598),
 * ATS-090: a full-width hero photo over 3 equal-width office photos, all in
 * one grid so the vertical gap above the row matches the horizontal gaps
 * within it — collapses to a single column below sm. */
export function PhotoGallery() {
  return (
    <Section spacing="none">
      <Container className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="relative aspect-[1566/874] overflow-hidden w-full sm:col-span-3">
          <Image
            src={interiorGalleryHero.src}
            alt={interiorGalleryHero.alt}
            fill
            sizes="100vw"
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        {interiorGalleryPhotos.map((photo) => (
          <div key={photo.src} className="relative aspect-[507/378] overflow-hidden w-full">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 640px) 33vw, 100vw"
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </Container>
    </Section>
  );
}
