import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { getFotoPrincipal } from '@/lib/imoveis'
import { formatPrice } from '@/lib/imoveis'

const baseUrl = 'https://noximobiliaria.com.br'

function getImovelBySlugServer(slug: string): any | null {
  try {
    const imoveisPath = path.join(process.cwd(), 'public/imoveis/imoveis.json')
    if (!fs.existsSync(imoveisPath)) return null
    const data = fs.readFileSync(imoveisPath, 'utf-8')
    const imoveis = JSON.parse(data).filter((i: any) => i.publicado === true || i.publicado === 'true')
    return imoveis.find((i: any) => i.slug === slug) || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const imovel = getImovelBySlugServer(slug)

  if (!imovel) {
    return {
      title: 'Imóvel não encontrado | Nox Imóveis',
    }
  }

  const titulo = imovel.titulo || 'Imóvel'
  const cidade = imovel.endereco?.cidade || ''
  const preco = imovel.preco ? formatPrice(imovel.preco) : ''
  const quartos = imovel.caracteristicas?.quartos || 0
  const area = imovel.caracteristicas?.area || 0

  const description = [
    titulo,
    cidade && `em ${cidade}`,
    preco && `- ${preco}`,
    quartos > 0 && `${quartos} quartos`,
    area > 0 && `${area}m²`,
  ]
    .filter(Boolean)
    .join(' ')

  const fotoPrincipal = getFotoPrincipal(imovel)
  const ogImage = fotoPrincipal?.startsWith('http') ? fotoPrincipal : fotoPrincipal ? `${baseUrl}${fotoPrincipal.startsWith('/') ? '' : '/'}${fotoPrincipal}` : undefined

  return {
    title: `${titulo} | Nox Imóveis`,
    description: description || `Imóvel à venda - ${titulo}. Nox Imóveis - Penha, Piçarras e Barra Velha.`,
    openGraph: {
      title: `${titulo} | Nox Imóveis`,
      description: description || `Imóvel à venda - ${titulo}`,
      type: 'website',
      locale: 'pt_BR',
      url: `${baseUrl}/imoveis/${slug}`,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: titulo }] : undefined,
    },
    alternates: {
      canonical: `${baseUrl}/imoveis/${slug}`,
    },
  }
}

export default function ImovelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
