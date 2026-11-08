# Approved printable document sources

The five Markdown files here contain approved public document wording. `tools/generate_downloads.py` creates the five branded A4 cards/records from these files, plus the blank 15-question Self-Check **directly from** `tools/content/selfcheck-v2.json`.

Run `python tools/generate_downloads.py` in the repository root with ReportLab and pypdf installed, then run `node tools/build.mjs`. The Node builder checks that each download file exists and preserves `public/downloads/` during regeneration. If the canonical questions change, regenerate both the PDFs and HTML/JavaScript before packaging and publishing.

The approved logo is `public/assets/logo/cybersafe-logo-white.png`; do not substitute a third-party or government-agency mark. Human proofreading and actual print inspection are needed before production publication.
