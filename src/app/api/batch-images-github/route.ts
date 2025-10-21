import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'
import { siteImagesConfig } from '@/lib/github-images'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'

interface UploadImage {
  imageId: string
  file: File
}

interface DeleteImage {
  imageId: string
  filePath: string
  sha: string
}

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
    
    const uploadResults: Array<{ imageId: string; success: boolean; url?: string; error?: string }> = []
    const deleteResults: Array<{ imageId: string; success: boolean; error?: string }> = []
    
    // Processar uploads se houver
    if (files.length > 0 && imageIds.length > 0) {
      console.log('📸 Processando uploads...')
      
      // Validar uploads
      const validatedImages: Array<{ imageId: string; filePath: string; buffer: Buffer }> = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const imageId = imageIds[i]
        
        if (!file || !imageId) {
          uploadResults.push({ imageId: imageId || 'unknown', success: false, error: 'Arquivo ou ID obrigatório' })
          continue
        }
        
        if (!file.type.startsWith('image/')) {
          uploadResults.push({ imageId, success: false, error: 'Apenas imagens são permitidas' })
          continue
        }
        
        if (file.size > 10 * 1024 * 1024) {
          uploadResults.push({ imageId, success: false, error: 'Arquivo muito grande (máx 10MB)' })
          continue
        }
        
        const imageConfig = siteImagesConfig.find(img => img.id === imageId)
        if (!imageConfig) {
          uploadResults.push({ imageId, success: false, error: 'Configuração não encontrada' })
          continue
        }
        
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const filePath = `public${imageConfig.localPath}`
        
        validatedImages.push({ imageId, filePath, buffer })
      }
      
      // Fazer uploads usando Tree API
      if (validatedImages.length > 0) {
        try {
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
          const treeItems = []
          
          for (const img of validatedImages) {
            const { data: blobData } = await octokit.git.createBlob({
              owner: REPO_OWNER,
              repo: REPO_NAME,
              content: img.buffer.toString('base64'),
              encoding: 'base64'
            })
            
            treeItems.push({
              path: img.filePath,
              mode: '100644' as const,
              type: 'blob' as const,
              sha: blobData.sha
            })
            
            uploadResults.push({ 
              imageId: img.imageId, 
              success: true, 
              url: `/${img.filePath.replace('public/', '')}` 
            })
          }
          
          const { data: newTreeData } = await octokit.git.createTree({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            base_tree: baseTreeSha,
            tree: treeItems
          })
          
          const { data: newCommitData } = await octokit.git.createCommit({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            message: `Admin: Batch upload de ${validatedImages.length} imagem(ns)`,
            tree: newTreeData.sha,
            parents: [latestCommitSha]
          })
          
          await octokit.git.updateRef({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            ref: 'heads/main',
            sha: newCommitData.sha
          })
          
          console.log(`✅ Uploads concluídos: ${validatedImages.length} imagens`)
          
        } catch (error) {
          console.error('❌ Erro nos uploads:', error)
          uploadResults.forEach(result => {
            if (result.success) result.success = false
            result.error = 'Erro no upload'
          })
        }
      }
    }
    
    // Processar deletes se houver
    if (deleteIds.length > 0) {
      console.log('🗑️ Processando deletes...')
      
      for (const imageId of deleteIds) {
        try {
          const imageConfig = siteImagesConfig.find(img => img.id === imageId)
          
          if (!imageConfig) {
            deleteResults.push({ imageId, success: false, error: 'Configuração não encontrada' })
            continue
          }
          
          const filePath = `public${imageConfig.localPath}`
          
          const fileResponse = await octokit.repos.getContent({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: filePath,
            ref: 'main'
          })
          
          if ('sha' in fileResponse.data) {
            await octokit.repos.deleteFile({
              owner: REPO_OWNER,
              repo: REPO_NAME,
              path: filePath,
              message: `Admin: Batch delete de ${deleteIds.length} imagem(ns)`,
              sha: fileResponse.data.sha,
              branch: 'main'
            })
            
            deleteResults.push({ imageId, success: true })
            console.log(`✅ Deletado: ${imageId}`)
          } else {
            deleteResults.push({ imageId, success: false, error: 'Arquivo não encontrado' })
          }
          
        } catch (error) {
          console.error(`❌ Erro ao deletar ${imageId}:`, error)
          deleteResults.push({ 
            imageId, 
            success: false, 
            error: error instanceof Error ? error.message : 'Erro desconhecido' 
          })
        }
      }
    }
    
    const uploadSuccess = uploadResults.filter(r => r.success).length
    const deleteSuccess = deleteResults.filter(r => r.success).length
    
    console.log(`🎉 Batch completo: ${uploadSuccess} uploads, ${deleteSuccess} deletes`)
    
    return NextResponse.json({
      success: true,
      message: `${uploadSuccess} upload(s) e ${deleteSuccess} delete(s) processados`,
      uploads: uploadResults,
      deletes: deleteResults
    })
    
  } catch (error) {
    console.error('❌ Erro no batch completo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
