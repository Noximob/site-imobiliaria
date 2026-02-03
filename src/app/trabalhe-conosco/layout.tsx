import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trabalhe Conosco - Nox Imóveis',
  description: 'Faça parte da equipe Nox Imóveis. Oportunidades para corretores em Penha, Piçarras e Barra Velha.',
  alternates: { canonical: 'https://noximobiliaria.com.br/trabalhe-conosco/' },
}

export default function TrabalheConoscoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
