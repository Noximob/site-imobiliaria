import { NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'
import fs from 'fs'
import path from 'path'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
// Dono do repositório no GitHub (usar sempre minúsculo para evitar URLs com UPPERCASE)
const REPO_OWNER = 'noximob'
const REPO_NAME = 'site-imobiliaria'
const IMOVEIS_PATH = 'public/imoveis/imoveis.json'
const baseUrl = 'https://noximobiliaria.com.br'

type ImovelSitemap = {
  slug: string
  updatedAt?: string
  createdAt?: string
  fotos?: string[]
  fotoPrincipalDWV?: string
  fotoPrincipalIndex?: number
}

async function getImoveisFromGitHub(): Promise<ImovelSitemap[]> {
  try {
    if (!process.env.GITHUB_TOKEN) return []
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: IMOVEIS_PATH,
    })
    if (!('content' in data)) return []
    const imoveis = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'))
    return imoveis
      .filter((i: any) => i.publicado === true || i.publicado === 'true' || i.publicado === 1)
      .map((i: any) => ({
        slug: i.slug,
        updatedAt: i.updatedAt,
        createdAt: i.createdAt,
        fotos: i.fotos || [],
        fotoPrincipalDWV: i.fotoPrincipalDWV,
        fotoPrincipalIndex: i.fotoPrincipalIndex ?? 0,
      }))
  } catch (e: any) {
    if (e?.status === 404) return []
    console.error('Erro ao buscar imóveis do GitHub para sitemap:', e)
    return []
  }
}

function getImovelImagesForSitemap(imovel: ImovelSitemap): string[] {
  const principal =
    imovel.fotoPrincipalDWV ||
    imovel.fotos?.[imovel.fotoPrincipalIndex ?? 0] ||
    imovel.fotos?.[0]
  if (!principal) return []
  const urls: string[] = [principal]
  const fotos = imovel.fotos || []
  fotos.forEach((url) => {
    if (url !== principal && urls.length < 10) urls.push(url)
  })
  return urls
}

