# Align the Spine SEO / AEO / AIO / GEO Optimization Report

Date: 2026-08-12

## Scope and ownership

This pass changed search-facing copy, metadata, URL paths, redirects, existing FAQ text, existing internal-link destinations/anchors, descriptive schema inputs, and booking-link recognition for analytics. It did not intentionally change CSS, Tailwind classes, layout, animation, forms, analytics event behavior, publication gates, sitemap generation logic, or dependencies.

### URL migrations

| Legacy URL                             | New canonical URL               | Reason                                                                         |
| -------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------ |
| `/auto-accident` and `/auto-accidents` | `/car-accident-chiropractor`    | Aligns the highest-value commercial query with the preferred landing page.     |
| `/home-visits`                         | `/home-visit-chiropractor`      | Makes the service/provider topic explicit while remaining concise.             |
| `/services/massage-soft-tissue`        | `/services/soft-tissue-therapy` | Removes the ambiguous compound slug and matches the verified service language. |
| `/book`                                | `/book-an-appointment`          | Clarifies the transactional purpose and matches the patient action.            |

Each legacy URL has a direct permanent redirect to its final destination. Internal links, route registry entries, self-referencing canonicals, breadcrumbs, sitemap expectations, navigation route behavior, and tests use the new URLs. Other slugs were retained because they were already short, readable, descriptive, lowercase, and hyphenated.

| Query cluster                                                                          | Preferred route                      | Intent                      |
| -------------------------------------------------------------------------------------- | ------------------------------------ | --------------------------- |
| chiropractor Deerfield Beach                                                           | `/`                                  | Local/commercial            |
| car accident chiropractor; auto accident chiropractor; chiropractor after car accident | `/car-accident-chiropractor`         | Local/commercial            |
| back pain chiropractor                                                                 | `/conditions/back-pain`              | Commercial/informational    |
| neck pain chiropractor                                                                 | `/conditions/neck-pain`              | Commercial/informational    |
| sciatica chiropractor                                                                  | `/conditions/sciatica`               | Commercial/informational    |
| whiplash chiropractor                                                                  | `/conditions/whiplash`               | Accident-support/commercial |
| cervicogenic headache chiropractor                                                     | `/conditions/cervicogenic-headache`  | Informational/commercial    |
| concussion symptoms after a car accident                                               | `/conditions/concussion`             | Safety/informational        |
| TMJ chiropractor                                                                       | `/conditions/tmj-jaw-pain`           | Commercial/informational    |
| chiropractic adjustments                                                               | `/services/chiropractic-adjustments` | Commercial                  |
| spinal decompression                                                                   | `/services/spinal-decompression`     | Commercial/informational    |
| chiropractic soft-tissue therapy                                                       | `/services/soft-tissue-therapy`      | Commercial                  |
| chiropractic services Deerfield Beach                                                  | `/services`                          | Hub/local                   |
| home-visit chiropractor                                                                | `/home-visit-chiropractor`           | Local/commercial            |
| Dr. Abe Nasser chiropractor                                                            | `/about`                             | Branded/entity              |
| Align the Spine reviews                                                                | `/reviews`                           | Branded/trust               |
| request chiropractic appointment                                                       | `/book-an-appointment`               | Transactional               |
| contact Align the Spine Chiropractic                                                   | `/contact-us`                        | Navigational/local          |

## Visual-QA notation

`Rendered HTML pass` means the production render returned successfully, contained exactly one H1, retained a unique title and description, had the expected canonical, and introduced no broken internal links. The in-app browser was unavailable, so screenshot comparison at 375, 390, 768, 1024, and 1440 pixels could not be completed. No CSS, layout classes, animation settings, image assets, section order, or component hierarchy were intentionally changed by this pass.

## Page-by-page implementation

### `/`

