'use client'

import { useState } from 'react'

export default function BillingPage() {
  const [loading, setLoading] = useState(false)

  async function startCheckout() {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else alert(data.error || 'Failed to start checkout')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow text-center space-y-6">
        <h1 className="text-2xl font-bold">Subscribe to KuberaBooks</h1>
        <p className="text-gray-600">$10/month — full access for your business, landlord, or contractor needs.</p>
        <button
          onClick={startCheckout}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          {loading ? 'Redirecting...' : 'Subscribe for $10/month'}
        </button>
        <p className="text-sm text-gray-500">Owner account is free forever.</p>
      </div>
    </div>
  )
}
