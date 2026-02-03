import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anuncie seu Imóvel - Nox Imóveis',
  description: 'Anuncie seu imóvel com a Nox Imóveis. Atendimento personalizado em Penha, Balneário Piçarras e Barra Velha.',
  openGraph: {
    title: 'Anuncie seu Imóvel - Nox Imóveis',
    description: 'Anuncie seu imóvel com a Nox Imóveis. Atendimento personalizado em Penha, Balneário Piçarras e Barra Velha.',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://noximobiliaria.com.br/anunciar/',
    images: [{ url: 'https://noximobiliaria.com.br/api/image?id=banner-home', width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anuncie seu Imóvel - Nox Imóveis',
    description: 'Anuncie seu imóvel com a Nox Imóveis. Atendimento personalizado em Penha, Balneário Piçarras e Barra Velha.',
    images: ['https://noximobiliaria.com.br/api/image?id=banner-home'],
  },
  alternates: { canonical: 'https://noximobiliaria.com.br/anunciar/' },
}

export default function AnunciarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
