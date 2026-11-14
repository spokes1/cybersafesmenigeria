# Cyber Practice, menu ownership and transparent branding

12 November 2026. This applies the approved navigation, brand-logo and game motion-control changes, superseding the previous backing behind the brand logo.

## Changes

- Renamed the game area to **Cyber Practice** in Learn menus, the Learn card, search, page metadata, breadcrumb and no-JavaScript fallback. Individual activities retain their titles. The existing `/learn/spot-the-scam` address and article/return links remain valid.
- Every one of the 32 published topic destinations has one menu home. Protect Your Business contains Account Security, Payment Security, Device Security and Incident Response. Learn owns its guides and Cyber Practice; Resources owns Self-Check, Downloads, Organisations, External Resources and Tools.
- Removed five cross-section entries from Protect. Added the missing WhatsApp Security and Phishing Guide links to Learn. Self-Check now appears in Resources, including its footer list. Related learning links are explicitly labelled Learn.
- Restored the original transparent PNG treatment: the entire logo and lettering are white in dark mode and teal in light mode. Removed the added tile and pseudo-elements. Original image files remain unchanged.
- Pause/Resume motion is available only on mobile devices, including phones/tablets in landscape. Android, iPhone/iPad and iPadOS's Mac-style identity are recognised. Resizing a desktop window or using a touchscreen Windows laptop does not reveal the button.
- Desktop animation starts enabled by default; system reduced-motion preferences remain respected, including live changes. Mobile data-saving behaviour is preserved.
- The build now rejects duplicate menu destinations/labels, wrong owners, omitted published topics and mismatched search/footer classifications. Privacy and Terms search badges now correctly say Legal.

`navigation-map.json` records the final assignments. Routes, approved scenarios and scoring are preserved.

## Verification

| Check | Result |
| --- | --- |
| Build | 40 pages + 404; 38 search entries; 159 visitor phrases |
| All pages, both themes: header/mobile ownership, branding and overflow | 80 browser checks passed |
| Desktop animation, narrow resize and live reduced-motion changes | Passed with actual textured WebGL loading |
| Touchscreen desktop | Mobile control remains hidden |
| Pixel 7, iPhone 13 and iPad Pro 11 profiles | Pause/Resume works; landscape retains control |
| Total browser page/device cases | 85 passed; no page JavaScript errors |
| Representative theme/layout cases at 390/1440 px | 20 passed; no computed contrast flags or root overflow |
| Ownership/device unit contracts, including rejected duplicates | 4 passed |
| Gameplay paths | 12 passed |
| Companion/session tests | 52 passed |
| Ten-second notice deadline/session/visibility cases | 15 passed |
| Source/output and preserved assets | Passed; PDFs, logo files, photos and self-check data unchanged |

Screenshots on the private navigation proof page show both logo colours, the menus and desktop/mobile controls. Browser results and menu assignments are included here.

## Reproduce and limits

Run `node tools/build.mjs`, `node --test tests/navigation-and-device.test.mjs`, `node tests/static-integration.mjs` and `node tests/game-logic.mjs`. With `python tests/serve.py` running, use `python tests/navigation-layout.py --output /tmp/cybersafe-navigation-review` and `python tests/notice-deadline.py --output /tmp/cybersafe-notice-review`.

Tests use Linux Chromium, software WebGL and device emulation, not physical Android/iOS or Safari. Local screenshots use fallback fonts because of environment Google Fonts certificate trust; production URLs are unchanged. Contrast samples are triage, not a full WCAG audit. The game retains its approved dedicated dark presentation inside both host themes.

The private review and full repository ZIP contain the update. The main Netlify website and the owner's external Git repository have not been deployed or pushed. Earlier theme/integration reports are historical evidence; this report supersedes their brand-logo treatment and game-area name.
