import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Apartamentos à Venda - Penha, Piçarras e Barra Velha | Nox Imóveis',
  description: 'Apartamentos à venda no litoral norte de SC. Penha, Balneário Piçarras e Barra Velha. Lançamentos e prontos.',
  alternates: { canonical: 'https://noximobiliaria.com.br/imoveis/apartamentos/' },
}

export default function ApartamentosPage() {
  redirect('/imoveis?tipo=apartamento')
}
