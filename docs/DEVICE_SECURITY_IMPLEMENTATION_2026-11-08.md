# CyberSafe SME Nigeria | Device Security implementation and QA

**Review date:** 8 November 2026  
**Route:** `/protect-your-business/device-security`  
**Baseline:** `CyberSafe_SME_Nigeria_Incident_Response_Updated_Project.zip`, including Ransomware, the narrative-quality minor correction, Incident Response and all earlier approved changes.  
**Deployment:** **Not authorised and not performed**; no GitHub push or production merge.

## Summary of work

Replaced the legacy short Device Security article **at the existing route**, using `tools/content/approved/device-security.html` and registering one approved generator page in `tools/build.mjs`. Retained its one `PROTECT_AREAS` category entry and removed the obsolete short article body from the maintained source. The existing nav/card, canonical URL, search entry, and sitemap path remain present and valid.

Published the complete owner-approved text (77 paragraph/list text blocks checked, none missing), including all six detailed everyday checks, Windows 11, Mac and phone guidance, the fully visible shared-counter workplace example, loss/repair response, seven-item opening/closing routine, Start Here action and one article disclaimer. Did **not** introduce a Read More, optional story timer, simulated device diagnostic or security scan.

**Required Windows correction retained verbatim:** Windows 10 support ended **14 October 2025**. The article advises planning Windows 11 migration, checking hardware compatibility, replacing unsupported machines if needed and backing up important files first. It makes no public Extended Security Updates recommendation.

**Inspect the Shared Work Computer:** original CSS illustration of a shared counter workstation, plus **six semantic selectable controls** for Screen lock, Updates, User accounts, Applications, USB and files, and Recovery. Selected guidance gives “What to check” and “What to change”. Controls are hidden until JS successfully attaches listeners; without JS, all six explanatory cards remain visible. Buttons expose `aria-pressed`, real focus outlines and 44px+ tap targets. The interaction is quiet, instant and user-initiated; reduced-motion mode disables transitions.

**Supporting design:** a static three-part opening/work/closing shift strip. The existing seven-item daily routine remains verbatim. Uses existing Plus Jakarta Sans, approved light palette, line-icon sprite, and CSS/vector illustrations. **No new external image, asset licence or runtime library was introduced.**

**Four related links:** Malware, Mobile Security, Account Security, Backup & Recovery. All resolve to generated routes.

## Reading-time calculation

- The completed page with scripts enabled and one workstation detail selected displays approximately **2,599 normally visible words** (including the hero, public explanatory copy and selected controls). At 220 wpm this is **12 minutes, rounded up**.
- Switching checks changes the count slightly (about **2,595–2,608 words**), but all six states still round up to **12 minutes**.
- **12-minute read** is shown at the top. No optional story timer is shown.
- Without JS, all six details are visible: approximately **2,658 words** after excluding duplicated/decorative control labels. This accessibility fallback is deliberately longer; it does **not** change the normal interactive page’s top label.
- The handoff's 11 minutes was a provisional pre-layout estimate. No approved article text was shortened.
- The new Device Security entry is appended as **topic 21** in `docs/READ_TIME_AUDIT_2026-11-08.csv`. Previous 20 topic rows and historical audit registers are retained.

## Source and generated files

The final change list is included below. Source and generated HTML were both updated. Unrelated article outputs, the homepage, the Social Media Security page, all four animation batches, Cyber Tips and header-only search scripts remain **byte-identical** to the baseline.

### Changed paths

- `public/assets/css/site.css`
- `public/assets/js/device-security.js`
- `public/assets/search-index.json`
- `public/protect-your-business/device-security/index.html`
- `public/protect-your-business/index.html`
- `public/sitemap.xml`
- `tools/build.mjs`
- `tools/content/approved/device-security.footer.html`
- `tools/content/approved/device-security.html`
- `tools/content/protect.mjs`
- `tools/content/search.mjs`
- `docs/READ_TIME_AUDIT_2026-11-08.csv`
- `docs/VERIFICATION_REGISTER.csv`
- `docs/DEVICE_SECURITY_IMPLEMENTATION_2026-11-08.md`

## Actual QA

| Check | Result | Evidence |
|---|---|---|
| Build `node tools/build.mjs` | **PASS** | 42 pages + 404; 40 search entries, all resolving |
| Source-to-output content fidelity | **PASS** | 77 of 77 approved public text blocks retained |
| Single route / sitemap / canonical / search | **PASS** | Unique generated `/protect-your-business/device-security`; all four related routes exist |
| Mobile and desktop responsiveness | **PASS** | 320, 360, 375, 390, 430, 768 and 1366px; no detected horizontal overflow |
| Hotspot selection and label matching | **PASS** | All six buttons; selected panel + `aria-pressed` agree |
| Keyboard activation / focus state | **PASS** | Enter and Space activate buttons, focus outline visible |
| Reduced-motion | **PASS** | Selecting USB works, CSS transition 0s |
| No-JavaScript | **PASS** | All six guidance sections visible; interactive controls hidden, story and seven-item routine readable |
| Header-only search and homepage tips | **PASS, smoke-tested** | Five tip elements, next/previous, pause/resume, mobile menu, single header search entry, `/` shortcut, Escape close; no-JS tips static |
| Existing articles and interaction scripts | **PASS, source comparison** | Unrelated generated pages, shared JS and 16-item self-check unchanged |
| Browser interaction set | **33/33 PASS** | Offline Chromium; page error checks and screenshots |
| Homepage and Self-Check regression | **12/12 PASS** | Cyber Tips controls, mobile menu, all 16 self-check boxes, count and reset; localStorage key source unchanged |
| Full timed 7-second tip rotation | **NOT TESTED** | Interval constant remains `7000` in unchanged site script |
| Actual phone and manual screen-reader review | **NOT TESTED** | Recommended for owner staging QA |
| Hosted Netlify test | **NOT TESTED** | No deployment authorised |
| Fresh verification of eight external editorial sources | **NOT TESTED** | Pending register entries; owner-provided URLs not treated as live verification |
| Rights-cleared Nigerian workplace photograph | **NOT SUPPLIED** | CSS/icon artwork used instead |

The screenshots use Chromium with the current generated HTML, CSS and JavaScript in an offline document preview. Isolated component screenshots temporarily use a static header **only during capture** to prevent the normal sticky navigation from obscuring component edges. The website stylesheet still retains its sticky header unchanged.

## Outstanding publication-stage checks

Owner visual approval, real-device responsiveness, manual assistive-technology review, current external-source verification and, if replacing the original illustration with a photograph, evidence of the image’s usage rights. The business contact/domain decisions remain deferred as before.

**No Netlify publish, GitHub push or production merge was performed.**
