# CyberSafe SME Nigeria: site update brief

## 1. Who you are and what this is

You are a senior front-end engineer with 15 years of experience, working on the production website for CyberSafe SME Nigeria, a free cybersecurity awareness site for Nigerian small businesses. Treat this as a release, not a draft. The work should look and feel like it came from an experienced design and engineering team: consistent, fast, accessible, and free of leftovers.

The site already exists in this repository and is hosted on Netlify. Your job is to bring the whole site up to the new design and to replace six pages with approved designs. Work in the project's source files. Use the live or preview URL for reference only.

## 2. What is in /_reference

- `pages/homepage-light-v3.html`: the approved homepage.
- `pages/password-security-v3.html`, `backup-and-recovery.html`, `business-wifi-security.html`, `sim-swap-fraud.html`, `whatsapp-hijacking.html`: the approved article pages.
- `assets/logo/`: the logo (white, transparent), the mark alone, and the favicon.
- `assets/photos/`: four approved photographs.

These files are the single source of truth for the design. Copy them faithfully. Do not reinterpret the layout, spacing, colours, icons or wording. Note that the reference pages contain the logo and photos as inline data, and a few styles repeated in each file. In production, move the logo and photos into real files, and move repeated CSS, icons and scripts into shared files.

## 3. Order of work

1. Inspect the repository first: framework, build command, templating, publish directory, existing routes, `netlify.toml`. Fit your work into the existing stack. Do not introduce a new framework or build tool.
2. Write a short plan in the pull request description before changing files.
3. Build the shared pieces: tokens and styles, icon sprite, header, footer, search, logo, favicon.
4. Replace the six approved pages.
5. Restyle every other existing page (section 7).
6. Run the editorial pass (section 9).
7. Run the checks (section 11) and write the report (section 12).

## 4. Design system

Light theme only. No automatic dark mode. Do not use large dark navy panels or backgrounds. Navy is for text.

- Colours: page background `#fbfdfe`; section tints `#f0f8f8` and `#eaf3fb`; cards `#ffffff`; text `#12304d`; muted text `#566b80`; borders `#dcebed`; soft teal `#e3f5f2`. Brand gradient `#0f766e` to `#14b8a6`. Supporting blue `#1d6fa5`, green `#15803d`. Orange `#e8590c` is only for risk and warnings.
- Type: Plus Jakarta Sans, weights 400 to 800. Headlines 800, tight tracking (-0.025em to -0.035em), line height 1.05 to 1.15. Body 17px at 1.65 to 1.7.
- Shape: cards 22px radius, large panels 26 to 32px, icon tiles 14 to 17px, pills fully round. Soft layered shadows. Gradient icon tiles with white 2px-stroke SVG icons. No emojis in the interface.
- Layout: content width 1160px on the homepage and hubs, reading column 720px on articles.
- Motion: gentle fade-up on scroll, 3 to 4px card lift on hover. Respect `prefers-reduced-motion`.
- Put shared CSS in one stylesheet, icons in one sprite, scripts in one file. No duplicated code across pages.

## 5. Shared header, footer and search (every page)

- Header: sticky, white. The logo image on the left (use `assets/logo/cybersafe-logo-white.png` as a CSS mask coloured with the text colour, so it renders navy on light pages). Five dropdown menus (Learn, Threats, Protect Your Business, Resources, About), a Search button, and the "Check Your Business Security" button. A mobile menu below 1120px. Highlight the current section.
- Reading progress bar under the header on article pages.
- Search: the panel in `homepage-light-v3.html` opens from the Search button, from the `/` key, and from Ctrl+K or Cmd+K, on every page. Keep its behaviour: suggested-search chips, arrow keys and Enter, Esc to close, synonym handling. Move the page list into `/assets/search-index.json` and load it with `fetch`. Every entry must point to a real, working route. Remove entries for pages that do not exist and add entries for pages that do.
- Footer: light. Columns for Explore, Resources, Company and Connect, plus the logo, the Go2Cyber credit, copyright for 2026, and the Privacy, Terms and Contact links. Keep the existing contact email and the existing Go2Cyber link and logo (with alt text) as they appear on the current site. Do not invent any other details.
- Favicon: `assets/logo/favicon.png`, plus an Apple touch icon. Create a 1200 by 630 Open Graph image using the logo on a light teal gradient.

## 6. The six approved pages

Replace the content and markup of the existing pages at these routes with the approved versions. Do not leave duplicates.

| Reference file | Route |
|---|---|
| homepage-light-v3.html | `/` |
| password-security-v3.html | `/learn/password-security` |
| business-wifi-security.html | `/learn/business-wifi` (keep the existing route) |
| backup-and-recovery.html | `/learn/backup-and-recovery` |
| sim-swap-fraud.html | `/threats/sim-swap-fraud` |
| whatsapp-hijacking.html | `/threats/whatsapp-hijacking` |

Correct any link in the reference files that does not match a real route on this site. Links from "Keep learning" cards must work.