- Primary keyword: `chiropractor Deerfield Beach`
- Secondary keywords: Deerfield Beach chiropractor; chiropractic care Deerfield Beach; local chiropractor; back pain; neck pain; car-accident evaluation
- Search intent: Local/commercial, general chiropractic practice
- Original title: `Align the Spine Chiropractic | South Florida's Chiropractor`
- New title: `Chiropractor in Deerfield Beach, FL | Align the Spine Chiropractic`
- Original meta description: `Spinal health care in Deerfield Beach, FL — car accident evaluations and home visits when it fits your case. Call (954) 573-7192.`
- New meta description: `Chiropractic care in Deerfield Beach for back pain, neck pain, mobility concerns, and injuries, with focused evaluations after car accidents.`
- H1 change: `South Florida's Chiropractor` → `Deerfield Beach Chiropractor`, preserving the existing three-line composition.
- Body copy changes: Reframed the hero as general chiropractic care while retaining a prominent car-accident pathway; removed an unverified multi-city footer claim; renamed the existing services heading to `Chiropractic Services`.
- FAQ changes: Shared general FAQ visit-count answer now avoids fixed-outcome language.
- Internal link changes: None on the homepage.
- Alt text changes: Corrected `gratson` to `Graston` in a service image description.
- Schema text changes: Practice schema unchanged; OG/Twitter text inherits the new metadata.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Published.
- Cannibalization notes: Owns general local chiropractor intent; `/car-accident-chiropractor` owns the accident-commercial cluster.

### `/car-accident-chiropractor`

- Primary keyword: `car accident chiropractor`
- URL change: `/auto-accidents` → `/car-accident-chiropractor`; `/auto-accident` also redirects directly to the new canonical.
- Secondary keywords: auto accident chiropractor; chiropractor after car accident; auto injury chiropractor; whiplash; accident-related neck pain; accident-related back pain
- Search intent: Local/commercial
- Original title: `Car Accident Chiropractor in Deerfield Beach, FL | Align the Spine Chiropractic`
- New title: Unchanged.
- Original meta description: `Car accident evaluations for Florida PIP claims. Full exam, treatment, and documentation for your claim — in-home visits available. Call (954) 573-7192.`
- New meta description: `See Dr. Abe for a car accident chiropractic evaluation in Deerfield Beach, including care for neck pain, back pain, stiffness, and whiplash symptoms.`
- H1 change: `Injured in an Accident?` → `Car Accident Chiropractor`, retaining two lines.
- Body copy changes: Corrected a sciatica eyebrow mismatch; established Dr. Abe, Deerfield Beach, chiropractic evaluation, symptoms, and purpose in the hero; made PIP language conditional; replaced attorney/insurer handling guarantees with documentation language.
- FAQ changes: Added answer-first medical escalation and conditional PIP guidance; removed categorical need-for-care and coverage implications.
- Internal link changes: Existing treatment cards now link to the dedicated adjustments, decompression, and soft-tissue pages.
- Alt text changes: None.
- Schema text changes: FAQ JSON-LD remains sourced from the visible FAQ; OG/Twitter text inherits the new description.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Published.
- Cannibalization notes: Sole owner of generic accident-chiropractor variants; condition pages retain symptom-specific intent.

### `/conditions/back-pain`

- Primary keyword: `back pain chiropractor`
- Secondary keywords: lower back pain chiropractor; back pain treatment; back pain after car accident; lower back pain after car accident
- Search intent: Commercial/informational
- Original title: `Back pain Chiropractor in Deerfield Beach, FL | Align the Spine Chiropractic`
- New title: `Back Pain Chiropractor in Deerfield Beach, FL | Align the Spine Chiropractic`
- Original meta description: `Evaluation and decompression-focused treatment for sciatic and radiating nerve pain, with in-home visits available when it applies to your case.`
- New meta description: `Chiropractic evaluation for lower back pain, stiffness, and pain that may travel into the hip or leg, including symptoms after a car accident.`
- H1 change: Capitalization corrected; topic and line intent preserved.
- Body copy changes: Replaced mismatched sciatica hero copy; clarified red flags and conditional PIP timing; corrected `Myofascial`; softened outcome claims.
- FAQ changes: Herniated-disc and radiating-leg-pain answers now lead with assessment limits and urgent red flags.
- Internal link changes: Existing accident, sciatica, decompression, and soft-tissue links retained.
- Alt text changes: None.
- Schema text changes: Visible FAQ and FAQ JSON-LD remain synchronized.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Draft/noindex; unchanged.
- Cannibalization notes: Owns back-pain intent; sends generic accident care to `/car-accident-chiropractor`.

