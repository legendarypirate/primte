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

## v2 Parent App API

- `POST /api/auth/parent/login` — `{ phone, code }`
- `GET /api/app/parent/home` — parent dashboard + children
- `GET /api/app/parent/children/:id` — child detail
- `GET /api/app/parent/children/:id/attendance|progress|purchases`
- `POST /api/app/parent/wallet/topup` — start QPay top-up
- `POST /api/app/parent/wallet/topup/:id/confirm` — confirm payment
- Admin: `GET/POST /api/admin/parents`

## Notes

- Seed data creates default admin, member, and parent accounts — change passwords before production.
- Parent login after seed: `+97699112233` / `99112233`
- The Flutter mobile app lives in a separate repository.
