import { NextRequest, NextResponse } from 'next/server'
import { uploadImageToGitHub } from '@/lib/github'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const imageId = formData.get('imageId') as string
    const category = formData.get('category') as string || 'site'
    
    if (!file || !imageId) {
      return NextResponse.json(
        { error: 'Arquivo e ID da imagem são obrigatórios' },
        { status: 400 }
      )
    }
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Apenas arquivos de imagem são permitidos' },
        { status: 400 }
      )
    }
    
    // Validar tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 10MB' },
        { status: 400 }
      )
    }
    
    // Fazer upload para GitHub
    const imageUrl = await uploadImageToGitHub(imageId, file, category)
    
    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      message: 'Imagem enviada com sucesso! Aguarde o rebuild...'
    })
    
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
