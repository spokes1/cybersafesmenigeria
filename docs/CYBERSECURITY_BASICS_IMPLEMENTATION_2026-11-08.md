# CyberSafe SME Nigeria — Cybersecurity Basics implementation and QA

**Date:** 8 November 2026  
**Owner approval:** Cybersecurity Basics handoff, 8 November 2026  
**Page:** `/learn/cybersecurity-basics`  
**Baseline:** `CyberSafe_SME_Nigeria_Device_Security_Updated_Project.zip` (SHA-256: `90662f5a0cb6cbc5ba7fee34a7f55b88878b25b92ea0705824b94f716197c926`)  
**Deployment:** **Not performed**. No GitHub push, Netlify publish or production merge.

## Changes

- Replaced the old short Cybersecurity Basics article with the exact approved beginner-focused source at `tools/content/approved/cybersecurity-basics.html`, using the existing approved-page generator. The outdated four-causes claim and old FAQ source have been removed. `APPROVED_LEARN` excludes the old generator path, so there is only one article at the existing canonical route.
- Updated the Learn hub teaser, SEO page metadata and existing search index description/keywords. No new search bar or route.
- Added **Your Digital Business Map**, a five-area, user-controlled educational navigator: Accounts, Payments, Information, Devices and People. Each selection displays 'Why it matters', 'What to check first', and a live internal guide link. Native buttons report `aria-pressed`; the selected panel is displayed without waiting for animation. The five complete approved area explanations also remain lower on the page.
- With scripts absent, all five map explanations and guide links remain visible as static HTML. `prefers-reduced-motion: reduce` eliminates the selection transition. Controls have visible focus and responsive 44px-plus targets.
- Presented five approved **First-Week Plan** actions as a readable ordered sequence, not another checkbox or assessment; linked the unchanged 16-item Security Self-Check at `/resources/security-checklist`.
- Preserved the approved cybersecurity definition, nine-term glossary, five FAQs, Start Here, four Keep Learning links and disclaimer. Internal build/design/source notes are not published.
- Added an original CSS shop-counter illustration rather than asserting rights to an unverified workplace photograph. The source-verification register contains six additional **PENDING_EVIDENCE** editorial leads, without claims of independent validation.

## Source and generated files

- `tools/content/approved/cybersecurity-basics.html` (new)
- `tools/content/approved/cybersecurity-basics.footer.html` (new)
- `tools/build.mjs` (one registered approved route)
- `tools/content/learn.mjs` (remove legacy article and FAQ source; retain one live topic and add approved exclusion)
- `tools/content/search.mjs` (update existing search metadata)
- `public/assets/css/site.css` (page-scoped `.cb-` styling)
- `public/assets/js/cybersecurity-basics.js` (new scoped, idempotent map controller)
- `public/learn/cybersecurity-basics/index.html` (regenerated)
- `public/learn/index.html`, `public/assets/search-index.json`, `public/sitemap.xml` (regenerated)
- `docs/VERIFICATION_REGISTER.csv` (six pending editorial source leads)
- `docs/CYBERSECURITY_BASICS_IMPLEMENTATION_2026-11-08.md` (this report)

## Reading time

**1,765 normally visible words / 220 words per minute, rounded up = 9-minute read.** This counts the hero title and subtitle, visible navigation/selection instructions, main public article, the selected map explanation and visible related guidance. It excludes four alternative map explanations hidden after enhancement, duplicated decorative illustration text, header/footer boilerplate and internal editor notes. All five map explanations remain available in static mode. No optional continuation or secondary timer exists. The provisional 8-minute estimate was revised to **9 minutes** without shortening the approved article.

## Tests performed

| Check | Result and evidence |
|---|---|
| `node tools/build.mjs` | **PASS**: 42 pages + 404, 40 search entries, all resolving |
| Static checks | **PASS 33/33**: single route, structure, exact approved paragraphs, links and regression file comparison |
| Approved reader-facing copy | **PASS**: 58 text blocks verified; 0 missing |
| Responsive/interactive Chromium | **PASS 17/17**: 320/360/375/390/430/768/1024/1366px; no overflow; 5 areas; Enter, Space and visible focus |
| Scripts-absent static fallback | **PASS** in Chromium with scripts removed: all 5 explanations and 5 corresponding guide links visible, zero horizontal overflow at 390px; 320px static responsive checks also completed |
| Reduced motion | **PASS**: zero transition and animation durations, correct selected state |
| Homepage regression | **PASS 13/13**: 5 Cyber Tips, 7,000ms interval retained, Next/Previous, Pause/Resume, search shortcut/result/close, mobile navigation, no JS errors |
| 16-point Self-Check regression | **PASS 4/4**: 16 checkboxes, count increments, reset and `cybersafe.checklist.v1` storage key unchanged |
| Search and related routes | **PASS**: 40 generated search entries, Basics returned in offline search preview, all five map and four related destinations exist |
| Earlier articles and global script | **PASS**: all other article HTML, homepage source and `site.js` byte-identical to Device Security baseline |
| Repeat build | **PASS**, byte-for-byte output comparison |

### Limitations and open review items

Browser checks used **offline Chromium with the generated site stylesheet, icon sprite, scripts and search index embedded in the preview**. The fallback view was tested with scripts removed, equivalent to the static no-JavaScript output; a separate physical device with JavaScript disabled was not tested. Manual screen-reader review, physical iPhone/Android tests, hosted Netlify staging, full seven-second elapsed carousel timing, and production reporting flows were **not tested**. The existing carousel interval and interactions were tested or verified as indicated above. The linked Nigeria Police NCCC portal and six editorial-source leads require publication-stage verification. No independently rights-cleared Nigerian shop photograph was provided; the illustration is original CSS and existing line icons. Domain and contact decisions remain deferred.

## Owner acceptance

This is a **review ZIP**, not a deployment. Inspect the desktop and phone screenshots, especially the map at 320px/390px and the scripts-absent static view, before authorising any publication.