### `/conditions/neck-pain`

- Primary keyword: `neck pain chiropractor`
- Secondary keywords: neck pain treatment; neck pain after car accident; whiplash; cervical spine pain
- Search intent: Commercial/informational
- Original title: `Neck Pain Chiropractor in Deerfield Beach, FL | Align the Spine Chiropractic`
- New title: Unchanged.
- Original meta description: `Evaluation and decompression-focused treatment for sciatic and radiating nerve pain, with in-home visits available when it applies to your case.`
- New meta description: `Chiropractic evaluation for neck pain, stiffness, and limited motion, including neck pain that begins after a car accident or whiplash injury.`
- H1 change: None.
- Body copy changes: Replaced mismatched sciatica hero copy; clarified muscular versus structural contributors; made traction, conservative-care, and PIP language conditional; corrected `Myofascial`.
- FAQ changes: Rewrote pinched-nerve, timing, and chronic-neck-pain answers without treatment guarantees.
- Internal link changes: Existing whiplash and accident links retained.
- Alt text changes: None.
- Schema text changes: Visible FAQ and FAQ JSON-LD remain synchronized.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Draft/noindex; unchanged.
- Cannibalization notes: Owns general neck-pain intent; `/conditions/whiplash` owns whiplash; `/car-accident-chiropractor` owns generic accident care.

### `/conditions/sciatica`

- Primary keyword: `sciatica chiropractor`
- Secondary keywords: sciatica treatment; radiating leg pain; sciatica after car accident; spinal decompression for selected cases
- Search intent: Commercial/informational
- Original title: `Sciatica Chiropractor in Deerfield Beach, FL | Align the Spine Chiropractic`
- New title: Unchanged.
- Original meta description: `Evaluation and decompression-focused treatment for sciatic and radiating nerve pain, with in-home visits available when it applies to your case.`
- New meta description: Unchanged; already aligned.
- H1 change: None.
- Body copy changes: Added a direct definition in the first body section; removed direct-PIP billing and deterministic disc-cause language; made adjustments/decompression conditional; corrected `Myofascial`.
- FAQ changes: Rewrote accident causation, surgery, and recovery-timing answers with examination limits and red flags.
- Internal link changes: Existing decompression, back-pain, and accident links retained.
- Alt text changes: None.
- Schema text changes: Visible FAQ and FAQ JSON-LD remain synchronized.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Draft/noindex; unchanged.
- Cannibalization notes: Sole owner of sciatica-chiropractor intent; decompression page owns the treatment modality.

### `/conditions/whiplash`

- Primary keyword: `whiplash chiropractor`
- Secondary keywords: whiplash treatment; chiropractor for whiplash; rear-end collision neck injury; accident-related headache
- Search intent: Accident-support/commercial
- Original title: `Whiplash Chiropractor in Deerfield Beach, FL | Align the Spine Chiropractic`
- New title: Unchanged.
- Original meta description: `Evaluation and treatment for whiplash — stiffness, restricted range of motion, and the headaches that come with it, with in-home visits available when it applies to your case.`
- New meta description: `Whiplash is a neck injury from rapid back-and-forth movement, often in a rear-end collision. Dr. Abe evaluates stiffness, limited motion, and related headaches.`
- H1 change: None.
- Body copy changes: Added an answer-first definition; softened adjustment/decompression outcomes; replaced benefit-preservation and out-of-pocket scare language with conditional PIP wording; corrected `Myofascial`.
- FAQ changes: Rewrote whiplash grading and PIP answers; removed no-upfront-cost and categorical coverage language.
- Internal link changes: Strong existing links to accident, neck-pain, headache, adjustments, and decompression pages retained.
- Alt text changes: None.
- Schema text changes: Visible FAQ and FAQ JSON-LD remain synchronized.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Draft/noindex; unchanged.
- Cannibalization notes: Owns whiplash intent and supports `/car-accident-chiropractor` without competing for the generic accident cluster.

