/**
 * Pure mapping of Resend webhook event types onto our delivery model, factored
 * out of the route so it can be unit-tested without the HTTP/svix layer.
 * "Accepted" (API took it) stays distinct from "delivered" (actually arrived);
 * bounce/complaint/suppression flag `suppress` so the row is locked against any
 * automatic resend.
 */
import type { DeliveryState } from "./types";

export interface ResendEventMapping {
  deliveryState: DeliveryState;
  /** When true, the outbox row is moved to 'suppressed' so it is never resent. */
  suppress: boolean;
}

const MAP: Record<string, ResendEventMapping> = {
  "email.sent": { deliveryState: "accepted", suppress: false },
  "email.delivered": { deliveryState: "delivered", suppress: false },
  "email.delivery_delayed": { deliveryState: "delayed", suppress: false },
  "email.bounced": { deliveryState: "bounced", suppress: true },
  "email.failed": { deliveryState: "failed", suppress: false },
  "email.complained": { deliveryState: "complained", suppress: true },
  "email.suppressed": { deliveryState: "suppressed", suppress: true },
};

export function mapResendEvent(type: string): ResendEventMapping | null {
  return MAP[type] ?? null;
}
