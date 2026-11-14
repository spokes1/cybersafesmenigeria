# CyberSafe SME Nigeria — Tools & Resources (Nigeria-first) implementation and QA

**Date:** 8 November 2026. **Route:** `/resources/tools`. **Deployment:** none.

## Summary

Replaced the former five-provider Tools listing with the complete owner-approved **Free and Low-Cost Cybersecurity Tools** directory. The single route remains `/resources/tools`; navigation and other resource routes are unchanged. The updated directory starts with Google account and password-management features, supported Android Play Protect, Windows Security, authenticator apps and existing storage/backup options. It then addresses account exposure and Nigerian reporting channels, and finally presents optional/specialist tools and their limits.

The four-need selector (Accounts, Devices, Information, Exposure & recovery) uses semantic buttons, accurate `aria-pressed` states, visible focus, and labelled category panels. Every card and every provider link remain fully visible without JavaScript; selection only highlights a card. No visitor data, requests to providers, payment integrations, affiliate links, vendor scores or automatically rotating animations were added.

The approved reader-facing copy has been preserved. The developer-only editorial material is retained as a documentation source, not published.

**Reading time:** 1,925 normally visible HTML text words, including the selected category descriptions, category anchors and resource copy; 220 words/minute, rounded up to **9-minute read**. The public handoff alone contains approximately 1,878 words. No hidden story and no optional timer.

## Actual build and tests

- Generator: `node tools/build.mjs`: **PASS**, exit 0; stdout: `Generated 42 pages + 404 (1157 KB of HTML)
Search index: 40 entries, all resolving`.
- Repeat build: **PASS**, 84 generated files byte-identical.
- Approved content and static regression: **115 PASS / 0 FAIL**. Individual checks include 100 approved public content blocks, route uniqueness, all internal links resolving, and all other generated article HTML unchanged.
- Chromium automated browser checks: **47 PASS / 0 FAIL** at 320, 360, 375, 390, 430, 768, 1024, 1366 pixels. Four selections, Enter, Space, focus ring, aria-pressed state, four-category links, external-link new-tab safety, reduced-motion CSS, no-JS at 320 and 390, no JS errors, homepage tips next/previous/pause/resume, header search `/` and results, Security Self-Check 16 items/count/reset were checked.
- Horizontal overflow: none at tested viewport widths.
- Homepage Cyber Tips seven-second timing: script unchanged; elapsed automatic rotation was **not separately timed** in this QA round.
- Physical Android/iPhone testing, screen-reader testing and hosted Netlify staging: **NOT TESTED**.

## Link and Nigeria applicability verification

A separate exact-URL evidence register, `docs/TOOLS_NIGERIA_LINK_VERIFICATION_2026-11-08.csv`, has 21 entries ({'Needs manual confirmation': 1, 'Official page opened': 14, 'Opened Nigeria storefront listing': 4, 'Partly verified; browser restrictions': 2}). The entries include 17 unique public external URLs, plus four supplemental Nigerian iOS App Store listings. Verified links were checked against their official publishers. Public access and independent authentication/device configuration can differ, so a reachable information page is not proof that a Nigerian SME can purchase or use every tier.

**Important limitations:** The ngCERT domain blocked direct automated fetching (HTTP 403); an indexed ngCERT official FAQ/contact page was discovered but the corporate-reporting form was not completed. NPF-NCCC’s e-reporting URL and official title were found, but no report was submitted. Nigeria iOS listings were available for Google Authenticator, Microsoft Authenticator, Bitwarden and OneDrive; this is not proof of Android device compatibility, uptake, pricing or subscription payment success. VirusTotal’s JS interface could not be meaningfully exercised, so confidentiality caveat remains prominent.

No unsupported Nigerian market-share, affordability or provider popularity statement has been added. `docs/VERIFICATION_REGISTER.csv` is updated with the itemised review results while historical entries remain in place.

## Changed files (15)

- `tools/build.mjs`
- `docs/TOOLS_NIGERIA_FIRST_IMPLEMENTATION_NOTES.md`
- `docs/VERIFICATION_REGISTER_README.md`
- `docs/TOOLS_NIGERIA_FIRST_APPROVED_SOURCE_2026-11-08.md`
- `docs/READ_TIME_AUDIT_2026-11-08.csv`
- `docs/TOOLS_NIGERIA_LINK_VERIFICATION_2026-11-08.csv`
- `docs/VERIFICATION_REGISTER.csv`
- `docs/TOOLS_NIGERIA_APPLICABILITY_2026-11-08.md`
- `tools/content/resources.mjs`
- `tools/content/search.mjs`
- `tools/content/approved/tools-nigeria.html`
- `public/assets/search-index.json`
- `public/resources/tools/index.html`
- `public/assets/css/site.css`
- `public/assets/js/tools-nigeria.js`

## Screenshots and remaining approvals

The screenshot pack contains hero, four-category selector, Nigerian reporting, optional specialist tools, and no-JavaScript views at relevant mobile/desktop widths. The owner should review external destinations in a normal browser, test on at least one actual Nigerian Android and a Windows device where feasible, and review screen-reader behaviour before authorising production. No GitHub push or Netlify publish was performed.
