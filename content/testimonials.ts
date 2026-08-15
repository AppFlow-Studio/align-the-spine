export interface Testimonial {
  quote: string;
  author: string;
}

/** Real, client-supplied Google reviews (screenshots provided directly by
 * the practice, 2026-08-12) — copied verbatim, including each reviewer's
 * own phrasing/typos, same as every other real review on this site. Do not
 * invent or embellish entries here — a prior version fabricated "Maria G."
 * placeholder testimonials and that's what content-safety.test.ts's rule
 * exists to catch. All are 5-star; no date field since none of the
 * consuming UI (ReviewsCarousel, HeroReviewsCarousel, PatientReviews)
 * displays one. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Dr. Abe is a very dedicated, committed, and knowledgeable professional. He helped me a lot with my pain after my car accident.",
    author: "Sheila Pimentel",
  },
  {
    quote:
      "Amazing service! I am a professional fighter, DR Abe has helped me recover and fix any injuries I get from my fights and training",
    author: "John Michael Escoboza",
  },
  {
    quote:
      "Very professional had great therapy here I would definitely recommend to anyone with knee and back pain. Dr. Abe is very helpful and I would definitely come back again for more treatment",
    author: "Josh Merulla",
  },
  {
    quote:
      "I contacted Dr. Nasser after being in so much pain. He litterely responded right away and saw me the next day. I left there feeling so much better and pain free. I Will most definitely recommend him and be back soon.",
    author: "Evolutionary physique Fitness",
  },
  {
    quote:
      "Very professional and clean office. I love that he offers mobile services. I highly recommend Dr. Nasser. I walk out of his office feeling relieved of my lower back pain.",
    author: "Sabrina Perez",
  },
  {
    quote:
      "Had some lower back pain and saw Dr. Abe he was very informative and helpful in assisting me to get my range of motion back. Highly recommend!",
    author: "Mohammed Husein",
  },
  {
    quote:
      "Dr. Abe Nasser has me feeling great! Came in with shoulder, neck and knee pain and I feel great. Prices were spectacular compared to anyone else, great conversations. 100% recommended!",
    author: "Nash Husein",
  },
];

export const featuredTestimonial: Testimonial | undefined = testimonials[0];
export const homeFeaturedTestimonial: Testimonial | undefined = testimonials[0];
export const homeReviews: Testimonial[] = testimonials;
export const heroReviewsCarousel: Testimonial[] = testimonials;
