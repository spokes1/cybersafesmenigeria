# Combined Improvement Implementation | 8 November 2026

The owner-approved route consolidation and brand/privacy corrections are implemented **for review**, not deployed.

- **Retired routes:** `/resources/checklists` → `/resources/downloads` and `/resources/guides` → `/learn`. The generator no longer emits either old route. `netlify.toml` contains explicit 301 entries for slash and non-slash forms. Their **actual HTTP behaviour on hosted Netlify** remains untested.
- **Resources:** Header dropdown, mobile menu, footer column, Resources hub, homepage four-card grid and search/sitemap now refer only to Downloads, Organisations, External Resources and Tools. The Learn hub remains the article library. The interactive 15-question Self-Check stays at `/resources/security-checklist`.
- **Brand:** Removed the retired third-party footer credit, logo asset, support sentence and obsolete normative references. CyberSafe logo/name and copyright remain.
- **Privacy:** Accurate v2 browser-only assessment copy describes 15 answers, optional local business name, key `cybersafe.selfcheck.v2`, clearing answers and absence of automatic migration/deletion of old v1 data. Hosting and fonts still process technical requests. Terms distinguish self-reported checklist-practice progress from a security grade.
- **Legacy code:** Removed unused static 16-question catalogue and page handler after checking active sources; old stored visitor data are **not** read or deleted by the release.
- **Image concepts:** Proposed photographs for existing scenarios are **deferred** pending separate owner review. No new imagery or licensed rights asserted. Existing approved photographs and teaching visuals are unchanged.
- **Historical reference:** Superseded, non-generated reference pages and stale internal report removed to prevent outdated navigation/branding instructions being reused. Active articles are generated from `tools/content/approved/`.
- **No production action:** No Netlify deployment, GitHub push, report submission, data collection or contact-domain activation.

For acceptance details, see `docs/COMBINED_IMPROVEMENT_QA_2026-11-08.md` in the final deliverable.
