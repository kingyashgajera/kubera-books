import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KuberaBooks',
  description: 'Your owned invoicing platform — $10/mo for everyone else, free for you.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}
