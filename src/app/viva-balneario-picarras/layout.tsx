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
    url: 'https://noximobiliaria.com.br/viva-balneario-picarras/',
    images: [{ url: 'https://noximobiliaria.com.br/api/image?id=banner-home', width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: 'https://noximobiliaria.com.br/viva-balneario-picarras/' },
}

export default function VivaBalnearioPicarrasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
