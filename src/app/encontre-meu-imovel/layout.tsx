import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Encontre seu Imóvel dos Sonhos - Nox Imóveis',
  description: 'Deixe a Nox Imóveis encontrar o imóvel perfeito para você! Preencha nosso formulário e receba as melhores opções de casas, apartamentos e terrenos em Penha, Balneário Piçarras e Barra Velha.',
  keywords: 'encontrar imóvel, busca imóvel, casas para venda, apartamentos para alugar, terrenos, Penha, Balneário Piçarras, Barra Velha, Nox Imóveis',
  openGraph: {
    title: 'Encontre seu Imóvel dos Sonhos - Nox Imóveis',
    description: 'Deixe a Nox Imóveis encontrar o imóvel perfeito para você! Preencha nosso formulário e receba as melhores opções.',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://noximobiliaria.com.br/encontre-meu-imovel/',
    images: [{ url: 'https://noximobiliaria.com.br/api/image?id=banner-home', width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Encontre seu Imóvel dos Sonhos - Nox Imóveis',
    description: 'Deixe a Nox Imóveis encontrar o imóvel perfeito para você! Preencha nosso formulário e receba as melhores opções.',
    images: ['https://noximobiliaria.com.br/api/image?id=banner-home'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: 'https://noximobiliaria.com.br/encontre-meu-imovel/' },
}

export default function EncontreMeuImovelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
