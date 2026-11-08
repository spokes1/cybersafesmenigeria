# CyberSafe SME Nigeria — Approved Website Updates / Release Review

**Date:** 8 November 2026  
**Baseline:** `CyberSafe_SME_Nigeria_Kenny_Preview_Fixes_Preproduction_2026-11-08.zip` (newest full ZIP available in this conversation).  
**Output:** Complete generator repository with authored source (`tools/`), tracked assets and rebuilt `public/`.  
**Deployment status:** NOT pushed or deployed. This package is a **staging-review candidate**, not a production sign-off.

## Change summary

| Work item | Implementation and evidence | Status |
|---|---|---|
| CSN-UI-101 — Grey strip | No matching site overlay/image/iframe found in generated source or isolated rendering. The grey broken-image rectangle in the original Deploy Preview remains unexplained. Do not hide elements arbitrarily; inspect the overlay in Netlify DevTools and a clean browser profile. | **OPEN: staging gate** |
| CSN-NAV-102 — Desktop navigation | Retained the previously corrected breakpoint: five desktop menus at 981px and above; hamburger at 980px and below. No new edits to working menu code. | PASS in isolated layout |
| CSN-KEN-103 — Kenny | Preserved approved peeking robot, targeted 20-second invitation and one five-minute post-completion check-in. Kenny invitation JS, game data and engine are byte-identical to the prior candidate. Dark appearance adapts via shared theme layer. | Prior timing tests retained; live same-origin test outstanding |
| CSN-TIP-104 — Cyber Tips | Preserved existing seven-second shared hero/carousel timer, pause, next/previous and reduced-motion handling. Manual next tested in current isolated browser. | PASS manual; prior virtual-clock QA preserved |
| CSN-VIS-105 — Light redesign | Added restrained teal/pale blue hero edge shading, a very soft wave under the hero, card depth and gently tinted sections. Original copy and photography untouched. | PASS visually at desktop and mobile in isolation |
| CSN-THEME-106 — System dark mode | Added `tools/assets/theme.css`, generator copy to `public/assets/css/theme.css`, appropriate light/dark `<meta name="theme-color">` tags and dark-mode variables/overrides. Default remains light. Print remains ink on white. | PASS in isolated browser; actual devices still to test |
| CSN-HEAD-107 — Topic identity | Added a compact Breadcrumb/topic strip for article pages and Cybersecurity Organisations, without changing approved hooks or adding duplicate H1s. All **40** pages retain exactly one static H1; **32** pages display the new strip. | PASS static and screenshot checks |
| CSN-SC-108 — Self-Check links | Added descriptive guide-title mapping in `tools/templates/selfcheck-v2.js.template`; links remain actual routes, while URLs/paths disappear from top-three, expanded and printable action plan. Removed print `attr(href)` leak. All 15 questions and scoring unchanged. | PASS isolated complete-report test (light/dark) |
| CSN-QA-109 — Regression | Generator passes: 40 pages + 404; 38 search entries; 159 verified visitor search phrases. 9 widths tested. All six PDFs and 74 protected baseline files preserved byte-identically. | PASS static/isolated; staging gate open |

## Browser test method and scope

`playwright` / Chromium rendered the generated HTML by calling `page.set_content()` with inlined exact local CSS, image data and source JavaScript. The environment **blocks direct navigation**, even to localhost or the Netlify preview URL. The QA screenshots and interaction tests are therefore **isolated browser renderings**, not proof of live Netlify headers, origin storage, external fonts or injected overlays. Screenshots are provided under `screenshots/`.

- Viewport widths: 320, 375, 390, 768, 980, 981, 1100, 1366, 1440 px. Horizontal overflow: none found. JavaScript page errors during these checks: none.
- Header: desktop menu appears at 981px; hamburger menu opens at 390px.
- Cyber Tips: manually advancing the carousel also changes the hero tip.
- Self-Check: all 15 answers were supplied using the actual form; report generated with descriptive links only. Isolated browser `about:blank` blocks persistent `localStorage`, so native origin persistence **was not** verified in this test.
- Print CSS: in both light/dark modes, rendered print background is white (`rgb(255,255,255)`), print ink is dark (`rgb(18,48,77)`), and hyperlink `::after` content is `none`.
- Game: bundled local V5.1 modules in the isolated test (without changing the source). Completed five-scenario runs at scores **0, 1, 2, 3, 4, 5**, all with feedback and no JavaScript errors. Original game/scenarios are byte-identical to the baseline.
- All 40 routes were rendered in a dark-mode 390px screenshot audit; no horizontal overflow found. See `all_pages_dark.json` and montage.

## Important open pre-production checks

1. Recreate grey strip on the new Netlify Deploy Preview in a clean browser profile; use Inspect Element to determine ownership and correct it. If the overlay is injected by Netlify tooling or an extension, address through that control rather than suppressing site markup. This remains an open blocker.
2. Test real same-origin session storage, after completing all five questions; wait five foreground minutes on an eligible page; verify no check-in on sensitive pages and no unsolicited check-in for non-players. Include reload, back/forward and two-tab checks.
3. Test real device OS dark/light switches, contrast, assistive technology and physical touch targets. Check Cyber Tips after seven real seconds, reduced-motion and tab visibility.
4. Re-run the Self-Check on staging and use the browser Print/Save-as-PDF action. Confirm the descriptive guide labels are clickable where supported and that no raw URLs appear. Confirm PDF download links (six files).
5. Obtain senior game developer sign-off on the integrated game in the updated staging build.

**Do not merge or publish until the above staging gates are addressed and owner approval is recorded.**
