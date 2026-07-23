export interface GalleryPhoto {
  src: string;
  alt: string;
}

/** Interior photo strip per the about-drabe artboard (96:2596–96:2598),
 * ATS-090: three office photos in a row. */
export const interiorGalleryPhotos: GalleryPhoto[] = [
  { src: "/figma-exports/interior-chairs.png", alt: "Align the Spine waiting area seating" },
  { src: "/figma-exports/interior-table.png", alt: "Align the Spine treatment room" },
  { src: "/figma-exports/interior-corridor.png", alt: "Align the Spine office corridor" },
];
