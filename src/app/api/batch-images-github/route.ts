import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'
import { siteImagesConfig } from '@/lib/github-images'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const imageIds = formData.getAll('imageIds') as string[]
    const deleteIds = formData.getAll('deleteIds') as string[]
    
    console.log('📦 Batch completo iniciado:', {
      uploads: files.length,
      deletes: deleteIds.length
    })
    
    const uploadCount = files.length
    const deleteCount = deleteIds.length
    const commitMessage = `Admin: Batch completo - ${uploadCount} upload(s) e ${deleteCount} delete(s)`
    
    // Usar Tree API para fazer 1 ÚNICO commit com todas as alterações
    const { data: refData } = await octokit.git.getRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: 'heads/main'
    })
    
    const latestCommitSha = refData.object.sha
    const { data: commitData } = await octokit.git.getCommit({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      commit_sha: latestCommitSha
    })
    
    const baseTreeSha = commitData.tree.sha
    
    // Buscar tree atual
    const { data: currentTreeData } = await octokit.git.getTree({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      tree_sha: baseTreeSha,
      recursive: 'true'
    })
    
    // Filtrar arquivos que devem ser deletados
    const filesToDelete = deleteIds.map(imageId => {
      const imageConfig = siteImagesConfig.find(img => img.id === imageId)
      return imageConfig ? `public${imageConfig.localPath}` : null
    }).filter(Boolean)
    
    // Manter apenas arquivos que NÃO devem ser deletados
    const filteredTreeItems = currentTreeData.tree.filter(item => 
      !filesToDelete.includes(item.path)
    )
    
    // Adicionar novos uploads
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const imageId = imageIds[i]
      
      if (!file || !imageId) continue
      
      const imageConfig = siteImagesConfig.find(img => img.id === imageId)
      if (!imageConfig) continue
      
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const filePath = `public${imageConfig.localPath}`
      
      // Criar blob
      const { data: blobData } = await octokit.git.createBlob({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        content: buffer.toString('base64'),
        encoding: 'base64'
      })
      
      // Adicionar à tree
      filteredTreeItems.push({
        path: filePath,
        mode: '100644' as const,
        type: 'blob' as const,
        sha: blobData.sha
      })
      
      console.log(`✅ Upload preparado: ${imageId}`)
    }
    
    // Criar nova tree
    const { data: newTreeData } = await octokit.git.createTree({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      base_tree: baseTreeSha,
      tree: filteredTreeItems.map(item => ({
        path: item.path,
        mode: item.mode as any,
        type: item.type as any,
        sha: item.sha
      }))
    })
    
    // Criar commit único
    const { data: newCommitData } = await octokit.git.createCommit({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      message: commitMessage,
      tree: newTreeData.sha,
      parents: [latestCommitSha]
    })
    
    // Atualizar referência do branch
    await octokit.git.updateRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: 'heads/main',
      sha: newCommitData.sha
    })
    
    console.log(`🎉 Commit único criado: ${commitMessage}`)
    
    return NextResponse.json({
      success: true,
      message: `${uploadCount} upload(s) e ${deleteCount} delete(s) processados em 1 único commit`,
      uploadCount,
      deleteCount
    })
    
  } catch (error) {
    console.error('❌ Erro no batch completo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
