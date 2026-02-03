import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'

const baseUrl = 'https://noximobiliaria.com.br'

function getArtigoBySlugServer(slug: string): any | null {
  try {
    const artigosPath = path.join(process.cwd(), 'public/blog/artigos.json')
    if (!fs.existsSync(artigosPath)) return null
    const data = fs.readFileSync(artigosPath, 'utf-8')
    const artigos = JSON.parse(data).filter((a: any) => a.publicado === true)
    return artigos.find((a: any) => a.slug === slug) || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const artigo = getArtigoBySlugServer(slug)

  if (!artigo) {
    return {
      title: 'Artigo não encontrado | Nox Imóveis',
    }
  }

  const titulo = artigo.titulo || 'Artigo'
  const resumo = artigo.resumo ? artigo.resumo.substring(0, 160) : `Artigo - ${titulo}`
  const imagem = artigo.imagem?.startsWith('http') ? artigo.imagem : artigo.imagem ? `${baseUrl}${artigo.imagem.startsWith('/') ? '' : '/'}${artigo.imagem}` : undefined

  return {
    title: `${titulo} | Nox Imóveis`,
    description: resumo,
    openGraph: {
      title: `${titulo} | Nox Imóveis`,
      description: resumo,
      type: 'article',
      locale: 'pt_BR',
      url: `${baseUrl}/blog/${slug}`,
      images: imagem ? [{ url: imagem, width: 1200, height: 630, alt: titulo }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${titulo} | Nox Imóveis`,
      description: resumo,
      images: imagem ? [imagem] : undefined,
    },
    alternates: {
      canonical: `${baseUrl}/blog/${slug}/`,
    },
  }
}

export default async function ArtigoLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const artigo = getArtigoBySlugServer(slug)

  const articleSchema = artigo
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: artigo.titulo,
        description: artigo.resumo?.substring(0, 160),
        image: artigo.imagem?.startsWith('http')
          ? artigo.imagem
          : artigo.imagem
            ? `${baseUrl}${artigo.imagem.startsWith('/') ? '' : '/'}${artigo.imagem}`
            : undefined,
        datePublished: artigo.dataPublicacao,
        dateModified: artigo.dataAtualizacao || artigo.dataPublicacao,
        author: { '@type': 'Organization', name: artigo.autor || 'Nox Imóveis' },
        publisher: { '@type': 'Organization', name: 'Nox Imóveis', url: baseUrl },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${baseUrl}/blog/${slug}/` },
      }
    : null

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog/` },
      { '@type': 'ListItem', position: 3, name: artigo?.titulo || 'Artigo', item: `${baseUrl}/blog/${slug}/` },
    ],
  }

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      {children}
    </>
  )
}
