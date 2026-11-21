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
    .select('*, clients(name, email)')
    .eq('id', params.id)
    .eq('organization_id', org.id)
    .single()

  if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

  const amountDue = Math.round((Number(invoice.total) - Number(invoice.amount_paid || 0)) * 100)
  if (amountDue <= 0) return NextResponse.json({ error: 'Nothing to pay' }, { status: 400 })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card', 'us_bank_account'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Invoice ${invoice.invoice_number}`,
            description: invoice.clients?.name ? `For ${invoice.clients.name}` : undefined,
          },
          unit_amount: amountDue,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/invoices/${invoice.id}?paid=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/invoices/${invoice.id}`,
    customer_email: invoice.clients?.email || user.email,
    metadata: {
      invoice_id: invoice.id,
      organization_id: org.id,
      type: 'invoice_payment',
    },
  })

  return NextResponse.json({ url: session.url })
}
