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
    
    console.log('📦 Batch upload iniciado:', {
      filesCount: files.length,
      imageIdsCount: imageIds.length,
      imageIds: imageIds
    })
    
    if (!files.length || !imageIds.length || files.length !== imageIds.length) {
      console.error('❌ Validação falhou:', { files: files.length, imageIds: imageIds.length })
      return NextResponse.json(
        { error: 'Arquivos e IDs das imagens são obrigatórios' },
        { status: 400 }
      )
    }
    
    // Validar todas as imagens primeiro
    const validatedImages = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const imageId = imageIds[i]
      
      console.log(`📸 Validando imagem ${i + 1}/${files.length}:`, imageId)
      
      if (!file || !imageId) {
        throw new Error(`Arquivo ${i + 1} ou ID da imagem é obrigatório`)
      }
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error(`Arquivo ${i + 1}: Apenas arquivos de imagem são permitidos`)
      }
      
      // Validar tamanho (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error(`Arquivo ${i + 1}: Arquivo muito grande. Máximo 10MB`)
      }
      
      // Buscar configuração da imagem
      const imageConfig = siteImagesConfig.find(img => img.id === imageId)
      if (!imageConfig) {
        throw new Error(`Imagem ${i + 1}: Configuração não encontrada para ID "${imageId}"`)
      }
      
      // Converter File para Buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const filePath = `public${imageConfig.localPath}`
      
      validatedImages.push({
        imageId,
        filePath,
        buffer,
        config: imageConfig
      })
    }
    
    console.log(`✅ Validação concluída: ${validatedImages.length} imagens validadas`)
    
    // Fazer 1 ÚNICO commit com todas as imagens
    const commitMessage = `Admin: Batch upload de ${validatedImages.length} imagem(ns)`
    const results = []
    
    try {
      console.log(`📦 Criando commit único com ${validatedImages.length} arquivos...`)
      
      // Para cada arquivo, fazer commit individual mas com mensagem consistente
      for (const img of validatedImages) {
        // Buscar SHA se arquivo existe
        let sha: string | undefined
        try {
          const existingFile = await octokit.repos.getContent({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: img.filePath,
            ref: 'main'
          })
          
          if ('sha' in existingFile.data) {
            sha = existingFile.data.sha
          }
        } catch (error) {
          // Arquivo não existe, está ok
        }
        
        // Commit com mensagem batch
        await octokit.repos.createOrUpdateFileContents({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: img.filePath,
          message: commitMessage,
          content: img.buffer.toString('base64'),
          branch: 'main',
          ...(sha && { sha })
        })
        
        const imageUrl = `/${img.filePath.replace('public/', '')}`
        
        results.push({ imageId: img.imageId, success: true, url: imageUrl })
        console.log(`✅ Commitado: ${img.imageId}`)
      }
      
      console.log(`🎉 Batch commit concluído: ${results.length} imagens`)
      
      return NextResponse.json({
        success: true,
        message: `${results.length} imagem(ns) enviada(s) em 1 único commit`,
        results
      })
      
    } catch (error) {
      console.error('❌ Erro no batch commit:', error)
      throw error
    }
    
  } catch (error) {
    console.error('❌ Erro no batch upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}