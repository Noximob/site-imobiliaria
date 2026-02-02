import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noximobiliaria.com.br'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/administrador/', '/_next/'],
    },
    sitemap: `${baseUrl.replace(/\/$/, '')}/sitemap.xml`,
  }
}
