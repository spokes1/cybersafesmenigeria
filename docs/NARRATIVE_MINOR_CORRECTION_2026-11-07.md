# CyberSafe SME Nigeria — Narrative Quality minor correction

**Date:** 7 November 2026  
**Status:** Implementation complete for owner review; no Netlify deployment or GitHub push.  
**Baseline:** `CyberSafe_SME_Nigeria_Narrative_Quality_Updated_Project.zip` (the most recent 18-article Narrative Quality project).

## Narrow scope and approved changes

1. **Employee Security** (`/learn/employee-security`): replaced the unrelated cashier/transfer opening with an unfamiliar business-email sign-in alert and uncertainty about reporting it. Adjusted one follow-on introductory sentence to connect reporting and verification. The supplier WhatsApp example, general staff guidance, payment training, Ruth’s entire Benin City narrative, full continuation and always-visible lesson remain intact.
2. **Employee story anchor:** changed the obsolete Ibadan cashier ID to `ruths-benin-city-sign-in-alert`. Searched the repository: no internal `href` points to the previous anchor. Updated Employee Security search keywords to reference the approved Benin City sign-in story; regenerated search index.
3. **Payment Security** (`/protect-your-business/payment-security`): corrected the four-stage scenario diagram’s accessible label to describe **Bisi and Femi checking an unsettled transfer and responding to duplicate debits**. The Money Coming In / Money Going Out diagram, scenario text, 8-item staff checklist, optional story and controls are unchanged.
4. **Reading-time handoff:** regenerated current 18-article CSV/Markdown register using 220 words per minute, rounded up, excluding closed story continuations from article headers. Archived the 6 November audit and unrelated old editorial report rather than deleting them, and made the 7 November documents authoritative.

## Reading-time findings

| Article | Previously visible words | Updated visible words | Header | Optional words | Extra beside Read More |
|---|---:|---:|---:|---:|---:|
| Employee Security | 2218 | 2224 | 11 min | 222 | +2 min |
| Payment Security | 2230 | 2230 | 11 min | 161 | +1 min |

**Finding:** Employee Security increased by six normally visible words, from 2,218 to 2,224, while the 222-word hidden story remained unchanged. Both still round to 11 minutes normal and 2 minutes extra. Payment Security remains 2,230 visible words, 161 optional story words, 11 minutes normal and 1 minute extra. **No displayed reading-time badge or disclosure label needed correction.**

All 18 entries, narrative decisions, count comparisons and disclosure placement are in `docs/READ_TIME_AUDIT_2026-11-07.csv` and `.md`. The historical audit remains under `docs/archive/READ_TIME_AUDIT_2026-11-06.*`.

## Source and output file changes

**Existing files modified (8):**

```text
EDITORIAL-REPORT.md
docs/VERIFICATION_REGISTER_README.md
public/assets/search-index.json
public/learn/employee-security/index.html
public/protect-your-business/payment-security/index.html
tools/content/approved/employee-security.html
tools/content/approved/payment-security.html
tools/content/search.mjs
```

**Documentation archived / superseded:**

- docs/READ_TIME_AUDIT_2026-11-06.csv
- docs/READ_TIME_AUDIT_2026-11-06.md

**Documentation added before final report:**

- docs/READ_TIME_AUDIT_2026-11-07.csv
- docs/READ_TIME_AUDIT_2026-11-07.md
- docs/archive/EDITORIAL-REPORT_legacy.md
- docs/archive/READ_TIME_AUDIT_2026-11-06.csv
- docs/archive/READ_TIME_AUDIT_2026-11-06.md

No approved article fragments outside Employee and Payment Security were modified. No changes were made to website layout, CSS, JavaScript, generator source, other story fragments, homepage, self-check source, Social Media Security, or other animation batches.

## Actual QA and evidence

- **PASS — build:** `node tools/build.mjs` generated 42 pages plus 404 and a 40-entry search index, all routes resolving.
- **PASS — repeat build:** two consecutive runs produced identical SHA-256 hashes of all generated `public/` files.
- **PASS — content isolation:** byte comparison against the Narrative Quality baseline confirmed the exact eight expected existing-file modifications; two superseded audit files moved into archive and five documentation files added before this report. Historical source audits and report are preserved byte-for-byte.
- **PASS — all 18 reading-time values:** verified against generated visible/hidden text, the actual header badge, and the applicable native story summary. Four Narrative Quality stories plus Malware retain their Read More controls.
- **PASS — payment checklist:** all eight checklist inputs remain; both money-flow lanes remain.
- **PASS — source text:** the original Employee payment/incident guidance remains; obsolete anchor no longer exists; no generated-page duplicate IDs on the two edited routes.
- **PASS — mobile/desktop:** tested both pages with Chromium at 320, 360, 375, 390, 430, 768 and 1366 px; no horizontal overflow.
- **PASS — keyboard disclosure:** Employee story opens with Enter, closes with Space. Native disclosures open without JavaScript on both pages.
- **PASS — reduced motion:** Chromium emulated `prefers-reduced-motion: reduce`; Employee journey controls and Payment money-flow visual remain available. No site interaction code was changed.
- **PASS — homepage smoke:** five approved tips present; Next, Previous, Pause/Resume controls; one header search entry, Ctrl+K search results and Escape closing; all five tips readable without JavaScript.
- **PASS — browser runtime:** no JavaScript page errors observed in the tested offline pages.
- **Test totals:** 62/62 static and build checks passed; 45/45 browser and responsive checks passed; **107/107 successful checks in total**.

### Screenshots

10 screenshots in the screenshot pack, including desktop and 375px mobile captures of the updated Employee introduction and Ruth scenario, the Payment story, its eight-item checklist and two-lane money verification diagram, plus no-JavaScript expanded story views. These are local, in-memory Chromium renders, not a hosted Netlify preview.

## Not tested / remain pending

- Manual NVDA or VoiceOver screen-reader review and actual Android/iPhone interaction.
- Hosted Netlify staging review, live search fetch or live external links; the browser harness uses the generated local search index.
- Real-time seven-second autoplay measurement: the `7000` ms setting is unchanged and tip controls were smoke-tested.
- Broad external legal/cybersecurity source re-verification and photo-licence evidence: not part of this correction.
- Formal owner acceptance and deployment authorisation.

**Deployment:** None. No changes were pushed to GitHub or deployed to Netlify.
