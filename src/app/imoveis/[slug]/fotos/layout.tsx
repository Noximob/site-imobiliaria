import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { Octokit } from '@octokit/rest'

const baseUrl = 'https://noximobiliaria.com.br'

async function getImovelBySlugServer(slug: string): Promise<any | null> {
  try {
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
      title: 'Fotos - Imóvel não encontrado | Nox Imóveis',
    }
  }

  const titulo = imovel.titulo || 'Imóvel'
  const description = `Galeria de fotos: ${titulo}. Nox Imóveis - Penha, Piçarras e Barra Velha.`

  return {
    title: `Fotos - ${titulo} | Nox Imóveis`,
    description,
    openGraph: {
      title: `Fotos - ${titulo} | Nox Imóveis`,
      description,
      type: 'website',
      locale: 'pt_BR',
      url: `${baseUrl}/imoveis/${slug}/fotos/`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Fotos - ${titulo} | Nox Imóveis`,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/imoveis/${slug}/fotos/`,
    },
  }
}

export default function FotosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
