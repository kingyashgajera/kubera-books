import { createClient } from '@/lib/supabase/server'
import { requireActiveSubscription } from '@/lib/organizations'
import Link from 'next/link'
import ManageSubscriptionButton from '@/components/ManageSubscriptionButton'

export default async function DashboardPage() {
  const org = await requireActiveSubscription()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isOwner = org.is_owner_org

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600 mb-2">
              {org.name} • {user?.email} {isOwner && '(Owner — Free forever)'}
            </p>
            <p className="text-sm">
              Status: <span className="font-medium capitalize">{org.subscription_status}</span>
              {!isOwner && org.subscription_status === 'active' && ' • $10/month'}
            </p>
          </div>
          {!isOwner && <ManageSubscriptionButton />}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Link href="/dashboard/clients" className="bg-white p-6 rounded-xl shadow hover:shadow-md text-center">
            <h2 className="font-semibold">Clients</h2>
          </Link>
          <Link href="/dashboard/invoices" className="bg-white p-6 rounded-xl shadow hover:shadow-md text-center">
            <h2 className="font-semibold">Invoices</h2>
          </Link>
          <Link href="/dashboard/recurring" className="bg-white p-6 rounded-xl shadow hover:shadow-md text-center">
            <h2 className="font-semibold">Recurring</h2>
          </Link>
          <Link href="/dashboard/payments" className="bg-white p-6 rounded-xl shadow hover:shadow-md text-center">
            <h2 className="font-semibold">Payments</h2>
          </Link>
          <Link href="/dashboard/expenses" className="bg-white p-6 rounded-xl shadow hover:shadow-md text-center">
            <h2 className="font-semibold">Expenses</h2>
          </Link>
        </div>
      </div>
    </div>
  )
}