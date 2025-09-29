import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Viva Barra Velha - Descubra o Paraíso Catarinense | Nox Imóveis',
  description: 'Descubra Barra Velha, o paraíso catarinense com praias deslumbrantes, Beto Carrero World, Cristo Luz e oportunidades de investimento incríveis. Encontre seu imóvel dos sonhos!',
  keywords: 'Barra Velha SC, imóveis Barra Velha, Beto Carrero World, Cristo Luz, praias Barra Velha, investimento imobiliário, Nox Imóveis, viva Barra Velha',
  openGraph: {
    title: 'Viva Barra Velha - Descubra o Paraíso Catarinense | Nox Imóveis',
    description: 'Descubra Barra Velha, o paraíso catarinense com praias deslumbrantes, Beto Carrero World, Cristo Luz e oportunidades de investimento incríveis.',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function VivaBarraVelhaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
