import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'
import { getText } from '@/lib/site-texts'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://noximobiliaria.com.br'),
  title: 'Nox Imóveis - Imóveis em Penha, Balneário Piçarras e Barra Velha',
  description: 'Encontre o imóvel dos seus sonhos em Penha, Balneário Piçarras e Barra Velha. Apartamentos, casas e terrenos com a melhor imobiliária da região.',
  keywords: 'imobiliária, casas, apartamentos, terrenos, venda, aluguel, imóveis',
  authors: [{ name: 'Nox Imóveis' }],
  icons: {
    // PNG 48x48 primeiro para o Google usar na bolinha dos resultados de busca (preferem PNG/ICO)
    icon: [
      { url: '/icon', type: 'image/png', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Nox Imóveis - Imóveis em Penha, Balneário Piçarras e Barra Velha',
    description: 'Encontre o imóvel dos seus sonhos em Penha, Balneário Piçarras e Barra Velha. Apartamentos, casas e terrenos com a melhor imobiliária da região.',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://noximobiliaria.com.br/',
    images: [
      {
        url: 'https://noximobiliaria.com.br/api/image?id=banner-home',
        width: 1920,
        height: 1080,
        alt: 'Nox Imóveis - Imóveis em Penha, Balneário Piçarras e Barra Velha',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nox Imóveis - Imóveis em Penha, Balneário Piçarras e Barra Velha',
    description: 'Encontre o imóvel dos seus sonhos em Penha, Balneário Piçarras e Barra Velha. Apartamentos, casas e terrenos com a melhor imobiliária da região.',
    images: ['https://noximobiliaria.com.br/api/image?id=banner-home'],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? 'googlee2ad78a0c2991fa4',
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
      <head>
        {/* Favicon 48x48 PNG para Google usar na bolinha dos resultados de busca */}
        <link rel="icon" type="image/png" sizes="48x48" href="/icon" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title="Blog Nox Imóveis" href="https://noximobiliaria.com.br/blog/rss.xml" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nox Imóveis" />
        {/* Preload banner da home para LCP - Core Web Vitals */}
        <link
          rel="preload"
          as="image"
          href="https://noximobiliaria.com.br/api/image?id=banner-home"
          fetchPriority="high"
        />
      </head>
      <body className={`${inter.className} h-full`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Nox Imóveis',
              url: 'https://noximobiliaria.com.br',
              logo: 'https://noximobiliaria.com.br/imagens/logo-nox-imoveis-penha-picarras-barra-velha.png',
              telephone: '+5547997530113',
              address: {
                '@type': 'PostalAddress',
                streetAddress: getText('footer.central_atendimento.endereco'),
                addressLocality: 'Penha',
                addressRegion: 'SC',
                addressCountry: 'BR',
              },
              areaServed: [
                { '@type': 'City', name: 'Penha' },
                { '@type': 'City', name: 'Balneário Piçarras' },
                { '@type': 'City', name: 'Barra Velha' },
              ],
            }),
          }}
        />
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
