import { siteConfig } from "@/content/site";

export interface WhyChooseContent {
  heading: string;
  body: string;
  cta: { label: string; href: string };
  rating: { value: number; count: number; location: string };
  image: { src: string; alt: string };
}

/** WhyChoose copy + image per homepage artboard (96:496–96:503), ATS-072. */
export const whyChooseContent: WhyChooseContent = {
  heading: "Why Choose Align the Spine Chiropractic",
  body: "Serving South Florida for over 15 years. From everyday back pain and sports injuries to complex accident recovery, Align the Spine was built around one belief: great chiropractic care should be accessible to everyone. Transparent pricing. All major insurance accepted. And a doctor who actually knows your name — because at Align the Spine, you always see Dr. Abe.",
  cta: { label: "Book an appointment", href: siteConfig.bookingCta.href },
  rating: { value: 5, count: 152, location: "Deerfield Beach, Florida" },
  image: { src: "/figma-exports/interior-table.png", alt: "Align the Spine treatment room" },
};
