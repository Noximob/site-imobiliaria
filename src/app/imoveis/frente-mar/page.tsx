import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Imóveis Frente Mar - Penha, Piçarras e Barra Velha | Nox Imóveis',
  description: 'Imóveis frente mar no litoral norte de SC. Apartamentos e casas com vista para o mar.',
  alternates: { canonical: 'https://noximobiliaria.com.br/imoveis/frente-mar' },
}

export default function FrenteMarPage() {
  redirect('/imoveis?frenteMar=true')
}
