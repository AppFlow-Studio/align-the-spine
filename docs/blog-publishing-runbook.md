# Blog publishing runbook

Everything needed to finish rolling out self-publishing blogs and to automate publishing from
outside the app. Schema reference and payload shapes live in
[`blog-cms-supabase-reference.md`](./blog-cms-supabase-reference.md); this file is the operational
side — what to run, in what order, and how to verify it.

Project: **Align The Spine**, `qaaptlxxwfvxzgyzjhub`.

## 1. Current state of the live database

Two of the four migrations are already applied (2026-09-27), through the Supabase MCP rather than
the CLI, so their recorded versions are MCP timestamps rather than the filenames:

| File                                              | Applied?                                                                                    | Recorded as                      |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------- |
| `202609220001_content_medical_review_default.sql` | Partly — the column default only; its backfill is a no-op on this database (0 content rows) | `content_medical_review_default` |
| `202609270001_blog_writer_self_publish.sql`       | **Yes**                                                                                     | `20260927143909`                 |
| `202609270002_blog_gate_autopublish.sql`          | No                                                                                          | —                                |
| `202609270003_blog_direct_upload.sql`             | No                                                                                          | —                                |

Verified live after applying 001: `transition_content` carries the `writer_owned` branch,
`save_content_draft` accepts edits to a published post, and `content_editor_update_drafts` reads
`content_type = 'blog_post' OR status IN ('draft','in_review')`.

Every statement in all four files is idempotent (`create or replace`, `drop ... if exists`,
`create table if not exists`, and two `update` statements that match nothing twice), so re-applying
any of them — including via `supabase db push`, which will not recognize the two MCP-recorded
versions — is safe and produces the same state.

## 2. Apply the remaining two migrations

Either path works; they produce identical schema.

**Supabase SQL editor.** Paste the whole file, run, repeat for the next one. Order matters —
`202609270003` calls functions that `202609270002` defines.

1. `supabase/migrations/202609270002_blog_gate_autopublish.sql`
2. `supabase/migrations/202609270003_blog_direct_upload.sql`

**Supabase CLI.** Not currently installed on the maintainer's machine; `npm i -g supabase` first.

```bash
supabase link --project-ref qaaptlxxwfvxzgyzjhub
supabase db push
```

`db push` re-applies all four files. That is expected and harmless, per the idempotency note above.

## 3. Verify

Run `supabase/tests/blog_autopublish_assertions.sql` in the SQL editor. It creates real posts,
exercises every rule, and rolls the whole thing back, so it is safe to run against a database with
live content.

A single `assertions_passed` row means the pipeline works end to end:

- a complete post inserted directly auto-publishes and becomes publicly visible
- `seo_title`, `meta_description`, and `direct_answer` fill in from the writer's own fields
- a thin post stays draft and names its blockers
- attaching a verified source releases a post blocked on citations
- `noindex` and an off-CDN hero image each hold a post back
- `publish_blog_post()` creates, links taxonomy, and is idempotent on slug
- `service_area` rows are untouched by any of it

Any failure raises with a `FAIL <n><letter>` tag naming the exact behavior that broke.

## 4. Turn on instant cache invalidation (optional)

Without this, a post written straight to Supabase appears on the site within 60 seconds (the page
cache TTL in `lib/content/public-content.ts`). With it, the site updates immediately.

1. Enable `pg_net`: Supabase dashboard → Database → Extensions → `pg_net`.
2. Generate a secret and set it in Vercel as `CONTENT_REVALIDATION_SECRET` (all environments).
3. Point the database at the deployed endpoint:

```sql
update public.content_revalidation_config set
  endpoint_url = 'https://www.chirobackpain.com/api/internal/content-revalidate',
  secret       = '<the same value as CONTENT_REVALIDATION_SECRET>',
  enabled      = true;
```

Check it end to end by editing any published post and watching the page update without a redeploy.
If it silently does nothing, the trigger swallowed a failure on purpose — a revalidation that
cannot go out must never cost you the post. Look at `net._http_response` for the delivery record.

## 5. Automating publication

