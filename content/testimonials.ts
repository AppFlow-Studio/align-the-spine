export interface Testimonial {
  quote: string;
  author: string;
}

/** PLACEHOLDER COPY — not real reviews. ATS-E4 (4.11) purged the old
 * repeated "Maria G." placeholder because the same fake quote was reused
 * everywhere; these are restored (still fake) so the review sections
 * render across the site again. Swap for real, client-approved Google
 * reviews before launch. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Great experience. Very professional and explains everything clearly. Highly recommend for back pain.",
    author: "Maria G.",
  },
  {
    quote: "Same-day appointment after my accident and the whole team made the paperwork painless.",
    author: "James T.",
  },
  {
    quote: "Dr. Abe came to my home for the first visit — huge help while I couldn't drive.",
    author: "Priya R.",
  },
  {
    quote:
      "Bilingual staff made it so much easier for my parents to understand their treatment plan.",
    author: "Carlos M.",
  },
];

export const featuredTestimonial: Testimonial | undefined = testimonials[0];
export const homeFeaturedTestimonial: Testimonial | undefined = testimonials[0];
export const homeReviews: Testimonial[] = testimonials;
export const heroReviewsCarousel: Testimonial[] = testimonials;
