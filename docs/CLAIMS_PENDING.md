# Claims pending

Non-blocking log of items worth the client's attention but not worth gating the site on. Per implementation-brief update #4 (2026-08-11): if something looks worth a second look, it goes here and the build keeps moving — it does not get deleted, hedged, or held back.

## Google Business Profile hours mismatch

The site now states **7:00 AM – 11:00 PM, Monday–Sunday** (`content/site.ts`, `hoursVerified: true`, client-confirmed per implementation-brief update #4). The Google Business Profile listing currently shows **9:00 AM – 9:00 PM**. Google's local-pack "open now" filter reads the GBP listing, not this site, so a search during the 7–9 AM or 9–11 PM windows will currently show the practice as closed even though the site (correctly) says it's open. The client should update the GBP listing to match. Not a code fix — flagged here for follow-up.

## `reviewsRating` (5.0 / 164) sourcing

`content/site.ts`'s `reviewsRating` and the derived doctor-profile star badge are marked `verified` with source "Client-confirmed (implementation brief update #4, 2026-08-11)" — i.e. asserted directly in a brief document, not an independently-checkable record (a Places API response, a GBP screenshot, a client email). This is fine to ship per the client's explicit confirmation, but is worth reconciling against a live source once the `/reviews` page's Places API integration ships (see the main brief §9) — at that point `reviewsRating` should switch to reading the live-fetched count/rating rather than this static value, so the two can never drift apart.

## `pipHandling` wording

Reworded from the original "$0 with PIP" to "PIP accepted" specifically to avoid stating a dollar figure — see `content/site.ts`'s comment for the Fla. Stat. 627.736(1)(a) reasoning. If the practice wants a more specific insurance-billing claim on the site later, it should go through the same verification path, not reintroduce a coverage guarantee.