`publish_blog_post()` is exposed over PostgREST, so anything that can make an HTTP request can
publish a post. It is the same function the admin **New post** form calls, so an automated pipeline
and a human writer produce identical rows.

**Auth.** Use the service-role key from a server, a scheduler, or a CI job — never from a browser.
An end-user JWT also works if that user has an active `profiles` row with role `admin`, `editor`,
or `clinician_reviewer`.

```bash
curl -X POST 'https://qaaptlxxwfvxzgyzjhub.supabase.co/rest/v1/rpc/publish_blog_post' \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "payload": {
      "slug": "five-questions-before-a-chiropractic-evaluation",
      "title": "Five questions to ask before a chiropractic evaluation",
      "excerpt": "What to ask at a first visit, why each answer matters, and which answers should make you pause.",
      "markdown": "Opening paragraph...\n\n## What to ask first\n\n- How long have you treated this?\n- What changes if it does not improve?",
      "imageUrl": "https://align-the-spine.b-cdn.net/images/PHOTO-2026-08-17-17-38-56.jpg",
      "imageAlt": "Chiropractic evaluation room at Align the Spine in Deerfield Beach",
      "faqs": [{ "question": "How long is a first visit?", "answer": "Plan for about an hour." }],
      "categories": ["patient-education"]
    }
  }'
```

The response is the same object the SQL editor returns:

```json
{
  "id": "…",
  "slug": "five-questions-before-a-chiropractic-evaluation",
  "status": "published",
  "publiclyVisible": true,
  "url": "/blog/five-questions-before-a-chiropractic-evaluation",
  "gate": { "passed": true, "blockers": [], "recommendations": [], "checkedAt": "…" }
}
```

**Build the automation around `publiclyVisible`, not around HTTP 200.** A 200 with
`publiclyVisible: false` means the post was saved but is not live, and `gate.blockers` says exactly
what is missing. A generator that ignores that field will quietly accumulate unpublished drafts.

```ts
const { data, error } = await supabase.rpc("publish_blog_post", { payload });
if (error) throw error;
if (!data.publiclyVisible) {
  throw new Error(`"${data.slug}" saved but not live: ${data.gate.blockers.join(" ")}`);
}
```

**A generator has to supply five things** the gate will not invent: 350+ words of body, an excerpt
of 70+ characters, at least one FAQ, a hero image on `align-the-spine.b-cdn.net` with real alt
text, and a verified source for any objective claim (statute, statistic, coverage, diagnosis,
treatment wording — the full list is in the reference doc). Everything else has a sensible default.

**Scheduling ahead.** Pass `"scheduledFor": "2026-10-04T13:00:00Z"` and the post lands in
`scheduled` instead of `published`. `/api/cron/publish-scheduled` releases it: a Vercel Cron
(`vercel.json`, every 15 minutes) that finds blog posts whose time has passed and touches them so
the trigger re-evaluates. It needs `CRON_SECRET` set in Vercel — Vercel sends it automatically on
cron-triggered requests — and `CONTENT_REPOSITORY_MODE=supabase`; in fixture mode it no-ops instead
of alerting.

The gate still decides. A post that went thin or lost a source between being scheduled and its date
arriving stays unpublished with its blockers intact, and comes back in the response's `stillHeld`
list rather than being forced live.

**Auditing a run.**

```sql
-- What did the automation publish today?
select slug, status, published_at from public.content_publication_readiness
where published_at > now() - interval '1 day' order by published_at desc;

-- Anything saved but stuck?
select slug, explanation, blockers from public.content_publication_readiness
where not publicly_visible and status <> 'archived';
```

## 6. Accounts

`profiles` currently holds one active row: **Israel (AppFlow Studio)**, role `editor`. That account
can now write and publish blog posts on its own — before this work it could do neither, since
approval required `clinician_reviewer` or `admin` and publishing required `admin`.

Add writers as `editor`. Reserve `admin` for whoever also needs to schedule, publish, or archive
**service-area** pages, which keep the older review chain.

`default_editorial_actor()` attributes SQL-editor and service-role writes to the longest-standing
active editorial account, preferring an admin and falling back to an editor — which is why direct
inserts work today with no admin in the table.
