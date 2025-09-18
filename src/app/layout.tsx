import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Imobiliária - Encontre o Imóvel dos Seus Sonhos',
  description: 'Encontre casas, apartamentos e terrenos para venda e aluguel. A melhor imobiliária da região com os melhores imóveis.',
  keywords: 'imobiliária, casas, apartamentos, terrenos, venda, aluguel, imóveis',
  authors: [{ name: 'Imobiliária' }],
  openGraph: {
    title: 'Imobiliária - Encontre o Imóvel dos Seus Sonhos',
    description: 'Encontre casas, apartamentos e terrenos para venda e aluguel. A melhor imobiliária da região com os melhores imóveis.',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
