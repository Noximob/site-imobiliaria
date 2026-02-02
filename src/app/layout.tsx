import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://noximobiliaria.com.br'),
  title: 'Imobiliária - Encontre o Imóvel dos Seus Sonhos',
  description: 'Encontre casas, apartamentos e terrenos para venda e aluguel. A melhor imobiliária da região com os melhores imóveis.',
  keywords: 'imobiliária, casas, apartamentos, terrenos, venda, aluguel, imóveis',
  authors: [{ name: 'Imobiliária' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-N7ZT76PDDH'

  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
        </Script>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
