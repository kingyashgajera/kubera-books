# Local Setup Guide for KuberaBooks

## Step 1: Install dependencies

```bash
cd kubera-books
npm install
```

If you get errors, try:
```bash
npm install --legacy-peer-deps
```

## Step 2: Create your environment file

```bash
cp .env.example .env.local
```

Now open `.env.local` and fill in real values (see below).

## Step 3: Get Supabase keys

1. Go to [https://supabase.com](https://supabase.com) and create a free project
2. Once the project is ready, go to **Project Settings → API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret)

## Step 4: Get Stripe keys (test mode)

1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Copy:
   - **Secret key** (`sk_test_...`) → `STRIPE_SECRET_KEY`
   - **Publishable key** (`pk_test_...`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

3. Create a $10/month price:
   - Go to **Products** → **Add product**
   - Name: KuberaBooks
   - Price: $10, Recurring, Monthly
   - Copy the **Price ID** (`price_...`) → `STRIPE_PRICE_ID`

## Step 5: Set the rest

In `.env.local`:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
OWNER_EMAIL=your-real-email@gmail.com
```

(Leave `STRIPE_WEBHOOK_SECRET` and `RESEND_API_KEY` empty for now)

## Step 6: Run the database schema

1. In Supabase, go to **SQL Editor**
2. Copy the entire contents of `supabase/schema.sql` and run it
3. Then copy and run `supabase/automation_schema.sql`

## Step 7: Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Common issues

| Problem | Fix |
|---------|-----|
| `npm install` fails | Try `npm install --legacy-peer-deps` |
| Blank page or auth errors | Check that all three Supabase keys are correct |
| Stripe errors | Make sure you are using **test** keys (`sk_test_` / `pk_test_`) |
| Can't log in | Check Supabase Auth settings → enable Email provider |

Once this works, tell me which part is failing and I’ll help you fix it.