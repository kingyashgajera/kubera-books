import { createClient } from '@/lib/supabase/server'
import { requireActiveSubscription } from '@/lib/organizations'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AddPaymentForm from './AddPaymentForm'
import MakeRecurringButton from './MakeRecurringButton'
import PayNowButton from './PayNowButton'
import PaymentElementForm from './PaymentElementForm'

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const org = await requireActiveSubscription()
  const supabase = await createClient()

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, clients(name, email), invoice_items(*)')
    .eq('id', params.id)
    .eq('organization_id', org.id)
    .single()

  if (!invoice) notFound()

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('invoice_id', invoice.id)
    .order('payment_date', { ascending: false })

  const amountPaid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
  const amountDue = Number(invoice.total) - amountPaid

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/dashboard/invoices" className="text-sm text-blue-600 mb-4 inline-block">← Invoices</Link>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Invoice {invoice.invoice_number}</h1>
          <p className="text-sm text-red-600 mt-1">
            {amountDue > 0 ? `Amount Due: $${amountDue.toFixed(2)}` : 'Paid in full'}
          </p>
        </div>
        <div className="space-x-2 flex items-center">
          {amountDue > 0 && <PayNowButton invoiceId={invoice.id} />}
          <a href={`/api/invoices/${invoice.id}/pdf`} className="border px-3 py-2 rounded-lg text-sm">Download PDF</a>
          <MakeRecurringButton invoiceId={invoice.id} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="font-medium">{invoice.clients?.name || 'No client'}</p>
            <p>{invoice.clients?.email}</p>
          </div>
          <div className="text-right">
            <p>Date: {new Date(invoice.issue_date).toLocaleDateString()}</p>
            <p>Due: {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '—'}</p>
            <p className="font-semibold">Total: ${Number(invoice.total).toFixed(2)}</p>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Description</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Rate</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.invoice_items?.map((item: any) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{item.description}</td>
                <td className="text-right py-2">{item.quantity}</td>
                <td className="text-right py-2">${Number(item.unit_price).toFixed(2)}</td>
                <td className="text-right py-2">${Number(item.amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-4 space-y-1 text-sm">
          <p>Subtotal: ${Number(invoice.subtotal).toFixed(2)}</p>
          <p className="font-bold">Total: ${Number(invoice.total).toFixed(2)}</p>
          <p>Amount Paid: ${amountPaid.toFixed(2)}</p>
          <p className="font-bold text-lg">Amount Due: ${amountDue.toFixed(2)}</p>
        </div>
      </div>

      {amountDue > 0 && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Pay with Card or Bank (Embedded)</h2>
          <PaymentElementForm invoiceId={invoice.id} amountDue={amountDue} />
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Or Record a Manual Payment</h2>
        <AddPaymentForm invoiceId={invoice.id} amountDue={amountDue} />
      </div>

      {payments && payments.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-3">Payment History</h3>
          <ul className="space-y-2 text-sm">
            {payments.map((p) => (
              <li key={p.id} className="flex justify-between border-b pb-2">
                <span>{new Date(p.payment_date).toLocaleDateString()} — {p.payment_method.replace('_', ' ')}</span>
                <span>${Number(p.amount).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}