function escapeXml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  try {
    const staticUrls = [
      { url: `${baseUrl}/`, lastmod: new Date(), changefreq: 'daily', priority: 1, images: [] as string[] },
      { url: `${baseUrl}/imoveis/`, lastmod: new Date(), changefreq: 'daily', priority: 0.9, images: [] as string[] },
      { url: `${baseUrl}/contato/`, lastmod: new Date(), changefreq: 'monthly', priority: 0.7, images: [] as string[] },
      { url: `${baseUrl}/sobre/`, lastmod: new Date(), changefreq: 'monthly', priority: 0.7, images: [] as string[] },
      { url: `${baseUrl}/anunciar/`, lastmod: new Date(), changefreq: 'monthly', priority: 0.7, images: [] as string[] },
      { url: `${baseUrl}/trabalhe-conosco/`, lastmod: new Date(), changefreq: 'monthly', priority: 0.6, images: [] as string[] },
      { url: `${baseUrl}/como-comprar/`, lastmod: new Date(), changefreq: 'monthly', priority: 0.6, images: [] as string[] },
      { url: `${baseUrl}/encontre-meu-imovel/`, lastmod: new Date(), changefreq: 'monthly', priority: 0.7, images: [] as string[] },
      { url: `${baseUrl}/viva-penha/`, lastmod: new Date(), changefreq: 'monthly', priority: 0.7, images: [] as string[] },
      { url: `${baseUrl}/viva-balneario-picarras/`, lastmod: new Date(), changefreq: 'monthly', priority: 0.7, images: [] as string[] },
      { url: `${baseUrl}/viva-barra-velha/`, lastmod: new Date(), changefreq: 'monthly', priority: 0.7, images: [] as string[] },
      { url: `${baseUrl}/favoritos/`, lastmod: new Date(), changefreq: 'weekly', priority: 0.5, images: [] as string[] },
      { url: `${baseUrl}/blog/`, lastmod: new Date(), changefreq: 'weekly', priority: 0.7, images: [] as string[] },
      { url: `${baseUrl}/imoveis/penha/`, lastmod: new Date(), changefreq: 'weekly', priority: 0.85, images: [] as string[] },
      { url: `${baseUrl}/imoveis/balneario-picarras/`, lastmod: new Date(), changefreq: 'weekly', priority: 0.85, images: [] as string[] },
      { url: `${baseUrl}/imoveis/barra-velha/`, lastmod: new Date(), changefreq: 'weekly', priority: 0.85, images: [] as string[] },
      { url: `${baseUrl}/imoveis/apartamentos/`, lastmod: new Date(), changefreq: 'weekly', priority: 0.85, images: [] as string[] },
      { url: `${baseUrl}/imoveis/frente-mar/`, lastmod: new Date(), changefreq: 'weekly', priority: 0.85, images: [] as string[] },
      { url: `${baseUrl}/guia-imovel-na-planta-litoral-sc/`, lastmod: new Date(), changefreq: 'monthly', priority: 0.7, images: [] as string[] },
      { url: `${baseUrl}/perguntas-frequentes-imovel-na-planta/`, lastmod: new Date(), changefreq: 'monthly', priority: 0.7, images: [] as string[] },
      { url: `${baseUrl}/como-comprar-imovel-na-planta/`, lastmod: new Date(), changefreq: 'monthly', priority: 0.6, images: [] as string[] },
      { url: `${baseUrl}/fluxo-pagamento-imovel-na-planta/`, lastmod: new Date(), changefreq: 'monthly', priority: 0.6, images: [] as string[] },
      { url: `${baseUrl}/usar-fgts-imovel-na-planta/`, lastmod: new Date(), changefreq: 'monthly', priority: 0.6, images: [] as string[] },
      { url: `${baseUrl}/investir-imovel-na-planta-litoral/`, lastmod: new Date(), changefreq: 'monthly', priority: 0.6, images: [] as string[] },
      { url: `${baseUrl}/frente-mar-vs-quadra-mar/`, lastmod: new Date(), changefreq: 'monthly', priority: 0.6, images: [] as string[] },
      { url: `${baseUrl}/seguranca-imovel-na-planta/`, lastmod: new Date(), changefreq: 'monthly', priority: 0.6, images: [] as string[] },
    ]

    let blogUrls: { url: string; lastmod: Date; changefreq: string; priority: number; images: string[] }[] = []
    try {
      const artigosPath = path.join(process.cwd(), 'public/blog/artigos.json')
      if (fs.existsSync(artigosPath)) {
        const data = fs.readFileSync(artigosPath, 'utf-8')
        const artigos = JSON.parse(data).filter((a: { publicado?: boolean }) => a.publicado === true)
        blogUrls = artigos.map((a: { slug: string; updatedAt?: string; dataPublicacao?: string }) => ({
          url: `${baseUrl}/blog/${a.slug}/`,
          lastmod: a.updatedAt || a.dataPublicacao ? new Date(a.updatedAt || a.dataPublicacao || '') : new Date(),
          changefreq: 'monthly',
          priority: 0.6,
          images: [] as string[],
        }))
      }
    } catch {
      // ignorar
    }

    const imoveis = await getImoveisFromGitHub()
    const imoveisUrls = imoveis.map((imovel) => {
      const images = getImovelImagesForSitemap(imovel)
      return {
        url: `${baseUrl}/imoveis/${imovel.slug}/`,
        lastmod: new Date(imovel.updatedAt || imovel.createdAt || Date.now()),
        changefreq: 'weekly',
        priority: 0.8,
        images,
      }
    })

    const allUrls = [...staticUrls, ...blogUrls, ...imoveisUrls]
    const hasImages = allUrls.some((u) => u.images.length > 0)

    const urlEntries = allUrls.map((entry) => {
      const imageTags =
        entry.images.length > 0
          ? entry.images
              .map(
                (img) => `
    <image:image>
      <image:loc>${escapeXml(img)}</image:loc>
    </image:image>`
              )
              .join('')
          : ''
      return `
  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastmod.toISOString()}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>${imageTags}
  </url>`
    })

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${hasImages ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : ''}>
${urlEntries.join('')}
</urlset>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error)
    return new NextResponse('Erro ao gerar sitemap', { status: 500 })
  }
}
