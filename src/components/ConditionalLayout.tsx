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
  const isFotosPage = pathname.includes('/fotos')


  if (isAdminRoute) {
    return <>{children}</>
  }

  if (isFotosPage) {
    return <>{children}</>
  }

  if (isImoveisPage) {
    return (
      <>
        <Header />
        {children}
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
