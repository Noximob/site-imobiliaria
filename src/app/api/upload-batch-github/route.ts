import { NextRequest, NextResponse } from 'next/server'
import { uploadImageToGitHub } from '@/lib/github'
import { siteImagesConfig } from '@/lib/github-images'

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
    
    const results = []
    
    // Processar cada arquivo individualmente
    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i]
        const imageId = imageIds[i]
        
        console.log(`📸 Processando imagem ${i + 1}/${files.length}:`, imageId)
        
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
        
        // Caminho completo no GitHub
        const filePath = `public${imageConfig.localPath}`
        
        console.log(`🚀 Uploading ${imageId} to ${filePath}`)
        
        // Fazer upload individual
        const imageUrl = await uploadImageToGitHub(filePath, buffer)
        
        results.push({
          imageId,
          success: true,
          url: imageUrl
        })
        
        console.log(`✅ Sucesso: ${imageId}`)
        
      } catch (error) {
        console.error(`❌ Erro na imagem ${i + 1}:`, error)
        results.push({
          imageId: imageIds[i] || `unknown_${i}`,
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        })
      }
    }
    
    const successCount = results.filter(r => r.success).length
    const errorCount = results.filter(r => !r.success).length
    
    console.log(`📊 Resultado final: ${successCount} sucessos, ${errorCount} erros`)
    
    if (errorCount > 0) {
      return NextResponse.json({
        success: false,
        message: `${successCount} imagem(ns) enviada(s), ${errorCount} erro(s)`,
        results
      }, { status: 207 }) // 207 = Multi-Status
    }
    
    return NextResponse.json({
      success: true,
      message: `${files.length} imagem(ns) enviada(s) com sucesso! Aguarde o rebuild...`,
      results
    })
    
  } catch (error) {
    console.error('💥 Erro crítico no upload em batch:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
