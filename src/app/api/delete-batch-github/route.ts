import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'
import { siteImagesConfig } from '@/lib/github-images'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'

export async function DELETE(request: NextRequest) {
  try {
    const { imageIds } = await request.json()

    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json({ error: 'Array de IDs de imagens é obrigatório' }, { status: 400 })
    }

    console.log(`🗑️ Iniciando deleção de ${imageIds.length} imagem(ns)...`)

    const results = []

    for (const imageId of imageIds) {
      try {
        const imageConfig = siteImagesConfig.find(img => img.id === imageId)
        
        if (!imageConfig) {
          console.error(`❌ Configuração não encontrada para: ${imageId}`)
          results.push({ imageId, success: false, error: 'Configuração não encontrada' })
          continue
        }

        const filePath = `public${imageConfig.localPath}`
        console.log(`🔍 Buscando SHA para: ${filePath}`)

        // Buscar SHA do arquivo
        const fileResponse = await octokit.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: filePath,
          ref: 'main'
        })

        if ('sha' in fileResponse.data) {
          console.log(`🗑️ Deletando: ${filePath}`)
          
          await octokit.repos.deleteFile({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: filePath,
            message: `Admin: Batch delete ${imageId}`,
            sha: fileResponse.data.sha,
            branch: 'main'
          })

          console.log(`✅ Deletado com sucesso: ${imageId}`)
          results.push({ imageId, success: true })
        } else {
          console.error(`❌ Arquivo não é um file: ${filePath}`)
          results.push({ imageId, success: false, error: 'Arquivo não encontrado' })
        }

      } catch (error) {
        console.error(`❌ Erro ao deletar ${imageId}:`, error)
        results.push({ 
          imageId, 
          success: false, 
          error: error instanceof Error ? error.message : 'Erro desconhecido' 
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    console.log(`✅ Deleção concluída: ${successCount} sucesso, ${failCount} falhas`)

    return NextResponse.json({
      success: true,
      message: `${successCount} imagem(ns) deletada(s) com sucesso`,
      results
    })

  } catch (error) {
    console.error('❌ Erro no batch delete:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

