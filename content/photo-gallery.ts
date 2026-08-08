export interface GalleryPhoto {
  src: string;
  alt: string;
}

/** Interior photo strip per the about-drabe artboard (96:2596–96:2598),
 * ATS-090: a full-width hero photo (the office corridor) over a row of 3
 * office photos, all sharing one grid/gap so the hero's gap to the row
 * below matches the row's own gaps between photos. */
export const interiorGalleryHero: GalleryPhoto = {
  src: "/figma-exports/interior-corridor.png",
  alt: "Align the Spine office corridor",
};

export const interiorGalleryPhotos: GalleryPhoto[] = [
  { src: "/figma-exports/interior-chairs.png", alt: "Align the Spine waiting area seating" },
  { src: "/figma-exports/interior-table.png", alt: "Align the Spine treatment room" },
  { src: "/figma-exports/interior-reception.png", alt: "Align the Spine reception area" },
];
