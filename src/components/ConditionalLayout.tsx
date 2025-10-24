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

  console.log('pathname:', pathname, 'isImoveisPage:', isImoveisPage)

  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <div className="h-full flex flex-col">
      <Header />
      <main className={isImoveisPage ? "flex-1 overflow-hidden" : "flex-1"}>
        {children}
      </main>
      {!isImoveisPage && <Footer />}
    </div>
  )
}
