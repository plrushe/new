# Discipline Tracker MVP

Mobile-first daily achievement tracker built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase.

## Features
- Supabase email/password auth (sign up, sign in, logout)
- Protected dashboard with daily checklist
- Success rule:
  - `calorie_limit_met` must be true
  - at least one movement goal (`gym_completed` or `steps_completed`) must be true
- Monthly calendar with success/failure/no-entry colors
- Basic stats: current streak, best streak, success rate this month, successful days this month

## Tech Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres

## Project Structure
- `app/` routes: landing, auth, dashboard, calendar, stats, logout
- `components/` reusable mobile UI cards and controls
- `lib/supabase/` client/server Supabase setup
- `lib/habits.ts` success and stats helpers
- `types/` shared TypeScript types
- `supabase/schema.sql` DB schema and RLS policies

## Environment Variables
Create `.env.local` from `.env.example` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup
1. Create a new Supabase project.
2. In SQL editor, run `supabase/schema.sql`.
3. In Auth settings, enable Email auth.

## Run locally
```bash
npm install
npm run dev
```
Then open `http://localhost:3000`.