### `/conditions/cervicogenic-headache`

- Primary keyword: `cervicogenic headache chiropractor`
- Secondary keywords: chiropractor for cervicogenic headache; neck-related headache; cervical spine headache; neck pain and headache
- Search intent: Informational/commercial
- Original title: `Cervicogenic Headache Chiropractor in Deerfield Beach, FL | Align the Spine Chiropractic`
- New title: Unchanged.
- Original meta description: `Headaches that actually start in your neck, not your head. Full evaluation and PIP documentation available when accident-related.`
- New meta description: `A cervicogenic headache is referred pain from the neck. Dr. Abe evaluates neck motion and related musculoskeletal factors before recommending care.`
- H1 change: None.
- Body copy changes: Added a direct definition, differential-caution language, urgent-headache guidance, and conditional PIP wording; corrected the section label from conditions the headache “relieves” to conditions that may overlap.
- FAQ changes: Rewrote delayed-headache, identification, medication, and visit-count answers without diagnosis or outcome claims.
- Internal link changes: Existing whiplash, neck-pain, TMJ, concussion, adjustment, and accident links retained.
- Alt text changes: None.
- Schema text changes: Visible FAQ and FAQ JSON-LD remain synchronized.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Draft/noindex; unchanged.
- Cannibalization notes: Deliberately excludes generic migraine targeting.

### `/conditions/concussion`

- Primary keyword: `concussion symptoms after a car accident`
- Secondary keywords: possible concussion after collision; post-concussion symptoms; concussion and whiplash; when to seek emergency care
- Search intent: Safety/informational
- Original title: `Concussion / Post-Concussion Chiropractor in Deerfield Beach, FL | Align the Spine Chiropractic`
- New title: `Concussion Symptoms After a Car Accident | Align the Spine Chiropractic`
- Original meta description: `Even a "minor" concussion needs evaluation — symptoms can persist for weeks without the right care.`
- New meta description: `A concussion is a mild traumatic brain injury that needs medical evaluation. Chiropractic care is not a substitute for emergency or neurological assessment.`
- H1 change: Removed aggressive `concussion chiropractor` positioning in favor of safety-focused informational wording.
- Body copy changes: Medical evaluation and emergency red flags now lead; retained the existing four-card section but replaced clinically mismatched back-pain treatment copy with medical-first, post-clearance musculoskeletal scope.
- FAQ changes: Explicitly states chiropractic care does not diagnose or treat the brain injury; rewrote loss-of-consciousness, recovery, safety, and whiplash-overlap answers.
- Internal link changes: Existing whiplash and accident links retained.
- Alt text changes: Existing treatment-image descriptions preserved accurately in the replacement content object.
- Schema text changes: Visible FAQ and FAQ JSON-LD remain synchronized.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Draft/noindex; unchanged.
- Cannibalization notes: Does not target commercial concussion-chiropractor intent.

### `/conditions/tmj-jaw-pain`

