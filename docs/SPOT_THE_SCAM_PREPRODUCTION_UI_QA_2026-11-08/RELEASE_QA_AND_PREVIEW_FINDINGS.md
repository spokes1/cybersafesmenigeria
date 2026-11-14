# CyberSafe SME Nigeria — pre-production preview corrections

**Reference source:** `CyberSafe_SME_Nigeria_Spot_the_Scam_V5_1_Production_Candidate.zip` provided in this chat. The Netlify Deploy Preview content was checked using public page text; the current GitHub PR branch HEAD could not be independently fetched. **This ZIP is not deployed.**

## Implemented from owner review

1. **Desktop menu:** changed CSS from hamburger breakpoint 1239 px to 980 px. Header Self-Check CTA drops below 1181 px to leave room for the five navigation items. Tested 981, 1100, 1366, 1440.
2. **Cyber Tips:** one seven-second homepage timer updates the five original carousel slides and small hero photo tip together. Kept the original supplier bank-details tip as the first hero message. Explicit Pause/Resume, focus and controls-hover pause, hidden-tab pause, reduced-motion pause. The main carousel no longer freezes just because the pointer is resting over the reading text.
3. **Kenny:** compact peeking button on the right side of ordinary pages. Automatic invitation once after 20 seconds only on the previously targeted pages; Not now, Close, and automatic timeout return to peeking. Clicking Kenny before playing reopens the invitation; after the game has been started it opens a friendly greeting only. The 5-minute automatic check-in requires *completion of all five challenges*, counts foreground browsing even while the visitor quietly reads, and appears at most once per session. Game and sensitive page exclusions remain intact. No repeated unsolicited invitation loop.
4. **Visual contrast:** restrained navy/teal/blue fades at section edges and a softly tinted game card; the approved white reading cards and light theme remain. Kenny text uses an opaque white speech card for legibility.
5. **Security and privacy:** only local assets; no CSP relaxation, analytics, tracking of game answers, new dependencies or third-party credits.

## Unresolved reported grey preview strip

The uploaded screenshot shows a broad grey, broken-image-style rectangle over the bottom of the hero. **This exact overlay did not reproduce** in the isolated rendering of the generated source, and the source contains no `<iframe>`, `<embed>` or `<object>` that would produce it. Its origin is unverified. Possible preview/browser-injected elements must be checked in a fresh browser profile and using DevTools element inspection on the next Netlify Deploy Preview. Do not hide global iframe/image selectors: doing so could conceal a genuine external problem or break real content. Treat this as an **open staging-only visual gate**, not a verified fix. Netlify's preview-specific Drawer is one possible external overlay, not an established cause.

## Measured checks

| Acceptance item | Result | Evidence/limit |
|---|---|---|
| Generator build | PASS | 40 pages + 404; 38 search entries, 159 mapped phrases |
| All local JS syntax | PASS | `node --check` all `.js` modules |
| Internal routes & search destinations | PASS | Generator's built-in link validation |
| Header menu responsiveness | PASS (isolated browser) | 320, 375, 390, 768, 980 hamburger; 981, 1100, 1366, 1440 desktop menu |
| Header menu opens/closes | PASS (isolated browser) | All hamburger widths tested |
| Horizontal overflow | PASS (isolated browser) | 0px at nine viewport widths |
| Cyber Tips manual controls | PASS (isolated browser) | Next advances both hero and carousel; no JS errors |
| Tips seven-second timer | PASS (virtual clock) | 1 of 5 advanced to 2 of 5 after 7.5s |
| Tips pause + reduced motion | PASS (virtual clock) | Paused remains fixed; reduced-motion initial state remains fixed |
| Kenny peeker / replay invitation | PASS (isolated browser) | Click, Not now, reopen, close, Escape path in source |
| Kenny after-game manual greeting | PASS (isolated browser) | No new Play button after started game |
| Kenny 20-second invitation | PASS (virtual clock) | Actual production timer, see `kenny-real-timers-qa.log` |
| Kenny 300-second check-in | PASS (virtual clock) | Actual production timer, only once after `recordKennyGameCompleted()` |
| Six approved PDFs | PASS | Byte-identical SHA-256 comparisons |
| Game implementation assets | PASS | V5.1 game/scenario/script/style bytes unchanged |
| Photographs, search mappings and self-check data | PASS | Byte-identical SHA-256 comparisons |
| CSP headers | PASS (static) | `netlify.toml` byte-identical, script-src self |
| Live Netlify console/network checks | NOT RUN | Chromium browser blocked direct navigation |
| Real-origin sessionStorage and cross-page timing | NOT RUN | Requires newly deployed preview on Netlify |
| Screen readers and physical touch devices | NOT RUN | Actual device QA required |
| Reported grey bar | OPEN | Not reproduced in source rendering; must inspect on staging |

**Browser QA methodology:** Chromium was used with `page.set_content()` containing the actual generated homepage DOM, inline copies of local styles/images and corresponding JS. Navigation to both localhost and the Netlify preview URL was blocked by environment policy. The Kenny controller was bundled into the isolated harness and given a synthetic home pathname because the browser was on `about:blank`; stored runtime code in this ZIP was not modified for that harness. Time-dependent QA uses virtual browser clocks. These are meaningful component/layout checks, **not** proof of live-domain behaviour, CSP network application, Netlify injection, or session persistence across real navigation.

## Asset size change (bytes)

| File | Baseline | Updated | Delta |
|---|---:|---:|---:|
| `public/assets/css/site.css` | 261,301 | 262,551 | +1,250 |
| `public/assets/css/kenny-invitation.css` | 12,174 | 15,294 | +3,120 |
| `public/assets/js/site.js` | 16,158 | 16,842 | +684 |
| `public/assets/js/kenny-invitation.js` | 9,400 | 10,025 | +625 |
| `public/assets/js/kenny-bootstrap.js` | 1,315 | 1,267 | -48 |

## Staging release checklist

- [ ] Push the provided source **and** generated `public/` output to the same preview branch, after checking for other intervening commits.
- [ ] Open the new Deploy Preview in a fresh/private browser window. Identify the grey strip with DevTools Inspect; verify whether it is site DOM, Netlify Drawer or browser extension.
- [ ] At desktop 1100/1366 confirm menu visible, accessible keyboard dropdowns, header search and Self-Check CTA.
- [ ] On a real phone at 320–390 verify peeker doesn't obscure important controls; test close, Escape, focus and menu/search suppression.
- [ ] Clear session tab storage and verify first automatic game offer at approximately 20 seconds on the homepage; Not now leaves peeker, no repeat auto prompts.
- [ ] Complete all five scenarios, return to another page in the **same tab**, keep the tab visible/focused for five minutes; verify one greeting and no further automatic check-ins.
- [ ] Verify different tabs, reload/back navigation, hidden tabs, blocked sessionStorage, Search overlay, Self-Check and Incident Response exclusions.
- [ ] Confirm five rotating Cyber Tips, all game actions, six PDF downloads, About two-person team and no Audio Guide links.
- [ ] Senior game developer signs off gameplay and accessibility in the integrated Netlify preview.

**Release status:** Source build completed. Do not merge/publish to production until the open staging checks pass, especially the grey overlay and genuine same-origin sessionStorage behaviour. No Git push, merge, Netlify deployment, or production publication was performed here.
