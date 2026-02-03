import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Imóveis à Venda - Nox Imóveis',
  description: 'Encontre imóveis à venda em Penha, Balneário Piçarras e Barra Velha. Apartamentos, casas e terrenos.',
  openGraph: {
    title: 'Imóveis à Venda - Nox Imóveis',
    description: 'Encontre imóveis à venda em Penha, Balneário Piçarras e Barra Velha. Apartamentos, casas e terrenos.',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://noximobiliaria.com.br/imoveis/',
    images: [{ url: 'https://noximobiliaria.com.br/api/image?id=banner-home', width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imóveis à Venda - Nox Imóveis',
    description: 'Encontre imóveis à venda em Penha, Balneário Piçarras e Barra Velha. Apartamentos, casas e terrenos.',
    images: ['https://noximobiliaria.com.br/api/image?id=banner-home'],
  },
  alternates: { canonical: 'https://noximobiliaria.com.br/imoveis/' },
}

export default function ImoveisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
