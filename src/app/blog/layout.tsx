import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Nox Imóveis',
  description: 'Artigos sobre imóveis, investimento e o litoral de Santa Catarina. Penha, Piçarras e Barra Velha.',
  alternates: { canonical: 'https://noximobiliaria.com.br/blog' },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
