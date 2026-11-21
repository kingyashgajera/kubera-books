'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'apple_cash', label: 'Apple Cash' },
  { value: 'cash', label: 'Cash' },
  { value: 'other', label: 'Other' },
]

export default function AddPaymentForm({ invoiceId, amountDue }: { invoiceId: string; amountDue: number }) {
  const [amount, setAmount] = useState(amountDue.toFixed(2))
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [method, setMethod] = useState('bank_transfer')
  const [notes, setNotes] = useState('')
  const [notify, setNotify] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoice_id: invoiceId,
        amount: Number(amount),
        payment_date: date,
        payment_method: method,
        notes,
        send_notification: notify,
      }),
    })
    if (res.ok) {
      router.refresh()
      setAmount((amountDue - Number(amount)).toFixed(2))
    } else {
      alert('Failed to record payment')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Payment Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border p-3 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Payment Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Payment Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full border p-3 rounded-lg"
        >
          {METHODS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Payment Notes (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border p-3 rounded-lg"
          rows={2}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
        Send client a payment notification email
      </label>

      <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg">
        {loading ? 'Adding...' : 'Add Payment'}
      </button>
    </form>
  )
}
