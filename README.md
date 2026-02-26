This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database (PostgreSQL)

The admin panel uses **MVC** with **PostgreSQL** (database: `nice_housing`).

1. **Create database and user** (if needed):
   - Create DB: `CREATE DATABASE nice_housing;`
   - User: `root` / Password: `123456` (or set in `.env.local`)

2. **Environment**: Copy or set in `.env.local`:
   ```env
   DATABASE_URL=postgresql://root:123456@localhost:5432/nice_housing
   ```

3. **Run schema and seed**:
   ```bash
   psql -U root -d nice_housing -f scripts/schema.sql
   psql -U root -d nice_housing -f scripts/seed-content.sql
   ```

4. **Structure**:
   - **Models** (`src/models/`): User, Property, Booking, BlogPost, Content (terms/policy)
   - **API routes** (`src/app/api/`): CRUD for properties, bookings, users, blogs, content, dashboard stats
   - **Admin pages** (`src/app/admin/`): Dashboard, Properties, Bookings, Users, Blogs, Content — all wired to the API

Table columns match the website UI: `users`, `properties`, `bookings`, `blog_posts`, `terms_sections`, `policy_sections`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
