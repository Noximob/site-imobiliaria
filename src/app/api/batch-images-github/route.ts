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
    
    // Fazer uploads primeiro (se houver)
    if (files.length > 0 && imageIds.length > 0) {
      console.log('📸 Processando uploads...')
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const imageId = imageIds[i]
        
        if (!file || !imageId) continue
        
        const imageConfig = siteImagesConfig.find(img => img.id === imageId)
        if (!imageConfig) continue
        
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const filePath = `public${imageConfig.localPath}`
        
        // Buscar SHA se arquivo existe
        let sha: string | undefined
        try {
          const existingFile = await octokit.repos.getContent({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: filePath,
            ref: 'main'
          })
          
          if ('sha' in existingFile.data) {
            sha = existingFile.data.sha
          }
        } catch (error) {
          // Arquivo não existe, está ok
        }
        
        // Fazer upload
        await octokit.repos.createOrUpdateFileContents({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: filePath,
          message: commitMessage,
          content: buffer.toString('base64'),
          branch: 'main',
          ...(sha && { sha })
        })
        
        console.log(`✅ Upload: ${imageId}`)
      }
    }
    
    // Fazer deletes depois (se houver)
    if (deleteIds.length > 0) {
      console.log('🗑️ Processando deletes...')
      
      for (const imageId of deleteIds) {
        try {
          const imageConfig = siteImagesConfig.find(img => img.id === imageId)
          if (!imageConfig) continue
          
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
              message: commitMessage,
              sha: fileResponse.data.sha,
              branch: 'main'
            })
            
            console.log(`✅ Delete: ${imageId}`)
          }
        } catch (error) {
          console.error(`❌ Erro ao deletar ${imageId}:`, error)
        }
      }
    }
    
    console.log(`🎉 Batch completo: ${uploadCount} uploads, ${deleteCount} deletes`)
    
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
