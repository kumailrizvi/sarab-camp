# LaborConnect UAE / CampMaster ERP

This is the real app version, not a static HTML prototype.

## What changed from the HTML prototype

- React + Vite frontend.
- Supabase login with email/password.
- Supabase database tables for camps, tenants, charges, payments, expenses, support tickets.
- Real data only: screens show records from Supabase. No hardcoded dummy records.
- Search, filters, exports, tabs, record payment, upload invoice, log expense, edit/delete actions are wired.
- Invoice upload uses Supabase Storage bucket `invoices`.

## Local setup

```bash
npm install
cp .env.example .env
```

Fill `.env`:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_KEY
```

Run:

```bash
npm run dev
```

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Paste and run `supabase_schema.sql`.
4. Go to Authentication > Users and create the users you want.
5. Use those emails/passwords to log in.

Known user labels included in the sidebar:

- operations@sarabalmadina.com — Munir — Operations Supervisor
- info@sarabalmadina.com — Rashid — Head Office Staff
- admin@sarabalmadina.com — Arslan — Head Office Staff
- asamaashraf55@gmail.com — Asama Ashraf — Logistics Manager
- muzafar@sarabalmadina.com — Muzafar Iqbal — General Manager
- ashrafgill@hotmail.com — Ch Ashraf — Owner / CEO

## Deploy on Vercel

Add these environment variables in Vercel Project Settings:

- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY

Then deploy with:

```bash
git add .
git commit -m "Build CampMaster Supabase app"
git push origin main
```
