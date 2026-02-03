import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Imóveis em Balneário Piçarras - Apartamentos e Casas | Nox Imóveis',
  description: 'Encontre imóveis à venda em Balneário Piçarras SC. Apartamentos, casas, coberturas e lançamentos.',
  alternates: { canonical: 'https://noximobiliaria.com.br/imoveis/balneario-picarras/' },
}

export default function BalnearioPicarrasPage() {
  redirect('/imoveis?cidade=balneario-picarras')
}
