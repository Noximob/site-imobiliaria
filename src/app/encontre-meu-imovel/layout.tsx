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
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: 'https://noximobiliaria.com.br/encontre-meu-imovel' },
}

export default function EncontreMeuImovelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
