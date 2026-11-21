# Core Automation Backbone Complete

## What was implemented
1. **Database schema** (`supabase/automation_schema.sql`)
   - `recurring_invoices` table
   - `reminder_logs` table
   - Organization-level settings for reminder offsets and late fees

2. **Nightly Edge Functions** (with real Resend email code)
   - `process-recurring-invoices` — generates invoices and emails them if `auto_send = true`
   - `process-reminders-and-overdue` — marks overdue + sends reminder emails at -7, 0, 3, 7, 14 days

3. **UI**
   - “Make Recurring” button on every invoice detail page
   - Modal to choose frequency (weekly/monthly/yearly), due days, and auto-send

4. **API**
   - `POST /api/recurring` creates the recurring template

## Resend setup
Add to your Edge Function secrets:
```
RESEND_API_KEY=re_xxxxxxxx
```
Update the `from` addresses in the functions to a verified domain in Resend.

## Schedule the jobs
Use Supabase Cron or an external cron to hit both function URLs daily.

## Result
You now have the core automation backbone for:
- Recurring billing
- Automatic late-payment chasing
- Email delivery
- Everything stays inside your own Supabase project

Ready for late-fee application logic or a dedicated Recurring Invoices management page.