import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato - Imobiliária',
  description: 'Entre em contato conosco. Estamos prontos para te ajudar a encontrar o imóvel ideal.',
  openGraph: {
    title: 'Contato - Imobiliária',
    description: 'Entre em contato conosco. Estamos prontos para te ajudar a encontrar o imóvel ideal.',
    type: 'website',
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
