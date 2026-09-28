# Editorial CMS guide

The CMS is for public editorial content only. Never enter a patient name, phone number, email, diagnosis, treatment record, appointment detail, accident narrative, claim number, policy number, or other health/lead data.

## Local demo

1. Keep `CONTENT_REPOSITORY_MODE=fixture` (the default when unset).
2. Run `npm run dev`.
3. Open `/admin/content`. Non-production fixture mode uses a local-only admin actor and never connects to Supabase.
4. Open a seed item, review its blockers, then use **Preview**. Every fixture is draft/noindex.

## Production login and provisioning

- No public registration exists. An administrator creates the Supabase Auth user and matching active `profiles` row.
- Roles are `admin`, `editor`, and `clinician_reviewer`. All three can write and publish blog posts; `clinician_reviewer` no longer gates anything on the blog, and only `admin` can schedule, publish, or archive a service-area page.
- Production admin pages re-check the authenticated user and active profile server-side. Hidden navigation and robots rules are not authorization.
- Rotate the privileged keys disclosed in chat before configuring any environment.

## Blog workflow (2026-09-27: no review step)

A blog post has one author and no queue. Whoever writes it owns it from first draft to live page.

1. **Write it.** **New post** on `/admin/content` takes a title, an excerpt, an optional Markdown
   body, and a featured image; the editor page has every remaining field. Supply a unique
   title/slug, a patient-helpful excerpt, a direct answer, structured blocks, an author, image +
   alt text, taxonomies, relations, and sources.
2. **Cite anything objective.** Attach a source to the exact block/claim it supports. Record
   publisher, URL, source type, publication/update date, access date, geography, statistic period,
   classification, supported claim, and recheck date. Any stat, statute, coverage, or diagnosis
   wording in the body needs at least one verified source before the post can publish.
3. **Preview** whenever you want a second look: authenticated preview is noindex/nofollow and
   excluded from sitemap/feed/analytics. Check mobile/tablet/desktop, headings, links, images,
   sources, emergency guidance, and CTA wording.
4. **It publishes itself.** The database recomputes the publication checklist on every save, and the
   moment every blocker clears, the post goes live — no submit, no approval, no admin handoff. The
   **Publication checklist** panel and `content_publication_readiness` both name whatever is still
   missing.
5. **Keep editing after it is live.** A published post is still editable; saves republish it. Note
   that an edit which breaks the checklist takes the page out of the public index until it passes
   again.
6. **Unpublish/archive** from the editor's **Status** panel: published → archived. Public queries
   stop returning the item, and history stays immutable.
7. **Restore:** archived → draft. Restoration never silently republishes; the post has to clear the
   checklist again.

Holding a finished post back is explicit: check **noindex** with a reason, or set a future
`scheduled_for` (released automatically by the `/api/cron/publish-scheduled` cron). Nothing else
delays a passing post.

Service-area pages are the exception — they keep the older draft → review → approve → publish chain
and their own local-evidence gate.

## Structured editor

Allowed blocks: paragraph, H2–H4 heading, ordered/unordered list, quote, answer/info/warning/emergency callout, approved image, and accessible table. Raw HTML, H1 blocks, scripts, event handlers, iframes, objects, embeds, and arbitrary components are not supported.

Heading levels cannot skip. Tables require captions, headers, and equal cell counts. Images require approved asset metadata and useful alt text, or an explicit decorative choice.

## Slugs and redirects

- Slugs are lowercase, stable, and hyphenated.
- Changing a published slug must create a redirect in the same transaction, warn the editor, invalidate old/new paths, and preserve the previous canonical path in audit history.
- Never reuse an old slug for unrelated content.

## Assets

- Providers: local `/figma-exports`, approved Bunny CDN, or separately approved external storage.
- Store metadata, not image binaries, in Postgres.
- Record MIME type, dimensions, alt, caption, attribution, approval state, and focal point.
- Do not hotlink arbitrary images. Do not publish pending/rejected assets.

## Conflicts and autosave

Every item has an integer version. Mutations include the version the editor loaded. A mismatch returns a conflict; preserve local input, reload the latest server version, compare, and deliberately merge. Do not overwrite the newer record.

The fixture demo is intentionally read-only. Autosave, **New post**, and the status controls become active only with the authenticated Supabase mutation adapter (`CONTENT_REPOSITORY_MODE=supabase`). Publication transitions use the transactional database RPC and retain work even if cache revalidation later needs retry.

Writing straight to Supabase — table editor, SQL editor, or `publish_blog_post()` — is a supported path, not a workaround: the gate and auto-publish live in the database, so a direct write behaves identically to a save from this form. See `docs/blog-cms-supabase-reference.md`.

## Troubleshooting

- **Public page 404:** expected for draft, review, approved, future scheduled, archived, noindex, or failed-gate content.
- **Preview redirects to login:** the session/profile is missing, inactive, or not provisioned.
- **Version conflict:** another editor saved first; reload and merge.
- **Post is not live:** read every blocker in the **Publication checklist** panel, or query `content_publication_readiness`. Do not lower the gate; fix the evidence, source, uniqueness, image, or metadata issue it names. The most common ones are under 350 words, no FAQ, a meta description under 70 characters, an objective claim with no verified source, and a featured image hosted somewhere other than the site's CDN.
- **Published but stale:** check the publication event. A `failed` revalidation status is retryable; the database transaction was preserved.
- **Database unavailable:** do not switch production to fixtures. Restore connectivity; never serve drafts as fallback.
