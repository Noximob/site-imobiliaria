import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Viva Balneário Piçarras - Descubra o Paraíso Catarinense | Nox Imóveis',
  description: 'Descubra Balneário Piçarras, o paraíso catarinense com praias deslumbrantes, Unipraias, Cristo Luz e oportunidades de investimento incríveis. Encontre seu imóvel dos sonhos!',
  keywords: 'Balneário Piçarras SC, imóveis Balneário Piçarras, Unipraias, Cristo Luz, praias Balneário Piçarras, investimento imobiliário, Nox Imóveis, viva Balneário Piçarras',
  openGraph: {
    title: 'Viva Balneário Piçarras - Descubra o Paraíso Catarinense | Nox Imóveis',
    description: 'Descubra Balneário Piçarras, o paraíso catarinense com praias deslumbrantes, Unipraias, Cristo Luz e oportunidades de investimento incríveis.',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function VivaBalnearioPicarrasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
