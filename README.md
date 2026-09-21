# PRIME Admin + API

Backend and admin dashboard for the PRIME airsoft club app.

## Stack

- **API** — Node.js, Express, Sequelize, PostgreSQL (`back/`)
- **Admin** — Next.js, shadcn/ui (`admin/`)

## Setup

### 1. API

```bash
cd back
cp .env.example .env   # edit with your DB credentials
npm install
npm run seed   # requires Cloudinary env vars; uses images in back/seed-assets/
npm run dev
```

API runs at http://localhost:3151

### 2. Admin

```bash
cd admin
npm install
npm run dev
```

Admin runs at http://localhost:3150

Set `NEXT_PUBLIC_API_URL` in `admin/.env.local` if the API is not on `http://localhost:3151`.

## Notes

- Seed data creates default admin and member accounts — change passwords before production.
- The Flutter mobile app lives in a separate repository.
