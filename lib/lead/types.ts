/** Shared types for the lead CRM + delivery platform (server-side). */

export type LeadPriority = "high" | "standard";

export type DeliveryPurpose = "office_notification" | "patient_acknowledgment" | "google_sheets";

export type DeliveryDestination = "resend_email" | "google_sheets";

export type OutboxStatus =
  "pending" | "processing" | "sent" | "dead_letter" | "suppressed" | "cancelled";

export type DeliveryState =
  "accepted" | "delivered" | "delayed" | "bounced" | "failed" | "complained" | "suppressed";

/** Row shape of public.leads (the columns the app reads back). */
export interface LeadRow {
  id: string;
  submission_id: string;
  created_at: string;
  updated_at: string;
  form_variant: string;
  form_version: number;
  priority: LeadPriority;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  zip: string | null;
  best_time: string | null;
  reason: string | null;
  car_accident: string | null;
  raw_fields: Record<string, string>;
  attribution: Record<string, string>;
  source_path: string | null;
  sensitive_payload: string | null;
  sensitive_present: boolean;
  status: string;
}

/** Row shape of public.lead_delivery_outbox. */
export interface OutboxRow {
  id: string;
  lead_id: string;
  submission_id: string;
  destination: DeliveryDestination;
  delivery_purpose: DeliveryPurpose;
  status: OutboxStatus;
  attempts: number;
  max_attempts: number;
  next_attempt_at: string;
  locked_at: string | null;
  locked_by: string | null;
  external_id: string | null;
  idempotency_key: string | null;
  delivery_state: DeliveryState | null;
  delivery_state_at: string | null;
  payload: Record<string, unknown>;
  last_error: string | null;
  created_at: string;
  updated_at: string;
}
