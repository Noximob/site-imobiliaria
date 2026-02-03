import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'
const ARTIGOS_PATH = 'public/blog/artigos.json'

export async function GET() {
  try {
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: ARTIGOS_PATH,
    })

    if ('content' in data) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8')
      const artigos = JSON.parse(content)
      return NextResponse.json(artigos)
    }

    return NextResponse.json([])
  } catch (error) {
    console.error('Erro ao buscar artigos:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const { artigo, imagem } = await request.json()
    
    // Gerar ID único
    const id = Date.now().toString()
    
    // Upload da imagem se fornecida
    let imagemUrl = ''
    if (imagem) {
      const imageResponse = await octokit.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: `public/blog/imagens/${id}.jpg`,
        message: `Adicionar imagem do artigo ${artigo.titulo}`,
        content: imagem.split(',')[1], // Remove data:image/jpeg;base64,
      })
      imagemUrl = `/blog/imagens/${id}.jpg`
    }

    // Buscar artigos existentes
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: ARTIGOS_PATH,
    })

    let artigos = []
    if ('content' in data) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8')
      artigos = JSON.parse(content)
    }

    // Adicionar novo artigo
    const novoArtigo = {
      ...artigo,
      id,
      imagem: imagemUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      visualizacoes: 0,
    }

    artigos.push(novoArtigo)

    // Salvar no GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: ARTIGOS_PATH,
      message: `Adicionar artigo: ${artigo.titulo}`,
      content: Buffer.from(JSON.stringify(artigos, null, 2)).toString('base64'),
      sha: 'content' in data ? data.sha : undefined,
    })

    return NextResponse.json({ id })
  } catch (error) {
    console.error('Erro ao criar artigo:', error)
    return new Response(JSON.stringify({ error: 'Erro ao criar artigo' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, artigo, imagem } = await request.json()
    
    // Buscar artigos existentes
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: ARTIGOS_PATH,
    })

    if (!('content' in data)) {
      return new Response(JSON.stringify({ error: 'Arquivo não encontrado' }), { 
      status: 404, 
      headers: { 'Content-Type': 'application/json' } 
    })
    }

    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    const artigos = JSON.parse(content)
    
    const index = artigos.findIndex((a: any) => a.id === id)
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Artigo não encontrado' }), { 
      status: 404, 
      headers: { 'Content-Type': 'application/json' } 
    })
    }

    // Upload da nova imagem se fornecida
    if (imagem) {
      const imageResponse = await octokit.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: `public/blog/imagens/${id}.jpg`,
        message: `Atualizar imagem do artigo ${artigo.titulo}`,
        content: imagem.split(',')[1],
      })
      artigo.imagem = `/blog/imagens/${id}.jpg`
    }

    // Atualizar artigo preservando slug e id (evita quebrar URL e referências)
    const slugOriginal = artigos[index].slug
    const idOriginal = artigos[index].id
    artigos[index] = {
      ...artigos[index],
      ...artigo,
      slug: slugOriginal,
      id: idOriginal,
      updatedAt: new Date().toISOString(),
    }

    // Salvar no GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: ARTIGOS_PATH,
      message: `Atualizar artigo: ${artigo.titulo}`,
      content: Buffer.from(JSON.stringify(artigos, null, 2)).toString('base64'),
      sha: data.sha,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar artigo:', error)
    return new Response(JSON.stringify({ error: 'Erro ao atualizar artigo' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID do artigo é obrigatório' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    })
    }

    // Buscar artigos existentes
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: ARTIGOS_PATH,
    })

    if (!('content' in data)) {
      return new Response(JSON.stringify({ error: 'Arquivo não encontrado' }), { 
      status: 404, 
      headers: { 'Content-Type': 'application/json' } 
    })
    }

    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    const artigos = JSON.parse(content)
    
    const index = artigos.findIndex((a: any) => a.id === id)
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Artigo não encontrado' }), { 
      status: 404, 
      headers: { 'Content-Type': 'application/json' } 
    })
    }

    const artigo = artigos[index]
    
    // Deletar imagem se existir
    if (artigo.imagem) {
      try {
        // Buscar SHA da imagem para deletar
        const imageData = await octokit.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: `public/blog/imagens/${id}.jpg`,
        })
        
        if ('sha' in imageData.data) {
          await octokit.repos.deleteFile({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: `public/blog/imagens/${id}.jpg`,
            message: `Deletar imagem do artigo ${artigo.titulo}`,
            sha: imageData.data.sha,
          })
        }
      } catch (error) {
        console.log('Imagem não encontrada para deletar')
      }
    }

    // Remover artigo da lista
    artigos.splice(index, 1)

    // Salvar no GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: ARTIGOS_PATH,
      message: `Deletar artigo: ${artigo.titulo}`,
      content: Buffer.from(JSON.stringify(artigos, null, 2)).toString('base64'),
      sha: data.sha,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar artigo:', error)
    return new Response(JSON.stringify({ error: 'Erro ao deletar artigo' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }
}
