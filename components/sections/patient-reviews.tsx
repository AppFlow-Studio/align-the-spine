import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Rating } from "@/components/ui/rating";
import { Section } from "@/components/ui/section";
import type { Testimonial } from "@/content/testimonials";

export interface PatientReviewsProps {
  featured: Testimonial;
  reviews: Testimonial[];
}

/** Full-bleed navy "PATIENT SUCCESS" reviews band per homepage artboard
 * (Group 10, 96:347–96:394): a large centered featured quote over a
 * three-column row of verified-review cards. */
export function PatientReviews({ featured, reviews }: PatientReviewsProps) {
  return (
    <Section spacing="lg" className="bg-navy-900">
      <Container className="flex flex-col items-center gap-14">
        <div className="flex max-w-3xl flex-col items-center gap-6 text-center">
          <Eyebrow>Patient success</Eyebrow>
          <p className="font-display text-h2 text-white">&ldquo;{featured.quote}&rdquo;</p>
          <div className="flex flex-col items-center gap-1">
            <span className="font-sans text-stat-label uppercase text-white">
              – {featured.author}
            </span>
            <span className="font-sans text-stat-label text-mute-300">Verified Google review</span>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-3">
          {reviews.map((review, i) => (
            <div
              key={`${review.author}-${i}`}
              className="flex flex-col gap-3 border-t border-white/20 pt-6"
            >
              <span className="font-sans text-stat-label uppercase text-mute-300">
                {review.author}
              </span>
              <Rating value={5} />
              <p className="font-sans text-card-body text-mute-300">&ldquo;{review.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
