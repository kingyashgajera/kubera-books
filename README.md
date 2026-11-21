[README.md](https://github.com/user-attachments/files/35203774/README.md)
# KuberaBooks

Your fully owned Freshbooks alternative. Multi-tenant invoicing SaaS priced at **$10/month** for businesses, landlords, and contractors. Owner (Yash) uses it for free forever.

## Goals
- Full ownership & control of code and data
- Easy to customize and extend
- Low ongoing costs
- Auth via Email, Google, and Apple
- Stripe subscriptions for paying customers

## Tech Stack
- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS + shadcn/ui**
- **Supabase** (Postgres + Auth + Storage + RLS)
- **Stripe** (Subscriptions + Invoice payments)
- **Resend** (emails)

## Core Features (MVP)
- Multi-tenant organizations
- Clients, Invoices, Estimates, Expenses
- PDF invoices + email sending
- Stripe checkout for $10/mo plan + free owner account
- Google + Apple + Email auth
- Basic dashboard & reports

## Getting Started
1. Create a Supabase project
2. Enable Google and Apple providers in Supabase Auth
3. Create Stripe product for $10/month
4. Copy `.env.example` to `.env.local` and fill keys
5. Run migrations
6. `npm install && npm run dev`

## Pricing Logic
- Owner account flagged as free (via email or special role)
- All other organizations require active Stripe subscription

---
Built for vertical integration and cost control.
