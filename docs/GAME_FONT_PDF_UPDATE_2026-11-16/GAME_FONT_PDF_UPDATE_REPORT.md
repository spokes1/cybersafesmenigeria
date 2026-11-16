# Game, typography and PDF update — 16 November 2026

The six downloadable PDFs now display the original full transparent logo lockup (icon plus CyberSafe SME Nigeria wordmark) in their existing navy header. The separate typeset name and tagline are removed. The lockup is 78 mm wide, keeps its original 640:176 proportions and appears on all nine pages, including continuation pages. The original PNG is unchanged.

## Game presentation

Animation-only replay controls are removed from feedback and results, together with their event handlers and unused stage entry points. Automatic Kenny reactions remain, as do normal activity Play again, mobile-only Pause/Resume and system reduced-motion handling.

First-attempt correct answers show GOOD DECISION. The ransomware mission uses these headings in order:

- You’ve taken the right first step.
- You’ve reached trusted help.
- You’ve chosen the right recovery steps.

Spot the Scam retains Sharp thinking. Correct takeaway cards say Correct answer chosen. Wrong-answer feedback and guided-recovery headings remain unchanged. Question data, explanations, scores and first-attempt tracking are preserved.

## Typography

The existing Plus Jakarta Sans face stays in place. A shared local stylesheet disables optional liga/clig ligatures throughout full page shells, games and controls; the Kenny companion receives the same rule inside its shadow root. Required script shaping and kerning remain intact. The actual Google Fonts regular and bold files were shaped with HarfBuzz: ten word/weight samples (files, first, confirm, office, offline) confirm separate f/i forms when ligatures are disabled. Before the change, files and first used the fi glyph. See font-shaping.json. QA-only shaping dependencies were installed outside the repository; no production dependency was added.

## Validation

- 104 automated DOM/runtime tests passed, including five targeted game/typography regressions. These exercise first-correct, wrong, guided-recovery and result flows, automatic animation cue requests, retained Play again and mobile pause behavior.
- 12 gameplay paths passed, preserving all 0–5 score totals, retries, multi-select rules and original scenario digest.
- Static integration passed source/output parity, module dependency and preserved-asset checks.
- All 41 HTML files passed the editorial audit; 37 full page shells include the typography stylesheet. Four retired-route redirect shells are retained.
- Six PDFs / nine pages / 33 URI annotations passed. Approved printed body text and page counts remain identical, excluding the intentionally replaced old typeset header. The exact original grayscale and alpha PNG channels are embedded and drawn on each page, preserving header proportions and valid link bounds.
- The six approved PDF hashes were refreshed only after comparison with pre-change backups and successful content/logo validation; all other asset hashes stay unchanged.
- The payment card and fourth self-check page header were rendered and inspected; see the PNG evidence. No duplicated header name or logo crop was observed.
- Build and git diff whitespace checks passed.

## Verification limits and delivery

Browser visual QA was unavailable because the supported managed browser interface was not present. No browser was installed or alternate automation path used. DOM/runtime and font-shaping checks do not certify physical-device rendering or full accessibility.

This delivery updates the existing owner-private Sites review and complete repository archive. The production origin remains https://www.cybersafesme.org and contact remains learn@cybersafesme.org. The owner's GitHub, Netlify production deployment, DNS and mailbox settings are not changed.
