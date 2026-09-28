"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { canTransition } from "@/lib/content/state-machine";
import type { ContentItem, ContentStatus } from "@/lib/content/types";

/** Manual status control for a content item.
 *
 * Most posts never need this: a blog post that passes its gates publishes
 * itself (supabase/migrations/202609270002_blog_gate_autopublish.sql). This is
 * for the decisions a trigger can't make — retiring a live post, pulling one
 * back to draft, releasing a scheduled post early — and it is the only UI that
 * reaches `/api/admin/content/[id]/transition`, which until now nothing called.
 *
 * Every offered button is a transition the database will actually accept: the
 * targets come from `canTransition()`, the same table the SQL
 * `transition_content()` enforces. */
const LABELS: Record<ContentStatus, string> = {
  draft: "Move back to draft",
  in_review: "Send for review",
  approved: "Mark approved",
  scheduled: "Schedule",
  published: "Publish now",
  archived: "Unpublish (archive)",
};

const ORDER: ContentStatus[] = [
  "published",
  "scheduled",
  "approved",
  "in_review",
  "draft",
  "archived",
];

export function ContentStatusControls({
  item,
  editable,
  publicUrl,
}: {
  item: ContentItem;
  editable: boolean;
  /** Path this item occupies when public, e.g. "/blog/my-post". */
  publicUrl: string;
}) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState<ContentStatus | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const targets = ORDER.filter(
    (target) => target !== item.status && canTransition(item.status, target, item.contentType),
  );
  const live = item.status === "published" && !item.noindex && item.gateResult.passed;

  async function move(target: ContentStatus) {
    if (reason.trim().length < 8) {
      setFailed(true);
      setMessage("Write at least 8 characters explaining the change — it goes in the audit log.");
      return;
    }
    setPending(target);
    setFailed(false);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/content/${item.id}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedVersion: item.version,
          targetStatus: target,
          reason: reason.trim(),
        }),
      });
      const result = (await response.json()) as { error?: string; revalidation?: string };
      if (!response.ok) {
        setFailed(true);
        setMessage(result.error ?? "The transition was not allowed.");
        return;
      }
      setReason("");
      setMessage(
        result.revalidation === "retry_required"
          ? `Now ${target.replaceAll("_", " ")}. The page cache didn't refresh — retry if the live page looks stale.`
          : `Now ${target.replaceAll("_", " ")}.`,
      );
      router.refresh();
    } catch {
      setFailed(true);
      setMessage("The request didn't reach the server. Check your connection and retry.");
    } finally {
      setPending(null);
    }
  }

  return (
    <section className="rounded-30 bg-white p-6 shadow-comparison" aria-labelledby="status-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="status-heading" className="font-display text-2xl text-navy-800">
          Status
        </h2>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${live ? "bg-[#e9f7f5] text-teal-500" : "bg-panel-100 text-ink-500"}`}
        >
          {item.status.replaceAll("_", " ")}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink-500">
        {live ? (
          <>
            Live at{" "}
            <a href={publicUrl} className="font-semibold text-teal-500 underline">
              {publicUrl}
            </a>
            .
          </>
        ) : item.status === "archived" ? (
          "Archived. Move it back to draft to work on it again."
        ) : item.noindex ? (
          "Held back from the public site: noindex is checked in the form."
        ) : item.gateResult.passed ? (
          "Checklist passes — this publishes itself on the next save."
        ) : (
          "Not public yet. Clear the publication checklist below and it publishes itself."
        )}
      </p>

      {editable ? (
        <>
          <label htmlFor="transition-reason" className="mt-5 block font-semibold text-navy-800">
            Reason
          </label>
          <textarea
            id="transition-reason"
            value={reason}
            rows={2}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Why this change? Recorded against the post."
            className="mt-2 w-full rounded-15 border border-mute-400 px-4 py-3 text-base"
          />
          <div className="mt-4 flex flex-wrap gap-3">
            {targets.map((target) => (
              <button
                key={target}
                type="button"
                disabled={pending !== null}
                onClick={() => void move(target)}
                className={`min-h-11 rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                  target === "archived"
                    ? "border border-error text-error"
                    : "bg-navy-900 text-white"
                }`}
              >
                {pending === target ? "Working…" : LABELS[target]}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-5 rounded-15 bg-panel-100 px-4 py-3 text-sm text-ink-500">
          Fixture preview is read-only. Connect authenticated Supabase mode to change status.
        </p>
      )}

      {message ? (
        <p
          role="status"
          aria-live="polite"
          className={`mt-4 rounded-15 px-4 py-3 text-sm ${failed ? "bg-red-50 text-error" : "bg-panel-100 text-ink-500"}`}
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}
