# CyberSafe SME Nigeria | Self-Check + Downloads + Homepage integrated release

**Owner-approved handoff:** 8 November 2026. **Status: REVIEW ONLY. DO NOT DEPLOY.**

## Scope

- Replaced the previous 16-checkbox Self-Check with the approved **15-question / five-area** Business Security Self-Check on `/resources/security-checklist`.
- Four standard answers; `Does not apply` on P1 and P2 only. All 15 questions must be answered before results. Answered count is separate from the denominator used for checklist-practice progress.
- Formula: `round(100 * earned points / (2 * applicable question count))`; in place 2, partly 1, not yet/unsure 0, N/A removed from denominator. 54% example passed.
- Private browser-only v2 storage (`cybersafe.selfcheck.v2`), explicit clear/reset, priority-ranked recommendations and links. Unanswered legacy v1 data are not imported. The old global v1 script remains dormant because the previous form ID is no longer used; no unrelated site-wide JS was modified.
- Print-only personalised A4 action plan with three explicit branded pages. The **blank** 15-question paper form is a separate PDF.
- Six genuine printable branded PDF resources under `public/downloads/`, described and linked on `/resources/downloads`.
- Homepage Self-Check preview, counts, CTA labels, Resources section, header-only search results and metadata updated, with the five Cyber Tips and approved photos kept intact.
- PDF generation sources: `tools/content/approved/printables/`; canonical question source `tools/content/selfcheck-v2.json` and JavaScript template `tools/templates/selfcheck-v2.js.template`. `node tools/build.mjs` compiles the browser script; `python tools/generate_downloads.py` regenerates six PDF resources (requires ReportLab and pypdf).

## Actual QA

- Final `node tools/build.mjs`: **42 pages + 404; 40 search entries**, no broken internal route/file links. Repeat build: unchanged generated files.
- Chromium offline in-memory preview: **43/43** checks passed across widths **320, 375, 390, 430, 768 and 1366px**. Includes no overflow, no JS errors, 15 questions, controls, no-JavaScript instructions, Downloads links, homepage tip count and header search presence.
- Additional scoring cases passed: 14/15 blocks final results; 15/15 allows result; all partly = 50%; all unsure = 0% with explicit verification actions; all not yet = 0%.
- Browser-only storage stub: confirmed v2 writes/restores; legacy v1 does not fill unanswered v2 questions. This is not a substitute for testing actual localStorage on hosted devices.
- All six PDFs: embedded original approved logo artwork, selectable text and `CyberSafe SME Nigeria` on **every page**, including the four-page blank form; page counts **1,1,1,1,1,4**.
- Personalised Chromium print: **3 A4 pages**, with logo artwork and full name on **every page**. Print test uses illustrative answers and a test business name, never real customer data.
- Previously approved Learn, Threats and Protect article **bodies** are byte-identical; their generated HTML chrome is regenerated with the new shared navigation label. Global `public/assets/js/site.js` and 7-second tips code unchanged.

## Important limitations and owner review

- Browser testing was in-memory with generated HTML/CSS/scripts because the environment blocked localhost navigation. Logo URLs in screenshots can show blank placeholders; the actual PDF print test embedded the genuine artwork for visual checking. **Hosted Netlify staging and real-device tests not performed.**
- No manual assistive-technology/screen-reader test, printer test on physical paper, end-to-end hosted browser storage test, or legal/compliance review performed. The owner should review all six PDF designs and check the printed report in colour and greyscale before approval.
- Logo artwork is embedded, but any PDF content can technically be edited; do not claim the mark is impossible to remove.
- No backend storage, telemetry, email collection, payments, affiliate advertising or external data transmission introduced.
- No GitHub push, Netlify deployment or production merge performed.
