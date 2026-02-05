import type { Metadata } from 'next'
import ImoveisListagem from './ImoveisListagem'

const CIDADE_LABELS: Record<string, string> = {
  penha: 'Penha',
  'balneario-picarras': 'Balneário Piçarras',
  'barra-velha': 'Barra Velha',
}

const TIPO_LABELS: Record<string, string> = {
  apartamento: 'Apartamentos',
  casa: 'Casas',
  cobertura: 'Coberturas',
  terreno: 'Terrenos',
}

function getMetadataTitle(params: {
  cidade?: string | null
  tipo?: string | null
  status?: string | null
  frenteMar?: string | null
  vistaMar?: string | null
  mobiliado?: string | null
}): string {
  const cidade = params.cidade ? (CIDADE_LABELS[params.cidade] || params.cidade) : null
  const tipo = params.tipo ? (TIPO_LABELS[params.tipo] || params.tipo) : null
  const lancamento = params.status === 'lancamento'
  const frenteMar = params.frenteMar === 'true'
  const vistaMar = params.vistaMar === 'true'
  const mobiliado = params.mobiliado === 'true'
  const extras: string[] = []
  if (frenteMar) extras.push('Frente Mar')
  if (vistaMar) extras.push('Vista Mar')
  if (mobiliado) extras.push('Mobiliados')
  const extraStr = extras.length > 0 ? ` ${extras.join(' e ')}` : ''
  if (lancamento && cidade) return `Empreendimentos em ${cidade}${extraStr}`
  if (lancamento) return `Empreendimentos e Lançamentos${extraStr}`
  if (tipo && cidade) return `${tipo} em ${cidade}${extraStr}`
  if (tipo) return `${tipo} à Venda${extraStr}`
  if (cidade) return `Imóveis em ${cidade}${extraStr}`
  if (extraStr.trim()) return `Imóveis${extraStr}`
  return 'Imóveis à Venda'
}

export function generateMetadata({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}): Metadata {
  const params = searchParams || {}
  const cidade = typeof params.cidade === 'string' ? params.cidade : undefined
  const tipo = typeof params.tipo === 'string' ? params.tipo : undefined
  const status = typeof params.status === 'string' ? params.status : undefined
  const frenteMar = typeof params.frenteMar === 'string' ? params.frenteMar : undefined
  const vistaMar = typeof params.vistaMar === 'string' ? params.vistaMar : undefined
  const mobiliado = typeof params.mobiliado === 'string' ? params.mobiliado : undefined
  const title = getMetadataTitle({ cidade, tipo, status, frenteMar, vistaMar, mobiliado })
  const base = 'Nox Imóveis'
  const description = `Encontre ${title.toLowerCase()} em Penha, Balneário Piçarras e Barra Velha. Apartamentos, casas e terrenos.`
  const search = new URLSearchParams()
  if (cidade) search.set('cidade', cidade)
  if (tipo) search.set('tipo', tipo)
  if (status) search.set('status', status)
  if (frenteMar) search.set('frenteMar', frenteMar)
  if (vistaMar) search.set('vistaMar', vistaMar)
  if (mobiliado) search.set('mobiliado', mobiliado)
  const canonicalUrl = search.toString()
    ? `https://noximobiliaria.com.br/imoveis/?${search.toString()}`
    : 'https://noximobiliaria.com.br/imoveis/'
  return {
    title: `${title} | ${base}`,
    description,
    openGraph: {
      title: `${title} | ${base}`,
      description,
      url: canonicalUrl,
      images: [{ url: 'https://noximobiliaria.com.br/api/image?id=banner-home', width: 1920, height: 1080, alt: 'Nox Imóveis' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${base}`,
      description,
      images: ['https://noximobiliaria.com.br/api/image?id=banner-home'],
    },
    alternates: { canonical: canonicalUrl },
  }
}

export default function ImoveisPage() {
  return <ImoveisListagem />
}
