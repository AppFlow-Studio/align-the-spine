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
