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

/** Formata preço curto para título (ex: "R$ 500 mil") */
function formatPriceShortMeta(value: number): string {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1).replace('.', ',')} mi`
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)} mil`
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value)
}

function getMetadataTitle(params: {
  cidade?: string | null
  tipo?: string | null
  status?: string | null
  frenteMar?: string | null
  vistaMar?: string | null
  mobiliado?: string | null
  quartos?: string | string[]
  dataEntrega?: string | string[]
  valorMin?: string | null
  valorMax?: string | null
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

  const quartosRaw = params.quartos !== undefined ? (Array.isArray(params.quartos) ? params.quartos : [params.quartos]) : []
  const qArr = quartosRaw.map((x) => parseInt(String(x), 10)).filter((n) => !isNaN(n))
  let quartosStr = ''
  if (qArr.length > 0) {
    if (qArr.includes(4) && qArr.length === 1) quartosStr = ' com 4 ou mais Quartos'
    else if (qArr.length === 1) quartosStr = ` de ${qArr[0]} ${qArr[0] === 1 ? 'Quarto' : 'Quartos'}`
    else quartosStr = ` de ${[...qArr].sort((a, b) => a - b).join(', ')} Quartos`
  }

  const deRaw = params.dataEntrega !== undefined ? (Array.isArray(params.dataEntrega) ? params.dataEntrega : [params.dataEntrega]) : []
  let entregaStr = ''
  if (deRaw.length > 0) {
    const temEntregues = deRaw.some((d) => String(d).toLowerCase() === 'entregues' || String(d).toLowerCase() === 'prontos')
    const anos = deRaw.map((d) => parseInt(String(d), 10)).filter((n) => !isNaN(n)).sort((a, b) => a - b)
    if (temEntregues && anos.length > 0) entregaStr = ` Entregues e em ${anos.join(', ')}`
    else if (temEntregues) entregaStr = ' Entregues'
    else if (anos.length > 0) entregaStr = ` com Entrega em ${anos.join(', ')}`
  }

  const valorMin = params.valorMin ? Number(params.valorMin) : undefined
  const valorMax = params.valorMax ? Number(params.valorMax) : undefined
  let precoStr = ''
  if (valorMax != null && !isNaN(valorMax) && (valorMin == null || isNaN(valorMin))) precoStr = ` até ${formatPriceShortMeta(valorMax)}`
  else if (valorMin != null && !isNaN(valorMin) && (valorMax == null || isNaN(valorMax))) precoStr = ` acima de ${formatPriceShortMeta(valorMin)}`
  else if (valorMin != null && !isNaN(valorMin) && valorMax != null && !isNaN(valorMax)) precoStr = ` de ${formatPriceShortMeta(valorMin)} a ${formatPriceShortMeta(valorMax)}`

  const suffix = `${quartosStr}${extraStr}${entregaStr}${precoStr}`.trim()

  if (lancamento && cidade) return `Empreendimentos em ${cidade}${suffix ? ` – ${suffix}` : ''}`
  if (lancamento) return `Empreendimentos e Lançamentos${suffix ? ` – ${suffix}` : ''}`
  if (tipo && cidade) return `${tipo} em ${cidade}${suffix ? ` – ${suffix}` : ''}`
  if (tipo) return `${tipo} à Venda${suffix ? ` – ${suffix}` : ''}`
  if (cidade) return `Imóveis em ${cidade}${suffix ? ` – ${suffix}` : ''}`
  if (extraStr.trim()) return `Imóveis${extraStr}${quartosStr}${entregaStr}${precoStr}`.trim()
  if (suffix) return `Imóveis à Venda – ${suffix}`
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
  const quartos = params.quartos !== undefined ? (Array.isArray(params.quartos) ? params.quartos : [params.quartos]) : undefined
  const dataEntrega = params.dataEntrega !== undefined ? (Array.isArray(params.dataEntrega) ? params.dataEntrega : [params.dataEntrega]) : undefined
  const valorMin = typeof params.valorMin === 'string' ? params.valorMin : undefined
  const valorMax = typeof params.valorMax === 'string' ? params.valorMax : undefined
  const title = getMetadataTitle({ cidade, tipo, status, frenteMar, vistaMar, mobiliado, quartos, dataEntrega, valorMin, valorMax })
  const base = 'Nox Imóveis'
  const description = `Encontre ${title.toLowerCase()} em Penha, Balneário Piçarras e Barra Velha. Apartamentos, casas e terrenos.`
  const search = new URLSearchParams()
  if (cidade) search.set('cidade', cidade)
  if (tipo) search.set('tipo', tipo)
  if (status) search.set('status', status)
  if (frenteMar) search.set('frenteMar', frenteMar)
  if (vistaMar) search.set('vistaMar', vistaMar)
  if (mobiliado) search.set('mobiliado', mobiliado)
  if (valorMin) search.set('valorMin', valorMin)
  if (valorMax) search.set('valorMax', valorMax)
  if (quartos?.length) quartos.forEach((q) => search.append('quartos', String(q)))
  if (dataEntrega?.length) dataEntrega.forEach((d) => search.append('dataEntrega', String(d)))
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
