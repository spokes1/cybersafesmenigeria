# CyberSafe SME Nigeria — Cybersecurity Organisations Implementation and QA

**Review date:** 8 November 2026  
**Baseline:** `CyberSafe_SME_Nigeria_Tools_Nigeria_First_Updated_Project.zip`  
**Route:** `/resources/organisations` (existing canonical route replaced once)  
**Deployment:** NONE. No Netlify publish, no GitHub push, no merge to publishing branch.

## Implementation

Replaced the six-entry short organisations listing with the complete approved article, retaining the approved wording and order. Five selectable incidents prioritise first provider/containment action and distinguish ngCERT technical response, NPF-NCCC criminal reporting, NDPC data rules, CBN and NCC complaint escalation, and EFCC financial-crime reporting. Official links are navigation to external services, not embedded forms or submitted reports. Seven profiles are in the approved order: ngCERT, NPF-NCCC, NDPC, CBN, NCC, EFCC, NITDA. The six report-preparation prompts, five FAQs, Start Here, four related guides and disclaimer are included.

No fictional story, Read More, pricing, agency logos, user data capture or new contact screen.

## Reading time

**1,828 unique reader-facing words**, inclusive of all five situations, directory text, supporting First Steps panel, official shortcut-link labels, FAQs, main article and disclaimer. Excludes duplicated situation-button labels, decorative section numbers, navigation/footer and global chrome. **220 words/minute; ceil(1828 / 220) = 9 minutes.** No optional story time. The full count is recorded in `docs/CYBERSECURITY_ORGANISATIONS_READING_TIME_2026-11-08.csv`.

## Objective QA results

| Check | Actual result |
|---|---|
| `node tools/build.mjs` | **PASS**. Generated 42 pages + 404 (1179 KB of HTML) ; Search index: 40 entries, all resolving |
| Repeat build | **PASS**. 85 generated files, byte-identical |
| Approved reader-facing source comparison | **PASS**. 97 of 97 headings, paragraphs and list items matched; 0 absent |
| Exactly one published route and search index entry | **PASS**; canonical path and Resources card present |
| Five cases, seven organisations, six reporting steps, five FAQs, four related links | **PASS** structural count |
| Chromium offline browser | **PASS**. 85 of 85 checks; 0 JavaScript errors |
| Responsive widths | **PASS** for 320, 360, 390, 430, 768, 1366 px; no horizontal overflow |
| Pointer and keyboard selection, ARIA selection, focus | **PASS**. Enter and Space selection; correct first actions and working link destinations |
| JavaScript absent | **PASS**. All five incident summaries and official links readable |
| Reduced motion | **PASS**. Selection works, CSS transitions disabled |
| Homepage header search and mobile navigation | **PASS** smoke checks including search result and Escape |
| Security Self-Check | **PASS** 16 controls, first-tick count and reset |
| Homepage Cyber Tips | **PASS** five slides, manual Next, pause; **7.25-second timed autoplay** advanced 1→2; reduced-motion mode stayed on slide 1 |
| Regressions | **PASS**. No previously generated approved article pages changed, global JS unchanged |
| Manual screen reader and physical Android/iOS | **NOT TESTED**. Needs owner staging review |
| Actual hosted Netlify preview | **NOT TESTED**. Only generated assets in offline Chromium |
| Official reporting-form submission | **NOT TESTED ON PURPOSE**. No dummy records submitted |

The Chromium environment blocks local file/http navigation, so page tests used an in-memory preview built from the exact generated HTML, site stylesheet, site JavaScript, selector JavaScript, icon sprite and built search index. No hosted navigation or device-app settings were claimed tested.

## External link verification

Twelve official destination URLs were checked via public official web results. CBN complaint instructions, NCC portal/form and NDPC breach portal were readable; NPF-NCCC and EFCC entry-page titles were reachable but application workflows not tested. ngCERT restricted direct automated fetches (403), although an official indexed RFC2350 document described its incident reporting; NITDA timed out directly but its standards list was indexed. NDPC main-site fetch also returned 403. **Do not equate an indexed listing or reachable portal title with successful form operation.** See `docs/CYBERSECURITY_ORGANISATIONS_OFFICIAL_LINK_VERIFICATION_2026-11-08.csv` and additions to `docs/VERIFICATION_REGISTER.csv` for itemised evidence and pending manual checks.

## Changed files and scope

Only the Organisations page, its Resources hub card description, search metadata, sources, scoped CSS/JS and verification documentation were changed. No previous article HTML or scripts were rewritten. The former six-agency constant was deleted from `tools/content/resources.mjs` to avoid maintaining a stale duplicate. Both `tools/` sources and generated `public/` output are included.

## Remaining owner-review items

- Confirm ngCERT, NDPC primary site and NITDA destinations manually where automated access was restricted.
- Test official portal navigation on real devices without submitting dummy incident data.
- Manual screen-reader audit and real-phone QA; optional staged Netlify preview after owner approval. No deployment performed.
