'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MakeRecurringButton({ invoiceId }: { invoiceId: string }) {
  const [open, setOpen] = useState(false)
  const [frequency, setFrequency] = useState('monthly')
  const [dueDays, setDueDays] = useState(30)
  const [autoSend, setAutoSend] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCreate() {
    setLoading(true)
    const res = await fetch('/api/recurring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template_invoice_id: invoiceId,
        frequency,
        due_days: dueDays,
        auto_send: autoSend,
        next_issue_date: new Date().toISOString().split('T')[0],
      }),
    })
    if (res.ok) {
      setOpen(false)
      router.refresh()
      alert('Recurring invoice created')
    } else {
      alert('Failed to create recurring invoice')
    }
    setLoading(false)
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="border px-3 py-2 rounded-lg text-sm">
        Make Recurring
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full space-y-4">
            <h3 className="text-lg font-semibold">Create Recurring Invoice</h3>
            <div>
              <label className="block text-sm mb-1">Frequency</label>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full border p-2 rounded">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Due in (days)</label>
              <input type="number" value={dueDays} onChange={(e) => setDueDays(Number(e.target.value))} className="w-full border p-2 rounded" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={autoSend} onChange={(e) => setAutoSend(e.target.checked)} />
              Automatically send when generated
            </label>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setOpen(false)} className="px-4 py-2">Cancel</button>
              <button onClick={handleCreate} disabled={loading} className="bg-black text-white px-4 py-2 rounded">
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
