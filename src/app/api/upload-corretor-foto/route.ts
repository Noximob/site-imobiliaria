import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const corretorId = formData.get('corretorId') as string
    
    if (!file || !corretorId) {
      return NextResponse.json({ error: 'Arquivo e ID do corretor são obrigatórios' }, { status: 400 })
    }
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Apenas arquivos de imagem são permitidos' }, { status: 400 })
    }
    
    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande. Máximo 5MB' }, { status: 400 })
    }
    
    // Gerar nome único para o arquivo
    const fileExtension = file.name.split('.').pop()
    const fileName = `corretor-${corretorId}.${fileExtension}`
    const filePath = `public/imagens/corretores/${fileName}`
    
    // Converter arquivo para base64
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
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
      // Arquivo não existe, será criado
    }
    
    // Upload para GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: `Admin: Upload foto corretor ${corretorId}`,
      content: buffer.toString('base64'),
      branch: 'main',
      ...(sha && { sha })
    })
    
    // Retornar URL da imagem
    const imageUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${filePath}`
    
    return NextResponse.json({
      success: true,
      imageUrl,
      fileName
    })
    
  } catch (error) {
    console.error('❌ Erro no upload da foto:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
