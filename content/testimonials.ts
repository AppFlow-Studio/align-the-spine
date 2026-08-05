export interface Testimonial {
  quote: string;
  author: string;
}

/** ATS-E4 (4.11): every testimonial previously here was the same
 * placeholder "Maria G." quote, repeated across the featured spot, the
 * 3-column row, and the hero carousel — not real reviews. Purged; add
 * real, client-approved reviews here once available. Every consumer
 * (HeroReviewsCarousel, PatientReviews, ReviewsStrip) renders nothing
 * when its testimonial(s) are empty/undefined, so the site is safe with
 * this file empty. */
export const testimonials: Testimonial[] = [];

/** Client-approved (per the Figma hero-stats-bar design, node 186:71). */
const mariaG: Testimonial = {
  quote:
    "Great experience. Very professional and explains everything clearly. Highly recommend for back pain.",
  author: "Maria G.",
};

export const featuredTestimonial: Testimonial | undefined = undefined;
export const homeFeaturedTestimonial: Testimonial | undefined = undefined;
export const homeReviews: Testimonial[] = testimonials;
export const heroReviewsCarousel: Testimonial[] = [mariaG];
