"use server";

import { revalidatePath } from "next/cache";

import { requeueDelivery } from "@/lib/lead/admin";

/** Server action for the "Retry" button. Only dead-lettered deliveries can be
 * requeued (requeueDelivery enforces it); suppressed rows are never resent.
 * Runs under the /admin Basic-auth gate (proxy.ts). */
export async function retryDeliveryAction(formData: FormData): Promise<void> {
  const outboxId = formData.get("outboxId");
  const leadId = formData.get("leadId");
  if (typeof outboxId === "string") {
    await requeueDelivery(outboxId);
  }
  if (typeof leadId === "string") {
    revalidatePath(`/admin/leads/${leadId}`);
  }
}
