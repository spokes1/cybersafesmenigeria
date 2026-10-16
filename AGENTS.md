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
| `public/assets/css/site.css`, `js/site.js`, `icons.svg` | The single stylesheet, script and icon sprite |
| `public/assets/photos`, `icons`, `logo` | Image files |

## Design rules

- Light theme only. There is no dark mode. Do not add large dark navy panels.
- Colours, type and spacing come from the variables at the top of `site.css`. Use them.
- Icons are the 2px line icons in `public/assets/icons.svg`. The coloured threat and pillar icons are PNGs in `public/assets/icons/`. No emojis in the interface.
- Orange is for risk and warnings, plus the cyber tips card. Do not use it as decoration.
- Do not add a hero search bar. Search lives in the header only (button, `/` key, Ctrl+K).

## Content rules

- British English. Plain language for small-business owners.
- No em dashes in body copy.
- Do not invent statistics, quotes, incidents, testimonials, awards or partnerships.
- Do not link a source you have not checked. Unverified sources stay as plain text.
- Do not credit any individual or group as the builder of the site. The footer credit is Go2Cyber only.
- The security self-check keeps its 16 items and the storage key `cybersafe.checklist.v1`.

## Adding a page

1. Add the content to the right module in `tools/content/` (or an approved fragment).
2. Register the route in `tools/build.mjs`.
3. Add it to `tools/content/search.mjs` and, if it belongs in a menu, `nav.mjs`.
4. Run `node tools/build.mjs` and commit `tools/` and `public/` together.

## Third-party links

NITDA, NDPC, CBN, ngCERT, EFCC, NCC, HaveIBeenPwned, Bitwarden, VirusTotal and Authy point at real organisations and tools. Do not change them without a reason.
