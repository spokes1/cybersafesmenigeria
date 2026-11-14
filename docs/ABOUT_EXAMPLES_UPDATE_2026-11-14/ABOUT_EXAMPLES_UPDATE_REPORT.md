# CyberSafe SME Nigeria: About and example interactions

Release: 14 November 2026 (Africa/Lagos). Prepared for the existing owner-private Sites review. The main Netlify website and the owner's external Git repository are unchanged.

## What changed

- One canonical `/about` page contains Mission, Team and Contact. Existing mission paragraphs and contact guidance are retained. Its header is a direct About link, with section shortcuts in the page and footer.
- Team cards show **Coker Kehinde — Founder & Project Lead** and **Collins Eyetu — Content & Design**. No biography was invented.
- Legacy `/about/mission`, `/about/team` and `/about/contact`, including trailing slashes, have Netlify 301 rules. Static review hosts receive small immediate meta-refresh documents with a manual link to the correct new section. These shells do not duplicate About content or mount Kenny. The sitemap and search index contain only canonical About content.
- Kenny's development notice is now scoped to `/about`, once per browser-tab session across its sections. It remains eligible at 10 visible seconds, defers during text input or overlays, and does not consume the 30-second game invitation. Completion remains session-only.
- Twelve example/guidance selectors use `tools/assets/example-reveal.js`. All choices remain visible. Details start hidden until a choice is made, unless the visitor follows a valid detail deep link. Selection reveals one detail beneath the choices and replaces the previous one.
- A Viewed badge means the topic was opened during this page visit. It does not measure reading or learning, transmit events, or persist browsing history.
- Existing direct anchors remain usable; arrow/Home/End keys move among choices, and links also accept Space. Controls expose expanded state and their panel relationships. A polite announcement identifies the opened topic.
- All approved guidance remains in the HTML. Without JavaScript, details stay readable. Print CSS reveals all details, including previously unselected ones. Ransomware retains each card's topic and button while revealing only the selected card's detail body.
- Dark selected states use dark teal, light text and a clear border. Inactive, hover, focus and Viewed states also have explicit colours. Light mode retains its light selected treatment. Example heading prefixes are removed without changing anchor IDs or factual numbers.
- A first-child heading-anchor edge case in the existing editorial normaliser was corrected. Related-section heading IDs survive normalisation.

## Covered selectors

| Page | Choices |
| --- | ---: |
| Phishing guide | 4 |
| Social Engineering | 3 |
| Malware | 4 |
| Business Email Compromise | 2 |
| Social Media Security | 2 |
| Tools | 4 |
| Cybersecurity Basics | 5 |
| Device Security | 6 |
| Cybersecurity Organisations | 5 |
| Incident Response | 4 |
| WhatsApp Security | 3 |
| Ransomware | 4 |

Total: 12 selectors, 46 choices. Permanent informational grids, related-guide cards and step-by-step diagrams retain their appropriate existing behaviour. Incident Response's print action is preserved.

## Verification performed for this release

- Build: 37 canonical pages plus 404, three legacy redirect shells, 36 search entries and 159 validated visitor phrases.
- Independent HTML audit: all 41 generated HTML files; unique IDs, accessible references, meaningful link labels, no presentation numbering, and destination retention except the owner-approved About consolidation.
- 32 DOM integration tests against generated HTML: all 46 choices, initially unselected state, single detail visibility, retained content, Viewed history, repeat selection, keyboard navigation, direct hashes, About structure, redirect metadata, search/sitemap exclusion, full-site anchors, timing/session/hidden-tab/input deferral and declared contrast pairs.
- 61 existing editorial, navigation/device and Kenny companion/session unit tests.
- 12 gameplay paths: unchanged scenario data, scores, recovery, replay and lesson returns.
- Source/output parity and preserved asset digests: PDFs, canonical Self-Check data, original logo and game media retained.
- JavaScript syntax check for 27 files and Git whitespace check.
- The five declared interactive text/background pairs have contrast ratios of 6.85, 9.81, 8.66, 7.87 and 9.37 to 1. These are colour-pair calculations, not a claim of full rendered-page WCAG compliance.

The new suite is `tests/about-and-examples.test.mjs`. It requires LinkeDOM for DOM testing only; the website's build/runtime need no added package. Setup and execution commands are at the top of that file. Timing tests execute the actual website-notice source with a controlled clock and isolated page/session state.

### Verification limits

The supported browser-control tool is unavailable in this managed session. No preview server, browser, new screenshots, mobile rendering sweep or physical-device validation was run for this release. The Sites skill states: “If `cua_repl.js` is unavailable, skip browser QA: do not start a preview server, install a browser, or improvise another browser-control path.” Source: [Sites SKILL.md](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md). Earlier dated screenshot reports describe previous releases only. New DOM tests and contrast calculations do not replace rendered visual QA.

External guide destinations were retained; this release does not reverify third-party service availability. Static meta refresh and Netlify redirect configuration were checked as source; the Netlify production redirects have not been deployed.

## Pending supplied content

The user-selected Kehinde portrait is visible in chat, but its original image file is not exposed in the workspace or by an available download reference. The portrait-ready team component therefore retains CK initials temporarily. To complete this asset, supply the original JPG/PNG as a downloadable attachment; add its optimised local path to the `photo` field in `tools/content/about.mjs` and rebuild. Do not generate or substitute a person's portrait. Collins retains CE initials until his photo is supplied. The founder's personal paragraph has not been received and is omitted.
