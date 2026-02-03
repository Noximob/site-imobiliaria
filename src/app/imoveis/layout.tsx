import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Imóveis à Venda - Nox Imóveis',
  description: 'Encontre imóveis à venda em Penha, Balneário Piçarras e Barra Velha. Apartamentos, casas e terrenos.',
  alternates: { canonical: 'https://noximobiliaria.com.br/imoveis/' },
}

export default function ImoveisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
