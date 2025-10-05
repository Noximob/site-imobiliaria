import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Administrador - Nox Imóveis',
  description: 'Painel administrativo da Nox Imóveis',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  )
}
