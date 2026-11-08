# CyberSafe SME Nigeria — Combined Improvement Implementation QA

> **Historical release evidence.** This report describes the preceding combined-improvement build. Its Audio Guide status and recommendations were superseded by the subsequently approved 8 November 2026 photo-placement and Audio Guide retirement patch. See `PHOTO_AUDIO_RETIREMENT_QA_2026-11-08.md` for current status.

**Date:** 8 November 2026  
**Source baseline:** `CyberSafe_SME_Nigeria_Integrated_SelfCheck_Updated_Project.zip`  
**Scope:** Approved combined improvement handoff (8 November 2026), review only  
**Production action:** None. No GitHub push, Netlify deployment or data submission.

## Result

- **Source build:** `Generated 40 pages + 404 (1162 KB of HTML) | Search index: 38 entries, all resolving`
- **Repeat build:** PASS, 89 generated output files byte-identical.
- **Generated routes:** baseline 42 → final **40 pages + 404**, exactly two retired routes.
- **Search index:** baseline 40 → final **38 valid entries**.
- **Static tests:** **51/51 PASS**, no fails. Includes 34 unaffected main-content bodies, six PDF brand/byte checks, four-route config, branding and sitemap.
- **In-memory Chromium checks:** **69/69 PASS**, no fails. Captures 320, 375, 390, 768, 1366-pixel homepage; 320, 390, 768, 1366-pixel Resources hub; keyboard, JS, no-JS, reduced motion, search, Self-Check and print.
- **Redirect caveat:** Both bare and slash forms have Netlify `[[redirects]]` entries at 301, but actual hosted HTTP status and `Location` headers **NOT TESTED**. No local server or static build can confirm hosted redirect behaviour.

## Implemented changes

1. Retired `/resources/guides` and `/resources/checklists` from generator, links, navigation, Resources hub, homepage and search/sitemap. Set permanent 301 targets `/learn` and `/resources/downloads` respectively.
2. Removed the old third-party credit and image in footer, the team-support sentence, the legacy image asset, obsolete active-source notes and superseded reference markup. The CyberSafe SME Nigeria logo, copyright, footer columns and site identity remain.
3. Corrected Privacy and Terms to describe the current **15-question** Self-Check, v2 local-storage key, optional business name, page-local assessment, no implicit old-v1 import or deletion, actual clear button, hosting/fonts processing and lack of a security grade.
4. Removed the unused old 16-item catalogue data and global browser handler. Current v2 self-assessment, source JSON, generator, PDF source, homepage links and reports remain in place.
5. Updated the homepage and Resources hub to a readable **four-category two-column desktop / one-column phone** layout. The five rotating Cyber Tips, autoplay code and sole header search were not changed.
6. Follow-up audio check: verified the supplied AAC/MP4 audio duration at **82.176 seconds** with `ffprobe`, corrected its former inaccurate ~3-minute wording to approximately 1:22, and added a download fallback and honest notice that no word-for-word transcript is supplied.
7. Deferred suggested new BEC, Malware and Incident Response photographs until the owner separately approves image concepts. Existing photos, diagrams, interactive components and story copy are untouched.

## Preservation and regression evidence

- **34** page main-content bodies unchanged. All existing 15-question source data and six PDFs preserved; each PDF parsed, and each original PDF byte-for-byte identical to baseline. PDF branding text detected on every page.
- Test completed using browser-local simulated storage, not live hosted browser persistence. v1 sentinel survives v2 reset; v2 responses and optional business name restore in the preview. A 3-page A4 print PDF generated with CyberSafe name on all pages, but **graphic logo resolution in the offline preview harness is not equivalent to hosted print verification**.
- Screen captures use the actual compiled CSS and scripts in an in-memory Chromium preview because browser navigation to local or placeholder URLs is blocked by the execution environment. Screenshots of on-scroll reveal sections show the finished animation state. Hosted fonts, full network navigation, manual screen readers and actual mobiles are not covered.
- The external contact domain and mailbox remain owner-deferred; they were not activated or certified.
- Existing photo permissions and external provider/source verification register rows remain pending. No new photo rights claimed.

## Outstanding before publication

1. Test all four old URL variants on an actual **Netlify staging deploy**, verifying HTTP 301, destination, no loop and static-file precedence.
2. Confirm photographs/licensing and approve any new scenario images separately; do not insert the handoff's rejected concept infographic assets.
3. Review accessibility on a real phone and with NVDA, VoiceOver or TalkBack, including focus in the mobile menu.
4. Print each of the six forms on A4 in colour and greyscale; inspect pen space. Verify the personalised action plan's graphic branding via a hosted browser.
5. Provide an exact transcript for the Audio Guide if the feature is kept as a longer-term accessible learning format; current related written guide is **not** presented as a transcript.
6. Resolve previously deferred contact/domain and photography rights decisions independently before going live.

## Changed-file breakdown

- **1 added**, **56 modified**, **19 removed** compared with baseline. Many changed `public/**/*.html` files are **expected shared footer/nav regeneration**, not article rewrites.
- See `CyberSafe_Combined_Improvement_Changed_File_Manifest.csv` for the per-file list.
- Test script outputs: 69 browser cases, 51 static cases; 19 acceptance-matrix rows.

**No production deployment was performed.**
