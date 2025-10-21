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

    const results: Array<{ imageId: string; success: boolean; error?: string }> = []
    const filesToDelete: Array<{ imageId: string; filePath: string; sha: string }> = []

    // Primeiro, validar e coletar informações dos arquivos
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
          filesToDelete.push({
            imageId,
            filePath,
            sha: fileResponse.data.sha
          })
          results.push({ imageId, success: true })
        } else {
          console.error(`❌ Arquivo não é um file: ${filePath}`)
          results.push({ imageId, success: false, error: 'Arquivo não encontrado' })
        }

      } catch (error) {
        console.error(`❌ Erro ao validar ${imageId}:`, error)
        results.push({ 
          imageId, 
          success: false, 
          error: error instanceof Error ? error.message : 'Erro desconhecido' 
        })
      }
    }

    // Se não há arquivos para deletar, retornar
    if (filesToDelete.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhum arquivo válido para deletar',
        results
      })
    }

    // Fazer 1 ÚNICO commit com todas as deleções usando Tree API
    const commitMessage = `Admin: Batch delete de ${filesToDelete.length} imagem(ns)`
    
    try {
      console.log(`📦 Criando commit único para deletar ${filesToDelete.length} arquivos...`)
      
      // Buscar SHA do branch atual
      const { data: refData } = await octokit.git.getRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: 'heads/main'
      })
      
      const latestCommitSha = refData.object.sha
      console.log(`📋 SHA do commit atual: ${latestCommitSha}`)
      
      // Buscar tree do commit atual
      const { data: commitData } = await octokit.git.getCommit({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        commit_sha: latestCommitSha
      })
      
      const baseTreeSha = commitData.tree.sha
      console.log(`🌳 SHA da tree atual: ${baseTreeSha}`)
      
      // Buscar tree atual para remover os arquivos
      const { data: currentTreeData } = await octokit.git.getTree({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        tree_sha: baseTreeSha,
        recursive: 'true'
      })
      
      // Filtrar arquivos que NÃO devem ser deletados
      const filteredTreeItems = currentTreeData.tree.filter(item => 
        !filesToDelete.some(file => item.path === file.filePath)
      )
      
      console.log(`🗑️ Removendo ${filesToDelete.length} arquivos da tree`)
      
      // Criar nova tree sem os arquivos deletados
      const { data: newTreeData } = await octokit.git.createTree({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        base_tree: baseTreeSha,
        tree: filteredTreeItems.map(item => ({
          path: item.path,
          mode: item.mode,
          type: item.type,
          sha: item.sha
        }))
      })
      
      console.log(`🌳 Nova tree criada: ${newTreeData.sha}`)
      
      // Criar commit único
      const { data: newCommitData } = await octokit.git.createCommit({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        message: commitMessage,
        tree: newTreeData.sha,
        parents: [latestCommitSha]
      })
      
      console.log(`📝 Commit criado: ${newCommitData.sha}`)
      
      // Atualizar referência do branch
      await octokit.git.updateRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: 'heads/main',
        sha: newCommitData.sha
      })
      
      const successCount = results.filter(r => r.success).length
      const failCount = results.filter(r => !r.success).length

      console.log(`✅ Deleção concluída: ${successCount} sucesso, ${failCount} falhas em 1 único commit`)

      return NextResponse.json({
        success: true,
        message: `${successCount} imagem(ns) deletada(s) com sucesso em 1 único commit`,
        results
      })
      
    } catch (error) {
      console.error('❌ Erro no batch delete commit:', error)
      throw error
    }

  } catch (error) {
    console.error('❌ Erro no batch delete:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

