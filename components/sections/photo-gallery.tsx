import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { StoryVideo } from "@/components/ui/kibo-ui/stories";
import { Section } from "@/components/ui/section";
import {
  interiorGalleryHero,
  interiorGalleryPhotos,
  type GalleryPhoto,
} from "@/content/photo-gallery";

/** A single gallery cell's media: the still photo, plus — when the photo has
 * a `video` — a muted clip layered on top (kibo-ui StoryVideo) that fades in
 * and plays on hover. At rest the video sits at opacity-0, so the cell is
 * visually identical to the plain photo; the parent must carry the `group`
 * class so both the fade and StoryVideo's hover playback fire together. */
function GalleryMedia({ photo, sizes }: { photo: GalleryPhoto; sizes: string }) {
  return (
    <>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {photo.video ? (
        <StoryVideo
          src={photo.video}
          aria-label={photo.alt}
          className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      ) : null}
    </>
  );
}

/** Interior photo strip per the about-drabe artboard (96:2596–96:2598),
 * ATS-090: a full-width hero photo over 3 equal-width office photos, all in
 * one grid so the vertical gap above the row matches the horizontal gaps
 * within it — collapses to a single column below sm. Cells with a `video`
 * play their clip on hover; the layout is unchanged. */
export interface PhotoGalleryProps {
  hero?: GalleryPhoto;
  photos?: GalleryPhoto[];
  /** Optional eyebrow + heading rendered above the grid. Undefined by
   * default (no heading at all) so the existing Spanish /dr-abe-nasser
   * usage, which doesn't pass either, renders exactly as before — ATS-SEO-059
   * passes both explicitly from the English /about page only, since a
   * hardcoded English default here would otherwise leak onto the Spanish
   * page's photo strip. */
  eyebrow?: string;
  heading?: string;
}

export function PhotoGallery({
  hero = interiorGalleryHero,
  photos = interiorGalleryPhotos,
  eyebrow,
  heading,
}: PhotoGalleryProps = {}) {
  return (
    <Section spacing="none">
      <Container className="flex flex-col gap-6">
        {heading && (
          <div className="flex flex-col items-center gap-3 text-center">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h2 className="font-display text-h2 text-navy-800">{heading}</h2>
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="group relative aspect-[1566/874] overflow-hidden w-full sm:col-span-3">
            <GalleryMedia photo={hero} sizes="100vw" />
          </div>
          {photos.map((photo) => (
            <div key={photo.src} className="group relative aspect-[507/378] overflow-hidden w-full">
              <GalleryMedia photo={photo} sizes="(min-width: 640px) 33vw, 100vw" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
