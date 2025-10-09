import { NextRequest, NextResponse } from 'next/server'
import { uploadMultipleImages } from '@/lib/github'
import { siteImagesConfig } from '@/lib/github-images'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const imageIds = formData.getAll('imageIds') as string[]
    
    if (!files.length || !imageIds.length || files.length !== imageIds.length) {
      return NextResponse.json(
        { error: 'Arquivos e IDs das imagens são obrigatórios' },
        { status: 400 }
      )
    }
    
    // Validar cada arquivo
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const imageId = imageIds[i]
      
      if (!file || !imageId) {
        return NextResponse.json(
          { error: `Arquivo ${i + 1} ou ID da imagem é obrigatório` },
          { status: 400 }
        )
      }
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `Arquivo ${i + 1}: Apenas arquivos de imagem são permitidos` },
          { status: 400 }
        )
      }
      
      // Validar tamanho (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: `Arquivo ${i + 1}: Arquivo muito grande. Máximo 10MB` },
          { status: 400 }
        )
      }
      
      // Buscar configuração da imagem
      const imageConfig = siteImagesConfig.find(img => img.id === imageId)
      if (!imageConfig) {
        return NextResponse.json(
          { error: `Imagem ${i + 1}: Configuração não encontrada` },
          { status: 400 }
        )
      }
    }
    
    // Preparar dados para upload em batch
    const uploadData = await Promise.all(
      files.map(async (file, index) => {
        const imageId = imageIds[index]
        const imageConfig = siteImagesConfig.find(img => img.id === imageId)!
        
        // Converter File para Buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        // Caminho completo no GitHub
        const filePath = `public${imageConfig.localPath}`
        
        return {
          path: filePath,
          buffer: buffer
        }
      })
    )
    
    // Fazer upload em batch
    const imageUrls = await uploadMultipleImages(uploadData)
    
    return NextResponse.json({
      success: true,
      imageUrls: imageUrls,
      message: `${files.length} imagem(ns) enviada(s) com sucesso! Aguarde o rebuild...`
    })
    
  } catch (error) {
    console.error('Erro no upload em batch:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
