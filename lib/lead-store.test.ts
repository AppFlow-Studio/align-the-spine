import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdmin: vi.fn(),
}));

/** Minimal fake standing in for the Supabase JS client, backed by an
 * in-memory array — just enough chainable surface for lib/lead-store.ts's
 * two query shapes (insert().select().maybeSingle(), select().eq().single(),
 * update().eq()). Real enough to exercise the UNIQUE-violation / dedupe path
 * (Postgres error code 23505) without needing a live database in CI. */
function createFakeSupabase() {
  const rows: Record<string, unknown>[] = [];
  let nextId = 1;

  const client = {
    from(_table: string) {
      return {
        insert(row: Record<string, unknown>) {
          const conflict = rows.find((r) => r.idempotency_key === row.idempotency_key);
          return {
            select() {
              return {
                async maybeSingle() {
                  if (conflict) {
                    return { data: null, error: { code: "23505", message: "duplicate key" } };
                  }
                  const inserted = {
                    id: `lead-${nextId++}`,
                    created_at: new Date().toISOString(),
                    ...row,
                  };
                  rows.push(inserted);
                  return { data: inserted, error: null };
                },
              };
            },
          };
        },
        select() {
          return {
            eq(column: string, value: unknown) {
              return {
                async single() {
                  const found = rows.find((r) => r[column] === value);
                  return found
                    ? { data: found, error: null }
                    : { data: null, error: { message: "not found" } };
                },
              };
            },
          };
        },
        update(patch: Record<string, unknown>) {
          return {
            eq(column: string, value: unknown) {
              const target = rows.find((r) => r[column] === value);
              if (target) Object.assign(target, patch);
              return Promise.resolve({ error: target ? null : { message: "not found" } });
            },
          };
        },
      };
    },
  };

  return { client, rows };
}

describe("lib/lead-store", () => {
  let fake: ReturnType<typeof createFakeSupabase>;

  beforeEach(() => {
    fake = createFakeSupabase();
    vi.mocked(getSupabaseAdmin).mockReturnValue(fake.client as never);
  });

  it("persists a new lead and returns isDuplicate: false", async () => {
    const { persistLead } = await import("@/lib/lead-store");
    const { lead, isDuplicate } = await persistLead({
      variant: "heroEval",
      values: { name: "Jane Doe", phone: "5551234567" },
      attribution: { gclid: "abc123" },
      priority: "normal",
    });

    expect(isDuplicate).toBe(false);
    expect(lead.variant).toBe("heroEval");
    expect(lead.fields).toEqual({ name: "Jane Doe", phone: "5551234567" });
    expect(fake.rows).toHaveLength(1);
  });

  it("deduplicates an identical resubmission and preserves the original row", async () => {
    const { persistLead } = await import("@/lib/lead-store");
    const input = {
      variant: "heroEval",
      values: { name: "Jane Doe", phone: "5551234567" },
      attribution: { gclid: "original-click" },
      priority: "normal",
    };

    const first = await persistLead(input);
    // A retry that arrives with different (or missing) attribution must NOT
    // overwrite the original — this is exactly what 5.7 requires.
    const second = await persistLead({ ...input, attribution: { gclid: "retry-click" } });

    expect(second.isDuplicate).toBe(true);
    expect(second.lead.id).toBe(first.lead.id);
    expect(second.lead.attribution).toEqual({ gclid: "original-click" });
    expect(fake.rows).toHaveLength(1);
  });

  it("throws (never silently succeeds) when the datastore itself fails", async () => {
    vi.mocked(getSupabaseAdmin).mockReturnValue({
      from: () => ({
        insert: () => ({
          select: () => ({
            maybeSingle: async () => ({
              data: null,
              error: { code: "08006", message: "connection refused" },
            }),
          }),
        }),
      }),
    } as never);

    const { persistLead } = await import("@/lib/lead-store");
    await expect(
      persistLead({
        variant: "heroEval",
        values: { name: "Jane" },
        attribution: {},
        priority: "normal",
      }),
    ).rejects.toThrow(/persist failed/);
  });

  it("records a failed delivery outcome without throwing", async () => {
    const { persistLead, recordDeliveryOutcome } = await import("@/lib/lead-store");
    const { lead } = await persistLead({
      variant: "heroEval",
      values: { name: "Jane" },
      attribution: {},
      priority: "normal",
    });

    await recordDeliveryOutcome(lead.id, {
      deliveryStatus: "failed",
      retryCount: 3,
      finalFailureState: true,
    });

    expect(fake.rows[0]).toMatchObject({ delivery_status: "failed", final_failure_state: true });
  });
});
