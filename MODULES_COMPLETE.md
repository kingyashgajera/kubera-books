# Modules Complete

All four requested modules are implemented:

1. **Organization + free owner logic**  
   - Auto-creates org on first login  
   - Owner (OWNER_EMAIL) gets `is_owner_org = true` and free access  
   - Others redirected to `/billing` until Stripe subscription is active

2. **Stripe $10/month**  
   - `/billing` page with checkout button  
   - `POST /api/stripe/checkout` creates subscription session  
   - `POST /api/webhooks/stripe` updates org status on payment

3. **Clients CRUD**  
   - List at `/dashboard/clients`  
   - Create form at `/dashboard/clients/new`  
   - API at `/api/clients`

4. **Invoices module**  
   - List at `/dashboard/invoices`  
   - Create with line items at `/dashboard/invoices/new`  
   - Auto-generates invoice numbers (INV-0001…)  
   - API at `/api/invoices`  
   - Totals calculated from line items

## Still needed for production polish
- Client dropdown selector on invoice form (currently paste UUID)
- PDF generation (add `@react-pdf/renderer` or similar)
- Email sending via Resend when invoice is marked “sent”
- Expenses module
- RLS policies in Supabase

## Setup reminder
1. Run `supabase/schema.sql` in Supabase
2. Set `OWNER_EMAIL` in `.env.local`
3. Create Stripe $10 price and set `STRIPE_PRICE_ID`
4. Configure webhook endpoint to `/api/webhooks/stripe`
5. Enable Google + Apple in Supabase Auth

Project is functional for core invoicing flow. Ready to customize further.
