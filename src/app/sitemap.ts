import { MetadataRoute } from 'next'
import { getAllImoveis } from '@/lib/imoveis'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://imobiliaria.netlify.app'
  
  // Páginas estáticas
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/imoveis`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Páginas dinâmicas de imóveis
  let imovelPages = []
  try {
    const imoveis = await getAllImoveis()
    imovelPages = imoveis.map((imovel) => ({
      url: `${baseUrl}/imoveis/${imovel.slug}`,
      lastModified: imovel.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    // Se falhar ao carregar imóveis durante o build, continuar sem eles
    console.error('Erro ao carregar imóveis para sitemap:', error)
  }

  return [...staticPages, ...imovelPages]
}
