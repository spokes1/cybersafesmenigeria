# CyberSafe SME Nigeria — integrated games and Kenny

Delivery date: 12 November 2026 (Africa/Lagos).

## Result

The supplied 9 November light/dark website repository now contains the approved two-activity game and compact Kenny companion 2.1. The real website shell, responsive navigation, search, 15-question Self-Check, six downloads and educational pages are retained. The source generator still emits 40 pages plus 404 with 38 searchable entries and 159 verified visitor phrases.

The original Netlify website and the user's GitHub repository have not been modified remotely. The full ZIP includes both editable source and rebuilt `public/`, ready for the existing repository/deployment workflow. A separate owner-private Sites copy is only an integration review and file-download surface.

## Game and links

- Existing canonical URL: `/learn/spot-the-scam`.
- Welcome → two-activity selector → introduction/goals → decisions → feedback → results/learning.
- Spot the Scam: original five scenario facts, exact answer data and 0–5 scoring preserved. Scenario hash is checked against the approved original fixture.
- The Shop Laptop Is Locked: owner-approved three-step printing-business mission, specific unsafe-answer explanations and guided retries. First-attempt results are separate from guided recovery.
- Final character: delivered animated Kenny GLB, full-body blinking guidance artwork, motion controls, clear reactions and completion celebration. Game-only lazy WebGL with coloured fallbacks; no live WebGL on article pages.
- Reciprocal navigation: homepage practice button, Learn card, Learn/Protect menus, search and existing scam-article calls to action.
- Ransomware article links directly to `/learn/spot-the-scam?activity=ransom`. Feedback/recaps link to the real ransomware and backup articles.
- All five original learning destinations are retained. Full-guide links open a separate tab to preserve the current attempt. Results and game navigation provide Home and a validated same-origin return-to-reading route.

## Companion and page notices

- Silent; no voice pack or audio functionality.
- Initial invitation after 30 foreground seconds, eligible only when the visitor is not in a protected interaction. Invitation reading time is seven seconds after entrance.
- Later automatic messages rotate the ten supplied cyber tips. Tips stay for six reading seconds; hover, keyboard focus and text selection extend reading time. First subsequent-tip eligibility is three foreground minutes, with a five-minute minimum gap after tips.
- Close/ignore → functional retreat to a small visible edge; accessible clickable target retained. The supplied six frames show reach, touch, grip, half-blink, closed eyes and curiosity.
- Completing either real activity changes subsequent manual/automatic interactions to tips. Clicking Play does not count as completion.
- Completion, visit timing, notices and return context are in same-origin session storage; no localStorage completion. Memory fallback handles restricted storage. No answers/scores are sent to a server.
- Mission, Team and Contact are eligible for the agreed message after 10 visible seconds, once per page per tab/session: “We’re continually improving CyberSafe SME Nigeria to make our guidance and resources more useful for your business.”
- A pending page notice postpones ordinary automatic invitations. It uses the same bubble, with no game CTA, eight seconds of reading time and a 12-second post-notice quiet gap. This can defer the normal invitation slightly beyond its 30-second eligibility. There are no overlapping Kenny panels.
- Search, visible dialogs, mobile navigation, focused form controls and explicit busy markers defer automatic messages. Game, Self-Check, urgent response/contact-directory pages and 404 suppress the companion. Contact itself is enrolled for the requested notice.
- Browser history restoration re-reads same-tab completion; page timing does not jump after hidden tabs resume.

## Runtime retirement and maintenance

Removed the old invitation markup source and obsolete game/invitation CSS/JS from active output. Historical docs/screenshots are preserved as historical evidence. Current source is under `tools/assets/kenny-game/`, `tools/assets/kenny-companion/`, `tools/assets/kenny-session.js`, `tools/assets/kenny-website.js` and the game body fragment. Build replaces its owned output directories deterministically.

Game CSS is scoped to `.cs-game`, with its dedicated dark palette isolated from both host themes. The companion's shadow stylesheet supports the host's system light/dark preference. Main typography, branding, header search and footer are retained. Netlify CSP retains strict self-hosted script execution and permits only the local Blob transport needed by embedded GLB textures.

## Bug fixes and compatibility corrections

1. Fixed search result classification: About pages and section landing pages were incorrectly labelled Learn. They now display their real sections.
2. Fixed return-to-reading resolution: an empty stored destination was being treated as the homepage, and stale stored context could override the current article. Fresh same-origin referrers now take priority, followed by validated session context and the Learn fallback. Empty, cross-origin, asset and game-self destinations are rejected.
3. Removed stale game/theme overrides and old invitation entry points so there is one current runtime.
4. Kept the validated texture transport/material guard: partial texture failure produces coloured fallback artwork rather than an untextured white model.
5. Replaced the main game CTA's font-dependent diagonal arrow with an SVG so missing font glyphs cannot display an empty square.

## Verification actually performed

- Clean supplied baseline build passed before changes.
- Updated build passed, including every generated internal route and 159 search phrases.
- 12 gameplay state paths passed, including 0–5 totals, multi-select limits, recovery, replay and unchanged approved scenario data.
- All 49 supplied companion tests passed against current source, plus three session/page-notice tests.
- 12 animation clips and 60 sampled rig poses checked; 240 camera-framing calculations passed. Actual Chromium WebGL also loaded the textured model under the repository CSP.
- Texture regression reproduced the earlier blocked-Blob failure, verified material maps/sRGB after correction and rejected missing maps.
- Static checks verified source/output parity, retired-file absence, module dependencies, no duplicated HTML IDs, and byte preservation of all six PDFs, self-check data, brand images and existing photos.
- Real Chromium crawl loaded all 40 generated pages with one website header/footer and no desktop horizontal overflow or legacy Kenny widget.
- Browser flows passed every Spot the Scam total (0–5), direct ransomware entry, guided recovery (2/3 first-attempt decisions), article links, return navigation and real completion storage.
- Light/dark game layouts passed at 320, 390 and 768 px. Mobile menu and search worked; the Self-Check retained 15 distinct questions and six PDFs remained present.
- Browser virtual foreground timers verified the 30-second invitation, ignored invitation retreat, edge-click reopening and Play without false completion.
- All three About-page notices appeared after 10 visible seconds, stayed once per page/session across reload, and deferred while search was open.
- Browser suite finished without page JavaScript errors or failed same-origin asset requests. Screenshots and `browser-report.json` accompany this report.

## Limits and rollout

Tests used Linux Chromium and software WebGL, including mobile-sized viewports. They are not physical Android/iOS, Safari, Firefox or screen-reader acceptance tests. Google Fonts was replaced by an empty CSS response during local QA because the environment browser did not trust that endpoint certificate; production font URLs were not changed. The private review's font rendering/Netlify header handling may differ from production.

The local server applies Netlify headers and simulates configured redirects. A real Netlify Deploy Preview should still receive the normal hosted check before replacing production. Keep the supplied original repository ZIP/previous deployed commit as the rollback baseline. Deploy `public/` with this repository's `netlify.toml`; do not deploy the old standalone review or write over a newer branch without comparing it first.
