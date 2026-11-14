# CyberSafe SME Nigeria — Approved photos + Audio Guide retirement QA

**Date:** 8 November 2026  
**Baseline:** `CyberSafe_SME_Nigeria_Combined_Improvement_Updated_Project.zip` (previous cleanup fully completed)  
**Release scope:** Only three owner-approved images and complete Audio Guide retirement.  
**Deployment:** None. No Netlify deployment, GitHub push, or production merge.

## Outcome

- **Clean source build:** `node tools/build.mjs` → **Generated 39 pages + 404 (1151 KB of HTML); Search index: 37 entries, all resolving.** This is one fewer route and one fewer search entry than the 40-page/38-entry combined-improvement baseline.
- **Static preservation/route/image checks:** **92/92 PASS**. Three approved fragments remain byte-for-byte identical to the baseline after removing their newly inserted figures; other generated article pages remain byte-for-byte identical.
- **Chromium checks:** **136/136 PASS**. In-memory preview at 320, 375, 390, 768 and 1366px; no browser errors or horizontal overflow, images load at 4:3, keyboard controls work, and no-JavaScript and reduced-motion content remains available.
- **No hosted redirects or physical devices tested.** Both Audio Guide redirect variants have 301 rules in Netlify config, but the actual HTTP status, `Location` header, static precedence and routing on hosted Netlify **remain NOT TESTED** until authorised staging verification.

## Image changes

| Article | Route/anchor | Added file | Content preservation |
|---|---|---|---|
| Business Email Compromise | `/threats/business-email-compromise#illustrative-scenario` | `cybersafe-bec-supplier-verification.webp` | Fictional story, Read More and invoice-verification diagram untouched |
| Malware | `/threats/malware#abeokuta-story` | `cybersafe-malware-print-shop.webp` | Abeokuta story, Read More and four-signal Warning Desk untouched |
| Incident Response | `/protect-your-business/incident-response#a-realistic-example-three-calls-in-one-morning` | `cybersafe-incident-response-team.webp` | Three-calls story, four-choice Switchboard and five-part print card untouched |

Images are **owner-provided, AI-generated illustrative editorial imagery**, not real incident photographs or identified individuals. All three originals match the supplied SHA-256 checksum and are 1448 × 1086 pixels (4:3). They use explicit width/height, lazy loading, async decode, natural scaling without cropping, descriptive alternative text, and visible illustrative captions. No claim is made that tool-generated images are documentary evidence or that third-party licensing has been independently assessed. Exact hashes/captions are documented in `PHOTO_AUDIO_RETIREMENT_ASSETS_2026-11-08.csv`.

**Reading time:** Existing header labels stay unchanged. Only three short figure captions were added; approved editorial text and any hidden story continuations are unchanged. No additional story-time label has been introduced.

## Audio Guide retirement

- Removed generator import and route in `tools/build.mjs`, Audio Guide source function/card in `tools/content/resources.mjs`, and search definition in `tools/content/search.mjs`.
- Regenerated Resources overview, sitemap and search index. No `/resources/audio-guide/index.html` in the output, no Audio Guide canonical or metadata, and no audio player/CTA in surviving public pages.
- Verified no surviving source page uses `/audio_file.mp4`; removed that file, its build preservation and special-link exemption. Removed audio-only CSS selectors. Other media-related site code unchanged.
- Added **301** redirect rules for `/resources/audio-guide` and `/resources/audio-guide/` to `/learn/cybersecurity-basics` in `netlify.toml`. Existing four redirect rules for retired Checklists and Guides stay untouched. Targets exist and the configuration contains no loop.
- The older combined-improvement QA document is clearly labelled **historical** so its former Audio Guide test is not mistaken for current site status.

## Preservation and accessibility

- All original source wording, story previews/continuations, response actions, related links and diagrams preserved. Only approved figure markup added to the three story sections.
- 15-question online Self-Check intact, six branded PDFs byte-identical; five Cyber Tips, manual controls, pause/resume and header search tested. Global `site.js`, search dialog and mobile menu source unchanged.
- At no-JavaScript, photos, captions and original articles are visible. Reduced-motion mode remains static/readable. Existing keyboard selection in BEC, Malware and Incident Response checked.
- Print-media check: BEC/Malware photos stay within content width. The Incident Response guide intentionally prints only its established five-part First-Response Card; its accompanying scenario image does not print, preserving the approved card format.

## QA boundaries and next review

1. **Netlify staging redirect status** and slash handling: NOT TESTED. A locally parsed redirect rule is not an HTTP response. Owner permission is needed before staging.
2. **Real Android/iOS devices and manual NVDA/VoiceOver/TalkBack testing:** NOT TESTED.
3. **Physical A4/greyscale printing:** NOT TESTED. Browser print CSS properties were checked.
4. User-provided generated image provenance is documented; no external image licence claim is implied.

**Acceptance reference:** `PHOTO_AUDIO_RETIREMENT_QA_MATRIX_2026-11-08.csv`. Screenshots are in the supplied QA screenshot ZIP. No deployment was performed.
