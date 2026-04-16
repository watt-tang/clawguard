# Docker Deployment

This project is now packaged for a two-container deployment:

- `app`: Node/Express serves the built frontend and existing API routes from one container.
- `mysql`: MySQL 8.4 loads the existing dump from `db/clawguard.sql` on first startup.

## First start

```bash
docker compose up -d --build
```

The web app is exposed on port `8787`.

## Important behavior

- The MySQL dump is imported only when `mysql_data` is empty.
- Existing frontend styles and application logic are unchanged.
- The app container serves `web/dist` in production and keeps API routes under `/api/*`.
- Runtime refresh caches are stored in the `app_cache` volume.

## Common operations

```bash
docker compose ps
docker compose logs -f mysql
docker compose logs -f app
docker compose down
```

## Re-import the local MySQL dump from scratch

```bash
docker compose down -v
docker compose up -d --build
```

Use `down -v` carefully: it removes the current MySQL data volume and triggers a fresh import from `db/clawguard.sql`.
