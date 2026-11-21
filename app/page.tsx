import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-4">KuberaBooks</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your fully owned Freshbooks alternative. $10/month for businesses, landlords & contractors. Free for the owner.
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="border border-black px-6 py-3 rounded-lg hover:bg-gray-100"
          >
            Get Started — $10/mo
          </Link>
        </div>
      </div>
    </main>
  )
}
