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
    url: 'https://noximobiliaria.com.br/viva-barra-velha/',
    images: [{ url: 'https://noximobiliaria.com.br/api/image?id=banner-home', width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Viva Barra Velha - Descubra o Paraíso Catarinense | Nox Imóveis',
    description: 'Descubra Barra Velha, o paraíso catarinense com praias deslumbrantes, Beto Carrero World, Cristo Luz e oportunidades de investimento incríveis.',
    images: ['https://noximobiliaria.com.br/api/image?id=banner-home'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: 'https://noximobiliaria.com.br/viva-barra-velha/' },
}

export default function VivaBarraVelhaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
