import type { ContentStatus, ContentType, EditorialRole } from "./types";

/** Mirror of `transition_content()` in
 * supabase/migrations/202609270001_blog_writer_self_publish.sql — the database
 * is the enforcing copy; this exists so the app can reason about, and explain,
 * a transition before spending a round trip on it. Keep the two in step.
 *
 * Blog posts belong to their writer: any editorial account may take its own
 * post from draft straight to published, with no reviewer or admin handoff.
 * `service_area` keeps the two-person flow because those pages ride on the
 * local-evidence gate in static-service-area-repository.ts. */
const blogTransitions: Record<ContentStatus, readonly ContentStatus[]> = {
  draft: ["in_review", "approved", "scheduled", "published"],
  in_review: ["draft", "approved", "scheduled", "published"],
  approved: ["draft", "scheduled", "published"],
  scheduled: ["draft", "approved", "published"],
  published: ["archived"],
  archived: ["draft"],
};

const reviewedTransitions: Record<ContentStatus, readonly ContentStatus[]> = {
  draft: ["in_review"],
  in_review: ["draft", "approved"],
  approved: ["draft", "scheduled", "published"],
  scheduled: ["approved", "published"],
  published: ["archived"],
  archived: ["draft"],
};

export function canTransition(
  from: ContentStatus,
  to: ContentStatus,
  contentType: ContentType = "blog_post",
): boolean {
  const table = contentType === "blog_post" ? blogTransitions : reviewedTransitions;
  return table[from].includes(to);
}

export function assertTransitionAllowed(input: {
  from: ContentStatus;
  to: ContentStatus;
  role: EditorialRole;
  actorId: string;
  updatedBy: string;
  medicalReviewRequired: boolean;
  contentType?: ContentType;
}): void {
  const contentType = input.contentType ?? "blog_post";
  if (input.role === "lead_manager") {
    throw new Error("Lead managers cannot change editorial content.");
  }
  if (!canTransition(input.from, input.to, contentType)) {
    throw new Error(`Illegal content transition: ${input.from} -> ${input.to}`);
  }
  if (contentType === "blog_post") {
    // Whoever may write a post may publish it. No review handoff, and
    // `medicalReviewRequired` is deliberately not read for blog content.
    return;
  }
  if (input.to === "approved") {
    if (input.role !== "clinician_reviewer" && input.role !== "admin") {
      throw new Error("Only a clinician reviewer or admin may approve content.");
    }
    if (input.medicalReviewRequired && input.actorId === input.updatedBy) {
      throw new Error("Medical content cannot be self-approved by its latest editor.");
    }
  }
  if (["scheduled", "published", "archived"].includes(input.to) && input.role !== "admin") {
    throw new Error("Only an admin may schedule, publish, or archive content.");
  }
}
