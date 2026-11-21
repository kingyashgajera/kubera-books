import { createClient } from '@/lib/supabase/server'
import { requireActiveSubscription } from '@/lib/organizations'
import Link from 'next/link'

export default async function RecurringPage() {
  const org = await requireActiveSubscription()
  const supabase = await createClient()

  const { data: recurrings } = await supabase
    .from('recurring_invoices')
    .select('*, invoices!template_invoice_id(invoice_number, clients(name))')
    .eq('organization_id', org.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Recurring Invoices</h1>
      <p className="text-gray-600 mb-6">
        Templates that automatically generate and (optionally) send invoices on a schedule.
      </p>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Template</th>
              <th className="text-left p-4">Frequency</th>
              <th className="text-left p-4">Next Issue</th>
              <th className="text-left p-4">Auto-send</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {recurrings?.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-4">
                  {r.invoices?.invoice_number || '—'}
                  <div className="text-xs text-gray-500">{r.invoices?.clients?.name}</div>
                </td>
                <td className="p-4 capitalize">{r.frequency}</td>
                <td className="p-4">{new Date(r.next_issue_date).toLocaleDateString()}</td>
                <td className="p-4">{r.auto_send ? 'Yes' : 'No'}</td>
                <td className="p-4">{r.is_active ? 'Active' : 'Paused'}</td>
              </tr>
            ))}
            {(!recurrings || recurrings.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No recurring invoices yet. Open any invoice and click “Make Recurring”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Link href="/dashboard/invoices" className="text-blue-600 text-sm">
          ← Back to Invoices
        </Link>
      </div>
    </div>
  )
}
