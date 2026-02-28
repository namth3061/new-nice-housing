# Database migrations

Run migrations in order against the `Nine_housing` database.

**Prerequisites:** PostgreSQL server running with database created (e.g. `CREATE DATABASE Nine_housing;`). Set `DATABASE_URL` in `.env.local`.

## Option 1: Node (no psql required)

From project root:

```bash
npm run migrate
```

Or directly:

```bash
node scripts/run-migrations.js
```

This uses the project's `pg` package and reads `DATABASE_URL` from `.env.local` or `.env`.

## Option 2: psql (if PostgreSQL client is installed)

```bash
psql -U root -d nine_housing -f scripts/migrations/001_initial_schema.sql
psql -U root -d nine_housing -f scripts/migrations/002_seed_content.sql
```

**Order:**
| Migration | Description |
|-----------|-------------|
| `001_initial_schema.sql` | Creates tables: users, properties, bookings, blog_posts, terms_sections, policy_sections + indexes |
| `002_seed_content.sql` | Inserts default terms and policy sections (idempotent) |

Migrations use `CREATE TABLE IF NOT EXISTS` and `ON CONFLICT DO NOTHING` where applicable, so re-running is safe.
