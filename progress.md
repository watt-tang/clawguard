# Progress

## 2026-04-02
- Initialized planning files for rebuilding the skill scan pipeline after code rollback.
- Confirmed skill-related DB tables still exist even though code/schema were reverted.
- Confirmed old skill scan scripts are absent and need to be recreated.
- Rebuilt `web/server/scripts/scan-skill-static.mjs` as a resumable repo-deduped scanner that uses raw SQL via existing Prisma connection.
- Implemented off-web bounded repo cache, default concurrency 4, scanner1-first flow, and scanner2 escalation for high-risk hits.
- Verified the script on batch `7` with `--limit-repos 1`; it scanned `https://github.com/01000001-01001110/agent-jira-skills` and inserted 9 result rows successfully.
- Stopped the running batch-7 scan, analyzed failure makeup, and identified that most failures were from clone/network/data-quality causes rather than scanner logic.
- Added retry logic, GitHub URL validation, recursive `SKILL.md` discovery, and `skipped` status handling; then cleared batch-7 failed rows so they can be retried under the improved logic.
- Switched planning context to the OpenClaw risk-vulnerability backend task so progress tracking matches the active request.
- Confirmed the current `openclaw-risk` module is still a frontend placeholder, while the exposure API already provides a clean Express service pattern to extend.
- Verified live GitHub Advisory, GitHub Releases, and NVD CVE responses for OpenClaw, including the fields needed for fix-status inference.
- Added `web/server/services/openclawRiskService.mjs` to aggregate GitHub advisories and NVD CVEs, normalize fields, deduplicate overlaps, and infer fix state from patched versions versus the latest stable OpenClaw release.
- Exposed `/api/openclaw-risk/overview` and `/api/openclaw-risk/issues` from `web/server/index.mjs`.
- Added a real `OpenclawRiskPage` UI and frontend data service so the `openclaw-risk` module now shows latest issues, high-risk issues, fix progress, and a filterable issue list instead of a placeholder.
- Verified the new backend service directly with Node and confirmed deduplicated issue rows plus latest stable release `v2026.4.1`.
- Ran `npm run build` successfully in `web/`; Vite completed, but the existing build pipeline also regenerated `web/public/data/exposure-data.json` and `web/public/data/mock/version-trend.json`.
- Expanded the risk feature to be database-backed: added Prisma models for snapshots and issue samples, regenerated Prisma client, and manually created the new MySQL tables without dropping legacy skill-scan tables.
- Reworked `openclawRiskService.mjs` so APIs now read from the latest stored snapshot, while refresh jobs collect from GitHub/NVD, write cache artifacts under `D:\clawguard-cache\openclaw-risk`, and persist normalized samples into MySQL.
- Added startup scheduling plus a manual refresh path through `POST /api/openclaw-risk/refresh` and `npm run risk:refresh`.
- Ran the first manual refresh successfully, producing snapshot `20260402T114736Z` with `328` stored issue rows.
- Rebuilt `OpenclawRiskPage.jsx` into a stronger operational dashboard with snapshot status, scheduler status, storage info, refreshed styling, and DB-backed filters.

## 2026-04-03
- Restored planning context and re-scoped the prior OpenClaw risk tracker into a broader OpenClaw / Claw / Skill security intelligence platform.
- Confirmed the current backend, database schema, and frontend contracts are all limited to vulnerability tracking and need to be generalized for advisory plus research aggregation.
- Re-scoped again based on the latest request: keep the vulnerability page untouched and replace the separate deployment-risk placeholder with a research-focused academic progress module.
- Inspected `App.jsx`, `config.js`, `schema.prisma`, and `server/index.mjs` to locate the exact route, API, and persistence seams for the new module.
- Added `SecurityResearchSnapshot` / `SecurityResearchPaper` models to Prisma for research snapshots and normalized paper records.
- Implemented `web/server/services/securityResearchService.mjs` with top-conference aggregation, arXiv supplementation, deduplication, project-scope classification, relevance scoring, persistence, and 7-day scheduling.
- Added `GET /api/security-research/overview`, `GET /api/security-research/papers`, `POST /api/security-research/refresh`, plus `npm run research:refresh`.
- Created the frontend feature under `web/src/features/security-research/` and wired the existing `openclaw-deploy` route to a new academic progress page with badges, filters, sorting, and refresh actions.
- Added module README, generated the Prisma client, ran a successful manual research refresh, and verified `npm run build` completes.
- Hardened refresh behavior so provider outages cannot persist an empty snapshot; one previously empty snapshot was marked failed after validation.
- Fixed the academic page dev-runtime failure by adding a Vite proxy entry for `/api/security-research`; without it, the browser was receiving `index.html` instead of backend JSON.
- Fixed the regression in the existing vulnerability page by adding backward-compatible schema repair for legacy `OpenclawRiskSnapshot` / `OpenclawRiskIssue` tables before Prisma queries run.
- Upgraded the vulnerability page with a richer visualization band: severity donut, source comparison bar chart, repair-progress band, and runtime signal cards, backed by new overview breakdown fields.
