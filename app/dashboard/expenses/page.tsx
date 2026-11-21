import { createClient } from '@/lib/supabase/server'
import { requireActiveSubscription } from '@/lib/organizations'
import Link from 'next/link'

export default async function ExpensesPage() {
  const org = await requireActiveSubscription()
  const supabase = await createClient()

  const { data: expenses } = await supabase
    .from('expenses')
    .select('*')
    .eq('organization_id', org.id)
    .order('expense_date', { ascending: false })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <Link href="/dashboard/expenses/new" className="bg-black text-white px-4 py-2 rounded-lg">
          New Expense
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Description</th>
              <th className="text-left p-4">Category</th>
              <th className="text-right p-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses?.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-4">{new Date(e.expense_date).toLocaleDateString()}</td>
                <td className="p-4">{e.description}</td>
                <td className="p-4">{e.category || '—'}</td>
                <td className="p-4 text-right">${Number(e.amount).toFixed(2)}</td>
              </tr>
            ))}
            {(!expenses || expenses.length === 0) && (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No expenses yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
