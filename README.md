# Villa Anantara — Website Scaffold

## What is included
- Next.js (App Router) scaffold
- Prisma schema
- Basic pages: homepage, booking form, admin stub
- API route stubs: /api/book, /api/ical/export, /api/ical/import
- .env.example with required variables
- Instructions to run locally and deploy to Vercel + Supabase

## Quick start (friend/developer)
1. Install Node.js (LTS)
2. Clone repo and install deps:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and fill values.
4. Initialize Prisma:
   ```
   npx prisma generate
   npx prisma migrate dev --name init
   ```
   (Or use `npx prisma db push` with Supabase)
5. Run dev server:
   ```
   npm run dev
   ```
6. Open `http://localhost:3000`

## Deploy
- Push to GitHub
- Import project in Vercel
- Add Environment Variables in Vercel (as in .env)
- Deploy

## PhonePe
Payment integration will be added later once PhonePe merchant account is ready.
