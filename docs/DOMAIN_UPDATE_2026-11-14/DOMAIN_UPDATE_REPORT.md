# Primary domain and team introduction

14 November 2026 (Africa/Lagos). The approved primary website address is **https://www.cybersafesme.org**, including `www`.

## Completed changes

- Added `tools/content/site-config.json` as the shared public-origin setting for the Node website generator and Python PDF generator.
- Regenerated website canonical URLs, Open Graph URL/image metadata, Twitter image metadata, sitemap and robots with the new HTTPS/www origin. The three legacy About redirect documents now also have absolute canonical URLs on the new domain.
- Same-origin internal links, including navigation and game/home returns, remain relative so they work on both the owner-private review and production. Third-party organisation/tool URLs are retained.
- Regenerated all six downloadable PDFs. Every page displays `www.cybersafesme.org` in the footer and links it to `https://www.cybersafesme.org`. Existing printed article paths now have clickable HTTPS targets on the new domain. There were no existing branded QR codes in these documents to migrate.
- The team introduction now reads: “CyberSafe is written and maintained by a small team working on cybersecurity awareness for SMEs.” The requested word was removed from this sentence only. Team names, roles, supplied portraits and Nigeria-specific educational content are retained.
- Added Netlify 301 hostname rules from the bare domain and former Netlify hostname to the chosen www address, preserving request paths. The former hostname appears as a redirect source, not a visitor destination.
- Contact email remains `hello@cybersafesmenigeria.ng`; no replacement mailbox was supplied or established by this website-address change.

## Verification

- Build passed: 37 canonical pages, three legacy redirect shells and 404; 36 search entries and 159 validated visitor phrases.
- All 94 current DOM/editorial/navigation/device/companion/session tests passed. The added domain regression checks all 41 HTML files, 40 canonical tags, sharing metadata, 37 sitemap entries, robots and the exact team sentence.
- Independent static audit passed for all 41 HTML files. The active generated website has no references to the former Netlify hostname or the removed team phrase. Historical QA documentation remains historical.
- PDF verification passed for six PDFs, nine pages and 33 URI annotations. The approved page text and page counts match the pre-change documents after removing only the old/new footer host. All URI targets use the new origin and resolve to existing generated routes; annotation rectangles stay within their pages. Every PDF page has a clickable website footer.
- PDF digests in the preserved-asset fixture were refreshed only after that independent text/page/link verification. Canonical Self-Check question data, brand images, photos and game assets passed their unchanged-content checks.
- Two PDF pages were rendered and inspected: the payment desk card and the last Self-Check page. A pixel comparison confirms that the payment card body is unchanged outside its updated footer. PDF render samples are included here.
- Source/output parity and Git whitespace checks passed. PDFs are declared binary in `.gitattributes` so their valid cross-reference whitespace is not treated as source-code whitespace.

Run `python tests/domain-pdfs.py --output /tmp/cybersafe-pdf-check` to repeat the PDF checks. The approved printed-text fixture is independent of generated file hashes. ReportLab and pypdf are required for PDF generation/verification; no new dependency is required by the website runtime.

## Publication scope and remaining hosting setup

This release is prepared for the existing owner-private Sites review and complete repository download. It **does not change DNS, Netlify account/domain settings, TLS provisioning or the owner's external Git repository**. The production address should not be described as live solely because these files use its URLs.

For production, add/verify `www.cybersafesme.org` on the correct Netlify site, make it the primary domain, configure the DNS records supplied by Netlify for that site, complete HTTPS provisioning, and deploy the updated `public/` directory and `netlify.toml`. No DNS record values were guessed or applied here.

Browser-control tools remain unavailable in this managed session. No new website browser screenshots or physical-device visual tests were performed. PDF rendering and DOM/source checks do not claim full website visual or accessibility certification. The Sites skill says: “If `cua_repl.js` is unavailable, skip browser QA: do not start a preview server, install a browser, or improvise another browser-control path.” Source: [Sites SKILL.md](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md).

The complete repository archive includes all current source, generated pages, PDFs, game/Kenny assets, original portraits, tests, configuration and historical evidence. Current origin and PDF verification supersede earlier reports showing a former address.
