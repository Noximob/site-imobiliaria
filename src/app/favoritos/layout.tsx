import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Favoritos - Nox Imóveis',
  description: 'Seus imóveis favoritos. Nox Imóveis - Penha, Piçarras e Barra Velha.',
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Favoritos - Nox Imóveis',
    description: 'Seus imóveis favoritos. Nox Imóveis - Penha, Piçarras e Barra Velha.',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://noximobiliaria.com.br/favoritos/',
    images: [{ url: 'https://noximobiliaria.com.br/api/image?id=banner-home', width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Favoritos - Nox Imóveis',
    description: 'Seus imóveis favoritos. Nox Imóveis - Penha, Piçarras e Barra Velha.',
    images: ['https://noximobiliaria.com.br/api/image?id=banner-home'],
  },
  alternates: { canonical: 'https://noximobiliaria.com.br/favoritos/' },
}

export default function FavoritosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
