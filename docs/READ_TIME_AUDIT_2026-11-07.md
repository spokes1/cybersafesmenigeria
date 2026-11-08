# Current 18-topic narrative and reading-time audit — 7 November 2026

**Current audit:** supersedes the 6 November 2026 legacy 16-topic count and the preceding Narrative Quality register. Approved narratives remain approved.

**Baseline:** `CyberSafe_SME_Nigeria_Narrative_Quality_Updated_Project.zip` (18-article approved narrative round).

**Method:** Count normally displayed text from each generated page’s `<main>`, excluding site-wide header/footer, buttons, SVG internals and collapsed native `<details>` continuations. Count continuation prose separately. Unicode tokenisation treats internal apostrophes and hyphens as one word. Display `ceil(visible_words / 220)` minutes at the article header and `ceil(hidden_words / 220)` only beside an applicable Read the full story control. Counts are approximate editorial measures, not individual reading-speed predictions.

| # | Article | Visible words | Header | Optional story words | Extra beside Read More | Patch action |
|---:|---|---:|---:|---:|---:|---|
| 01 | Fake Bank Alerts | 1,673 | 8 min | 0 | — | Approved narrative unchanged |
| 02 | Employee Security | 2,224 | 11 min | 222 | 2 | Reporting hook and Benin City anchor |
| 03 | Data Protection | 2,841 | 13 min | 0 | — | Approved narrative unchanged |
| 04 | Business Email Compromise | 2,612 | 12 min | 168 | 1 | Approved narrative unchanged |
| 05 | Payment Security | 2,230 | 11 min | 161 | 1 | Corrected scenario illustration aria-label |
| 06 | Backup & Recovery | 1,781 | 9 min | 0 | — | Approved narrative unchanged |
| 07 | Email Security | 2,547 | 12 min | 178 | 1 | Approved narrative unchanged |
| 08 | Mobile Security | 3,540 | 17 min | 0 | — | Approved narrative unchanged |
| 09 | Account Security | 2,772 | 13 min | 0 | — | Approved narrative unchanged |
| 10 | Phishing | 2,316 | 11 min | 0 | — | Approved narrative unchanged |
| 11 | Phishing Guide | 2,234 | 11 min | 0 | — | Approved narrative unchanged |
| 12 | Business Wi-Fi | 1,284 | 6 min | 0 | — | Approved narrative unchanged |
| 13 | Social Media Security | 2,039 | 10 min | 0 | — | Approved narrative unchanged |
| 14 | Social Engineering | 2,128 | 10 min | 0 | — | Approved narrative unchanged |
| 15 | SIM Swap Fraud | 1,494 | 7 min | 0 | — | Approved narrative unchanged |
| 16 | WhatsApp Hijacking | 1,286 | 6 min | 0 | — | Approved narrative unchanged |
| 17 | Password Security | 1,141 | 6 min | 0 | — | Approved narrative unchanged |
| 18 | Malware | 2,352 | 11 min | 346 | 2 | Approved narrative unchanged |

## Comparison with the previous narrative register

- Employee Security opening is now an unfamiliar sign-in alert and the reporting uncertainty it creates, rather than an incoming bank transfer. Previously approved payment verification guidance elsewhere is unchanged.
- Employee Security story section now uses `#ruths-benin-city-sign-in-alert`; no repository links pointed to the obsolete Ibadan/cashier ID. Search keywords were aligned to the approved Benin City sign-in story.
- Payment Security’s story diagram is described accessibly as Bisi and Femi checking an unsettled transfer and responding to duplicate debits. The existing verification diagram and eight-item checklist are unchanged.
- All other 16 article source fragments, story decisions and optional story splits are unchanged. No automatic changes to header or disclosure minutes were required where their rounded totals remained valid.

## Historical audit handling

The former `READ_TIME_AUDIT_2026-11-06.csv` and `.md` remain available under `docs/archive/` solely for historical comparison. Their earlier article statuses and counts should **not** be used as the current production handoff. The older `EDITORIAL-REPORT.md` has likewise been retained as an archive and replaced by a dated entrypoint to the current correction report.

## Checks before publication

Staging, real-device testing, manual screen-reader review, photo rights and external-link/legal re-verification remain separate pre-publication checks. No deployment was carried out.
