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

    // Criar mapa de arquivos por nome base
    // Chave: nome base, Valor: caminho completo do arquivo encontrado
    const filesByBaseName: { [baseName: string]: string } = {}
    
    for (const file of allFiles) {
      if (file.type === 'file') {
        const relativePath = file.path.replace('public', '')
        const baseName = getBaseName(relativePath)
        
        // Se já existe um arquivo com mesmo nome base, manter o que já está
        // (isso garante que se houver múltiplos, mantemos o primeiro encontrado)
        // Mas na verdade, vamos priorizar: avif > webp > jpg/jpeg > png
        if (!filesByBaseName[baseName]) {
          filesByBaseName[baseName] = relativePath
        } else {
          // Verificar extensões e priorizar
          const existingExt = filesByBaseName[baseName].split('.').pop()?.toLowerCase() || ''
          const newExt = relativePath.split('.').pop()?.toLowerCase() || ''
          
          const priority: { [key: string]: number } = {
            'avif': 4,
            'webp': 3,
            'jpg': 2,
            'jpeg': 2,
            'png': 1,
          }
          
          const existingPriority = priority[existingExt] || 0
          const newPriority = priority[newExt] || 0
          
          if (newPriority > existingPriority) {
            filesByBaseName[baseName] = relativePath
          }
        }
      }
    }

    // Mapear para os configs usando o nome base
    const imagesMap: { [key: string]: string } = {}
    
    for (const config of siteImagesConfig) {
      const configBaseName = getBaseName(config.localPath)
      
      // Procurar arquivo com mesmo nome base
      if (filesByBaseName[configBaseName]) {
        // Usar o caminho REAL do arquivo encontrado (com extensão real)
        imagesMap[config.id] = filesByBaseName[configBaseName]
        console.log(`✅ ${config.id} -> ${filesByBaseName[configBaseName]}`)
      } else {
        // Arquivo não encontrado - não adicionar ao map
        // Isso fará com que currentPath seja undefined e não mostre extensão
        console.warn(`⚠️ Arquivo não encontrado: ${config.id} (base: ${configBaseName})`)
      }
    }

    console.log(`🎯 Total de imagens mapeadas: ${Object.keys(imagesMap).length}`)

    return NextResponse.json(imagesMap)
  } catch (error) {
    console.error('❌ Erro ao listar imagens do GitHub:', error)
    return NextResponse.json({ error: 'Erro ao buscar imagens' }, { status: 500 })
  }
}
