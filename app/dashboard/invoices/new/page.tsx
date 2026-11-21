'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewInvoicePage() {
  const [clientId, setClientId] = useState('')
  const [items, setItems] = useState([{ description: '', quantity: 1, unit_price: 0 }])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function addItem() {
    setItems([...items, { description: '', quantity: 1, unit_price: 0 }])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId || null, items, notes }),
    })
    if (res.ok) router.push('/dashboard/invoices')
    else alert('Failed to create invoice')
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Invoice</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block text-sm mb-1">Client ID (optional for now)</label>
          <input
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Paste client UUID or leave blank"
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Line Items</h2>
            <button type="button" onClick={addItem} className="text-sm underline">
              + Add item
            </button>
          </div>
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 mb-2">
              <input
                className="col-span-6 border p-2 rounded"
                placeholder="Description"
                value={item.description}
                onChange={(e) => {
                  const next = [...items]
                  next[i].description = e.target.value
                  setItems(next)
                }}
                required
              />
              <input
                type="number"
                className="col-span-2 border p-2 rounded"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => {
                  const next = [...items]
                  next[i].quantity = Number(e.target.value)
                  setItems(next)
                }}
              />
              <input
                type="number"
                step="0.01"
                className="col-span-4 border p-2 rounded"
                placeholder="Price"
                value={item.unit_price}
                onChange={(e) => {
                  const next = [...items]
                  next[i].unit_price = Number(e.target.value)
                  setItems(next)
                }}
              />
            </div>
          ))}
        </div>

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border p-3 rounded-lg"
          rows={3}
        />

        <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-lg">
          {loading ? 'Creating...' : 'Create Invoice'}
        </button>
      </form>
    </div>
  )
}
