# Editorial CMS guide

The CMS is for public editorial content only. Never enter a patient name, phone number, email, diagnosis, treatment record, appointment detail, accident narrative, claim number, policy number, or other health/lead data.

## Local demo

1. Keep `CONTENT_REPOSITORY_MODE=fixture` (the default when unset).
2. Run `npm run dev`.
3. Open `/admin/content`. Non-production fixture mode uses a local-only admin actor and never connects to Supabase.
4. Open a seed item, review its blockers, then use **Preview**. Every fixture is draft/noindex.

## Production login and provisioning

- No public registration exists. An administrator creates the Supabase Auth user and matching active `profiles` row.
- Roles are `admin`, `editor`, and `clinician_reviewer`.
- Production admin pages re-check the authenticated user and active profile server-side. Hidden navigation and robots rules are not authorization.
- Rotate the privileged keys disclosed in chat before configuring any environment.

## Editorial workflow

1. **Create/edit draft:** supply unique title/slug, patient-helpful excerpt, direct answer, structured blocks, author, approved image/alt, taxonomies, relations, and sources.
2. **Citations:** attach a source to the exact block/claim it supports. Record publisher, URL, source type, publication/update date, access date, geography, statistic period, classification, supported claim, and recheck date.
3. **Submit for review:** draft → in review. The server rejects illegal transitions.
4. **Clinical review:** a clinician reviewer checks substantive health/PIP guidance. The latest medical-content editor cannot self-approve. Approval records reviewer identity/date.
5. **Preview:** authenticated preview is noindex/nofollow and excluded from sitemap/feed/analytics. Check mobile/tablet/desktop, headings, links, images, sources, emergency guidance, and CTA wording.
6. **Schedule/publish:** admin only. Every hard gate must pass. Scheduling requires a future time; automatic scheduling requires the separately approved cron endpoint configuration.
7. **Unpublish/archive:** published → archived. Public queries stop returning the item. History remains immutable.
8. **Restore:** archived → draft. Restoration never silently republishes.

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

The fixture demo is intentionally read-only. Autosave and mutation buttons become active only with the authenticated Supabase mutation adapter. Publication transitions use the transactional database RPC and retain work even if cache revalidation later needs retry.

## Troubleshooting

- **Public page 404:** expected for draft, review, approved, future scheduled, archived, noindex, or failed-gate content.
- **Preview redirects to login:** the session/profile is missing, inactive, or not provisioned.
- **Version conflict:** another editor saved first; reload and merge.
- **Publish blocked:** read every hard blocker. Do not lower the gate; fix evidence, review, source, uniqueness, image, or metadata issues.
- **Published but stale:** check the publication event. A `failed` revalidation status is retryable; the database transaction was preserved.
- **Database unavailable:** do not switch production to fixtures. Restore connectivity; never serve drafts as fallback.
