# CyberSafe SME Nigeria | Approved Visitor Journey and Simplified Search | Implementation & QA

**Date:** 8 November 2026  
**Status:** Implemented for owner review. **NOT deployed or pushed to GitHub.**  
**Baseline:** `CyberSafe_SME_Nigeria_Photos_Audio_Removal_Updated_Project.zip` (newest returned repository before this work).

## Scope and actual changes

1. **Header search overlay** (`tools/lib/layout.mjs`, `public/assets/js/site.js`, `public/assets/css/site.css`): single accessible input named “Search CyberSafe SME Nigeria” with approved placeholder, one visible X close, four popular phrases and no tutorial/keyboard footer. Live matches show at most six real route links, title, description and section category; no `<role=listbox>` misuse. Focus, Escape, backdrop, Tab/Shift+Tab and existing shortcuts preserved. Field failures show a Retry button; no-match result is an honest sentence. Search uses only a one-time same-site fetch of `/assets/search-index.json` and no visitor query is transmitted, logged or saved. Static HTML remains navigable without JavaScript.
2. **Natural-language vocabulary** (`tools/content/search-phrases.json`, `tools/build.mjs`, `public/assets/search-index.json`): 159 owner-approved phrases stored as maintainable editable source data. Build validates the target routes and attaches primary/secondary intent aliases to the existing 37 searchable pages; no routes invented. Search normalises common punctuation, WhatsApp case, Wi-Fi and 2FA/two-factor variants. Exact approved phrases get editorial primary priority, followed by secondary page; otherwise title/keyword/summary scoring is conservative.
3. **Homepage incident-help strip** (`tools/content/approved/home.html`): approved copy directly below four goal cards with link to `/protect-your-business/incident-response`. No new hero CTA or search field.
4. **Learn beginner sequence** (`tools/content/learn.mjs`): removed the empty *Being written next* section, added three links in order: Cybersecurity Basics → Password Security → Phishing Guide. Correct CTA *Start the Security Self-Check*.
5. **Contact routing** (`tools/content/about.mjs`): official bank/payment provider first for suspected payment fraud, links to Incident Response and Organisations directory. Explicitly states CyberSafe does not receive or investigate reports.
6. **Homepage Resources goal card**: exact revised copy: “Find printable templates, useful tools, reporting contacts and trusted learning links.” Existing `/resources` URL unchanged.

## Build and preservation

- `node tools/build.mjs`: **PASS**, 39 pages plus a 404 page, 37 valid search entries and all 159 intent routes resolved.
- Retired `/resources/guides`, `/resources/checklists` and `/resources/audio-guide` remain absent. Existing Netlify redirect configuration is **unchanged**; hosted 301 responses were **not** tested.
- Other approved article `<main>` bodies match the prior repository byte-for-byte. The new search dialog is shared, so generator regeneration legitimately updated the common HTML shell of every generated page, but did **not** alter their approved article content.
- Three previously approved story WebPs, six downloadable PDFs, source article fragments, all canonical 15 Self-Check questions, generated Self-Check script and print templates are **unchanged**.
- The old Go2Cyber/GT Cyber and retired Audio Guide content have not been restored. Existing five Cyber Tips, carousel timing and controls are preserved.

## QA actually performed

| Test group | Result | Evidence |
|---|---:|---|
| Chromium search and visitor-flow checks | **56/56 PASS** | `Visitor_Journey_QA_Measured.csv` |
| Exact search phrase ranking | **159/159 PASS** | `VISITOR_JOURNEY_SEARCH_PHRASE_RESULTS_2026-11-08.csv` |
| Additional regression checks | **15/15 PASS** | `Visitor_Journey_Additional_QA.csv` |
| Static/source preservation checks | **18/18 PASS** | `Visitor_Journey_Static_QA.csv` |
| Full developer acceptance categories | **20 PASS, 1 NOT TESTED** | `VISITOR_JOURNEY_SEARCH_ACCEPTANCE_2026-11-08.csv` |

The additional checks include deliberately delayed index fetching with rapid input changes, simulated 503 failure and successful retry, HTML semantics, keyboard shortcuts/focus handling, 320–1366px responsive overflow checks, real 7-second Cyber Tips rotation in Chromium, reduced-motion autoplay suppression, and Self-Check scoring of **15/28 = 54%** after 15 answers (with one N/A). Self-Check local storage and legacy v1 data preservation were checked using **simulated** browser storage. All other article body and PDF/photo identity checks used file hashes/byte comparisons.

**Browser setup:** Chromium rendering of the actual generated page HTML, CSS, icon sprite, photo assets and JS in an in-memory preview. A simulated same-origin response supplied the **actual generated** `search-index.json`. This was necessary because local/test-origin navigation was blocked by the browser environment. Therefore results are not a substitute for actual Netlify staging, phone/keyboard-viewport behaviour or manual screen-reader assessment.

## Outstanding pre-production tests (NOT TESTED)

- Manual screen-reader checks in NVDA or VoiceOver, and macOS Command+K.
- Actual phone/desktop real-origin tests including mobile on-screen keyboard opening and closing, live browser history and search-result navigation, and slow or missing network in the hosted environment.
- Hosted Netlify redirect HTTP 301 responses, real-device browser persistence, and a final full-site accessibility scan.
- No changes were made to unrelated image licensing, external articles or domain/contact readiness.

**Decision:** Ready for owner preview and staging QA; **not authorised for production deployment**.
