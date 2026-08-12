export interface Testimonial {
  quote: string;
  author: string;
}

/** No real, client-approved testimonials exist yet. Every consuming
 * component (PatientReviews, HeroReviewsCarousel, ReviewsStrip) already
 * renders nothing when given an empty array/undefined featured quote — see
 * their own doc comments. The real replacement is scoped separately: real
 * reviews from the practice's Google review corpus, copied verbatim with
 * the reviewer's name and date (see the /reviews page build). Do not
 * repopulate this file with invented names/quotes — a prior version did
 * exactly that and it's what content-safety.test.ts's "Maria G." rule
 * exists to catch. */
export const testimonials: Testimonial[] = [];

export const featuredTestimonial: Testimonial | undefined = testimonials[0];
export const homeFeaturedTestimonial: Testimonial | undefined = testimonials[0];
export const homeReviews: Testimonial[] = testimonials;
export const heroReviewsCarousel: Testimonial[] = testimonials;
