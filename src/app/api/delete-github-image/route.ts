import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'
import { siteImagesConfig } from '@/lib/github-images'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

export async function DELETE(request: NextRequest) {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GitHub token não configurado' }, { status: 500 })
    }

    const { imageId } = await request.json()
    
    if (!imageId) {
      return NextResponse.json({ error: 'ID da imagem é obrigatório' }, { status: 400 })
    }

    // Buscar configuração da imagem
    const imageConfig = siteImagesConfig.find(img => img.id === imageId)
    if (!imageConfig) {
      return NextResponse.json({ error: 'Configuração da imagem não encontrada' }, { status: 404 })
    }

    // Caminho completo no GitHub
    const filePath = `public${imageConfig.localPath}`
    
    // Verificar se o arquivo existe
    let sha: string
    try {
      const existingFile = await octokit.repos.getContent({
        owner: 'Noximob',
        repo: 'site-imobiliaria',
        path: filePath,
        ref: 'main'
      })
      
      if ('sha' in existingFile.data) {
        sha = existingFile.data.sha
      } else {
        return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
      }
    } catch (error) {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
    }

    // Deletar arquivo
    await octokit.repos.deleteFile({
      owner: 'Noximob',
      repo: 'site-imobiliaria',
      path: filePath,
      message: `Admin: Remove ${imageId}`,
      sha: sha,
      branch: 'main'
    })

    return NextResponse.json({
      success: true,
      message: `Imagem "${imageId}" removida com sucesso`
    })

  } catch (error) {
    console.error('Erro ao deletar imagem:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