- Primary keyword: `TMJ chiropractor`
- Secondary keywords: TMJ chiropractor Deerfield Beach; jaw pain chiropractor; chiropractic care for TMJ-related symptoms
- Search intent: Commercial/informational
- Original title: `TMJ / Jaw Pain Chiropractor in Deerfield Beach, FL | Align the Spine Chiropractic`
- New title: Unchanged.
- Original meta description: `The same forces that cause whiplash can injure the jaw joint too — often missed because the neck pain gets all the attention.`
- New meta description: `Dr. Abe evaluates jaw-joint movement, surrounding muscle tension, and neck-related factors before deciding whether chiropractic care may be appropriate.`
- H1 change: None.
- Body copy changes: Broadened the hero beyond accident-only intent and clarified evaluation before care.
- FAQ changes: Made accident causation and visit-count answers conditional; retained habit and muscle/joint context.
- Internal link changes: Existing whiplash, accident, headache, concussion, and service links retained.
- Alt text changes: None.
- Schema text changes: Visible FAQ and FAQ JSON-LD remain synchronized.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Draft/noindex; unchanged.
- Cannibalization notes: Sole owner of TMJ/jaw-pain chiropractic intent.

### `/services`

- Primary keyword: `chiropractic services Deerfield Beach`
- Secondary keywords: chiropractic adjustments; spinal decompression; soft-tissue care; sports injury chiropractor; posture care
- Search intent: Hub/local/commercial
- Original title: `Chiropractic Services in Deerfield Beach, FL | Align the Spine Chiropractic`
- New title: Unchanged.
- Original meta description: `Adjustments, sports injury care, posture correction, spinal decompression, headache relief, and massage/soft-tissue therapy — same doctor, every visit. Call (954) 573-7192.`
- New meta description: `Explore chiropractic services in Deerfield Beach, including adjustments, spinal decompression, soft-tissue care, and sports-injury care from Dr. Abe.`
- H1 change: None.
- Body copy changes: Rewrote service summaries to remove deterministic relief/correction claims while retaining sports-injury relevance.
- FAQ changes: None.
- Internal link changes: Existing card buttons for adjustments, decompression, and soft-tissue care now say `Learn more` and point to their dedicated pages; other cards retain booking CTAs.
- Alt text changes: None.
- Schema text changes: Service schema descriptions inherit the revised service-card summaries.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Published.
- Cannibalization notes: Hub only; detail pages own service-specific queries.

### `/services/chiropractic-adjustments`

- Primary keyword: `chiropractic adjustments`
- Secondary keywords: chiropractic adjustment; spinal adjustment; back adjustment; neck adjustment; Deerfield Beach
- Search intent: Commercial/informational
- Original title: `Chiropractic Adjustments in Deerfield Beach, FL | Align the Spine Chiropractic`
- New title: Unchanged.
- Original meta description: `Restore motion lost in a collision — full evaluation, treatment, and documentation for your PIP claim. In-home care available when it applies.`
- New meta description: `Hands-on chiropractic adjustments use controlled pressure to improve joint motion. Dr. Abe evaluates your symptoms and safety before treatment.`
- H1 change: None.
- Body copy changes: Shifted from accident-only positioning to service intent; changed `Ongoing plan, billed to PIP` to `Plan and reassessment`; removed immediate-relief and direct-billing claims.
- FAQ changes: Rewrote post-accident safety and visit-count answers with evaluation/referral gates.
- Internal link changes: PIP fragment link now points to the existing accident page without a nonexistent fragment.
- Alt text changes: None.
- Schema text changes: OG/Twitter description updated through the route registry.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Draft/noindex; unchanged.
- Cannibalization notes: Sole owner of adjustment-specific intent; no invented Ahrefs metrics were used because no connector was available.

### `/services/spinal-decompression`

