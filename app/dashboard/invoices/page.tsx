import { createClient } from '@/lib/supabase/server'
import { requireActiveSubscription } from '@/lib/organizations'
import Link from 'next/link'

export default async function InvoicesPage() {
  const org = await requireActiveSubscription()
  const supabase = await createClient()

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, clients(name)')
    .eq('organization_id', org.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Link href="/dashboard/invoices/new" className="bg-black text-white px-4 py-2 rounded-lg">
          New Invoice
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Number</th>
              <th className="text-left p-4">Client</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Total</th>
              <th className="text-left p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {invoices?.map((inv) => (
              <tr key={inv.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">
                  <Link href={`/dashboard/invoices/${inv.id}`} className="text-blue-600 hover:underline">
                    {inv.invoice_number}
                  </Link>
                </td>
                <td className="p-4">{inv.clients?.name || '—'}</td>
                <td className="p-4 capitalize">{inv.status}</td>
                <td className="p-4 text-right">${Number(inv.total).toFixed(2)}</td>
                <td className="p-4">{new Date(inv.issue_date).toLocaleDateString()}</td>
              </tr>
            ))}
            {(!invoices || invoices.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No invoices yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}