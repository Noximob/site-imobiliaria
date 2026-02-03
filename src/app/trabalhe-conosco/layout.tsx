import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trabalhe Conosco - Nox Imóveis',
  description: 'Faça parte da equipe Nox Imóveis. Oportunidades para corretores em Penha, Piçarras e Barra Velha.',
  openGraph: {
    title: 'Trabalhe Conosco - Nox Imóveis',
    description: 'Faça parte da equipe Nox Imóveis. Oportunidades para corretores em Penha, Piçarras e Barra Velha.',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://noximobiliaria.com.br/trabalhe-conosco/',
    images: [{ url: 'https://noximobiliaria.com.br/api/image?id=banner-home', width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  alternates: { canonical: 'https://noximobiliaria.com.br/trabalhe-conosco/' },
}

export default function TrabalheConoscoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