- Primary keyword: `spinal decompression`
- Secondary keywords: non-surgical spinal decompression; spinal decompression chiropractor; Deerfield Beach; disc and radiating nerve-pain concerns
- Search intent: Commercial/informational
- Original title: `Spinal Decompression in Deerfield Beach, FL | Align the Spine Chiropractic`
- New title: Unchanged.
- Original meta description: `Non-surgical traction that relieves pressure on compressed discs and nerves — whether from a car accident or years of wear. Full evaluation and PIP documentation available for accident cases.`
- New meta description: `Non-surgical spinal decompression uses controlled traction to reduce pressure on spinal joints and discs. An evaluation determines whether it fits your case.`
- H1 change: None.
- Body copy changes: Added an answer-first definition; broadened beyond accident-only intent; renamed the plan step and conditions heading; made disc, sciatica, pain, and session claims conditional.
- FAQ changes: Rewrote herniated-disc causation, pain, and session-count answers with assessment limits.
- Internal link changes: Existing accident and sciatica links retained.
- Alt text changes: None.
- Schema text changes: OG/Twitter description updated through the route registry.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Draft/noindex; unchanged.
- Cannibalization notes: Owns the modality; sciatica and back-pain pages own their conditions.

### `/services/soft-tissue-therapy`

- Primary keyword: `chiropractic soft-tissue therapy`
- URL change: `/services/massage-soft-tissue` → `/services/soft-tissue-therapy` with a direct permanent redirect.
- Secondary keywords: soft-tissue treatment; myofascial release; Graston technique; soft-tissue injury treatment; massage and soft-tissue care
- Search intent: Commercial/informational
- Original title: `Massage & Soft Tissue Therapy in Deerfield Beach, FL | Align the Spine Chiropractic`
- New title: Unchanged.
- Original meta description: `Hands-on treatment for the muscle spasm, bruising, and soft-tissue strain a collision leaves behind — full evaluation and PIP documentation available for accident cases.`
- New meta description: `Targeted soft-tissue care for muscle tension, restricted motion, and injury-related soreness, selected after a chiropractic evaluation by Dr. Abe.`
- H1 change: None.
- Body copy changes: Broadened beyond accident-only intent; changed the conditions heading to accurate `addressed with` language; softened relief and immediate-post-accident claims.
- FAQ changes: Rewrote immediate post-accident suitability and session-count answers; retained conditional coverage wording.
- Internal link changes: Existing accident links retained.
- Alt text changes: Corrected Graston spelling in shared service data.
- Schema text changes: OG/Twitter description updated through the route registry.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Draft/noindex; unchanged.
- Cannibalization notes: Owns soft-tissue service intent without mislabeling all care as general massage therapy.

### `/home-visit-chiropractor`

- Primary keyword: `home-visit chiropractor`
- URL change: `/home-visits` → `/home-visit-chiropractor` with a direct permanent redirect.
- Secondary keywords: in-home chiropractor; house-call chiropractor; mobile chiropractor intent; Deerfield Beach
- Search intent: Local/commercial
- Original title: `Home Visit Chiropractor in Deerfield Beach, FL | Align the Spine Chiropractic`
- New title: Unchanged.
- Original meta description: `Full chiropractic exams and treatment at your address when it fits your case and location. Check your home-visit eligibility online or call (954) 573-7192.`
- New meta description: `Ask about a chiropractic home visit from Dr. Abe when travel is difficult and the service fits your case and location. Check eligibility before booking.`
- H1 change: None; the design-sensitive `The clinic, at your door` wording was preserved.
- Body copy changes: Existing eligibility and location caveats retained; no service-area list was added.
- FAQ changes: Existing home-visit FAQs retained.
- Internal link changes: None.
- Alt text changes: None.
- Schema text changes: No unverified service-area schema added.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Draft/noindex; unchanged.
- Cannibalization notes: Owns home-visit intent and does not compete with the homepage’s general local query.

### `/about`

