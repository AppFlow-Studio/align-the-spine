import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const migration003 = readFileSync(
  join(root, "supabase/migrations/202608160003_lead_crm_attribution.sql"),
  "utf8",
).toLowerCase();
const migration004 = readFileSync(
  join(root, "supabase/migrations/202608160004_lead_delivery_outbox.sql"),
  "utf8",
).toLowerCase();
const contentMigration = readFileSync(
  join(root, "supabase/migrations/202608160001_content_platform.sql"),
  "utf8",
).toLowerCase();
const uniformFieldsMigration = readFileSync(
  join(root, "supabase/migrations/202608190002_uniform_required_lead_fields.sql"),
  "utf8",
);

describe("lead CRM migration security contract", () => {
  it("creates every required normalized table with RLS", () => {
    for (const table of [
      "form_definitions",
      "lead_submissions",
      "lead_attribution",
      "lead_sensitive_payloads",
      "lead_consent_receipts",
      "lead_status_events",
      "lead_delivery_outbox",
      "lead_delivery_attempts",
    ]) {
      const migration = table.startsWith("lead_delivery_") ? migration004 : migration003;
      expect(migration).toContain(`create table public.${table}`);
      expect(migration).toContain(`alter table public.${table} enable row level security`);
    }
  });

  it("keeps service RPCs unavailable to anon and lead_manager out of CMS policies", () => {
    expect(migration003).toContain("grant execute on function public.ingest_lead_submission");
    expect(migration003).toContain("to service_role");
    expect(migration003).not.toContain(
      "grant execute on function public.ingest_lead_submission(uuid,text,integer,jsonb,jsonb,jsonb,public.lead_priority,public.lead_intent,text,timestamptz,text,text,text,integer,text[],text,integer) to anon",
    );
    expect(contentMigration).not.toContain("lead_manager");
  });

  it("uses lock-safe claims, attempt auditing, retry, and dead-letter states", () => {
    expect(migration004).toContain("for update skip locked");
    expect(migration004).toContain("insert into public.lead_delivery_attempts");
    expect(migration004).toContain("power(2");
    expect(migration004).toContain("dead_letter");
    expect(migration004).toContain("locked_at < now()");
  });

  it("seeds exactly the eight versioned application form IDs", () => {
    for (const form of [
      "heroEval",
      "accidentEval",
      "contactUs",
      "carAccident",
      "reviewsEval",
      "contact",
      "eligibility",
      "booking",
    ]) {
      expect(migration003).toContain(`('${form.toLowerCase()}', 1`);
    }
  });

  it("keeps the DB contract's required core fields in sync with content/lead-forms.ts (202608190002)", () => {
    for (const form of [
      "heroEval",
      "accidentEval",
      "contactUs",
      "carAccident",
      "reviewsEval",
      "contact",
      "eligibility",
      "booking",
    ]) {
      const clause = uniformFieldsMigration
        .split(/^update /m)
        .find((block) => block.includes(`form_id = '${form}'`) || block.includes(`'${form}'`));
      expect(clause, `no corrective UPDATE found for ${form}`).toBeDefined();
      for (const name of ["firstName", "lastName", "phone", "email", "carAccident"]) {
        expect(clause, `${form} missing "${name}" in the corrective migration`).toContain(
          `"name":"${name}"`,
        );
      }
      expect(clause, `${form}'s carAccident isn't required in the corrective migration`).toMatch(
        /"name":"carAccident"[^}]*"required":true/,
      );
    }
  });
});
