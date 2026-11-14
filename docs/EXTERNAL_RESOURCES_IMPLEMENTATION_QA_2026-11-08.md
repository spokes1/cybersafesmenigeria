# External Resources implementation and QA | 8 November 2026

## Completion and source

- Route: `/resources/external`. Replaced the legacy five-link index through `tools/content/resources.mjs` + approved fragment `tools/content/approved/external.html`; registered once in `tools/build.mjs` (article kind); generated `public/resources/external/index.html` using the project build. No production deploy and no GitHub push.
- Baseline: `CyberSafe_SME_Nigeria_Organisations_Updated_Project.zip`, the latest complete repository supplied in project context. No earlier approved pages were overwritten.
- Owner-approved public copy retained: 32/32 paragraphs and 24/24 headings matched against the approved Markdown; no editorial notes shown.
- Three learning paths; nine cards (3 Nigerian, 3 everyday-business, 3 staff-awareness); four descriptive fields per card, each with a working anchor to its **approved** official URL; five ordered staff-learning steps; four CyberSafe guide links; independence disclaimer.
- Purely static content. No new JavaScript, quiz, sorting/ranking, story, Read More, adverts, affiliate links, or autoplay component.

## Reading time

1568 unique visible editorial words at 220 words/minute -> **8 min**, rounded up. Count includes hero introduction, original headings, three paths, all nine guides, five cautions, staff activity, internal related-copy and disclaimer; excludes global site chrome, printed external URL strings, non-editorial decorative counters, and private handoff notes. No hidden or optional text. Top badge reads `8 min read`.

## Build and regression

```
Generated 42 pages + 404 (1195 KB of HTML)
Search index: 40 entries, all resolving
Generated 42 pages + 404 (1195 KB of HTML)
Search index: 40 entries, all resolving
```

- Generated files checked for exact byte agreement on repeat builds: **85 files identical**.
- Difference check: **14 new/changed files**, **0 deletions**. All previously approved generated article pages, Tools, Organisations, homepage and all site scripts are unchanged (byte comparison).
- Browser test environment: headless Chromium, offline in-memory HTML with real generated CSS and shared JS; local HTTP server was unavailable. Search-index JSON was provided from the generated file. No Netlify or public-hosted test was performed.
- **52/52 actual browser checks passed** at widths 320, 360, 390, 430, 768 and 1366: no overflow, card/field/link counts, keyboard focus, header search, page scripts disabled, reduced-motion preference, native links, five-tip homepage controls, 16-question checklist with count/reset. 14 screenshots captured. No uncaught JS exceptions.
- Static checks: single search index entry, single route, 32 approved paragraphs + 24 headings present, nine official external anchors, four internal guide destinations, native ordered list, zero new page-specific interactive controls.
- Distinct from previous Tests: no detailed 7-second autoplay timer check in this task; timing code is byte-identical, and manual Next/Pause controls pass. Real Android/iOS devices, manual screen-reader traversal, high-contrast external audit, hosted stage and external reports were **not tested**.

## External destinations (9 rechecked)

- Direct official page and relevant resource confirmed: **7/9** (NCC, UK NCSC guide, NIST Corner, NIST CSWP 50 final, WhatsApp Help, Microsoft awareness, UK NCSC phishing exercise).
- Official indexed resource, direct retrieval blocked with HTTP 403: **2/9** (ngCERT, NDPC). Their links remain owner-approved, but are **pending manual browser verification** from a Nigerian network before publication.
- NIST CSWP 50 page identifies *Small Business Cybersecurity: Non-Employer Firms*, published November 2026.
- UK NCSC exercise states 15–30 minutes; WhatsApp resource identifies suspicious messages and scams; Microsoft awareness page includes free-to-read materials alongside commercial content.
- Public page loads ≠ completion of courses, download of PDFs, successful purchases, country access for logged-in users or report submissions. None of these interactions were claimed or performed.
- All approved URLs retained. Foreign-country legal/reporting and government programmes expressly separated from Nigerian regulatory and incident-reporting procedures.
- See `docs/EXTERNAL_RESOURCES_OFFICIAL_LINK_VERIFICATION_2026-11-08.csv` and updated `docs/VERIFICATION_REGISTER.csv`.

## Files and pending items

- `docs/EXTERNAL_RESOURCES_APPROVED_SOURCE_2026-11-08.md` (new)
- `docs/EXTERNAL_RESOURCES_CHANGE_MANIFEST_2026-11-08.md` (new)
- `docs/EXTERNAL_RESOURCES_IMPLEMENTATION_QA_2026-11-08.md` (new)
- `docs/EXTERNAL_RESOURCES_OFFICIAL_LINK_VERIFICATION_2026-11-08.csv` (new)
- `docs/EXTERNAL_RESOURCES_READING_TIME_2026-11-08.csv` (new)
- `docs/READ_TIME_AUDIT_2026-11-08.csv`
- `docs/VERIFICATION_REGISTER.csv`
- `public/assets/css/site.css`
- `public/assets/search-index.json`
- `public/resources/external/index.html`
- `tools/build.mjs`
- `tools/content/approved/external.html` (new)
- `tools/content/resources.mjs`
- `tools/content/search.mjs`

**Pending review:** manually open ngCERT/NDPC from a Nigerian browser, check the nine links on hosted staging, review on actual phones and using a screen reader, and confirm any future changes to provider pages. Do not use foreign reporting links for Nigerian incidents; use `/resources/organisations`.
