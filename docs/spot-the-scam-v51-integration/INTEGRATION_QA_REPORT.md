# Spot the Scam V5.1: website integration report

**Source:** uploaded newest full website repository and separately uploaded senior game developer V5.1 integration-ready ZIP, 8 November 2026. **Deployment:** none. **Game canonical route:** `/learn/spot-the-scam` only.

## Implementation

- Reused original V5.1 scenario, mascot, rendering and score modules. Kept all five scenarios and supplier two-selection question. Preserved real, local article destinations and no-JS educational links.
- Registered page in `tools/build.mjs`, search, Learn menu, Learn index, homepage static learning invitation and six related pages (five game scenarios plus Phishing). Maintained shared CyberSafe shell and original site CSP.
- Mounted one Kenny invitation controller per eligible page, not on game or sensitive workflows. An invitation is only considered on Home, Learn hub and the selected article pages, after 20 seconds of active, recently interacted browsing; session flag stops offers once game begins. Further V5.1 decline/greeting/final-offer cadence remains.
- Independently counts **420,000 ms (7 minutes)** of active, visible, focused browsing per tab for one gentle greeting-only check-in. Check-in is not contingent on game play. Does not count hidden or idle time, does not show on game, Self-Check, incident-response, reporting contacts or contact form, and defers while search, menu, modal or form activity is present. The existing in-memory fallback is retained when storage is unavailable.
- No analytics SDK, third-party JS, inline scripts or policy weakening introduced. Netlify still publishes the prebuilt `public/` folder.

## Measured locally

Build output, exact changed-file list, static QA results and asset byte sizes are in this directory. Checks in `QA_EVIDENCE.csv` marked PASS were actually performed by inspecting source/generated files or running Node. `node tools/build.mjs` returned exit code 0, reporting 40 pages + 404 and 159 resolving visitor search phrases. Original content source is preserved aside from narrowly appended contextual links.

## Browser validation limitations and required staging work

**Not certified for deployment.** Local Playwright Chromium navigation failed with `net::ERR_BLOCKED_BY_ADMINISTRATOR` even when a same-origin HTTP server and intercepted requests were tried. Therefore responsive viewport screenshots, live 0–5 scoring, screen reader/keyboard on actual devices, network console, browser history, storage across two tabs, blocked storage, 7-minute clock, and timing of invitations against modal/menu/search were NOT verified in the integrated website. All those tests require a real same-origin staging deployment and manual device review. Do not interpret the upstream V5.1 test results as integrated-build validation.

Included `GAME_PACKAGE_REFERENCE_SCREENSHOTS` are **unmodified V5.1 standalone package screenshots**, *not* screenshots of the integrated CyberSafe site. They are provided as visual design references only.

The senior game developer has **not yet reviewed this integrated output**. Gameplay sign-off and owner staging approval are outstanding. No deploy, push or external upload occurred.
