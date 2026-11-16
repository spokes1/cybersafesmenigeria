# CyberSafe SME Nigeria

A free cybersecurity knowledge hub for Nigerian small and medium businesses: common threats, practical steps, a 15-question self-check, and the Nigerian organisations that handle cyber incidents.

## What is in this repository

- `public/`: the generated site that Netlify publishes.
- `tools/`: the generator and all page content. Plain Node.js, no dependencies.
- `AGENTS.md`: architecture, design rules and content rules. Read it before changing anything.

## Working on the site

Edit the content in `tools/`, then rebuild:

```bash
node tools/build.mjs
```

The build regenerates every page in `public/`, rewrites `sitemap.xml` and the search index, and stops with an error if any link points at a missing page. To preview locally:

```bash
npx serve public
```

Commit `tools/` and `public/` together.

## Hosting

Netlify publishes `public/` as it is. `netlify.toml` sets the publish directory, security headers and image caching.

## Appearance

The latest compact Keep learning cards, named links and presentation-numbering removal are documented in [the editorial update report](docs/EDITORIAL_UPDATE_2026-11-12/EDITORIAL_UPDATE_REPORT.md). The generator applies `tools/lib/editorial.mjs` before emitting visitor-facing HTML.

The approved appearance is light with subtle teal/blue background accents. Devices requesting dark colour schemes receive an accessible slate/teal variant through CSS `prefers-color-scheme: dark` in `public/assets/css/theme.css`. No JavaScript or visitor-tracking theme toggle is required. Keep light and dark screenshots in the QA package when changing layouts.

The latest Cyber Practice naming, topic ownership, transparent branding and mobile motion controls are documented in [the navigation update report](docs/NAVIGATION_UPDATE_2026-11-12/NAVIGATION_UPDATE_REPORT.md). The [theme consistency report](docs/THEME_CONSISTENCY_2026-11-12/THEME_CONSISTENCY_REPORT.md) and [earlier theme QA report](docs/THEME_QA_2026-11-12/THEME_QA_REPORT.md) retain historical evidence; the later transparent-logo request supersedes the former brand backing. Edit `tools/assets/theme.css` and rebuild so source and output stay aligned.

## Kenny integration — 12 November 2026

The current two-activity game lives at `/learn/spot-the-scam`. Its source assets are in `tools/assets/kenny-game/`, the compact companion is in `tools/assets/kenny-companion/`, and site session/scheduler code is in `tools/assets/kenny-session.js` and `tools/assets/kenny-website.js`. The generator copies these to `public/assets/` and removes the old V5.1 game/invitation runtime. Edit the source and rebuild; do not patch generated pages.

Kenny invites after 30 foreground seconds and completion is tab/session-only. Mission, Team and Contact show a once-per-page/session continuous-development notice after 10 visible seconds, deferred during important interactions. The notice takes priority over ordinary invitations. Keep companion WebP assets lightweight on article pages; the 3D model loads only inside the game.

Read `docs/KENNY_INTEGRATION_2026-11-12/INTEGRATION_REPORT.md` for changes, routes, validation and limits. The Netlify publish folder remains `public/`. This delivery has not been pushed to your GitHub repository or deployed to your Netlify website.

### Checks

Use Node.js 22 or later for source/module tests:

```
node tools/build.mjs
node tests/game-logic.mjs
node --test tests/companion-v21/*.test.mjs tests/session-and-notice.test.mjs
node tests/model-check.mjs
node tests/texture-check.mjs
node tests/static-integration.mjs
```

For the optional Chromium integration suite, use a Python environment with Playwright and a local Chromium executable. In one terminal run `python tests/serve.py`; in another run `python tests/browser-integration.py`. The local QA server applies the repository's Netlify headers. Native Netlify redirect/hosting behavior still needs its normal deployment-preview check.

## Latest About and example update (14 November 2026)

See [the release report](docs/ABOUT_EXAMPLES_UPDATE_2026-11-14/ABOUT_EXAMPLES_UPDATE_REPORT.md). About is one page with Mission, Team and Contact sections. Legacy URLs redirect, and comparable example selectors share one click-to-reveal interaction. Build and runtime remain dependency-free. The optional DOM regression suite uses LinkeDOM; its setup command is at the top of `tests/about-and-examples.test.mjs`.

## Team portraits and Kenny edge line (14 November 2026)

Both owner-supplied team portraits are now included, and Kenny's decorative one-pixel edge line has been removed. See the [current portrait/edge report](docs/PORTRAIT_EDGE_UPDATE_2026-11-14/PORTRAIT_EDGE_UPDATE_REPORT.md), which supersedes the earlier pending-photo note.

## Production address

The primary website address is **https://www.cybersafesme.org**. It is configured in `tools/content/site-config.json`, shared by the website and downloadable PDFs. Run `python tools/generate_downloads.py` followed by `node tools/build.mjs` after an address change. The production-domain report is [here](docs/DOMAIN_UPDATE_2026-11-14/DOMAIN_UPDATE_REPORT.md).

Netlify redirects from the bare domain and former Netlify hostname are prepared in `netlify.toml`. Add/verify `www.cybersafesme.org` in the production site's Netlify domain settings, make it the primary domain, and apply the DNS records Netlify supplies for that specific site; complete TLS provisioning before rollout. This repository update does not change DNS or the Netlify account. The owner-private Sites review remains at its existing review URL. Contact email is now learn@cybersafesme.org.

## Homepage and interaction cleanup (15 November 2026)

Contact email is `learn@cybersafesme.org`. The Privacy Policy is retired to About, homepage topic cards use compact icon tiles, repeated disclaimer/social-status blocks are removed, and thirteen information selectors reveal details on request. See [the cleanup report](docs/CLEANUP_UPDATE_2026-11-15/CLEANUP_UPDATE_REPORT.md).

## Game, typography and PDF branding (16 November 2026)

See [the current update report](docs/GAME_FONT_PDF_UPDATE_2026-11-16/GAME_FONT_PDF_UPDATE_REPORT.md). Animation replay controls are removed; first-attempt correct answers get positive feedback. Optional ligatures are disabled across pages, game controls and Kenny's shadow UI. All six PDFs now use the original full logo PNG without duplicate typeset branding, preserving approved body content and links. The release passed 104 automated tests, 12 gameplay paths and PDF/font checks; browser visual QA was unavailable.
