import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato - Imobiliária',
  description: 'Entre em contato conosco. Estamos prontos para te ajudar a encontrar o imóvel ideal.',
  openGraph: {
    title: 'Contato - Nox Imóveis',
    description: 'Entre em contato conosco. Estamos prontos para te ajudar a encontrar o imóvel ideal.',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://noximobiliaria.com.br/contato/',
    images: [{ url: 'https://noximobiliaria.com.br/api/image?id=banner-home', width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  alternates: { canonical: 'https://noximobiliaria.com.br/contato/' },
}

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
