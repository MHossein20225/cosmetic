# Cosmetic Storefront

An online cosmetics shop built as a Next.js application with PostgreSQL and Prisma. The storefront is designed for Persian-speaking shoppers and uses a right-to-left interface.

## About the project

Shoppers can browse products by category, search the catalog, explore brands, view product details, and use accounts, a shopping cart, checkout, and order history. The project also includes admin pages for managing products, orders, and users. Product, cart, account, and order data are modeled in PostgreSQL through Prisma.

The web app is in [`web/`](web/). Its Next.js routes and interface are in `web/src/`, while the database schema and seed data are in `web/prisma/`.

## Run locally with Docker

Docker Compose starts PostgreSQL, the Next.js app, and its Nginx proxy:

```bash
cd web
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). Stop the services with `docker compose down`.

## Project layout

- `web/src/app/` — storefront, account, order, and admin routes
- `web/src/components/` — shared storefront interface
- `web/prisma/` — database schema, migrations, and seed data
- `web/docker-compose.yml` — local app, database, and proxy services

For direct Next.js development or deployment details, see [`web/README.md`](web/README.md).
