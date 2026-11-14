# CyberSafe SME Nigeria – Dark Mode and Homepage Review
Date: 2026-11-09

## Implemented scope

This package applies the approved follow-up changes after the dark-mode review.

### Completed updates
1. **Dark-mode refinement pass** across shared components and affected article patterns.
2. **Reading-time badges / hero pills** updated so dark mode uses the darker badge style consistently.
3. **Cybersecurity Basics** corrected from **"Open the 16-point Security Self-Check"** to **"Open the 15-question Security Self-Check"**.
4. **Homepage Spot the Scam promotional card removed** so game discovery is handled by Kenny only.
5. **Homepage Cyber Tips moved higher** in the page order.
6. **Homepage Cyber Tips pause button removed**.
7. **Homepage Cyber Tips rotation changed from 7 seconds to 5 seconds**.
8. **Homepage threat cards refreshed** with cleaner SVG icon treatment and improved card-header colour handling for dark mode.
9. **Email Security dark-mode contrast fixes** added for the mailbox-routing interactive.
10. **Malware dark-mode contrast fixes** added for the hero illustration panel.
11. **Keep learning / related-card contrast fixes** strengthened for reusable article-card patterns, including Cybersecurity Basics and Device Security related-card states.

## Build result
- Build command: `node tools/build.mjs`
- Result: **Passed**
- Output reported: **Generated 40 pages + 404**
- Search reported: **38 entries, 159 verified visitor phrases, all resolving**

## QA summary

### Source checks completed
- Homepage game-invite section removed from source.
- Homepage Cyber Tips section reordered above the incident-help strip.
- Homepage tip controls now use only previous/next arrows and dots.
- `tipplay` control removed from homepage markup.
- Tip rotation interval set to **5000 ms** in `public/assets/js/site.js`.
- Threat cards on homepage now use inline SVG icons instead of the earlier PNG icon treatment.
- Cybersecurity Basics self-check text corrected to **15-question**.
- Tools page reference to the old 16-point wording also corrected for consistency.

### Theme / contrast coverage added
- Shared pill / read-time badge dark-mode overrides.
- Homepage threat-card strip and icon-circle dark-mode overrides.
- Email Security forwarder interactive dark-mode overrides.
- Malware hero illustration dark-mode overrides.
- Related-card dark-mode overrides for Cybersecurity Basics and Device Security card patterns.

## Recommended preview review in Netlify
Please review these areas in the deploy preview:
1. Homepage, both light and dark modes.
2. Password Security page (reference page).
3. Cybersecurity Basics page.
4. Email Security page.
5. Malware page.
6. Device Security page.
7. Home threat-card section and icon appearance.

## Notes
- The implementation was made from repository source, then rebuilt.
- Light mode was intentionally preserved as the default baseline; dark-mode fixes were added as targeted overrides.
