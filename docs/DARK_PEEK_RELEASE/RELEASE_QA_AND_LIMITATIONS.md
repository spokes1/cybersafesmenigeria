# CyberSafe SME Nigeria — dark-mode and compact Kenny preview corrections

Date: 8 November 2026  
Status: **Source updated and rebuilt for a new GitHub/Netlify Deploy Preview. Not production-approved.**

## Scope and evidence

Changes respond to screenshots showing unreadable pale text on pale Cyber Tips and interactive article panels in dark mode, and an oversized Kenny peeker that obscures content. **The game scenarios, scoring, Self-Check, downloadable PDFs, article copy, site navigation and search have not been modified.**

### Changed existing files (4)

| File | Purpose |
|---|---|
| `tools/assets/theme.css` | Source-level dark-mode contrast repairs for Cyber Tips, Account Security visualisations, reused editorial cards and related affected components. |
| `public/assets/css/theme.css` | Regenerated theme stylesheet, identical to the source file. |
| `public/assets/css/kenny-invitation.css` | Small transparent 44–48px screen-edge peeker, cropped face, reduced-motion and keyboard focus behaviours. |
| `public/assets/js/kenny-invitation.js` | Nonverbal peeking/retreating cycle within the existing scheduler. No change to invitations or completed-game check-in triggers. |

### Kenny behaviour retained and refined

- The approved targeted **20-second invitation** is unchanged.
- The approved **five-minute check-in only after completing all five game challenges** is unchanged; it remains once per tab session with the existing exclusions.
- Collapsed Kenny now uses a small fixed button at the page edge, not a tall permanent floating panel. The head briefly peeks out for about **10 seconds per 120-second cycle** on a visible/focused page, then retreats to a narrow edge cue. The periodic peek is purely visual and **does not show a message or open the invitation**.
- Clicking Kenny manually still opens a game invitation if not played, or a brief friendly greeting after play. Dismissal and keyboard focus handling remain.
- Under `prefers-reduced-motion: reduce`, there is no oscillating peek motion; the small head remains statically visible.

## Build and tests performed

| Check | Observed result | Method / limitation |
|---|---|---|
| Generator build | **40 pages + 404**, success | `node tools/build.mjs`; see `build.log`. |
| Header search | **38 index entries, 159 verified phrases** | Generator output. |
| JavaScript syntax | Passed | `node --check public/assets/js/kenny-invitation.js`. |
| Baseline preservation | **271 of 275 baseline files unchanged**; 4 files modified; zero missing | Archive-entry hash/content comparison in `preservation_and_changes.json`. |
| Game and six PDF assets | Byte-for-byte unchanged | See `preservation_and_changes.json`. |
| Dark-mode computed style contrast sweep | **40 pages scanned; zero heuristic low-contrast flags** | Isolated browser rendering and `contrast_audit_heuristic.json`. A heuristic scan is **not** a WCAG compliance certification. |
| Mobile/desktop overflow | **76 isolated layout checks; zero detected issues** | All 40 routes rendered at dark 390px, plus selected pages at 320, 375, 390, 768, 1366 and 1440px in light/dark; see `responsive_static_qa.json`. |
| Selected dark article panels | Foreground/background computed ratios measured around **10.37:1 to 11.64:1** | Explicit computed-colour samples; `selected_css_qa.json`. Does not cover every text run or component state. |
| Kenny trigger/retreat/response | **Passed in isolated virtual-clock simulation** | Initial peek, retreat, 20-second invitation, dismissal, click reopen, greeting after play, 300-second completed-game check-in; see `kenny_isolated_timer_QA.json`. |
| Live Netlify preview, cross-tab storage and actual physical devices | **Not tested** | Require new same-origin Deploy Preview. |
| Screen reader / physical-device assistive technology | **Not tested** | Follow-up staging requirement. |
| Existing grey bottom broken-image rectangle | **Not conclusively identified** | Could not be reproduced from local source; must inspect live preview with browser DevTools and network diagnostics; do not hide with arbitrary CSS. |

## Visual evidence

- `tip_dark_fixed.png` — CSS-only isolated reference of the revised Cyber Tips panel; the missing decorative icon is an asset-loading limitation of the isolated renderer, not evidence of a new production defect.
- `account_steps_dark_fixed.png`, `account_takeaway_dark_fixed.png` — actual CSS-rendered dark article panels. They show the corrected readable headings, labels and paragraphs.
- `kenny_compact_dark.png`, `kenny_compact_light.png`, `kenny_resting_mobile.png` — cropped component screenshots illustrating the new button size and appearance, **not** full-page screenshots from Netlify.

## Required staging gate before production

1. Replace the source and `public/` output on the existing review branch **without deploying production**; generate a new Netlify Deploy Preview.
2. Revisit the exact dark-mode article components from the supplied screenshots: Cyber Tips; Account Security's story cards, account-access map and employee-exit steps; and browse other content pages for accidental low contrast.
3. Test Kenny at mobile/desktop, light/dark, 20-second invite, `Not now`, repeat manual peeks, post-game-only five-minute check-in, reload, back/forward, two tabs, blocked storage, keyboard and reduced-motion preference. Confirm the collapsed head does not cover article text or actionable controls.
4. Check all five Cyber Tips rotate and remain readable; confirm page performance, search, PDFs, game scoring and Self-Check results.
5. Investigate the previously reported grey broken-image-style strip using live-page DOM inspection, Network panel and Console before considering production release.
6. Have the senior game developer review integrated game behaviour and get separate owner authorisation for the production merge/deployment.

**Deployment status:** No GitHub push, PR merge or Netlify deployment performed by the implementation assistant.
