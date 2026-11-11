# Cosmetic Storefront

A cosmetics storefront project. The application lives in [`web/`](web/), a Next.js app with a PostgreSQL database managed through Prisma.

## Run locally with Docker

Docker Compose starts PostgreSQL, the Next.js app, and its Nginx proxy:

```bash
cd web
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). Stop the services with `docker compose down`.

## Project layout

- `web/src/` — application routes, components, and supporting code
- `web/prisma/` — database schema, migrations, and seed data
- `web/docker-compose.yml` — local app, database, and proxy services

For direct Next.js development or deployment details, see [`web/README.md`](web/README.md).
