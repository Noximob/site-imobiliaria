import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Nox Imóveis',
  description: 'Artigos sobre imóveis, investimento e o litoral de Santa Catarina. Penha, Piçarras e Barra Velha.',
  openGraph: {
    title: 'Blog - Nox Imóveis',
    description: 'Artigos sobre imóveis, investimento e o litoral de Santa Catarina. Penha, Piçarras e Barra Velha.',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://noximobiliaria.com.br/blog/',
    images: [{ url: 'https://noximobiliaria.com.br/api/image?id=banner-home', width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Nox Imóveis',
    description: 'Artigos sobre imóveis, investimento e o litoral de Santa Catarina. Penha, Piçarras e Barra Velha.',
    images: ['https://noximobiliaria.com.br/api/image?id=banner-home'],
  },
  alternates: { canonical: 'https://noximobiliaria.com.br/blog/' },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
