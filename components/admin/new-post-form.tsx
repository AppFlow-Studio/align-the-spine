"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** "New post" panel on the content dashboard.
 *
 * Replaces a permanently disabled "Create draft" button — until now the admin
 * had no way to start a post at all. Posts to /api/admin/content, which calls
 * the same `publish_blog_post()` RPC a worker uses from Supabase directly, so a
 * whole article can be pasted in as Markdown here and arrive as real content
 * blocks.
 *
 * Whatever is complete enough publishes itself on creation; anything missing
 * shows up as a checklist item on the editor page it redirects to. */
export function NewPostForm({ editable }: { editable: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || undefined,
          excerpt: excerpt.trim(),
          markdown: markdown.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
          imageAlt: imageAlt.trim() || undefined,
        }),
      });
      const result = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !result.id) {
        setError(result.error ?? "Could not create the post.");
        return;
      }
      router.push(`/admin/content/${result.id}`);
    } catch {
      setError("The request didn't reach the server. Check your connection and retry.");
    } finally {
      setBusy(false);
    }
  }

  if (!editable) {
    return (
      <button
        type="button"
        disabled
        title="Connect authenticated Supabase mode to create posts"
        className="min-h-11 rounded-full bg-navy-900 px-6 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        New post
      </button>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="min-h-11 rounded-full bg-navy-900 px-6 font-semibold text-white"
      >
        New post
      </button>
    );
  }

  return (
    <form
      aria-label="New post"
      className="w-full max-w-xl space-y-4 rounded-30 bg-white p-6 shadow-comparison"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <div>
        <label htmlFor="new-title" className="block font-semibold text-navy-800">
          Title
        </label>
        <input
          id="new-title"
          value={title}
          required
          minLength={12}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-2 min-h-12 w-full rounded-15 border border-mute-400 px-4 text-base"
        />
      </div>
      <div>
        <label htmlFor="new-slug" className="block font-semibold text-navy-800">
          Slug <span className="font-normal text-ink-500">— optional, derived from the title</span>
        </label>
        <input
          id="new-slug"
          value={slug}
          placeholder="what-to-do-after-a-car-accident"
          onChange={(event) => setSlug(event.target.value)}
          className="mt-2 min-h-12 w-full rounded-15 border border-mute-400 px-4 text-base"
        />
      </div>
      <div>
        <label htmlFor="new-excerpt" className="block font-semibold text-navy-800">
          Excerpt
        </label>
        <p className="mt-1 text-sm text-ink-500">
          Becomes the meta description too, so write 70+ characters that would read well in search
          results.
        </p>
        <textarea
          id="new-excerpt"
          value={excerpt}
          required
          minLength={40}
          rows={3}
          onChange={(event) => setExcerpt(event.target.value)}
          className="mt-2 w-full rounded-15 border border-mute-400 px-4 py-3 text-base"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="new-image" className="block font-semibold text-navy-800">
            Featured image URL
          </label>
          <input
            id="new-image"
            value={imageUrl}
            placeholder="https://…"
            onChange={(event) => setImageUrl(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-15 border border-mute-400 px-4 text-base"
          />
        </div>
        <div>
          <label htmlFor="new-image-alt" className="block font-semibold text-navy-800">
            Image alt text
          </label>
          <input
            id="new-image-alt"
            value={imageAlt}
            onChange={(event) => setImageAlt(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-15 border border-mute-400 px-4 text-base"
          />
        </div>
      </div>
      <div>
        <label htmlFor="new-body" className="block font-semibold text-navy-800">
          Body <span className="font-normal text-ink-500">— optional, Markdown</span>
        </label>
        <p className="mt-1 text-sm text-ink-500">
          Blank lines separate blocks. <code>##</code>/<code>###</code> headings, <code>-</code> or{" "}
          <code>1.</code> lists, and <code>&gt;</code> quotes are converted; anything else becomes a
          paragraph. Aim for 350+ words.
        </p>
        <textarea
          id="new-body"
          value={markdown}
          rows={12}
          onChange={(event) => setMarkdown(event.target.value)}
          className="mt-2 w-full rounded-15 border border-mute-400 px-4 py-3 font-mono text-sm"
        />
      </div>
      {error ? (
        <p role="alert" className="rounded-15 bg-red-50 px-4 py-3 text-sm text-error">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy}
          className="min-h-12 rounded-full bg-navy-900 px-6 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create post"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="min-h-12 rounded-full border border-navy-800 px-6 font-semibold text-navy-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