## 7. Every other page: keep the content, change the look

For each remaining page (hubs, Learn, Threats, Protect Your Business, Resources, About, Contact, Privacy, Terms, the 404 page and any guides):

- Keep the URL, the wording, the page title and meta description, the headings and every existing link. Do not rewrite, shorten or add content.
- Apply the shared header, footer, search and styles.
- Rebuild the layout using the components in the reference pages: hero with pill label, large heading and lead text; icon cards; numbered step cards for sequences; callout and note boxes; the checklist component where a page already has a checklist.
- Keep the existing functionality (for example, the security self-check and its 16 items). Do not change how it works or what it concludes.
- Do not add photographs or empty photo frames to these pages. Only the homepage uses the four approved photos for now.
- Hub pages should use the same card grids as the homepage sections. List pages should keep the same items in the same order.
- If a page's structure does not fit a component cleanly, choose the closest one and flag it in the report. Do not drop content to make it fit.

## 8. Photographs

Use these in the homepage, and nowhere else for now:

- `hero-shop-owner.webp`: hero, 4:5.
- `made-for-nigeria.webp`: "Made for Nigeria" section, 3:2.
- `phishing-guide.webp`: featured phishing guide card, 2:1.
- `about-team.webp`: About section, 780:470.

Use `<img>` with width, height, `object-fit: cover` and the alt text already written in the reference homepage. Load the hero image eagerly with high fetch priority and everything else lazily. If a photo is later replaced by a larger one, keep the filename and aspect ratio. Do not generate, insert or invent other photographs.

## 9. Editorial pass

Read every word on every page. The goal is writing that reads like a person who knows small business wrote it, in plain British English (organisation, authorised, recognise).

- Keep the meaning, facts and links. Do not add claims, statistics, quotes, testimonials, awards or partnerships.
- Leave the approved reference pages alone except for typos and clear errors. Apply the full pass to every other page.
- Cut filler and stock phrases: "in today's digital age", "in an ever-evolving landscape", "it is important to note", "delve", "navigate", "robust", "seamless", "leverage", "unlock", "empower", "holistic", "cutting-edge", "game-changer", "peace of mind", "ultimately", "furthermore", "moreover".
- Avoid the patterns that make text feel machine-written: "not just X, but Y" repeated; every list having exactly three items; every section ending on a neat one-line moral; stacks of adjectives; rhetorical questions as openers; bold lead-ins on every bullet; the same sentence length throughout.
- Do not use em dashes in body copy. Use a full stop, a comma or a colon.
- Prefer concrete detail over general statements: a named situation, a number the owner can act on, a clear next step.
- Short sentences are fine. Vary the rhythm. Explain any technical term the first time it appears.
- Do not use automated AI-detection tools as the standard. They are unreliable. The standard is whether a careful human editor would be happy to publish it.
- Record each page you edited and the lines you changed in `EDITORIAL-REPORT.md`.

## 10. Site-wide fixes

- Remove every mention of "Trojan Kings" and "GCAP Team 7" from the entire project: pages, footers, About and Team pages, meta tags, structured data, alt text, comments and config. Search the whole repository to confirm none remain.
- Replace the three footer links whose visible text is a path such as "/about/contact" with properly labelled links, or remove them.
- Set the copyright year to 2026.
- Keep duplicate-topic pages (for example `/learn/phishing-guide` and `/threats/phishing`) as they are, but add visible "Related" links between them and list the pairs in the report.
- Source links in the approved pages (for example the Guardian Nigeria and TheCable reports) are not linked yet because the originals were not verified. Do not add links you cannot confirm. List them in the report.
- `netlify.toml`: keep what is there and add, rather than overwrite. Allow the Google Fonts hosts. Add sensible security headers and long cache headers for `/assets/*`.
- Delete `/_reference` from the published output when you finish, or confirm it is outside the publish directory. It must not be reachable on the live site.

## 11. Checks before you finish

- Every internal link and every search result resolves. No 404s, no console errors.
- Pages look correct at 375px, 768px and 1280px. No horizontal scrolling.
- Header dropdowns, mobile menu, search (button, `/` key and Ctrl+K), checklists and the security self-check all work.
- Light theme only. No dark navy panels. Text contrast meets WCAG AA.
- One H1 per page. Visible focus states. Touch targets at least 44px. Descriptive alt text on informative images.
- Every page has its own title, meta description, canonical URL, Open Graph and Twitter tags (`summary_large_image`).
- Lighthouse on mobile for the homepage and two article pages: aim for 90 or higher in all four categories.
- A project-wide search finds no "Trojan Kings" and no "GCAP".

## 12. Report

In the pull request description, list:

1. Pages replaced with approved designs.
2. Pages restyled, and any that needed a judgement call.
3. Links, sources, claims or details that could not be verified.
4. The related-page pairs you linked.
5. Anything you skipped or could not do, and why.
6. Which checks you actually ran. Do not claim a check you did not run.
