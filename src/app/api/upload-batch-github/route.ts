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
    
    // Fazer 1 ÚNICO commit com todas as imagens usando Tree API
    const commitMessage = `Admin: Batch upload de ${validatedImages.length} imagem(ns)`
    const results: Array<{ imageId: string; success: boolean; url: string }> = []
    
    try {
      console.log(`📦 Criando commit único com ${validatedImages.length} arquivos...`)
      
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
      
      // Criar blobs para todas as imagens
      const treeItems = []
      
      for (const img of validatedImages) {
        console.log(`📸 Criando blob para: ${img.imageId}`)
        
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
        
        const imageUrl = `/${img.filePath.replace('public/', '')}`
        results.push({ imageId: img.imageId, success: true, url: imageUrl })
      }
      
      // Criar nova tree com todas as alterações
      const { data: newTreeData } = await octokit.git.createTree({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        base_tree: baseTreeSha,
        tree: treeItems
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
      
      console.log(`🎉 Batch commit concluído: ${results.length} imagens em 1 único commit`)
      
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