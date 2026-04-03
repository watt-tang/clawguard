# Security Research Module

## What it does

This module replaces the old deployment-risk placeholder with an academic-intelligence workflow for ecosystem security analysis.

- Aggregates recent research related to OpenClaw / Claw / Skill / Agent / Plugin security
- Prioritizes top-tier conference papers from `USENIX`, `IEEE S&P`, `ACM CCS`, `NDSS`, and `Euro S&P`
- Supplements with `arXiv` and always labels those records as `preprint`
- Deduplicates conference and preprint variants of the same paper
- Stores normalized snapshots in MySQL and cache files outside `web/`
- Exposes overview, list, and manual-refresh APIs
- Runs a 7-day automatic refresh scheduler

## Data model

`SecurityResearchSnapshot`

- Snapshot metadata
- Paper counts by type and project scope
- Source/provider state
- Cache directory for exported JSON

`SecurityResearchPaper`

- `title`
- `sourceType`
- `projectScope`
- `venue`
- `publishedAt`
- `abstractOrSummary`
- `tags`
- `sourceUrl`
- `authors`
- `relevanceScore`

## Backend files

- `web/server/services/securityResearchService.mjs`
- `web/server/scripts/refresh-security-research.mjs`
- `web/server/index.mjs`
- `web/prisma/schema.prisma`

## Frontend files

- `web/src/features/security-research/pages/SecurityResearchPage.jsx`
- `web/src/features/security-research/services/dataService.js`
- `web/src/styles.css`

## API

- `GET /api/security-research/overview`
- `GET /api/security-research/papers`
- `POST /api/security-research/refresh`

Supported list query params:

- `page`
- `page_size`
- `source_type`
- `venue`
- `project_scope`
- `keyword`
- `sort`

## Refresh

Manual refresh:

```bash
npm run research:refresh
```

Automatic refresh:

- Scheduler starts with the API server
- If the latest snapshot is older than 7 days, it refreshes automatically
- Cache files are written under `../clawguard-cache/security-research`

## Reserved interfaces

The service keeps placeholders for:

- `DBLP`
- `Google Scholar`

They are intentionally marked as reserved and are not treated as live providers yet.
