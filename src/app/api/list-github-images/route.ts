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
    
    // Função auxiliar para extrair nome base do arquivo (sem extensão)
    const getBaseName = (path: string): string => {
      const lastSlash = path.lastIndexOf('/')
      const filename = path.substring(lastSlash + 1)
      const lastDot = filename.lastIndexOf('.')
      return lastDot > 0 ? filename.substring(0, lastDot) : filename
    }
    
    // Função auxiliar para obter extensão
    const getExtension = (path: string): string => {
      const lastDot = path.lastIndexOf('.')
      return lastDot > 0 ? path.substring(lastDot + 1).toLowerCase() : ''
    }
    
    // Prioridade de extensões (maior = melhor)
    const extensionPriority: { [key: string]: number } = {
      'avif': 4,
      'webp': 3,
      'jpg': 2,
      'jpeg': 2,
      'png': 1,
    }
    
    // Primeiro, processar todos os arquivos e agrupar por nome base
    const filesByBaseName: { [baseName: string]: Array<{ path: string; ext: string; priority: number }> } = {}
    
    for (const file of allFiles) {
      if (file.type === 'file') {
        const relativePath = file.path.replace('public', '')
        const baseName = getBaseName(relativePath)
        const ext = getExtension(relativePath)
        const priority = extensionPriority[ext] || 0
        
        if (!filesByBaseName[baseName]) {
          filesByBaseName[baseName] = []
        }
        
        filesByBaseName[baseName].push({ path: relativePath, ext, priority })
      }
    }
    
    // Agora mapear para os configs, priorizando extensões melhores
    for (const config of siteImagesConfig) {
      const configBaseName = getBaseName(config.localPath)
      const configPath = config.localPath
      
      // Verificar se existe arquivo com mesmo nome base
      const matchingFiles = filesByBaseName[configBaseName] || []
      
      if (matchingFiles.length > 0) {
        // Ordenar por prioridade (maior primeiro)
        matchingFiles.sort((a, b) => b.priority - a.priority)
        
        // Usar o arquivo com maior prioridade
        const bestFile = matchingFiles[0]
        imagesMap[config.id] = bestFile.path
        
        if (bestFile.path === configPath) {
          console.log(`✅ Mapeado (exato): ${config.id} -> ${bestFile.path}`)
        } else {
          console.log(`✅ Mapeado (prioridade): ${config.id} -> ${bestFile.path} (config: ${configPath})`)
        }
      } else {
        // Nenhum arquivo encontrado, usar o caminho do config como fallback
        // (mas não adicionar ao map, deixar vazio para mostrar que não existe)
        console.warn(`⚠️ Arquivo não encontrado para: ${config.id} (esperado: ${configPath})`)
      }
    }
    
    // Também processar arquivos que não têm config (para logs)
    for (const baseName in filesByBaseName) {
      const configExists = siteImagesConfig.some(config => getBaseName(config.localPath) === baseName)
      if (!configExists) {
        const files = filesByBaseName[baseName]
        files.forEach(file => {
          console.warn(`⚠️ Arquivo sem config: ${file.path}`)
        })
      }
    }

    console.log(`🎯 Total de imagens mapeadas: ${Object.keys(imagesMap).length}`)

    return NextResponse.json(imagesMap)
  } catch (error) {
    console.error('❌ Erro ao listar imagens do GitHub:', error)
    return NextResponse.json({ error: 'Erro ao buscar imagens' }, { status: 500 })
  }
}
