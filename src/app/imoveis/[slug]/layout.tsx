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

function toAbsUrl(url: string): string {
  if (!url) return ''
  return url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

export default async function ImovelLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const imovel = await getImovelBySlugServer(slug)

  const cidadeSlug = imovel?.endereco?.cidade ?? ''
  const cidadeNome =
    cidadeSlug === 'barra-velha'
      ? 'Barra Velha'
      : cidadeSlug === 'balneario-picarras'
        ? 'Balneário Piçarras'
        : cidadeSlug === 'penha'
          ? 'Penha'
          : cidadeSlug || 'Imóveis'

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Imóveis', item: `${baseUrl}/imoveis` },
      { '@type': 'ListItem', position: 3, name: cidadeNome, item: `${baseUrl}/imoveis?cidade=${cidadeSlug}` },
      { '@type': 'ListItem', position: 4, name: imovel?.titulo ?? 'Imóvel', item: `${baseUrl}/imoveis/${slug}` },
    ],
  }

  const jsonLd = imovel
    ? {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: imovel.titulo || 'Imóvel',
        description: imovel.descricao?.substring(0, 200) || imovel.titulo,
        url: `${baseUrl}/imoveis/${slug}`,
        image: (imovel.fotos || []).slice(0, 5).map((f: string) => toAbsUrl(f)),
        address: imovel.endereco
          ? {
              '@type': 'PostalAddress',
              streetAddress: [imovel.endereco.rua, imovel.endereco.numero].filter(Boolean).join(', '),
              addressLocality: imovel.endereco.bairro,
              addressRegion: imovel.endereco.estado,
              addressCountry: 'BR',
            }
          : undefined,
        numberOfRooms: imovel.caracteristicas?.quartos || undefined,
        floorSize: imovel.caracteristicas?.area
          ? { '@type': 'QuantitativeValue', value: imovel.caracteristicas.area, unitCode: 'MTK' }
          : undefined,
        offers: imovel.preco
          ? {
              '@type': 'Offer',
              price: imovel.preco,
              priceCurrency: 'BRL',
            }
          : undefined,
      }
    : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  )
}
