import { MetadataRoute } from 'next'
import { Octokit } from '@octokit/rest'
import fs from 'fs'
import path from 'path'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'
const IMOVEIS_PATH = 'public/imoveis/imoveis.json'

async function getImoveisFromGitHub(): Promise<{ slug: string; updatedAt?: string; createdAt?: string }[]> {
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
      }))
  } catch (e: any) {
    if (e?.status === 404) return []
    console.error('Erro ao buscar imóveis do GitHub para sitemap:', e)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://noximobiliaria.com.br'

  // Páginas estáticas (URLs com trailing slash para alinhar com trailingSlash: true)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/imoveis/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contato/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sobre/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/anunciar/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/trabalhe-conosco/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/como-comprar/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/encontre-meu-imovel/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/viva-penha/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/viva-balneario-picarras/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/viva-barra-velha/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/favoritos/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    { url: `${baseUrl}/imoveis/penha/`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${baseUrl}/imoveis/balneario-picarras/`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${baseUrl}/imoveis/barra-velha/`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${baseUrl}/imoveis/apartamentos/`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${baseUrl}/imoveis/frente-mar/`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
  ]

  // Buscar artigos do blog publicados
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const artigosPath = path.join(process.cwd(), 'public/blog/artigos.json')
    if (fs.existsSync(artigosPath)) {
      const data = fs.readFileSync(artigosPath, 'utf-8')
      const artigos = JSON.parse(data).filter((a: { publicado?: boolean }) => a.publicado === true)
      blogPages = artigos.map((artigo: { slug: string; updatedAt?: string; dataPublicacao?: string }) => ({
        url: `${baseUrl}/blog/${artigo.slug}/`,
        lastModified: artigo.updatedAt || artigo.dataPublicacao ? new Date(artigo.updatedAt || artigo.dataPublicacao || '') : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('Erro ao buscar artigos do blog para sitemap:', error)
  }

  // Buscar todos os imóveis publicados diretamente do GitHub (não depende de NEXT_PUBLIC_SITE_URL)
  let imoveisPages: MetadataRoute.Sitemap = []
  try {
    const imoveis = await getImoveisFromGitHub()
    imoveisPages = imoveis.map((imovel) => ({
      url: `${baseUrl}/imoveis/${imovel.slug}/`,
      lastModified: imovel.updatedAt || imovel.createdAt ? new Date(imovel.updatedAt || imovel.createdAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Erro ao buscar imóveis para sitemap:', error)
  }

  // Combinar todas as páginas
  return [...staticPages, ...blogPages, ...imoveisPages]
}
