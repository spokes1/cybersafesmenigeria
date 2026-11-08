# Spot the Scam V5.1: five-minute post-game check-in release adjustment

Date: 8 November 2026. Source baseline: `CyberSafe_SME_Nigeria_Spot_the_Scam_V5_1_Integrated_Review.zip`.

## Owner-approved adjustment

- Retired the unsolicited seven-minute site-browsing check-in. Visitors who have **not completed** the five game challenges do not qualify for the check-in.
- The game records `played` when the first challenge begins (unchanged, for avoiding repeat game invitations). It now additionally records `completed` only on the normal transition from the fifth challenge to the results screen.
- After game completion, Kenny offers **one** greeting-only check-in after **300,000 ms (five minutes) of active, visible, focused browsing** on eligible non-sensitive pages. It does not interrupt active game play; it has no game-answer tracking or server communication.
- `globalActiveMs` starts from zero at first completion. Once shown, `checkinShown` suppresses repeats for the browser-tab session. Previously stored session records lacking `completed` are treated as not completed, so they cannot cause unsolicited check-ins. Game invitations on the existing targeted pages are unchanged.
- All existing suppression conditions remain, including search, mobile navigation, forms, self-check, incident-response, game route and sensitive pages. No CSP change.

## Changed production files

1. `public/assets/js/kenny-session.js` — add persisted `completed` marker and game-completion event; set five-minute default.
2. `public/assets/js/spot-the-scam-game.js` — record completion at results transition, not mere game launch.
3. `public/assets/js/kenny-invitation.js` — require `completed` to count or display the check-in.
4. `public/assets/js/kenny-bootstrap.js` — set five-minute check-in and update explanatory comment.

These JavaScript assets are local/static production assets, not generated page HTML. No changes were made to article source, generator, CSS, navigation, content or game scenarios. `node tools/build.mjs` regenerated public HTML from `tools/`.

## Verification performed

- `node tools/build.mjs`: PASS; 40 pages plus 404; 38 search index entries; 159 resolving search phrases.
- `node --check` on all four modified JS files: PASS.
- Comparison against prior approved integration ZIP: only four production JS files changed (before this QA document was added); no files removed.
- Static code inspection: five-minute threshold and `completed` gate present; unchanged `script-src 'self'` policy and targeted invitation route list.

## Still required on a real staging browser

Confirm end-to-end completion, result navigation, idle/hidden-tab timing, exactly-once greeting, no greeting for unopened/abandoned game, sessionStorage blocked/available, two-tab isolation, search/modal suppression, and mobile interaction. Those are **NOT marked PASS**. The earlier integrated-build browser-navigation restriction still applies. Senior game developer has not been independently contacted or signed off through this tool environment.

**Release status:** owner-approved behavioural adjustment, build ready for staging review. This file does not assert a production deployment or successful staging QA. No GitHub/Netlify push was performed.
