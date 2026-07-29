export interface Testimonial {
  quote: string;
  author: string;
}

/** Single featured testimonial shown in the ReviewsStrip under /home-visits'
 * hero (ATS-110). Placeholder copy — swap in a real review when available. */
export const featuredTestimonial: Testimonial = {
  quote:
    "Great experience. Very professional and explains everything clearly. Highly recommend for back pain.",
  author: "Maria G.",
};

/** Large centered "PATIENT SUCCESS" quote on the homepage reviews band
 * (Group 10, 96:347–96:394). Placeholder copy per the homepage artboard. */
export const homeFeaturedTestimonial: Testimonial = {
  quote:
    "Dr. Abe is the best in South Florida. I was in a bad accident and couldn't leave my house—he came to me the same day and took care of everything",
  author: "Maria G.",
};

/** Three-column verified-review row below the featured quote. The artboard
 * repeats the same placeholder review across all three columns. */
export const homeReviews: Testimonial[] = [
  featuredTestimonial,
  featuredTestimonial,
  featuredTestimonial,
];

/** Rotation for the floating review-card carousel under Hero
 * (HeroReviewsCarousel). Four dots per the homepage artboard — placeholder
 * copy repeats the same review until real ones are available. */
export const heroReviewsCarousel: Testimonial[] = [
  featuredTestimonial,
  featuredTestimonial,
  featuredTestimonial,
  featuredTestimonial,
];
