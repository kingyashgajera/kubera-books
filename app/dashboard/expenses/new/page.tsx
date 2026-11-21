'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewExpensePage() {
  const [form, setForm] = useState({ description: '', amount: '', category: '', expense_date: new Date().toISOString().split('T')[0] })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    })
    if (res.ok) router.push('/dashboard/expenses')
    else alert('Failed')
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Expense</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <input placeholder="Description *" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full border p-3 rounded-lg" required />
        <input type="number" step="0.01" placeholder="Amount *" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} className="w-full border p-3 rounded-lg" required />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full border p-3 rounded-lg" />
        <input type="date" value={form.expense_date} onChange={(e) => setForm({...form, expense_date: e.target.value})} className="w-full border p-3 rounded-lg" />
        <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-lg">{loading ? 'Saving...' : 'Add Expense'}</button>
      </form>
    </div>
  )
}
