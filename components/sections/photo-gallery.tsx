import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { interiorGalleryPhotos } from "@/content/photo-gallery";

/** Interior photo strip per the about-drabe artboard (96:2596–96:2598),
 * ATS-090: three equal-width office photos, collapsing to a single column
 * below sm. */
export function PhotoGallery() {
  return (
    <Section spacing="none">
      <Container className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {interiorGalleryPhotos.map((photo) => (
          <div key={photo.src} className="relative aspect-[507/378] w-full">
            <Image src={photo.src} alt={photo.alt} fill className="object-cover" />
          </div>
        ))}
      </Container>
    </Section>
  );
}
