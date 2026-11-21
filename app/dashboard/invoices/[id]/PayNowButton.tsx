'use client'

import { useState } from 'react'

export default function PayNowButton({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false)

  async function handlePay() {
    setLoading(true)
    const res = await fetch(`/api/invoices/${invoiceId}/checkout`, { method: 'POST' })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert(data.error || 'Failed to start payment')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? 'Redirecting...' : 'Pay Now (Card or ACH)'}
    </button>
  )
}
