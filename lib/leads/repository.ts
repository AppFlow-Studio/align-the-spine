import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseServiceClient } from "@/lib/supabase/server";

import type { LeadIngestionInput, LeadIngestionResult } from "./types";

export interface LeadRepository {
  ingest(input: LeadIngestionInput): Promise<LeadIngestionResult>;
}

export class SupabaseLeadRepository implements LeadRepository {
  constructor(private readonly client: SupabaseClient = createSupabaseServiceClient()) {}

  async ingest(input: LeadIngestionInput): Promise<LeadIngestionResult> {
    const { data, error } = await this.client.rpc("ingest_lead_submission", {
      submission_id: input.clientSubmissionId,
      submitted_form_id: input.formId,
      submitted_form_version: input.formVersion,
      submitted_contact_fields: input.contactFields,
      submitted_attribution: input.attribution,
      submitted_consent: input.consent,
      submitted_priority: input.priority,
      submitted_intent: input.intent,
      submitted_source_path: input.sourcePagePath,
      submitted_at: input.submittedAt,
      encrypted_payload: input.encrypted?.ciphertext ?? null,
      encryption_iv: input.encrypted?.iv ?? null,
      encryption_auth_tag: input.encrypted?.authTag ?? null,
      encryption_key_version: input.encrypted?.keyVersion ?? null,
      sensitive_field_names: input.encrypted?.fieldNames ?? [],
      rate_fingerprint: input.rateFingerprint || null,
      rate_limit: Number(process.env.LEAD_RATE_LIMIT_PER_HOUR ?? "10"),
    });
    if (error)
      throw new Error(error.code === "P0001" ? "rate_limit_exceeded" : "lead_ingestion_failed");
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.lead_id) throw new Error("lead_ingestion_failed");
    return { leadId: row.lead_id as string, created: Boolean(row.created) };
  }
}

export class FixtureLeadRepository implements LeadRepository {
  private readonly records = new Map<string, LeadIngestionInput & { leadId: string }>();

  async ingest(input: LeadIngestionInput): Promise<LeadIngestionResult> {
    const existing = this.records.get(input.clientSubmissionId);
    if (existing) return { leadId: existing.leadId, created: false };
    const leadId = `fixture-${input.clientSubmissionId}`;
    this.records.set(input.clientSubmissionId, structuredClone({ ...input, leadId }));
    return { leadId, created: true };
  }

  snapshot() {
    return [...this.records.values()].map((record) => structuredClone(record));
  }
}

let fixtureRepository: FixtureLeadRepository | undefined;

export function getLeadRepository(): LeadRepository {
  const mode = process.env.LEAD_REPOSITORY_MODE ?? process.env.CONTENT_REPOSITORY_MODE ?? "fixture";
  if (process.env.NODE_ENV === "production" && mode !== "supabase") {
    throw new Error("Production lead storage must use Supabase.");
  }
  if (mode === "fixture") {
    fixtureRepository ??= new FixtureLeadRepository();
    return fixtureRepository;
  }
  if (mode === "supabase") return new SupabaseLeadRepository();
  throw new Error(`Unsupported LEAD_REPOSITORY_MODE: ${mode}`);
}
