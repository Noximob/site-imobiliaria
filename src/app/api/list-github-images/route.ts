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

    // Criar mapa de arquivos por nome base
    // Chave: nome base, Valor: caminho completo do arquivo encontrado
    const filesByBaseName: { [baseName: string]: string } = {}
    
    // Primeiro, coletar TODOS os arquivos com mesmo nome base
    const filesByBaseNameArray: { [baseName: string]: Array<{ path: string; ext: string }> } = {}
    
    console.log('📝 Processando arquivos encontrados...')
    for (const file of allFiles) {
      if (file.type === 'file') {
        const relativePath = file.path.replace('public', '')
        const baseName = getBaseName(relativePath)
        const ext = getExtension(relativePath)
        
        // Log para arquivos com extensões modernas
        if (ext === 'avif' || ext === 'webp') {
          console.log(`🔍 Encontrado arquivo moderno: ${relativePath} (${ext})`)
        }
        
        if (!filesByBaseNameArray[baseName]) {
          filesByBaseNameArray[baseName] = []
        }
        
        filesByBaseNameArray[baseName].push({ path: relativePath, ext })
      }
    }
    
    // Log de arquivos com múltiplas extensões
    for (const baseName in filesByBaseNameArray) {
      const files = filesByBaseNameArray[baseName]
      if (files.length > 1) {
        console.log(`📦 ${baseName}: ${files.length} versões encontradas: ${files.map(f => f.ext).join(', ')}`)
      }
    }
    
    // Agora, para cada nome base, escolher o arquivo com maior prioridade
    const priority: { [key: string]: number } = {
      'avif': 5,
      'webp': 4,
      'jpg': 3,
      'jpeg': 3,
      'png': 2,
      'gif': 1,
    }
    
    for (const baseName in filesByBaseNameArray) {
      const files = filesByBaseNameArray[baseName]
      
      // Ordenar por prioridade (maior primeiro)
      files.sort((a, b) => {
        const priorityA = priority[a.ext] || 0
        const priorityB = priority[b.ext] || 0
        return priorityB - priorityA
      })
      
      // Usar o arquivo com maior prioridade
      filesByBaseName[baseName] = files[0].path
      
      if (files.length > 1) {
        console.log(`📋 ${baseName}: encontrados ${files.length} arquivos, usando ${files[0].ext} (${files[0].path})`)
      }
    }

    // Mapear para os configs usando o nome base
    const imagesMap: { [key: string]: string } = {}
    
    for (const config of siteImagesConfig) {
      const configBaseName = getBaseName(config.localPath)
      
      // Procurar arquivo com mesmo nome base
      if (filesByBaseName[configBaseName]) {
        // Usar o caminho REAL do arquivo encontrado (com extensão real)
        const foundPath = filesByBaseName[configBaseName]
        const foundExt = getExtension(foundPath)
        imagesMap[config.id] = foundPath
        
        // Log detalhado mostrando extensão encontrada
        const configExt = getExtension(config.localPath)
        if (foundExt !== configExt) {
          console.log(`✅ ${config.id}: usando ${foundExt} (config tinha ${configExt}) -> ${foundPath}`)
        } else {
          console.log(`✅ ${config.id} -> ${foundPath}`)
        }
      } else {
        // Arquivo não encontrado - não adicionar ao map
        // Isso fará com que currentPath seja undefined e não mostre extensão
        console.warn(`⚠️ Arquivo não encontrado: ${config.id} (base: ${configBaseName}, esperado: ${config.localPath})`)
      }
    }

    console.log(`🎯 Total de imagens mapeadas: ${Object.keys(imagesMap).length}`)

    return NextResponse.json(imagesMap)
  } catch (error) {
    console.error('❌ Erro ao listar imagens do GitHub:', error)
    return NextResponse.json({ error: 'Erro ao buscar imagens' }, { status: 500 })
  }
}
