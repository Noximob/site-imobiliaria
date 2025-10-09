import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

export async function GET() {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GitHub token não configurado' }, { status: 500 })
    }

    // Listar todas as imagens na pasta public/imagens
    const { data } = await octokit.repos.getContent({
      owner: 'Noximob',
      repo: 'site-imobiliaria',
      path: 'public/imagens',
    })

    if (!Array.isArray(data)) {
      return NextResponse.json({})
    }

    // Mapear arquivos para um objeto com nome -> download_url
    const imagesMap: { [key: string]: string } = {}
    
    for (const item of data) {
      if (item.type === 'file' && item.download_url) {
        // Extrair nome do arquivo sem extensão para usar como ID
        const fileName = item.name.replace(/\.[^/.]+$/, '')
        imagesMap[fileName] = item.download_url
      }
    }

    return NextResponse.json(imagesMap)
  } catch (error) {
    console.error('Erro ao listar imagens do GitHub:', error)
    return NextResponse.json({ error: 'Erro ao buscar imagens' }, { status: 500 })
  }
}
