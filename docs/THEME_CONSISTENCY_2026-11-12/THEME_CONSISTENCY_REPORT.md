# Colour, dark surfaces and Kenny deadline review

12 November 2026. This update supersedes the earlier theme QA pass for the presentation issues reported in the owner's screenshots.

## What changed

- Shared icon tiles now have saturated teal, blue and green fills in both themes. Risk and cyber-tip badges retain an orange treatment. The white symbols remain clear when cards are selected. Inline icons use suitable contrast rather than pale glyphs on pale tiles.
- The existing website logo artwork is preserved. Its symbol now sits on a teal backing in the header and footer; the wordmark follows the theme's text colour. Existing coloured favicon and touch-icon assets are preserved.
- Keep learning and all related-card families retain dark surfaces on hover, keyboard focus and press. The selected phishing response links also stay dark, including the risk response.
- Removed the previous light reading-canvas exceptions. Cybersecurity Basics, WhatsApp Security, Device Security, Incident Response, External Resources, Organisations and Tools now have dark reading panels, diagrams, cards and controls in dark mode.
- Malware's illustration, document badge and Observe/Pause/Report actions now use readable dark surfaces and colourful icon badges.
- Numbered Social Engineering controls have readable selected and unselected numbers.
- Light mode keeps its existing page/text palette. The requested branding and icon colours intentionally change in both modes.

## Kenny's development notice

Mission, Team and Contact now use a visible-time deadline of 10,000 ms, replacing the repeating polling timer. The card is eligible at that deadline, once per page and tab/session. Hidden time and history suspension do not count. An open search, focused form or another open Kenny card defers it until the visitor is free to read it; it does not overlap another interaction. The independent game invitation remains at 30 visible seconds and completion remains session-only.

The notice reads:

> CyberSafe SME Nigeria is in continuous development. We’re regularly updating our guidance and resources to better support your business.

The message has no game CTA. Its existing reading time and close/retreat behaviour are preserved.

## Evidence and results

| Check | Result |
| --- | --- |
| Generated pages covered | 40 |
| Themes and widths | Light and dark, 390 and 1440 px |
| Page, expanded, styled-link focus/hover and selected-control focus/hover captures | 3,560 |
| Pale dark-mode panel flags | 0 |
| SVG contrast flags, including decorative icons visible to the visitor | 0 |
| Text-contrast flags and root horizontal overflow | 0 |
| Additional game, search, navigation and self-check result captures at 320/390/1440 px | 220, all passing |
| Light default text-style comparisons against the previous release | 80 of 80 unchanged |
| Notice deadline, session, search deferral and visibility/history cases | 15, all passing |

The consistency probe detects pale solid fills and pale gradient stops, independently of text contrast. It checks visible SVG colours against background candidates at 3:1, so a readable dark-on-white panel or a faint decorative symbol can no longer silently pass the website's dark-theme review. Text uses the existing normal/large-type contrast probe. All visibly styled main-content links are exercised, including related and Keep learning cards, rather than only `aria-pressed` buttons.

The deadline tests verify that the card is absent immediately before its scheduled deadline and visible at it in browser virtual time. They cover all three pages in both themes at mobile and desktop widths, once-per-page/session behaviour, deferred search and suspension. The test instruments the module's scheduling call without changing its delay or guards.

The full browser regression also passed: all 40 routes, every original-game score total, ransomware recovery, article and return navigation, mobile menus, search, real textured WebGL loading under the site's CSP, the 30-second invitation and the About-page notices. The 12 gameplay paths, 52 companion/session tests and static integration checks passed. Existing PDFs, self-check data, photos and original brand images remain unchanged.

The private proof page pairs before/after captures of the reported sections and includes light/mobile views and Kenny notice captures. The full repository includes the measurements and repeatable scripts; screenshots are available through the proof page. The compact evidence download contains the measurements and scripts.

## Reproduce

With Python Playwright, local Chromium and Node.js installed, run `node tools/build.mjs`, then keep `python tests/serve.py` running in another terminal.

```bash
python tests/theme-audit.py baseline --baseline-css tests/fixtures/theme-before-consistency.css --output docs/THEME_CONSISTENCY_2026-11-12
python tests/theme-audit.py final-defaults --output docs/THEME_CONSISTENCY_2026-11-12
python tests/theme-consistency.py final --states --output docs/THEME_CONSISTENCY_2026-11-12
python tests/theme-extra-states.py --output docs/THEME_CONSISTENCY_2026-11-12
python tests/notice-deadline.py --output docs/THEME_CONSISTENCY_2026-11-12
python tests/consistency-summary.py docs/THEME_CONSISTENCY_2026-11-12
```

For before/after visual proof, use `tests/theme-proof-screenshots.py` with `--output` and its optional `--baseline-css` argument. The prior CSS is a test fixture only and is not deployed.

## Limits and rollout

This is computed contrast/surface triage and representative visual review, not a full WCAG certification. The surface/SVG probe excludes approved in-game evidence mockups, raster photographs/artwork and print-only output. Game text, state flows and real WebGL loading are checked separately. Text-style fingerprints are not pixel comparisons; icon and logo changes are deliberate.

Tests use Linux Chromium, software WebGL and mobile viewports, not physical Android/iOS, Safari, Firefox or screen-reader acceptance testing. Local captures use fallback fonts because of the environment's Google Fonts certificate trust; production font URLs are unchanged. Notice timing uses browser virtual time and dispatched visibility/history events, not an operating-system background-tab endurance test. Browser scheduling, loading and protected interactions can affect wall-clock appearance.

The private review and downloadable repository contain this update. The main Netlify deployment and the owner's external Git repository have not been changed. Use the normal Netlify Deploy Preview before production rollout.
