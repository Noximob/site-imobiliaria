import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Favoritos - Nox Imóveis',
  description: 'Seus imóveis favoritos. Nox Imóveis - Penha, Piçarras e Barra Velha.',
  alternates: { canonical: 'https://noximobiliaria.com.br/favoritos' },
}

export default function FavoritosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
