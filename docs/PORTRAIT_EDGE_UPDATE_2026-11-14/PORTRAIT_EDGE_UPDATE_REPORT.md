# Team portraits and Kenny edge-line correction

14 November 2026 (Africa/Lagos). This release updates the existing owner-private review. Netlify production and the owner's external repository are unchanged.

## Changes

- The original files from the owner-supplied `pics.zip` are now available and integrated with the correct team cards. `IMG-20261114-WA0010(1).jpg` is **Collins Eyetu — Content & Design**. `kenny ai Headshot.png` is **Coker Kehinde — Founder & Project Lead**.
- Published paths are `/assets/photos/collins-eyetu.jpg` and `/assets/photos/coker-kehinde.png`. Both are byte-for-byte copies of the supplied originals, without generated replacements or facial edits. Each has the correct name as alternative text. The existing responsive portrait frame controls display size and crop.
- Removed the companion's decorative `.edge` node and its one-pixel gradient-line CSS, including the left-side variant. This is the faint vertical line visible beside Kenny in the supplied screenshot. The companion stylesheet cache key is now `v=4`.
- Kenny's peeking and retreat motion, blink frames, hit target, keyboard focus outline, notices, invitation timing and session state are unchanged.
- The earlier About/example release's pending-photo note is superseded by this release. A personal founder biography still has not been supplied; none was invented.

## Verification

- Build: 37 canonical pages, 404, three redirect shells, 36 search entries and 159 validated visitor phrases.
- All 93 current DOM/editorial/navigation/device/companion/session tests passed.
- Independent static audit passed for all 41 HTML files. Source/output parity and the preserved PDF, Self-Check, brand and game asset checks passed.
- Separate asset check confirms both name-to-photo mappings, both original file hashes, removal of the decorative line, preserved focus styling and stylesheet version 4. See `asset-check.json`.
- The two original photos were opened and visually inspected before integration. File dimensions are 960 × 1280 for Collins and 1054 × 1124 for Kehinde.
- Git whitespace checks passed.

Browser-control tools remain unavailable in this managed session, so no new rendered browser screenshots, physical-device tests or visual-browser claims are made. The Sites skill instructs: “If `cua_repl.js` is unavailable, skip browser QA: do not start a preview server, install a browser, or improvise another browser-control path.” Source: [Sites SKILL.md](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md).

The complete repository is delivered as a `.tar.xz` archive so all original portraits, historical evidence, source and generated assets remain included within the hosting file-size limit. A compact ZIP contains this report and test evidence. The earlier About/example functionality is retained.
