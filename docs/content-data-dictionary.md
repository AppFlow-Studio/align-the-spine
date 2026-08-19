# Content data dictionary

## Core tables

| Table                                | Purpose                                              | Important controls                                                                              |
| ------------------------------------ | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `profiles`                           | Auth-linked editor identity and role.                | Active role required; no self-registration.                                                     |
| `authors`                            | Public byline/entity profile.                        | Stable case-insensitive slug; external authority links verified before entry.                   |
| `content_items`                      | Shared blog/service-area record and structured body. | Status enum, unique slug, version, noindex reason, publish/schedule constraints, gate snapshot. |
| `categories`, `tags`                 | Controlled taxonomies.                               | Case-insensitive unique name/slug and active flag. Avoid orphans.                               |
| `content_categories`, `content_tags` | Taxonomy joins.                                      | Composite keys prevent duplicates.                                                              |
| `sources`                            | Source provenance.                                   | HTTPS URL, publisher/type/dates/geography/period/verification/recheck.                          |
| `content_sources`                    | Exact claim/source binding.                          | Stores block ID and supported claim.                                                            |
| `assets`                             | Approved media metadata.                             | Provider, MIME, dimensions, alt, attribution, approval, focal point.                            |
| `content_relations`                  | Editorial cross-links.                               | Typed, ordered, no self-link.                                                                   |
| `content_revisions`                  | Immutable snapshots.                                 | Append-only; version unique per item; rollback creates a new revision.                          |
| `publication_events`                 | Status/revalidation audit.                           | Actor, from/to, reason, path, targets, success/failure.                                         |
| `redirects`                          | Stable slug migrations.                              | Unique source path, local target, 301/308 only.                                                 |

## Content fields

| Field                                            | Meaning                                                                                            |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `content_type`                                   | `blog_post` or `service_area`.                                                                     |
| `status`                                         | `draft`, `in_review`, `approved`, `scheduled`, `published`, `archived`.                            |
| `content_blocks`                                 | Closed portable JSON block array. Never raw HTML.                                                  |
| `primary_keyword`                                | Internal planning only; never rendered for repetition.                                             |
| `search_intent`, `audience`                      | Editorial strategy fields excluded from public DTOs.                                               |
| `canonical_override`                             | Admin-only exceptional absolute canonical; empty by default.                                       |
| `medical_review_required`                        | Whether distinct clinician approval is mandatory.                                                  |
| `clinician_reviewer_id`, `clinician_reviewed_at` | Attributable review pair.                                                                          |
| `published_at`, `scheduled_for`                  | Honest publication time and optional future schedule.                                              |
| `last_substantive_review_at`                     | Last meaningful content/clinical review—not a build timestamp.                                     |
| `noindex`, `noindex_reason`                      | Deliberate index state and mandatory rationale.                                                    |
| `gate_result`                                    | Latest blockers/recommendations snapshot; DB public predicate requires `passed=true`.              |
| `version`                                        | Optimistic-concurrency integer.                                                                    |
| `service_area_evidence`                          | Relationship, operational/home-visit verification, local proof, source IDs, uniqueness/similarity. |

## Structured blocks

- `paragraph`: text.
- `heading`: level 2, 3, or 4 plus stable ID.
- `list`: ordered/unordered text items.
- `quote`: text and optional attributable source.
- `callout`: answer/info/warning/emergency title and text.
- `image`: approved asset ID, alt/caption, or explicit decorative flag.
- `table`: caption, headers, and equal-length rows.

## Public projection

`public_content_items` excludes planning keywords, audience, search intent, actor IDs, canonical overrides, and concurrency version. It includes only records that are published, past-dated, indexable, and have a passing gate snapshot. RLS repeats the predicate; the view is not the sole control.