- Primary keyword: `Dr. Abe Nasser chiropractor`
- Secondary keywords: Dr. Abe Nasser Deerfield Beach; Align the Spine chiropractor
- Search intent: Branded/entity/trust
- Original title: `Dr. Abe Nasser, D.C. | Deerfield Beach Chiropractor`
- New title: Unchanged.
- Original meta description: `One doctor, every visit. Meet Dr. Abe Nasser — transparent pricing and the same provider from your first exam through recovery. Call (954) 573-7192.`
- New meta description: `Meet Dr. Abe Nasser, the chiropractor behind Align the Spine Chiropractic in Deerfield Beach, and learn about his patient-centered approach to care.`
- H1 change: None.
- Body copy changes: Rewrote the shared doctor bio to explicitly connect Dr. Abe Nasser, chiropractor, Align the Spine Chiropractic, and Deerfield Beach while preserving unverified-credential gates.
- FAQ changes: None.
- Internal link changes: Existing booking CTA retained.
- Alt text changes: None.
- Schema text changes: Existing Person schema reads the improved entity context; unverified credential fields remain omitted.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Published.
- Cannibalization notes: Entity page only; does not target the homepage’s broad local query.

### `/reviews`

- Primary keyword: `Align the Spine reviews`
- Secondary keywords: Align the Spine Chiropractic reviews; Dr. Abe Nasser reviews
- Search intent: Branded/trust
- Original title: `Patient Reviews | Align the Spine Chiropractic`
- New title: Unchanged.
- Original meta description: `Verified patient reviews for Align the Spine Chiropractic in Deerfield Beach, FL.`
- New meta description: Unchanged.
- H1 change: None by this pass.
- Body copy changes: None by this pass; substantial concurrent developer changes were already present.
- FAQ changes: None.
- Internal link changes: None by this pass.
- Alt text changes: None by this pass.
- Schema text changes: No review/rating schema was added by this pass.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Working tree says published due a pre-existing concurrent edit; baseline was draft. This pass did not change or revert it.
- Cannibalization notes: Branded review intent only.

### `/book-an-appointment`

- Primary keyword: `request chiropractic appointment`
- URL change: `/book` → `/book-an-appointment` with a direct permanent redirect.
- Secondary keywords: chiropractic appointment Deerfield Beach; request evaluation; Dr. Abe appointment
- Search intent: Transactional
- Original title: `Request a Chiropractic Appointment | Deerfield Beach, FL | Align the Spine Chiropractic`
- New title: Unchanged.
- Original meta description: `Request your chiropractic evaluation in Deerfield Beach or at your home — we'll follow up to confirm. Call (954) 573-7192.`
- New meta description: `Request a chiropractic appointment with Dr. Abe in Deerfield Beach. Ask whether an office evaluation or eligible home visit fits your needs.`
- H1 change: None.
- Body copy changes: Added Dr. Abe and Deerfield Beach while preserving request-not-confirmation language.
- FAQ changes: Shared visit-count language was made non-promissory; PIP and home-visit answers remain conditional.
- Internal link changes: None.
- Alt text changes: None.
- Schema text changes: FAQ JSON-LD continues to use the visible FAQ source.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Published.
- Cannibalization notes: Utility/transactional only.

### `/contact-us`

- Primary keyword: `contact Align the Spine Chiropractic`
- Secondary keywords: Align the Spine phone; Align the Spine address; Deerfield Beach chiropractic contact
- Search intent: Navigational/local
- Original title: `Contact Us | Align the Spine Chiropractic`
- New title: `Contact Align the Spine Chiropractic | Deerfield Beach, FL`
- Original meta description: `Questions about your visit, insurance, or your claim? Reach Align the Spine Chiropractic directly — no call center, no hold music. Call (954) 573-7192.`
- New meta description: `Contact Align the Spine Chiropractic at 811 SE 8th Ave, Suite 101, Deerfield Beach, FL, or call (954) 573-7192 about an appointment or visit.`
- H1 change: `You've Landed in the Right Place After a Car Accident` → `Contact Align the Spine Chiropractic` to prevent competition with the accident page.
- Body copy changes: Added the verified address and broadened the page from accident-only to contact/navigation intent.
- FAQ changes: Shared booking FAQ retained.
- Internal link changes: Existing form jump retained.
- Alt text changes: None.
- Schema text changes: Practice schema remains present and aligned with visible NAP.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Published.
- Cannibalization notes: Navigational/entity intent only; no longer targets generic accident care.

