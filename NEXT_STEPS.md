# Next Steps for KuberaBooks

## Immediate Setup (do these in order)
1. Create Supabase project → copy URL + keys into `.env.local`
2. In Supabase Dashboard:
   - Enable Email provider
   - Enable Google OAuth (add client ID/secret)
   - Enable Apple OAuth
3. Create Stripe account → Product "KuberaBooks Pro" at $10/month → copy Price ID
4. Run the SQL in `supabase/schema.sql`
5. `npm install`
6. Scaffold full Next.js app with `npx create-next-app@latest . --typescript --tailwind --app --src-dir=false`
7. Install shadcn: `npx shadcn@latest init`

## What I will build next
- Auth pages (email + Google + Apple)
- Organization creation + free owner flag
- Stripe subscription checkout ($10) + webhook
- Clients CRUD
- Invoices CRUD + PDF generation
- Basic dashboard

## Owner Free Access
Set `OWNER_EMAIL` in env. On signup, if email matches, set `is_owner_org = true` and skip Stripe requirement.

Ready for me to generate the auth flow and organization logic next?
