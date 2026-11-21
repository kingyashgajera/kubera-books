import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOrCreateOrganization } from '@/lib/organizations'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await getOrCreateOrganization()
  const body = await req.json()

  const { data, error } = await supabase
    .from('recurring_invoices')
    .insert({
      organization_id: org.id,
      template_invoice_id: body.template_invoice_id,
      frequency: body.frequency,
      next_issue_date: body.next_issue_date,
      due_days: body.due_days || 30,
      auto_send: body.auto_send ?? true,
      is_active: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