### `/privacy-policy`

- Primary keyword: `Align the Spine privacy policy`
- Secondary keywords: None required.
- Search intent: Legal/utility
- Original title: `Privacy Policy | Align the Spine Chiropractic`
- New title: Unchanged.
- Original meta description: `How Align the Spine Chiropractic collects, uses, and protects your information, including HIPAA-protected health information.`
- New meta description: Unchanged.
- H1 change: None.
- Body copy changes: None.
- FAQ changes: None.
- Internal link changes: None.
- Alt text changes: None.
- Schema text changes: None.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Published.
- Cannibalization notes: No commercial targeting.

### `/thank-you`

- Primary keyword: None.
- Secondary keywords: None.
- Search intent: Form-confirmation utility.
- Original title: `Thank You | Align the Spine Chiropractic`
- New title: Unchanged.
- Original meta description: `We've received your request and will be in touch shortly.`
- New meta description: Unchanged.
- H1 change: None.
- Body copy changes: None.
- FAQ changes: None.
- Internal link changes: None.
- Alt text changes: None.
- Schema text changes: None.
- Visual QA result: Rendered HTML pass; viewport screenshots unavailable.
- Index status: Noindex and intentionally absent from the SEO registry/sitemap.
- Cannibalization notes: None.

## QA results

- `npm run typecheck`: passed.
- `npm run lint`: passed with 0 errors and 8 existing warnings.
- `npm run test`: passed, 18 files and 146 tests.
- `npm run build`: passed; 26 routes generated.
- `git diff --check`: passed.
- Local canonical crawl: 8 sitemap URLs passed.
- Rendered route audit: 20 routes checked; 0 duplicate titles, 0 duplicate descriptions, 0 incorrect H1 counts, 0 incorrect canonicals.
- Internal link crawl: 26 unique internal paths checked; 0 broken.
- URL migration crawl: 6 legacy aliases return direct 308 redirects; 0 redirect chains and 0 stale legacy internal links.
- New route canonical audit: `/book-an-appointment`, `/car-accident-chiropractor`, `/home-visit-chiropractor`, and `/services/soft-tissue-therapy` each return 200, exactly one H1, and a self-referencing canonical.
- Sitemap migration audit: published replacement URLs are included; draft/noindex replacement URLs remain excluded; no legacy URL is present.
- FAQ schema: visible FAQs and FAQ JSON-LD continue to share the same source objects.
- No new routes, visible sections, location pages, schema types, dependencies, CSS rules, or animation changes were added by this pass.

## Pre-existing conflicts and release blockers

1. The worktree contained substantial changes before this pass. In particular, `/reviews` was changed from draft to published, despite this task's explicit no-index-status-change rule. This pass preserved that developer-owned work and did not alter the status.
2. The concurrent `/reviews` page contains `Same-day appointments often available` and names Boca Raton and Fort Lauderdale, while `serviceAreasVerified` is false. Verify or remove that copy before release.
3. `content/site.ts` marks hours verified but stores `7:00 AM`–`11:00 PM`, while its nearby comment says the confirmed hours are `9:00 AM`–`7:00 PM`. Resolve the source-of-truth conflict before relying on hours in schema or visible content.
4. Production requires `SITE_URL`; the non-production fallback is `https://chirobackpain.com`. Confirm the Vercel production environment uses the intended canonical origin.
5. A specific PIP dollar stat remains gated as client-verified in existing code and was not changed during this keyword pass. Legal/clinical approval should remain separate from SEO approval.
6. Screenshot-based QA at the five requested viewport widths remains outstanding because no browser backend was available in this environment.

## Source validation note

No Ahrefs connector was available, so no new keyword metrics were invented. Florida PIP language was made conditional based on the current Florida Legislature statute and Florida Department of Financial Services consumer guidance: initial services and care generally must occur within 14 days, while payment and limits depend on eligibility, policy terms, medical necessity, and claim circumstances.
