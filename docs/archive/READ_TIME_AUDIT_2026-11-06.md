# Final article reading-time audit (6 November 2026)

**Baseline:** CyberSafe_SME_Nigeria_BEC_Updated_Project.zip, not the older Batch 4 review snapshot. All 16 listed articles were present.

**Method:** parse each final approved article source fragment and its public footer. Remove script, style, SVG markup and the existing read-time pill; count visible/available text including the hero heading, article links, diagram labels and explanatory content, scenario, public source headings and public disclaimer. Use Unicode word tokens and compute `ceil(words/220)`; all JS-selected educational steps are counted once, including steps temporarily not in view. This source-based count was cross-checked against generated page content after build. Counts are approximate and vary slightly depending on tokenisation; the resulting integer labels are reproducible. Internal editorial notes and global website chrome are not included.

| Page | Prior label | Final words | New label | Reference words |
|---|---|---:|---|---:|
| Account Security | About 8-minute read | 2,789 | 13-minute read | 2763 |
| Backup And Recovery | 5-minute read | 1,716 | 8-minute read | 1696 |
| Business Email Compromise | About 10–12-minute read | 2,739 | 13-minute read | 2186 |
| Business Wifi | 5-minute read | 1,349 | 7-minute read | 1328 |
| Data Protection | About 9–10-minute read | 2,825 | 13-minute read | 2411 |
| Email Security | About 12-minute read | 2,662 | 13-minute read | 2634 |
| Employee Security | About 8–9-minute read | 2,337 | 11-minute read | 2056 |
| Fake Bank Alerts | 8-minute read | 1,581 | 8-minute read | 1560 |
| Mobile Security | About 9–10-minute read | 3,545 | 17-minute read | 3518 |
| Password Security | 5-minute read | 1,182 | 6-minute read | 1143 |
| Payment Security | 7–8-minute read | 2,308 | 11-minute read | 2287 |
| Phishing Guide | About 9-minute read | 2,472 | 12-minute read | 2443 |
| Phishing | About 9-minute read | 2,258 | 11-minute read | 2229 |
| Sim Swap Fraud | 5-minute read | 1,511 | 7-minute read | 1487 |
| Social Media Security | About 8–9-minute read | 1,990 | 10-minute read | 1964 |
| Whatsapp Hijacking | 5-minute read | 1,304 | 6-minute read | 1281 |

**Why some figures exceed the handoff:** The final Employee Security, Data Protection and BEC pages include added diagram explanations and links. For the earlier 13 articles, the owner reference table omitted the public footer disclaimer; it is included here as instructed. This changes the rounded label for Mobile Security, Email Security and Social Media Security. No body copy was changed.
