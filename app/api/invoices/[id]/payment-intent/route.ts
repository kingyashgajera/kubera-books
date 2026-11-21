import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { getOrCreateOrganization } from '@/lib/organizations'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20.acacia' })

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await getOrCreateOrganization()

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', params.id)
    .eq('organization_id', org.id)
    .single()

  if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

  const amountDue = Math.round((Number(invoice.total) - Number(invoice.amount_paid || 0)) * 100)
  if (amountDue <= 0) return NextResponse.json({ error: 'Nothing to pay' }, { status: 400 })

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountDue,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    metadata: {
      invoice_id: invoice.id,
      organization_id: org.id,
      type: 'invoice_payment',
    },
  })

  return NextResponse.json({ clientSecret: paymentIntent.client_secret })
}
