import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anuncie seu Imóvel - Nox Imóveis',
  description: 'Anuncie seu imóvel com a Nox Imóveis. Atendimento personalizado em Penha, Balneário Piçarras e Barra Velha.',
  alternates: { canonical: 'https://noximobiliaria.com.br/anunciar/' },
}

export default function AnunciarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
