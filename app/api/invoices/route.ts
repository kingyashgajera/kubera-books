import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOrCreateOrganization } from '@/lib/organizations'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await getOrCreateOrganization()
  const body = await req.json()

  // Generate invoice number
  const { count } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', org.id)
  const invoiceNumber = `INV-${String((count || 0) + 1).padStart(4, '0')}`

  // Calculate totals
  const items = body.items || []
  const subtotal = items.reduce((sum: number, i: any) => sum + (i.quantity * i.unit_price), 0)
  const total = subtotal // tax/discount later

  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({
      organization_id: org.id,
      client_id: body.client_id || null,
      invoice_number: invoiceNumber,
      status: 'draft',
      subtotal,
      total,
      notes: body.notes || null,
    })
    .select()
    .single()

  if (error || !invoice) return NextResponse.json({ error: error?.message }, { status: 400 })

  // Insert line items
  if (items.length) {
    const lineItems = items.map((i: any) => ({
      invoice_id: invoice.id,
      description: i.description,
      quantity: i.quantity,
      unit_price: i.unit_price,
      amount: i.quantity * i.unit_price,
    }))
    await supabase.from('invoice_items').insert(lineItems)
  }

  return NextResponse.json(invoice)
}
