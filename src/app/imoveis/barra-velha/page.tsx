import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Imóveis em Barra Velha - Apartamentos e Casas | Nox Imóveis',
  description: 'Encontre imóveis à venda em Barra Velha SC. Apartamentos, casas, lançamentos frente mar.',
  alternates: { canonical: 'https://noximobiliaria.com.br/imoveis/barra-velha' },
}

export default function BarraVelhaPage() {
  redirect('/imoveis?cidade=barra-velha')
}
