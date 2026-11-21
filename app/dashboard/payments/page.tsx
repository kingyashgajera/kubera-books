import { createClient } from '@/lib/supabase/server'
import { requireActiveSubscription } from '@/lib/organizations'

export default async function PaymentsPage() {
  const org = await requireActiveSubscription()
  const supabase = await createClient()

  const { data: payments } = await supabase
    .from('payments')
    .select('*, invoices(invoice_number, clients(name))')
    .eq('organization_id', org.id)
    .order('payment_date', { ascending: false })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Payments</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Client / Invoice</th>
              <th className="text-left p-4">Payment Date</th>
              <th className="text-left p-4">Method / Notes</th>
              <th className="text-right p-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments?.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-4">
                  {p.invoices?.clients?.name || '—'}<br />
                  <span className="text-gray-500">{p.invoices?.invoice_number}</span>
                </td>
                <td className="p-4">{new Date(p.payment_date).toLocaleDateString()}</td>
                <td className="p-4">
                  {p.payment_method.replace('_', ' ')}
                  {p.notes && <div className="text-xs text-gray-500">{p.notes}</div>}
                </td>
                <td className="p-4 text-right font-medium">${Number(p.amount).toFixed(2)}</td>
              </tr>
            ))}
            {(!payments || payments.length === 0) && (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No payments yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
