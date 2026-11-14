# Light and dark theme corrections, 12 November 2026

The repeated readability problems came from light-only component backgrounds combined with shared dark-mode text colours. The fix pairs each surface with its text and icon colours, including the states shown after a visitor makes a choice. The dark repairs are scoped to `prefers-color-scheme: dark`.

## Corrections

- Removed the full-width highlight strips behind article category labels, including Keep learning cards.
- Mobile Security: corrected quick-setting labels, the lost-phone sequence and navigation, icon tiles, and the iPhone/Android comparison table.
- Business Wi-Fi: corrected unselected/selected device controls and the business/guest network rule cards.
- Social Media Security: corrected platform and official-guide cards, comparison tables, scenario controls, icon tiles and numbered steps.
- Applied the same treatment to affected payment, phishing, email-compromise, social-engineering, malware, ransomware, data-protection and employee-security components found during the whole-site scan.
- Corrected dark search-result category badges and the small timestamp in the game's outgoing WhatsApp bubble.
- Preserved the light palette. Slightly darkened existing illustration captions on Device Security, Incident Response and Ransomware, and the game timestamp, to improve their existing contrast.

## QA results

| Coverage | Result |
| --- | --- |
| All 40 generated pages, light/dark, 390 and 1440 px | Passed |
| Expanded details and visible choice controls, including focus/hover | Passed |
| Main audit states | 1,420 |
| Extra navigation, search, self-check results and game states at 320/390/1440 px, plus 404 and narrow article checks | 220 |
| Final computed text-contrast flags across 1,640 states | 0 |
| Root horizontal overflow flags across those states | 0 |
| Light default text-style comparisons against the pre-change baseline | 74 of 80 identical |
| Other six light defaults | Only caption contrast changed on the three pages listed above, at both widths |

The main baseline recorded 2,062 dark and 46 light contrast flags across repeated default/expanded/selected states. These are repeated text instances, not counts of distinct defects. `baseline.json`, `final.json`, `extra-states.json` and `summary.json` retain the actual measurements.

Representative section screenshots cover the reported Mobile Security, Business Wi-Fi and Social Media Security areas in desktop light/dark and mobile dark. They are provided in the separate theme QA evidence ZIP to keep the full source repository download compact.

The build, gameplay logic, 52 companion/session tests, model/texture checks and static integration checks passed. The existing full browser regression was also rerun; its results are in `browser-regression.log` and the integration evidence folder. That suite covers all score totals, recovery, article/return links, the actual textured WebGL model, session completion, the 30-second invitation and all three 10-second page notices.

## Reproduce the audit

From the repository root, with Node.js, Python Playwright and local Chromium installed:

```bash
node tools/build.mjs
python tests/serve.py
```

In another terminal:

```bash
python tests/theme-audit.py baseline --baseline-css tests/fixtures/theme-before-qa.css --states
python tests/theme-audit.py final --states
python tests/theme-extra-states.py
python tests/theme-summary.py docs/THEME_QA_2026-11-12
```

`theme-summary.py` fails if contrast flags, root overflow or unexpected light default text-style changes remain. The scripts accept an output directory so historical evidence can be retained. Main audit routes are discovered from generated pages.

## Verification limits and delivery

This is computed text-contrast triage plus representative visual review, not a full WCAG certification. The probe checks normal text against solid backgrounds and conservative gradient-stop candidates. It excludes gradient-clipped type, raster backgrounds, shadow DOM and decorative icons; representative icon/card surfaces were inspected visually. Its text-style signatures cover text colours, backgrounds, borders and typography, not a pixel-for-pixel layout comparison.

Tests ran in Linux Chromium, including mobile viewports and software WebGL. Physical Android/iOS, Safari, Firefox and screen-reader acceptance testing are outside this run. Local QA substitutes empty Google Fonts CSS because the environment browser does not trust that endpoint's certificate; production font URLs remain unchanged.

The private review and full repository ZIP contain the corrections. The main Netlify website and the owner's external Git repository have not been deployed or pushed. A normal Netlify Deploy Preview remains the appropriate final hosted check before production rollout.
