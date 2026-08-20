import type { ContentStatus, EditorialRole } from "./types";

const transitions: Record<ContentStatus, readonly ContentStatus[]> = {
  draft: ["in_review"],
  in_review: ["draft", "approved"],
  approved: ["draft", "scheduled", "published"],
  scheduled: ["approved", "published"],
  published: ["archived"],
  archived: ["draft"],
};

export function canTransition(from: ContentStatus, to: ContentStatus): boolean {
  return transitions[from].includes(to);
}

export function assertTransitionAllowed(input: {
  from: ContentStatus;
  to: ContentStatus;
  role: EditorialRole;
  actorId: string;
  updatedBy: string;
  medicalReviewRequired: boolean;
}): void {
  if (input.role === "lead_manager") {
    throw new Error("Lead managers cannot change editorial content.");
  }
  if (!canTransition(input.from, input.to)) {
    throw new Error(`Illegal content transition: ${input.from} -> ${input.to}`);
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
