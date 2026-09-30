# Paws Connect

A Vite and React pet-care directory backed by Supabase and deployed through Vercel.

## Local development
1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from Supabase project settings.
3. Run `npm install`, then `npm run dev`.

The Supabase schema is in `supabase/schema.sql`. The browser app uses only the publishable key; never put a Supabase secret or service-role key in a `VITE_` variable.

## Vercel
The `sypherlogic/Paw-Connect` GitHub repository is linked to Vercel project `pawsconnect`. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for Production, Preview, and Development. Vercel builds with `npm run build`; `vercel.json` supports client-side routing.

## Data migration
The schema does not copy existing Base44 provider, review, or booking records. Export and import those separately before relying on the existing directory content.
