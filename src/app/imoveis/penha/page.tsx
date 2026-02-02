import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Imóveis em Penha - Apartamentos e Casas | Nox Imóveis',
  description: 'Encontre imóveis à venda em Penha SC. Apartamentos, casas e terrenos. Lançamentos, frente mar e mobiliados.',
  alternates: { canonical: 'https://noximobiliaria.com.br/imoveis/penha' },
}

export default function PenhaPage() {
  redirect('/imoveis?cidade=penha')
}
