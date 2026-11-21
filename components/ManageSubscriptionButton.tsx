'use client'

import { useState } from 'react'

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)

  async function openPortal() {
    setLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else alert(data.error || 'Failed to open portal')
    setLoading(false)
  }

  return (
    <button
      onClick={openPortal}
      disabled={loading}
      className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
    >
      {loading ? 'Opening...' : 'Manage Subscription'}
    </button>
  )
}
