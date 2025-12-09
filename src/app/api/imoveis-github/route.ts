import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'
const IMOVEIS_PATH = 'public/imoveis/imoveis.json'

export async function GET() {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GitHub token não configurado' }, { status: 500 })
    }

    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: IMOVEIS_PATH,
    })

    if ('content' in data) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8')
      const imoveis = JSON.parse(content)
      return NextResponse.json(imoveis)
    }

    return NextResponse.json([])
  } catch (error: any) {
    // Se o arquivo não existe, retornar array vazio
    if (error.status === 404) {
      return NextResponse.json([])
    }
    console.error('Erro ao buscar imóveis:', error)
    return NextResponse.json({ error: 'Erro ao buscar imóveis' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GitHub token não configurado' }, { status: 500 })
    }

    const { imovel, fotos } = await request.json()

    // Gerar ID único
    const id = Date.now().toString()

    // Upload das fotos para GitHub
    const fotosUrls: string[] = []
    
    if (fotos && Array.isArray(fotos) && fotos.length > 0) {
      // Buscar artigos existentes para pegar o SHA
      let existingData: any = { sha: undefined }
      try {
        const { data } = await octokit.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: IMOVEIS_PATH,
        })
        if ('sha' in data) {
          existingData.sha = data.sha
        }
      } catch (error) {
        // Arquivo não existe, está ok
      }

      // Upload de todas as fotos em batch usando Tree API
      const treeItems = []
      
      for (let i = 0; i < fotos.length; i++) {
        const foto = fotos[i]
        const fotoPath = `public/imoveis/imagens/${id}_${i}.jpg`
        
        // Remover data:image/jpeg;base64, se existir
        const base64Content = foto.split(',')[1] || foto
        
        // Criar blob para a foto
        const { data: blobData } = await octokit.git.createBlob({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          content: base64Content,
          encoding: 'base64'
        })
        
        treeItems.push({
          path: fotoPath,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: blobData.sha
        })
        
        fotosUrls.push(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${fotoPath}`)
      }

      // Criar tree com as fotos
      const { data: treeData } = await octokit.git.createTree({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        tree: treeItems
      })

      // Buscar SHA do commit atual
      const { data: refData } = await octokit.git.getRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: 'heads/main'
      })
      const latestCommitSha = refData.object.sha

      // Buscar tree do commit atual para mesclar
      const { data: commitData } = await octokit.git.getCommit({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        commit_sha: latestCommitSha
      })
      const baseTreeSha = commitData.tree.sha

      // Criar nova tree mesclando com a base
      const { data: mergedTree } = await octokit.git.createTree({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        base_tree: baseTreeSha,
        tree: treeItems
      })

      // Criar commit para as fotos
      const { data: fotosCommit } = await octokit.git.createCommit({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        message: `Adicionar fotos do imóvel ${imovel.titulo}`,
        tree: mergedTree.sha,
        parents: [latestCommitSha]
      })

      // Atualizar referência
      await octokit.git.updateRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: 'heads/main',
        sha: fotosCommit.sha
      })
    }

    // Buscar imóveis existentes
    let imoveis: any[] = []
    let sha: string | undefined
    
    try {
      const { data } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: IMOVEIS_PATH,
      })
      
      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString('utf-8')
        imoveis = JSON.parse(content)
        sha = data.sha
      }
    } catch (error) {
      // Arquivo não existe, está ok
    }

    // Gerar slug
    const slug = generateSlug(imovel.titulo)

    // Adicionar novo imóvel
    const novoImovel = {
      ...imovel,
      id,
      slug,
      fotos: fotosUrls,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    imoveis.push(novoImovel)

    // Salvar no GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: IMOVEIS_PATH,
      message: `Adicionar imóvel: ${imovel.titulo}`,
      content: Buffer.from(JSON.stringify(imoveis, null, 2)).toString('base64'),
      sha: sha,
    })

    return NextResponse.json({ id })
  } catch (error) {
    console.error('Erro ao criar imóvel:', error)
    return NextResponse.json({ error: 'Erro ao criar imóvel' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GitHub token não configurado' }, { status: 500 })
    }

    const { id, imovel, fotos } = await request.json()

    // Buscar imóveis existentes
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: IMOVEIS_PATH,
    })

    if (!('content' in data)) {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
    }

    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    const imoveis = JSON.parse(content)
    
    const index = imoveis.findIndex((i: any) => i.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })
    }

    // Se houver novas fotos, fazer upload
    if (fotos && Array.isArray(fotos) && fotos.length > 0) {
      const fotosUrls: string[] = []

      // Buscar SHA do commit atual
      const { data: refData } = await octokit.git.getRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: 'heads/main'
      })
      const latestCommitSha = refData.object.sha

      // Buscar tree do commit atual
      const { data: commitData } = await octokit.git.getCommit({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        commit_sha: latestCommitSha
      })
      const baseTreeSha = commitData.tree.sha

      const treeItems = []

      // Contar fotos existentes para não sobrescrever
      const fotosExistentes = imoveis[index].fotos || []
      const numeroFotosExistentes = fotosExistentes.length
      
      for (let i = 0; i < fotos.length; i++) {
        const foto = fotos[i]
        // Usar timestamp para garantir nome único e não sobrescrever
        const timestamp = Date.now()
        const fotoPath = `public/imoveis/imagens/${id}_${timestamp}_${i}.jpg`
        
        const base64Content = foto.split(',')[1] || foto
        
        const { data: blobData } = await octokit.git.createBlob({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          content: base64Content,
          encoding: 'base64'
        })
        
        treeItems.push({
          path: fotoPath,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: blobData.sha
        })
        
        fotosUrls.push(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${fotoPath}`)
      }

      // Criar tree mesclada
      const { data: mergedTree } = await octokit.git.createTree({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        base_tree: baseTreeSha,
        tree: treeItems
      })

      // Criar commit
      const { data: fotosCommit } = await octokit.git.createCommit({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        message: `Atualizar fotos do imóvel ${imovel.titulo}`,
        tree: mergedTree.sha,
        parents: [latestCommitSha]
      })

      // Atualizar referência
      await octokit.git.updateRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: 'heads/main',
        sha: fotosCommit.sha
      })

      // Adicionar novas fotos às existentes (não substituir)
      imovel.fotos = [...fotosExistentes, ...fotosUrls]
    } else {
      // Se não houver novas fotos, manter as existentes
      imovel.fotos = imoveis[index].fotos || []
    }

    // Atualizar imóvel
    imoveis[index] = {
      ...imoveis[index],
      ...imovel,
      updatedAt: new Date().toISOString(),
    }

    // Salvar no GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: IMOVEIS_PATH,
      message: `Atualizar imóvel: ${imovel.titulo}`,
      content: Buffer.from(JSON.stringify(imoveis, null, 2)).toString('base64'),
      sha: data.sha,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar imóvel:', error)
    return NextResponse.json({ error: 'Erro ao atualizar imóvel' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GitHub token não configurado' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID do imóvel é obrigatório' }, { status: 400 })
    }

    // Buscar imóveis existentes
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: IMOVEIS_PATH,
    })

    if (!('content' in data)) {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
    }

    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    const imoveis = JSON.parse(content)
    
    const index = imoveis.findIndex((i: any) => i.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })
    }

    const imovel = imoveis[index]

    // Deletar fotos se existirem
    if (imovel.fotos && imovel.fotos.length > 0) {
      // Buscar SHA do commit atual
      const { data: refData } = await octokit.git.getRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: 'heads/main'
      })
      const latestCommitSha = refData.object.sha

      // Buscar tree do commit atual
      const { data: commitData } = await octokit.git.getCommit({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        commit_sha: latestCommitSha
      })
      const baseTreeSha = commitData.tree.sha

      // Listar fotos para deletar
      const deleteItems = []
      for (let i = 0; i < imovel.fotos.length; i++) {
        const fotoPath = `public/imoveis/imagens/${id}_${i}.jpg`
        
        try {
          // Buscar SHA da foto para deletar
          const { data: fotoData } = await octokit.repos.getContent({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: fotoPath,
          })
          
          if ('sha' in fotoData) {
            deleteItems.push({
              path: fotoPath,
              mode: '100644' as const,
              type: 'blob' as const,
              sha: null as any // null remove o arquivo
            })
          }
        } catch (error) {
          // Foto não existe, está ok
        }
      }

      if (deleteItems.length > 0) {
        // Criar tree sem as fotos
        const { data: newTree } = await octokit.git.createTree({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          base_tree: baseTreeSha,
          tree: deleteItems
        })

        // Criar commit
        const { data: deleteCommit } = await octokit.git.createCommit({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          message: `Deletar fotos do imóvel ${imovel.titulo}`,
          tree: newTree.sha,
          parents: [latestCommitSha]
        })

        // Atualizar referência
        await octokit.git.updateRef({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          ref: 'heads/main',
          sha: deleteCommit.sha
        })
      }
    }

    // Remover imóvel da lista
    imoveis.splice(index, 1)

    // Salvar no GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: IMOVEIS_PATH,
      message: `Deletar imóvel: ${imovel.titulo}`,
      content: Buffer.from(JSON.stringify(imoveis, null, 2)).toString('base64'),
      sha: data.sha,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar imóvel:', error)
    return NextResponse.json({ error: 'Erro ao deletar imóvel' }, { status: 500 })
  }
}

function generateSlug(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

