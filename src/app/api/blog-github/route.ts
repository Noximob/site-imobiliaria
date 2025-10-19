import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

const owner = 'Noximob'
const repo = 'site-imobiliaria'
const artigosPath = 'public/blog/artigos.json'

// GET - Buscar todos os artigos
export async function GET() {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: artigosPath,
    })

    if ('content' in data) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8')
      const artigos = JSON.parse(content)
      return NextResponse.json(artigos)
    }

    return NextResponse.json([])
  } catch (error: any) {
    if (error.status === 404) {
      return NextResponse.json([])
    }
    console.error('Erro ao buscar artigos:', error)
    return NextResponse.json({ error: 'Erro ao buscar artigos' }, { status: 500 })
  }
}

// POST - Criar novo artigo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { artigo, imagem } = body

    // Buscar artigos atuais
    let artigos: any[] = []
    let sha: string | undefined

    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: artigosPath,
      })

      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString('utf-8')
        artigos = JSON.parse(content)
        sha = data.sha
      }
    } catch (error: any) {
      if (error.status !== 404) throw error
    }

    // Gerar ID único
    const id = `artigo-${Date.now()}`
    
    // Upload da imagem se fornecida
    let imagemUrl = artigo.imagem
    if (imagem) {
      const imagemPath = `public/imagens/blog/${id}.jpg`
      const imagemBuffer = Buffer.from(imagem.split(',')[1], 'base64')
      
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: imagemPath,
        message: `Admin: Upload imagem do artigo ${artigo.titulo}`,
        content: imagemBuffer.toString('base64'),
      })

      imagemUrl = `/imagens/blog/${id}.jpg`
    }

    // Criar novo artigo
    const novoArtigo = {
      id,
      ...artigo,
      imagem: imagemUrl,
      visualizacoes: 0,
      dataPublicacao: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    artigos.push(novoArtigo)

    // Salvar artigos atualizados
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: artigosPath,
      message: `Admin: Criar artigo "${artigo.titulo}"`,
      content: Buffer.from(JSON.stringify(artigos, null, 2)).toString('base64'),
      sha,
    })

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Erro ao criar artigo:', error)
    return NextResponse.json({ error: 'Erro ao criar artigo' }, { status: 500 })
  }
}

// PUT - Atualizar artigo existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, artigo, imagem } = body

    // Buscar artigos atuais
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: artigosPath,
    })

    if (!('content' in data)) {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
    }

    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    let artigos = JSON.parse(content)

    // Encontrar índice do artigo
    const index = artigos.findIndex((a: any) => a.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Artigo não encontrado' }, { status: 404 })
    }

    // Upload da nova imagem se fornecida
    let imagemUrl = artigos[index].imagem
    if (imagem) {
      const imagemPath = `public/imagens/blog/${id}.jpg`
      const imagemBuffer = Buffer.from(imagem.split(',')[1], 'base64')
      
      // Buscar SHA da imagem existente se houver
      let imagemSha: string | undefined
      try {
        const { data: imagemData } = await octokit.repos.getContent({
          owner,
          repo,
          path: imagemPath,
        })
        if ('sha' in imagemData) {
          imagemSha = imagemData.sha
        }
      } catch (error: any) {
        if (error.status !== 404) throw error
      }

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: imagemPath,
        message: `Admin: Atualizar imagem do artigo ${artigo.titulo || artigos[index].titulo}`,
        content: imagemBuffer.toString('base64'),
        sha: imagemSha,
      })

      imagemUrl = `/imagens/blog/${id}.jpg`
    }

    // Atualizar artigo
    artigos[index] = {
      ...artigos[index],
      ...artigo,
      imagem: imagemUrl,
      updatedAt: new Date().toISOString(),
    }

    // Salvar artigos atualizados
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: artigosPath,
      message: `Admin: Atualizar artigo "${artigos[index].titulo}"`,
      content: Buffer.from(JSON.stringify(artigos, null, 2)).toString('base64'),
      sha: data.sha,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar artigo:', error)
    return NextResponse.json({ error: 'Erro ao atualizar artigo' }, { status: 500 })
  }
}

// DELETE - Deletar artigo
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
    }

    // Buscar artigos atuais
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: artigosPath,
    })

    if (!('content' in data)) {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
    }

    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    let artigos = JSON.parse(content)

    // Encontrar artigo
    const artigo = artigos.find((a: any) => a.id === id)
    if (!artigo) {
      return NextResponse.json({ error: 'Artigo não encontrado' }, { status: 404 })
    }

    // Tentar deletar imagem se existir
    if (artigo.imagem && artigo.imagem.startsWith('/imagens/blog/')) {
      try {
        const imagemPath = artigo.imagem.replace('/', '')
        const { data: imagemData } = await octokit.repos.getContent({
          owner,
          repo,
          path: imagemPath,
        })

        if ('sha' in imagemData) {
          await octokit.repos.deleteFile({
            owner,
            repo,
            path: imagemPath,
            message: `Admin: Deletar imagem do artigo ${artigo.titulo}`,
            sha: imagemData.sha,
          })
        }
      } catch (error) {
        console.warn('Erro ao deletar imagem:', error)
        // Continuar mesmo se não conseguir deletar a imagem
      }
    }

    // Remover artigo da lista
    artigos = artigos.filter((a: any) => a.id !== id)

    // Salvar artigos atualizados
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: artigosPath,
      message: `Admin: Deletar artigo "${artigo.titulo}"`,
      content: Buffer.from(JSON.stringify(artigos, null, 2)).toString('base64'),
      sha: data.sha,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar artigo:', error)
    return NextResponse.json({ error: 'Erro ao deletar artigo' }, { status: 500 })
  }
}

