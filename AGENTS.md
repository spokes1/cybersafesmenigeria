# AGENTS.md

## Project architecture

This is a static, single-page site with no build step. Netlify publishes the `public/` directory as-is (configured in `netlify.toml`).

- `public/index.html` — the entire site: markup, embedded `<style>` CSS, and embedded `<script>` JS (scroll animations, nav behavior, etc.) all live in this one file.
- `public/audio_file.mp4` — an audio guide referenced by an `<audio>` element in the "Listen to Our Audio Guide" section.

## Coding conventions

- Styling uses CSS custom properties defined in `:root` (colors, shadows, transitions) rather than a framework or preprocessor.
- Section IDs (e.g. `#audio`, section anchors in the nav) are used for in-page smooth-scroll navigation — keep IDs stable if restructuring sections.

## Non-obvious decisions

- The site intentionally has no JS framework, bundler, or package dependencies — everything needed to render the page is inline in `index.html`, so there is nothing to install or build.
- External links (NITDA, NDPC, CBN, CERT, HaveIBeenPwned, Bitwarden, VirusTotal, Authy) point to real third-party regulatory/tool sites and should not be altered without reason.
