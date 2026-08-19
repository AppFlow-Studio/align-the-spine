"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { contentBlocksSchema } from "@/lib/content/schemas";
import type { ContentFaqItem, ContentItem } from "@/lib/content/types";

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error" | "conflict";

let faqRowSeq = 0;
function nextFaqRowId() {
  faqRowSeq += 1;
  return `faq-${Date.now().toString(36)}-${faqRowSeq}`;
}

export function EditorialForm({ item, editable }: { item: ContentItem; editable: boolean }) {
  const router = useRouter();
  const initial = useRef(true);
  const [version, setVersion] = useState(item.version);
  const [title, setTitle] = useState(item.title);
  const [excerpt, setExcerpt] = useState(item.excerpt);
  const [directAnswer, setDirectAnswer] = useState(item.directAnswer);
  const [keyTakeawaysText, setKeyTakeawaysText] = useState(item.keyTakeaways.join("\n"));
  const [faqs, setFaqs] = useState<ContentFaqItem[]>(item.faqs);
  const [seoTitle, setSeoTitle] = useState(item.seoTitle);
  const [metaDescription, setMetaDescription] = useState(item.metaDescription);
  const [ogTitle, setOgTitle] = useState(item.ogTitle ?? "");
  const [ogDescription, setOgDescription] = useState(item.ogDescription ?? "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(item.featuredImage?.url ?? "");
  const [featuredImageAlt, setFeaturedImageAlt] = useState(
    item.featuredImage?.alt ?? item.featuredImageAlt ?? "",
  );
  const [featured, setFeatured] = useState(item.featured);
  const [noindex, setNoindex] = useState(item.noindex);
  const [noindexReason, setNoindexReason] = useState(item.noindexReason ?? "");
  const [blocksJson, setBlocksJson] = useState(JSON.stringify(item.blocks, null, 2));
  const [state, setState] = useState<SaveState>("idle");
  const [message, setMessage] = useState(
    editable
      ? "No unsaved changes."
      : "Fixture preview is read-only; connect authenticated Supabase mode to save.",
  );

  async function save() {
    if (state === "saving" || state === "conflict") return;
    const json = (() => {
      try {
        return JSON.parse(blocksJson) as unknown;
      } catch {
        return null;
      }
    })();
    const blocks = contentBlocksSchema.safeParse(json);
    if (!blocks.success) {
      setState("error");
      setMessage("Structured blocks are invalid. Review the JSON and heading hierarchy.");
      return;
    }
    setState("saving");
    setMessage("Saving changes…");
    try {
      const keyTakeaways = keyTakeawaysText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const response = await fetch(`/api/admin/content/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedVersion: version,
          title,
          excerpt,
          directAnswer,
          keyTakeaways,
          faqs: faqs.filter((faq) => faq.question.trim() && faq.answer.trim()),
          blocks: blocks.data,
          seoTitle,
          metaDescription,
          ogTitle,
          ogDescription,
          featuredImageUrl,
          featuredImageAlt,
          featured,
          noindex,
          noindexReason,
          changeNote: "Editorial autosave",
        }),
      });
      const result = (await response.json()) as { error?: string; version?: number };
      if (response.status === 409) {
        setState("conflict");
        setMessage(
          "Conflict: another editor saved first. Copy your work, reload, and merge deliberately.",
        );
        return;
      }
      if (!response.ok || !result.version) throw new Error(result.error ?? "Save failed");
      setVersion(result.version);
      setState("saved");
      setMessage(`Saved as version ${result.version}.`);
      router.refresh();
    } catch {
      setState("error");
      setMessage("Save failed. Your text remains in this browser; retry before leaving.");
    }
  }

  useEffect(() => {
    if (!editable) return;
    if (initial.current) {
      initial.current = false;
      return;
    }
    setState("dirty");
    setMessage("Unsaved changes. Autosave will run shortly.");
    const timer = window.setTimeout(() => void save(), 1_500);
    return () => window.clearTimeout(timer);
    // Save intentionally depends on the edited fields; version/state are handled within the request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    title,
    excerpt,
    directAnswer,
    keyTakeawaysText,
    faqs,
    seoTitle,
    metaDescription,
    ogTitle,
    ogDescription,
    featuredImageUrl,
    featuredImageAlt,
    featured,
    noindex,
    noindexReason,
    blocksJson,
    editable,
  ]);

  return (
    <form
      className="space-y-6 rounded-30 bg-white p-6 shadow-comparison sm:p-8"
      aria-label="Content editor"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <div
        role="status"
        aria-live="polite"
        className={`rounded-15 px-4 py-3 text-sm ${state === "error" || state === "conflict" ? "bg-red-50 text-error" : "bg-panel-100 text-ink-500"}`}
      >
        {message}
      </div>
      <div>
        <label htmlFor="title" className="block font-semibold text-navy-800">
          Title
        </label>
        <input
          id="title"
          value={title}
          readOnly={!editable}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-2 min-h-12 w-full rounded-15 border border-mute-400 px-4 text-base"
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="slug" className="block font-semibold text-navy-800">
            Slug
          </label>
          <input
            id="slug"
            value={item.slug}
            readOnly
            aria-describedby="slug-help"
            className="mt-2 min-h-12 w-full rounded-15 border border-mute-400 bg-panel-100 px-4 text-base"
          />
          <p id="slug-help" className="mt-1 text-sm text-ink-500">
            Slug changes use the redirect workflow.
          </p>
        </div>
        <div>
          <label htmlFor="status" className="block font-semibold text-navy-800">
            Status
          </label>
          <input
            id="status"
            value={item.status.replaceAll("_", " ")}
            readOnly
            className="mt-2 min-h-12 w-full rounded-15 border border-mute-400 bg-panel-100 px-4 text-base"
          />
        </div>
      </div>
      <div>
        <label htmlFor="excerpt" className="block font-semibold text-navy-800">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          readOnly={!editable}
          onChange={(event) => setExcerpt(event.target.value)}
          rows={3}
          className="mt-2 w-full rounded-15 border border-mute-400 p-4 text-base"
        />
      </div>
      <div>
        <label htmlFor="direct-answer" className="block font-semibold text-navy-800">
          Direct answer
        </label>
        <textarea
          id="direct-answer"
          value={directAnswer}
          readOnly={!editable}
          onChange={(event) => setDirectAnswer(event.target.value)}
          rows={4}
          className="mt-2 w-full rounded-15 border border-mute-400 p-4 text-base"
        />
      </div>
      <div>
        <label htmlFor="key-takeaways" className="block font-semibold text-navy-800">
          Key takeaways
        </label>
        <p className="mt-1 text-sm text-ink-500">
          One bullet per line. Rendered as a bulleted list next to the direct answer.
        </p>
        <textarea
          id="key-takeaways"
          value={keyTakeawaysText}
          readOnly={!editable}
          onChange={(event) => setKeyTakeawaysText(event.target.value)}
          rows={5}
          className="mt-2 w-full rounded-15 border border-mute-400 p-4 text-base"
        />
      </div>
      <fieldset>
        <legend className="font-semibold text-navy-800">FAQs</legend>
        <p className="mt-1 text-sm text-ink-500">
          Rendered as an accordion and mirrored into FAQPage JSON-LD — every question here should
          match what&apos;s visibly shown on the page.
        </p>
        <div className="mt-3 space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="rounded-15 border border-mute-400 p-4">
              <div className="flex items-start justify-between gap-3">
                <label htmlFor={`faq-question-${faq.id}`} className="sr-only">
                  Question {index + 1}
                </label>
                <input
                  id={`faq-question-${faq.id}`}
                  value={faq.question}
                  readOnly={!editable}
                  placeholder="Question"
                  onChange={(event) =>
                    setFaqs((prev) =>
                      prev.map((row) =>
                        row.id === faq.id ? { ...row, question: event.target.value } : row,
                      ),
                    )
                  }
                  className="min-h-11 w-full rounded-15 border border-mute-400 px-4 text-base font-semibold"
                />
                {editable && (
                  <button
                    type="button"
                    onClick={() => setFaqs((prev) => prev.filter((row) => row.id !== faq.id))}
                    className="min-h-11 shrink-0 rounded-15 border border-mute-400 px-3 text-sm font-semibold text-error"
                  >
                    Remove
                  </button>
                )}
              </div>
              <label htmlFor={`faq-answer-${faq.id}`} className="sr-only">
                Answer {index + 1}
              </label>
              <textarea
                id={`faq-answer-${faq.id}`}
                value={faq.answer}
                readOnly={!editable}
                placeholder="Answer"
                onChange={(event) =>
                  setFaqs((prev) =>
                    prev.map((row) =>
                      row.id === faq.id ? { ...row, answer: event.target.value } : row,
                    ),
                  )
                }
                rows={3}
                className="mt-3 w-full rounded-15 border border-mute-400 p-4 text-base"
              />
            </div>
          ))}
        </div>
        {editable && (
          <button
            type="button"
            onClick={() =>
              setFaqs((prev) => [...prev, { id: nextFaqRowId(), question: "", answer: "" }])
            }
            className="mt-3 min-h-11 rounded-full border border-navy-800 px-5 font-semibold text-navy-800"
          >
            Add question
          </button>
        )}
      </fieldset>
      <fieldset className="grid gap-5 md:grid-cols-2">
        <legend className="sr-only">Search metadata</legend>
        <div>
          <label htmlFor="seo-title" className="block font-semibold text-navy-800">
            SEO title
          </label>
          <input
            id="seo-title"
            value={seoTitle}
            readOnly={!editable}
            onChange={(event) => setSeoTitle(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-15 border border-mute-400 px-4 text-base"
          />
          <p className="mt-1 text-sm text-ink-500">
            {seoTitle.length} characters; clarity matters more than hard truncation.
          </p>
        </div>
        <div>
          <label htmlFor="meta-description" className="block font-semibold text-navy-800">
            Meta description
          </label>
          <textarea
            id="meta-description"
            value={metaDescription}
            readOnly={!editable}
            onChange={(event) => setMetaDescription(event.target.value)}
            rows={3}
            className="mt-2 w-full rounded-15 border border-mute-400 p-4 text-base"
          />
          <p className="mt-1 text-sm text-ink-500">{metaDescription.length} characters.</p>
        </div>
      </fieldset>
      <fieldset className="grid gap-5 md:grid-cols-2">
        <legend className="font-semibold text-navy-800">Featured image</legend>
        <div>
          <label htmlFor="featured-image-url" className="block font-semibold text-navy-800">
            Image CDN URL
          </label>
          <p className="mt-1 text-sm text-ink-500">
            Paste an already-hosted https:// image link — this feeds the article hero (
            BlogArticleHero) and the social-share image fallback. Leave blank to use the plain
            header instead of a photo hero.
          </p>
          <input
            id="featured-image-url"
            type="url"
            value={featuredImageUrl}
            readOnly={!editable}
            onChange={(event) => setFeaturedImageUrl(event.target.value)}
            placeholder="https://align-the-spine.b-cdn.net/images/…"
            className="mt-2 min-h-12 w-full rounded-15 border border-mute-400 px-4 text-base"
          />
        </div>
        <div>
          <label htmlFor="featured-image-alt" className="block font-semibold text-navy-800">
            Image alt text
          </label>
          <p className="mt-1 text-sm text-ink-500">
            Required for a non-decorative image — describes the photo for screen readers.
          </p>
          <input
            id="featured-image-alt"
            value={featuredImageAlt}
            readOnly={!editable}
            onChange={(event) => setFeaturedImageAlt(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-15 border border-mute-400 px-4 text-base"
          />
        </div>
      </fieldset>
      <fieldset className="grid gap-5 md:grid-cols-2">
        <legend className="sr-only">Social sharing (optional overrides)</legend>
        <div>
          <label htmlFor="og-title" className="block font-semibold text-navy-800">
            Social share title
          </label>
          <p className="mt-1 text-sm text-ink-500">Falls back to SEO title when left blank.</p>
          <input
            id="og-title"
            value={ogTitle}
            readOnly={!editable}
            onChange={(event) => setOgTitle(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-15 border border-mute-400 px-4 text-base"
          />
        </div>
        <div>
          <label htmlFor="og-description" className="block font-semibold text-navy-800">
            Social share description
          </label>
          <p className="mt-1 text-sm text-ink-500">Falls back to meta description when blank.</p>
          <textarea
            id="og-description"
            value={ogDescription}
            readOnly={!editable}
            onChange={(event) => setOgDescription(event.target.value)}
            rows={2}
            className="mt-2 w-full rounded-15 border border-mute-400 p-4 text-base"
          />
        </div>
      </fieldset>
      <fieldset className="space-y-4 rounded-15 border border-mute-400 p-4">
        <legend className="px-1 font-semibold text-navy-800">Publication flags</legend>
        <label className="flex items-start gap-3 text-sm text-navy-800">
          <input
            type="checkbox"
            checked={featured}
            disabled={!editable}
            onChange={(event) => setFeatured(event.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-mute-400"
          />
          <span>
            <span className="font-semibold">Featured</span> — shown in the large hero-card slot on
            the hub instead of the regular grid.
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm text-navy-800">
          <input
            type="checkbox"
            checked={noindex}
            disabled={!editable}
            onChange={(event) => setNoindex(event.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-mute-400"
          />
          <span>
            <span className="font-semibold">Noindex</span> — keeps this page out of search engines
            and the sitemap even once published.
          </span>
        </label>
        {noindex && (
          <div>
            <label htmlFor="noindex-reason" className="block text-sm font-semibold text-navy-800">
              Noindex reason
            </label>
            <p className="mt-1 text-sm text-ink-500">
              Required whenever noindex is checked — the database rejects a save without one.
            </p>
            <input
              id="noindex-reason"
              value={noindexReason}
              readOnly={!editable}
              onChange={(event) => setNoindexReason(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-15 border border-mute-400 px-4 text-base"
            />
          </div>
        )}
      </fieldset>
      <fieldset>
        <legend className="font-semibold text-navy-800">Structured content blocks</legend>
        <p className="mt-1 text-sm text-ink-500">
          Closed JSON blocks prevent raw HTML, scripts, iframes, event handlers, and editor-created
          H1s.
        </p>
        <textarea
          aria-label="Structured content JSON"
          value={blocksJson}
          readOnly={!editable}
          onChange={(event) => setBlocksJson(event.target.value)}
          rows={24}
          className="mt-3 w-full rounded-15 border border-mute-400 bg-[#111827] p-4 font-mono text-sm text-white"
        />
      </fieldset>
      <button
        type="submit"
        disabled={!editable || state === "saving" || state === "conflict"}
        className="min-h-12 rounded-full bg-navy-900 px-6 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state === "saving" ? "Saving…" : "Save now"}
      </button>
    </form>
  );
}
