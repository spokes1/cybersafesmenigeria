# Homepage, content and phishing response cleanup

15 November 2026 (Africa/Lagos). This release implements the eight owner-approved changes in the existing owner-private review. Production DNS, Netlify account settings and the owner's external Git repository are unchanged. The production origin remains `https://www.cybersafesme.org`.

## Completed scope

1. **Contact email:** all site contact links use `learn@cybersafesme.org`. The former address is absent from active generated pages.
2. **Game entrypoints:** removed the homepage “Practise with Kenny” button and duplicate optional promotions in seven article footers. Removed the Learn hub promotion and direct game search result so entrypoints are Kenny's invitation and Learn → Cyber Practice. The canonical game route, activities, scoring, timing, session behaviour and article/home returns remain available.
3. **Homepage topic cards:** all six threat topics retain their titles, copy, order and article destinations. Large banners/circular rings are replaced with compact coloured icon tiles, shared card surfaces, aligned Read more links and responsive card spacing. Hover and keyboard-focus styles use theme tokens. Icon backgrounds retain white-symbol contrast with restrained teal, blue, green and orange gradients.
4. **About cleanup:** removed the long passwords/OTP/BVN/card-details warning and the unavailable-social-channels heading/paragraph shown in the owner's screenshot. Mission, Team, supplied portraits, corrected team introduction and the main Contact cards are retained.
5. **Privacy Policy retirement:** removed the policy body/function, its related link, footer link and search entry. It is excluded from the sitemap. `/privacy` and `/privacy/` have Netlify 301 rules to About; static review hosts receive an immediate redirect shell with a manual fallback link. The shell has no policy content or Kenny widget.
6. **Repeated footer notices:** removed the repeated “CyberSafe SME Nigeria provides…” educational disclaimer variants. The Password Security page's actual Sources and further reading footer remains, including its reference destinations. Incident guidance within articles is retained.
7. **Heading/state colours:** retired the pale `h3:target` background/shadow responsible for the white-on-pale phishing heading. Selected response headings use transparent backgrounds and the active theme's text colour. Incident-response linked headings use the theme accent. Dark example shadows are subdued. The audit also identified and corrected a faint business-map caption and light hero-text/gradient contrast edge cases.
8. **Phishing response disclosure:** four original headings and their advice are wrapped as labelled panels and added to the shared reveal script. Under normal JavaScript, choices stay visible and details start closed until a visitor selects a response or opens a valid response deep link. Only one panel is visible at a time. Switching preserves the original heading URLs. Viewed markers, keyboard controls and polite announcements work as in the other selectors. Printing reveals all details; no-JavaScript reading retains the reference advice.

There are now **13 shared information selectors and 50 choices**. Permanent process diagrams, sequential stage widgets and ordinary article-navigation cards retain their appropriate behaviour.

## Verification

- Build passed: **36 canonical pages**, four redirect shells and 404; **34 search entries**, with all 159 visitor phrases resolving.
- **99 automated DOM, editorial, navigation/device and Kenny companion/session tests passed.** The new cases cover all four phishing response choices and deep links, the contact/Privacy/footer changes, removal of duplicate game promotions and the six homepage card structures.
- An independent static audit passed for all **41 HTML files**, including identifiers, accessibility references, meaningful link labels, numbering and destination retention with the approved retirements/email migration accounted for.
- Content comparison against the previous committed site confirms that **all four response texts and all six homepage topic titles, descriptions and destinations are preserved**. See `content-preservation.json`.
- The CSS cascade audit passed **880 states and 157,954 HTML text samples** at 390 and 1440 CSS-pixel media widths in both themes. It exercises initial/hover/focus states, actual DOM clicks for all reveal choices and existing diagram controls, plus linked response headings. It accounts for selector specificity, important/inline declarations, inherited variables, backgrounds and sampled gradient colours. There were no unmatched selector parse errors or classic-script execution errors in the audited set.
- A negative control recreating the original white-on-pale response heading is detected as a contrast failure. This confirms the colour audit can flag the reported failure pattern rather than merely inspecting declared colour pairs.
- Existing source/output and preserved-asset checks passed. The six PDFs, their approved content, nine pages, 33 website/article links, production domain, Self-Check data, logos, portraits and game media are retained. PDF verification passed without regenerating unrelated documents.
- Git whitespace checks passed.

## Repeating the optional colour audit

The website build/runtime remain dependency-free. The optional DOM/CSS audit needs LinkeDOM, css-tree and specificity in a separate QA directory:

```sh
npm install --prefix /tmp/cs-style-qa linkedom css-tree specificity --no-save --package-lock=false
CS_AUDIT_DEPS=/tmp/cs-style-qa/node_modules CS_AUDIT_OUTPUT=/tmp/cs-style-report node tests/css-cascade-audit.cjs
```

The DOM regression suite setup remains documented at the top of `tests/about-and-examples.test.mjs`.

## Verification limits

**No rendered browser visual QA was performed in this session.** The supported browser-control tool remains unavailable. The Sites skill says: “If `cua_repl.js` is unavailable, skip browser QA: do not start a preview server, install a browser, or improvise another browser-control path.” Source: [Sites SKILL.md](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md).

The CSS audit is a DOM/source model, not a browser renderer or full WCAG certification. It does not verify physical layout/overflow, actual font rasterisation, spatial gradient placement, image/SVG text, canvas/WebGL, every asynchronous UI or physical devices. It samples gradient colours conservatively and simulates hover/focus/target attributes for selector matching. Hidden/screen-reader-only and disabled text is excluded from visual-text contrast checks. Earlier screenshot evidence describes earlier releases only.

The private review and downloadable repository make the completed implementation available for rendered review. This release does not deploy the main Netlify website, change DNS/TLS, establish a mailbox or send email. Historical QA documents remain historical; this report supersedes their previous page counts, contact email, Privacy page and game-promotion descriptions.
