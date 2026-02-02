import { MetadataRoute } from 'next'
import { getAllImoveis } from '@/lib/imoveis'
import fs from 'fs'
import path from 'path'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://noximobiliaria.com.br'

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/imoveis`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/anunciar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/trabalhe-conosco`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/como-comprar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/encontre-meu-imovel`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/viva-penha`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/viva-balneario-picarras`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/viva-barra-velha`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/favoritos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Buscar artigos do blog publicados
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const artigosPath = path.join(process.cwd(), 'public/blog/artigos.json')
    if (fs.existsSync(artigosPath)) {
      const data = fs.readFileSync(artigosPath, 'utf-8')
      const artigos = JSON.parse(data).filter((a: { publicado?: boolean }) => a.publicado === true)
      blogPages = artigos.map((artigo: { slug: string; updatedAt?: string; dataPublicacao?: string }) => ({
        url: `${baseUrl}/blog/${artigo.slug}`,
        lastModified: artigo.updatedAt || artigo.dataPublicacao ? new Date(artigo.updatedAt || artigo.dataPublicacao || '') : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('Erro ao buscar artigos do blog para sitemap:', error)
  }

  // Buscar todos os imóveis publicados
  let imoveisPages: MetadataRoute.Sitemap = []
  try {
    const imoveis = await getAllImoveis()
    imoveisPages = imoveis.map((imovel) => ({
      url: `${baseUrl}/imoveis/${imovel.slug}`,
      lastModified: imovel.updatedAt || imovel.createdAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Erro ao buscar imóveis para sitemap:', error)
  }

  // Combinar todas as páginas
  return [...staticPages, ...blogPages, ...imoveisPages]
}
