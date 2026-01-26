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
    
    for (const file of allFiles) {
      if (file.type === 'file') {
        // Construir o caminho relativo (ex: /imagens/logo.png)
        const relativePath = file.path.replace('public', '')
        
        // Tentar match exato primeiro
        let matchingConfig = siteImagesConfig.find(config => config.localPath === relativePath)
        
        if (matchingConfig) {
          // Match exato encontrado
          imagesMap[matchingConfig.id] = relativePath
          console.log(`✅ Mapeado (exato): ${matchingConfig.id} -> ${relativePath}`)
        } else {
          // Tentar match por nome base (ignorando extensão)
          const fileBaseName = getBaseName(relativePath)
          const fileExtension = getExtension(relativePath)
          
          // Procurar configs que tenham o mesmo nome base
          const candidateConfigs = siteImagesConfig.filter(config => {
            const configBaseName = getBaseName(config.localPath)
            return configBaseName === fileBaseName
          })
          
          if (candidateConfigs.length > 0) {
            // Se já existe uma imagem mapeada para este ID, verificar se devemos substituir
            const configId = candidateConfigs[0].id
            const existingPath = imagesMap[configId]
            
            if (!existingPath) {
              // Nenhuma imagem mapeada ainda, usar esta
              imagesMap[configId] = relativePath
              console.log(`✅ Mapeado (nome base): ${configId} -> ${relativePath}`)
            } else {
              // Já existe uma imagem mapeada, verificar qual tem prioridade maior
              const existingExt = getExtension(existingPath)
              const existingPriority = extensionPriority[existingExt] || 0
              const currentPriority = extensionPriority[fileExtension] || 0
              
              if (currentPriority > existingPriority) {
                // Substituir pela imagem com extensão de maior prioridade
                imagesMap[configId] = relativePath
                console.log(`✅ Mapeado (substituído por prioridade): ${configId} -> ${relativePath} (era ${existingPath})`)
              }
            }
          } else {
            console.warn(`⚠️ Arquivo sem config: ${relativePath}`)
          }
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
