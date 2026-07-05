# ClawGuard

ClawGuard is a full-stack security governance platform for the Claw, OpenClaw, and Skill ecosystem. It combines internet exposure monitoring, vulnerability tracking, security research aggregation, Skill static analysis, and dynamic sandbox assessment in one repository.

## What It Does

- Claw product security overview: security events, alerts, response progress, and risk dashboards.
- OpenClaw risk tracking: GitHub Security Advisory, NVD, CVE, official advisory, and fix-progress aggregation.
- Public exposure monitoring: exposure instances, geo distribution, version trends, and searchable asset tables for OpenClaw, GoClaw, IronClaw, PicoClaw, TinyClaw, and ZeroClaw.
- Skill ecosystem governance: Skill risk intelligence, search, static scans, scan batches, and dangerous-sample review.
- Security research feed: papers and preprints related to OpenClaw, Skill, Agent, Plugin, and adjacent security topics.
- Account and access workflows: login, registration, invite codes, and admin-oriented operations.

## Tech Stack

- Frontend: React 19, Vite 7, Tailwind CSS 4, ECharts 6, Lucide React, React Markdown.
- Backend: Node.js ESM, Express 5, Prisma Client.
- Database: MySQL 8.4.
- Scanners: Node.js orchestration with Python scanners and ProvLoom dynamic analysis components.
- Deployment: Docker Compose. The application container serves both the built frontend and `/api/*` routes.

## Repository Layout

```text
clawguard/
|-- Doc/                  # Project docs, API notes, data requirements
|-- docs/                 # Planning and process notes
|-- scanners/             # Multiple generations of Skill scanners
|-- provloom/             # Dynamic sandbox and deep-analysis components
|-- web/                  # Main web application
|   |-- src/              # React frontend
|   |-- server/           # Express API service
|   |-- shared/           # Shared frontend/backend configuration
|   |-- prisma/           # Prisma schema
|   `-- scripts/          # Data import, refresh, scan, and ops scripts
|-- Dockerfile            # Production image build
|-- docker-compose.yml    # app + mysql orchestration
`-- DEPLOYMENT.md         # Docker deployment notes
```

Runtime data, cache, logs, and backups should not be committed. Keep paths such as `data/`, `db/`, `logs/`, `runtime-cache/`, `backups/`, `web/node_modules/`, `web/dist/`, and `web/generated/` out of code commits unless there is an explicit reason and review.

## Requirements

- Node.js 22 or compatible
- npm
- MySQL 8.4 or Docker Compose
- Python 3 for scanner and dynamic-analysis flows
- Docker for production deployment and dynamic sandbox workflows

## Environment Variables

The root `.env` is used by Docker Compose. `web/.env` or `web/.env.local` can be used for local development. Never commit real secrets, production database URLs, or local credentials.

Common variables:

```env
MYSQL_ROOT_PASSWORD=change-me
DATABASE_URL=mysql://root:change-me@mysql:3306/clawguard
API_PORT=8787
VITE_ADMIN_DEFAULT_API_KEY=
PROVLOOM_LLM_API_KEY=
GEOLITE2_CITY_DB=/app/web/geoip/GeoLite2-City.mmdb
GEOLITE2_ASN_DB=/app/web/geoip/GeoLite2-ASN.mmdb
OPENCLAW_RISK_CACHE_DIR=/app/runtime-cache/openclaw-risk
SECURITY_RESEARCH_CACHE_DIR=/app/runtime-cache/security-research
SKILL_DYNAMIC_CONCURRENCY_LIMIT=30
```

For local development, set `DATABASE_URL` to a reachable MySQL instance.

## Local Development

Install dependencies from the web app directory:

```bash
cd web
npm install
```

Start the frontend and API services:

```bash
npm run dev
```

Useful commands:

```bash
npm run dev:web        # Start the Vite frontend
npm run dev:api        # Start the Express API
npm run db:generate    # Generate Prisma Client
npm run db:push        # Push schema changes to the database
npm run build          # Build the production frontend
npm run start          # Start the production Express service
```

Default ports:

- Vite frontend: `5173`
- API / production app: `8787`

## Docker Deployment

Prepare the root `.env`, then start the stack:

```bash
docker compose up -d --build
```

Open the application at:

```text
http://<server-host>:8787
```

Common operations:

```bash
docker compose ps
docker compose logs -f app
docker compose logs -f mysql
```

The MySQL dump at `db/clawguard.sql` is imported only when the `mysql_data` volume is empty. To re-import from scratch:

```bash
docker compose down -v
docker compose up -d --build
```

Use `down -v` carefully because it removes the current MySQL data volume.

## Data and Refresh Scripts

Run these from `web/` when maintaining exposure, risk, or research data:

```bash
npm run generate:data
npm run generate:version-trend
npm run download:geo
npm run db:import:exposure
npm run db:import:product
npm run db:rebuild:agg
npm run risk:refresh
npm run research:refresh
```

Skill governance scripts:

```bash
npm run skill:scan:static
npm run skill:rescan:risky
npm run skill:rescan:progress
npm run skill:export:dangerous
```

These commands may read or create data, cache, and log files. Review Git status before committing so generated data is not uploaded accidentally.

## API Overview

Health and auth:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Exposure monitoring:

- `GET /api/exposure/stats`
- `GET /api/exposure/world-distribution`
- `GET /api/exposure/china-distribution`
- `GET /api/exposure/trend`
- `GET /api/exposure/version-trend`
- `GET /api/exposure/list`

Risk and research:

- `GET /api/openclaw-risk/overview`
- `GET /api/openclaw-risk/issues`
- `POST /api/openclaw-risk/refresh`
- `GET /api/security-research/overview`
- `GET /api/security-research/papers`
- `POST /api/security-research/refresh`

Skill governance:

- `GET /api/skill/intelligence/overview`
- `GET /api/skill/search`
- `POST /api/skill/scan`
- `GET /api/skill/scan/status`
- `GET /api/skill/dynamic-sandbox/capacity`
- `POST /api/skill/dynamic-sandbox`

## Commit Hygiene

Before committing:

```bash
git status --short
git diff --check
git diff --stat
```

Commit only source code, configuration, documentation, and required scripts or migrations. Do not commit:

- `.env`, `.env.local`, or any real secret
- Runtime data under `data/`, `runtime-cache/`, `logs/`, `backups/`, or `web/public/data/`
- Database dumps unless explicitly required
- Build output, dependency directories, temporary files, scanner output, exported CSV files, or logs

## Related Docs

- `DEPLOYMENT.md`: Docker deployment details
- `Doc/???????.md`: Architecture and technology overview
- `Doc/??????.md`: Exposure monitoring API notes
- `Doc/????.md`: Frontend data requirements
- `db/README.md`: Database bootstrap notes
