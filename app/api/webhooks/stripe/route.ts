import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20.acacia' })
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function recordInvoicePayment(invoiceId: string, organizationId: string, amount: number, method: string, reference: string) {
  await supabaseAdmin.from('payments').insert({
    organization_id: organizationId,
    invoice_id: invoiceId,
    amount,
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: method,
    notes: reference,
  })

  const { data: inv } = await supabaseAdmin
    .from('invoices')
    .select('total, amount_paid')
    .eq('id', invoiceId)
    .single()

  if (inv) {
    const newPaid = Number(inv.amount_paid || 0) + amount
    const status = newPaid >= Number(inv.total) ? 'paid' : 'partial'
    await supabaseAdmin
      .from('invoices')
      .update({ amount_paid: newPaid, status })
      .eq('id', invoiceId)
  }
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 })
  }

  // Checkout Session (redirect flow)
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.metadata?.type === 'invoice_payment' && session.metadata.invoice_id) {
      const amount = (session.amount_total || 0) / 100
      const method = session.payment_method_types?.includes('us_bank_account') ? 'bank_transfer' : 'credit_card'
      await recordInvoicePayment(
        session.metadata.invoice_id,
        session.metadata.organization_id!,
        amount,
        method,
        `Stripe Checkout (${session.id})`
      )
    }

    if (session.metadata?.organization_id && session.subscription) {
      await supabaseAdmin
        .from('organizations')
        .update({
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          subscription_status: 'active',
        })
        .eq('id', session.metadata.organization_id)
    }
  }

  // PaymentIntent (Payment Element flow)
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    if (pi.metadata?.type === 'invoice_payment' && pi.metadata.invoice_id) {
      const amount = pi.amount / 100
      const method = pi.payment_method_types?.includes('us_bank_account') ? 'bank_transfer' : 'credit_card'
      await recordInvoicePayment(
        pi.metadata.invoice_id,
        pi.metadata.organization_id!,
        amount,
        method,
        `Stripe PaymentIntent (${pi.id})`
      )
    }
  }

  if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const status = sub.status === 'active' ? 'active' : sub.status === 'past_due' ? 'past_due' : 'canceled'
    await supabaseAdmin
      .from('organizations')
      .update({ subscription_status: status })
      .eq('stripe_subscription_id', sub.id)
  }

  return NextResponse.json({ received: true })
}