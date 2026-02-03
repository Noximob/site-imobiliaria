import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Viva Penha - Descubra o Paraíso Catarinense | Nox Imóveis',
  description: 'Descubra Penha, o paraíso catarinense com praias deslumbrantes, Beto Carrero World, Cristo Luz e oportunidades de investimento incríveis. Encontre seu imóvel dos sonhos!',
  keywords: 'Penha SC, imóveis Penha, Beto Carrero World, Cristo Luz, praias Penha, investimento imobiliário, Nox Imóveis, viva Penha',
  openGraph: {
    title: 'Viva Penha - Descubra o Paraíso Catarinense | Nox Imóveis',
    description: 'Descubra Penha, o paraíso catarinense com praias deslumbrantes, Beto Carrero World, Cristo Luz e oportunidades de investimento incríveis.',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: 'https://noximobiliaria.com.br/viva-penha/' },
}

export default function VivaPenhaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
