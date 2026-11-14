# Compact related reading, named links and presentation numbering

12 November 2026. This update adds the owner's approved editorial changes to the existing navigation, branding and mobile-motion release.

- Replaced displayed internal paths and external URLs with meaningful link labels, including Google Security Checkup, Microsoft recent account activity, ngCERT incident-reporting guidance and the NPF–NCCC reporting portal. Accessible names describe the destination, and existing external-tab behaviour is preserved.
- All 28 existing related-reading areas now use the same Keep learning component: arrow tile, smaller heading, compact icon/title/description/section cards. The desktop grid has four columns, medium layouts two and small mobile layouts one. Heading size is 23–28 px; card titles 17 px and descriptions 14 px. Primary action buttons remain separate from the guide cards.
- Removed section badges, card indices, numbered heading prefixes and list counters. Numeric diagram selectors now show action names, and step status messages name the current action. Procedure order, interaction identities and accessibility metadata are preserved.
- Removed decorative numbering from game takeaway cards and question identifiers from the displayed Self-Check form/results. Telephone numbers, dates, security-code lengths, reading times, question progress and scores remain meaningful information.

The transparent brand PNG remains uniformly white in dark mode and teal in light mode, with no backing tile. Cyber Practice belongs to Learn only. Desktop motion controls remain hidden; mobile Pause/Resume and system reduced-motion support remain available. The 10-visible-second Mission/Team/Contact notices and 30-visible-second game invitation are preserved.

## Verification

| Check | Result |
| --- | --- |
| Generated content pages | 40 |
| Independent static checks, including 404 | 41 passed |
| Original link destinations | Preserved on every page |
| Exposed URL/path link labels and presentation numbering | None found |
| Shared Keep learning sections | 28 |
| Editorial browser captures, light/dark at 390/1440 px | 1,452 passed |
| Game, overlay and Self-Check captures, including 320 px | 220 passed |
| Navigation, transparent logos and desktop/mobile motion | 85 browser cases passed |
| Kenny notice deadlines, sessions and deferred interactions | 15 passed |
| Editorial, ownership/device and companion/session unit cases | 61 passed |
| Gameplay paths and static asset/source parity | Passed |

The browser checks exercise related-card keyboard focus/hover and diagram choices, and check text contrast, SVG visibility, pale dark-mode panels, root overflow and numeric presentation labels. A targeted Protect-page recheck confirms the separate Security Self-Check action remains a button below its three Learn cards. Self-Check result checks confirm question identifiers are absent while progress values remain intact. Static checks independently parse HTML, reject duplicate IDs/missing accessibility references and compare all link destinations with the bundled approved baseline.

Existing six PDFs, original brand images, photos and the canonical Self-Check question data remain byte-identical. External destinations were preserved, rather than subjected to a new provider availability review. Fictional, non-clickable addresses used as game evidence remain visible for learning.

## Maintenance and reproduction

`tools/lib/editorial.mjs` normalises the generated HTML before it is published. It edits relevant element ranges without reserialising unrelated content. `tools/content/link-labels.mjs` holds descriptions of approved external destinations; related-guide metadata comes from the existing navigation/search catalogue with short curated descriptions. Unknown raw URL labels cause a build error so a meaningful label can be supplied. Original approved prose fragments can retain their authoring form; `public/` contains the visitor-facing presentation.

```bash
node tools/build.mjs
node --test tests/editorial.test.mjs tests/navigation-and-device.test.mjs tests/companion-v21/*.test.mjs tests/session-and-notice.test.mjs
node tests/game-logic.mjs
node tests/static-integration.mjs
python tests/editorial-static.py --output /tmp/cybersafe-editorial
```

With `python tests/serve.py` running in another terminal:

```bash
python tests/editorial-browser.py --output /tmp/cybersafe-editorial
python tests/editorial-selfcheck.py --output /tmp/cybersafe-editorial
python tests/navigation-layout.py --output /tmp/cybersafe-navigation
python tests/theme-extra-states.py --output /tmp/cybersafe-editorial
python tests/notice-deadline.py --output /tmp/cybersafe-notices
```

The static check uses `tests/fixtures/editorial-baseline-links.json` by default, so it also runs from the downloadable ZIP without Git history. `--baseline` optionally selects a Git commit. Screenshots can be reproduced with `tests/editorial-screenshots.py --output /tmp/cybersafe-screenshots`.

## Limits and delivery

Tests use Linux Chromium, software WebGL and mobile/device emulation, not physical Android/iOS, Safari or Firefox. Local QA uses fallback fonts because of environment Google Fonts certificate trust; production URLs are unchanged. Contrast/surface probes are triage rather than a full WCAG certification. The private proof page shows representative compact layouts and link labels in both themes.

The private review and full repository download contain these changes. The main Netlify website and the owner's external Git repository have not been deployed or pushed. Earlier reports describe their original releases; this report supersedes their related-reading layouts, raw link labels and presentation numbering.
