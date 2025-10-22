'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/administrador')
  const isImoveisPage = pathname === '/imoveis'

  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      {!isImoveisPage && <Footer />}
    </>
  )
}
