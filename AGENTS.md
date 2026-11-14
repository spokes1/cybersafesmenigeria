# AGENTS.md

Notes for anyone (person or AI agent) changing this site. Read this before editing.

## How the site is built

CyberSafe SME Nigeria is a static site, but the pages in `public/` are **generated**.
Do not edit `public/**/*.html` by hand: the next build overwrites it.

- Source of truth: `tools/` (the generator and all page content).
- Output: `public/`, committed to the repository. Netlify publishes `public/` as it is (see `netlify.toml`). There is no build step on Netlify.
- To rebuild after any change to `tools/`:

```bash
node tools/build.mjs
```

The build fails, on purpose, if any internal link, navigation entry, footer link or search result points at a page that does not exist.

## Where things live

| Path | What it holds |
|---|---|
| `tools/build.mjs` | Page list, routes, titles, meta descriptions, link checks, sitemap, robots |
| `tools/lib/layout.mjs` | Header, footer, search panel and the page shell (meta tags, Open Graph) |
| `tools/lib/components.mjs`, `prose.mjs`, `icons.mjs` | Reusable page pieces |
| `tools/content/nav.mjs` | Site name, email, menus, footer columns |
| `tools/content/search.mjs` | The search index (title, section, url, keywords, summary) |
| `tools/content/learn.mjs`, `threats.mjs`, `protect.mjs`, `resources.mjs`, `about.mjs` | Page content |
| `tools/content/approved/` | The six approved designs and the homepage, as body fragments |
| `public/assets/css/site.css`, `tools/assets/theme.css` → `public/assets/css/theme.css`, `public/assets/js/site.js`, `public/assets/icons.svg` | Static base CSS, generated shared light/dark theme, JavaScript and icon sprite |
| `public/assets/photos`, `icons`, `logo` | Image files |

## Design rules

- The original transparent brand PNG is uniformly white in dark mode and teal in light mode. Do not add a backing tile. This is separate from the colourful article icon tiles.
- Every published topic has one menu home. Keep `tools/content/nav.mjs`, page sections, search and footer ownership consistent; the build validates this. Related reading may cross sections when labelled correctly.

- Default light theme with a restrained teal/blue gradient treatment. The optional automatic dark appearance follows `prefers-color-scheme: dark` in `public/assets/css/theme.css`. Do not introduce heavy dark panels into the default light theme.
- Colours, type and spacing come from the variables at the top of `site.css`. Use them.
- Icons are the 2px line icons in `public/assets/icons.svg`. The coloured threat and pillar icons are PNGs in `public/assets/icons/`. No emojis in the interface.
- Orange is for risk and warnings, plus the cyber tips card. Do not use it as decoration.
- Do not add a hero search bar. Search lives in the header only (button, `/` key, Ctrl+K).

## Content rules

- The owner-approved visitor presentation uses descriptive link text, compact shared Keep learning cards and no decorative section/card/list numbering. `tools/lib/editorial.mjs` applies this during build; external labels live in `tools/content/link-labels.mjs`. Preserve real destinations, factual numbers, functional progress/scores, interaction IDs and the approved PDF data. Keep primary actions separate from related-guide cards.

- British English. Plain language for small-business owners.
- No em dashes in body copy.
- Do not invent statistics, quotes, incidents, testimonials, awards or partnerships.
- Do not link a source you have not checked. Unverified sources stay as plain text.
- Do not add a third-party powered-by, sponsor, developer or partnership credit. Keep only the CyberSafe SME Nigeria brand in the footer and site identity.
- The approved 8 November 2026 release supersedes the old 16-item form. The Security Self-Check now contains 15 canonical questions in `tools/content/selfcheck-v2.json`, uses `cybersafe.selfcheck.v2` and leaves old v1 browser entries untouched. Six PDF downloads must be maintained with the same approved source data.

## Adding a page

1. Add the content to the right module in `tools/content/` (or an approved fragment).
2. Register the route in `tools/build.mjs`.
3. Add it to `tools/content/search.mjs` and, if it belongs in a menu, `nav.mjs`.
4. Run `node tools/build.mjs` and commit `tools/` and `public/` together.

## Third-party links

NITDA, NDPC, CBN, ngCERT, EFCC, NCC, HaveIBeenPwned, Bitwarden, VirusTotal and Authy point at real organisations and tools. Do not change them without a reason.

## Current Kenny/game source (12 November 2026)

The owner-approved game uses a dedicated dark presentation in both host themes. Scope game CSS under `.cs-game`; preserve the actual site header/footer. Source runtime is in `tools/assets/kenny-game/`, `tools/assets/kenny-companion/`, `tools/assets/kenny-session.js` and `tools/assets/kenny-website.js`. Build copies these to public assets and retires the old runtime. Keep `/learn/spot-the-scam` as the existing canonical game entry.

Its public area name is Cyber Practice, under Learn only. Motion controls are mobile-only using device identity rather than viewport width; desktop animation defaults on and still respects system reduced motion. Preserve mobile Pause/Resume and data-saving support.

The five original questions/answers and 0–5 scoring remain approved. The separate three-step ransomware mission tracks first-attempt decisions independently of guided recovery. Mark session completion only after results. No audio, accounts, analytics or persistent completion history. First invitation is 30 foreground seconds. The combined `/about` notice is once per session across its Mission/Team/Contact sections, eligible after 10 visible seconds with interaction suppression and priority over invitations. Use the real article links and validated same-origin return navigation.

Embedded model textures require local blob image/fetch permission. Preserve `script-src 'self'`; no CDN or inline game scripts. Site-wide companion uses supplied WebP frames, not WebGL. Existing historical QA documents describe their original versions, not the current release; see the dated integration report for current evidence.

## About and example selectors (14 November 2026)

- `/about` is the single canonical About page, with `#mission`, `#team` and `#contact`. Old subpages are redirect shells plus Netlify 301 rules, excluded from sitemap/search. Keep menu, footer, search and Kenny notice scope consistent.
- Team roles are Coker Kehinde, Founder & Project Lead; Collins Eyetu, Content & Design. Do not invent biographies or portraits. Both original portraits are now supplied in `pics.zip` and used at `/assets/photos/coker-kehinde.png` and `/assets/photos/collins-eyetu.jpg`. Preserve their identity and correct name mapping.
- Kenny’s decorative one-pixel `.edge` element was removed after owner review. Keep the peeker and its accessible focus indicator; do not restore the decorative line.
- `tools/assets/example-reveal.js` owns the twelve example/guidance selector groups. One detail is visible after an explicit choice (or valid deep link); no detail is selected initially. Keep approved text readable with JavaScript off and all details visible when printing. Viewed markers mean opened during this page only, without analytics or persistence. Ransomware keeps all choices accessible while revealing the selected card's body.

## Production domain (14 November 2026)

- Primary origin is `https://www.cybersafesme.org`, including `www`. `tools/content/site-config.json` is shared by the site and PDF generators. Keep canonical/share URLs, sitemap, robots and PDF footers/URI links in sync. Internal relative links retain same-origin navigation in reviews and production.
- The Our Team introduction says “a small team”; do not restore “a small Nigerian team”. Country-specific educational content and brand remain unchanged.
- Domain updates authorise PDF regeneration, not question/content changes. `tests/domain-pdfs.py` checks all nine pages against approved text and validates URI targets and bounds. The PDF digests were refreshed only after this content-preservation check.
- Existing contact email remains `hello@cybersafesmenigeria.ng`; a new website domain does not establish a replacement mailbox. Netlify hostname redirects are prepared in `netlify.toml`; DNS, TLS and primary-domain settings require production hosting configuration outside this source update.
