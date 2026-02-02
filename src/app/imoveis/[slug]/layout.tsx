import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { Octokit } from '@octokit/rest'
import { getFotoPrincipal, formatPrice } from '@/lib/imoveis'

const baseUrl = 'https://noximobiliaria.com.br'

async function getImovelBySlugServer(slug: string): Promise<any | null> {
  try {
    // 1) Tentar GitHub (fonte principal em produção)
    if (process.env.GITHUB_TOKEN) {
      const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
      const { data } = await octokit.repos.getContent({
        owner: 'Noximob',
        repo: 'site-imobiliaria',
        path: 'public/imoveis/imoveis.json',
      })
      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString('utf-8')
        const imoveis = JSON.parse(content).filter((i: any) => i.publicado === true || i.publicado === 'true')
        return imoveis.find((i: any) => i.slug === slug) || null
      }
    }
    // 2) Fallback: arquivo local (build local)
    const imoveisPath = path.join(process.cwd(), 'public/imoveis/imoveis.json')
    if (fs.existsSync(imoveisPath)) {
      const data = fs.readFileSync(imoveisPath, 'utf-8')
      const imoveis = JSON.parse(data).filter((i: any) => i.publicado === true || i.publicado === 'true')
      return imoveis.find((i: any) => i.slug === slug) || null
    }
  } catch {
    // ignorar
  }
  return null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const imovel = await getImovelBySlugServer(slug)

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
  // URL absoluta obrigatória para WhatsApp/Facebook
  const ogImage = fotoPrincipal?.startsWith('http') ? fotoPrincipal : fotoPrincipal ? `${baseUrl}${fotoPrincipal.startsWith('/') ? '' : '/'}${fotoPrincipal}` : undefined

  const openGraph: Metadata['openGraph'] = {
    title: `${titulo} | Nox Imóveis`,
    description: description || `Imóvel à venda - ${titulo}`,
    type: 'website',
    locale: 'pt_BR',
    url: `${baseUrl}/imoveis/${slug}`,
  }
  if (ogImage) {
    openGraph.images = [{ url: ogImage, width: 1200, height: 630, alt: titulo }]
  }

  return {
    title: `${titulo} | Nox Imóveis`,
    description: description || `Imóvel à venda - ${titulo}. Nox Imóveis - Penha, Piçarras e Barra Velha.`,
    openGraph,
    alternates: {
      canonical: `${baseUrl}/imoveis/${slug}`,
    },
  }
}

export default function ImovelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
