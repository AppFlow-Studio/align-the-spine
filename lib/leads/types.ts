import type { Attribution } from "@/lib/attribution";

export type LeadStatus = "new" | "contacted" | "qualified" | "scheduled" | "closed" | "spam";
export type LeadPriority = "high" | "standard";
export type LeadIntent = "general" | "car_accident";

export interface LeadIngestionInput {
  clientSubmissionId: string;
  formId: string;
  formVersion: number;
  contactFields: Record<string, string>;
  attribution: Attribution;
  consent: { version: string; wording: string; channel: "web_form"; granted: true };
  priority: LeadPriority;
  intent: LeadIntent;
  sourcePagePath: string;
  submittedAt: string;
  encrypted?: {
    ciphertext: string;
    iv: string;
    authTag: string;
    keyVersion: number;
    fieldNames: string[];
  };
  rateFingerprint?: string;
}

export interface LeadIngestionResult {
  leadId: string;
  created: boolean;
}
