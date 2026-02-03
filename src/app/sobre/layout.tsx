import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nós - Nox Imóveis',
  description: 'Conheça nossa história, missão e valores. A melhor imobiliária da região.',
  keywords: 'sobre nós, história, missão, valores, equipe, corretores, Nox Imóveis, Santa Catarina',
  openGraph: {
    title: 'Sobre Nós - Nox Imóveis',
    description: 'Conheça nossa história, missão e valores. A melhor imobiliária da região.',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://noximobiliaria.com.br/sobre/',
    images: [{ url: 'https://noximobiliaria.com.br/api/image?id=banner-home', width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: 'https://noximobiliaria.com.br/sobre/' },
}

export default function SobreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
