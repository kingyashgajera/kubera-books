import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOrCreateOrganization } from '@/lib/organizations'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await getOrCreateOrganization()

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, clients(name, email, address), invoice_items(*)')
    .eq('id', params.id)
    .eq('organization_id', org.id)
    .single()

  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Simple HTML invoice for PDF-like download (browser print or later replace with real PDF lib)
  const html = `
<!DOCTYPE html>
<html>
<head><title>Invoice ${invoice.invoice_number}</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; }
  h1 { margin-bottom: 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  th, td { border-bottom: 1px solid #ddd; padding: 8px; text-align: left; }
  .right { text-align: right; }
  .total { font-weight: bold; font-size: 1.1em; }
</style>
</head>
<body>
  <h1>Invoice ${invoice.invoice_number}</h1>
  <p>${org.name}</p>
  <p>Client: ${invoice.clients?.name || 'N/A'}</p>
  <p>Date: ${invoice.issue_date}</p>
  <table>
    <tr><th>Description</th><th class="right">Qty</th><th class="right">Rate</th><th class="right">Amount</th></tr>
    ${(invoice.invoice_items || []).map((i: any) => `
      <tr>
        <td>${i.description}</td>
        <td class="right">${i.quantity}</td>
        <td class="right">$${Number(i.unit_price).toFixed(2)}</td>
        <td class="right">$${Number(i.amount).toFixed(2)}</td>
      </tr>`).join('')}
  </table>
  <p class="right total">Total: $${Number(invoice.total).toFixed(2)}</p>
  <p>Notes: ${invoice.notes || ''}</p>
</body>
</html>`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': `attachment; filename="invoice-${invoice.invoice_number}.html"`,
    },
  })
}
