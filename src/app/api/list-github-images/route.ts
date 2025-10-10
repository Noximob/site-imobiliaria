import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'
import { siteImagesConfig } from '@/lib/github-images'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'

async function getAllFilesRecursive(path: string): Promise<any[]> {
  try {
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: path,
    })

    if (!Array.isArray(data)) {
      return []
    }

    let files: any[] = []

    for (const item of data) {
      if (item.type === 'file') {
        files.push(item)
      } else if (item.type === 'dir') {
        // Recursivamente buscar arquivos em subpastas
        const subFiles = await getAllFilesRecursive(item.path)
        files = files.concat(subFiles)
      }
    }

    return files
  } catch (error) {
    console.error(`Erro ao buscar arquivos em ${path}:`, error)
    return []
  }
}

export async function GET() {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GitHub token não configurado' }, { status: 500 })
    }

    console.log('🔍 Buscando todas as imagens do GitHub...')

    // Buscar TODOS os arquivos recursivamente
    const allFiles = await getAllFilesRecursive('public/imagens')

    console.log(`📦 Total de arquivos encontrados: ${allFiles.length}`)

    // Mapear arquivos para IDs usando siteImagesConfig
    const imagesMap: { [key: string]: string } = {}
    
    for (const file of allFiles) {
      if (file.type === 'file') {
        // Construir o caminho relativo (ex: /imagens/logo.png)
        const relativePath = file.path.replace('public', '')
        
        // Encontrar o imageConfig que corresponde a este arquivo
        const matchingConfig = siteImagesConfig.find(config => config.localPath === relativePath)
        
        if (matchingConfig) {
          imagesMap[matchingConfig.id] = relativePath
          console.log(`✅ Mapeado: ${matchingConfig.id} -> ${relativePath}`)
        } else {
          console.warn(`⚠️ Arquivo sem config: ${relativePath}`)
        }
      }
    }

    console.log(`🎯 Total de imagens mapeadas: ${Object.keys(imagesMap).length}`)

    return NextResponse.json(imagesMap)
  } catch (error) {
    console.error('❌ Erro ao listar imagens do GitHub:', error)
    return NextResponse.json({ error: 'Erro ao buscar imagens' }, { status: 500 })
  }
}
