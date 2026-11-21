import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOrCreateOrganization } from '@/lib/organizations'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await getOrCreateOrganization()
  const body = await req.json()

  // Verify invoice belongs to org
  const { data: invoice } = await supabase
    .from('invoices')
    .select('id')
    .eq('id', body.invoice_id)
    .eq('organization_id', org.id)
    .single()

  if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('payments')
    .insert({
      organization_id: org.id,
      invoice_id: body.invoice_id,
      amount: body.amount,
      payment_date: body.payment_date,
      payment_method: body.payment_method,
      notes: body.notes || null,
      send_notification: body.send_notification || false,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Optionally update invoice amount_paid (can be computed on read)
  return NextResponse.json(data)
}
