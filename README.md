# CyberSafe SME Nigeria

A free cybersecurity knowledge hub for Nigerian small and medium businesses: common threats, practical steps, a 16-point self-check, and the Nigerian organisations that handle cyber incidents.

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
