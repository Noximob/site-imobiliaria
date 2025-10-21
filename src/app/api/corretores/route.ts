import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'

interface Corretor {
  id: string
  nome: string
  cargo: string
  creci: string
  telefone: string
  instagram?: string
  email: string
  foto: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

// GET - Buscar todos os corretores
export async function GET() {
  try {
    const filePath = 'public/dados/corretores.json'
    
    const response = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      ref: 'main'
    })
    
    if ('content' in response.data) {
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8')
      const data: { corretores: Corretor[] } = JSON.parse(content)
      return NextResponse.json(data.corretores || [])
    }
    
    return NextResponse.json([])
    
  } catch (error) {
    console.error('❌ Erro ao buscar corretores:', error)
    return NextResponse.json({ error: 'Erro ao buscar corretores' }, { status: 500 })
  }
}

// POST - Criar novo corretor
export async function POST(request: NextRequest) {
  try {
    const corretor: Omit<Corretor, 'id' | 'createdAt' | 'updatedAt'> = await request.json()
    
    // Buscar dados atuais
    const filePath = 'public/dados/corretores.json'
    let currentData: { corretores: Corretor[] } = { corretores: [] }
    let sha: string | undefined
    
    try {
      const response = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: filePath,
        ref: 'main'
      })
      
      if ('content' in response.data) {
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8')
        currentData = JSON.parse(content)
        sha = response.data.sha
      }
    } catch (error) {
      // Arquivo não existe, será criado
    }
    
    // Criar novo corretor
    const novoCorretor: Corretor = {
      ...corretor,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    currentData.corretores.push(novoCorretor)
    
    // Salvar no GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: `Admin: Adiciona corretor ${novoCorretor.nome}`,
      content: Buffer.from(JSON.stringify(currentData, null, 2), 'utf-8').toString('base64'),
      branch: 'main',
      ...(sha && { sha })
    })
    
    return NextResponse.json(novoCorretor)
    
  } catch (error) {
    console.error('❌ Erro ao criar corretor:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// PUT - Atualizar corretor
export async function PUT(request: NextRequest) {
  try {
    const { id, ...corretorData }: Corretor = await request.json()
    
    // Buscar dados atuais
    const filePath = 'public/dados/corretores.json'
    const response = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      ref: 'main'
    })
    
    if (!('content' in response.data)) {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
    }
    
    const content = Buffer.from(response.data.content, 'base64').toString('utf-8')
    const data: { corretores: Corretor[] } = JSON.parse(content)
    
    // Encontrar e atualizar corretor
    const corretorIndex = data.corretores.findIndex((c: Corretor) => c.id === id)
    if (corretorIndex === -1) {
      return NextResponse.json({ error: 'Corretor não encontrado' }, { status: 404 })
    }
    
    data.corretores[corretorIndex] = {
      ...data.corretores[corretorIndex],
      ...corretorData,
      updatedAt: new Date().toISOString()
    }
    
    // Salvar no GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: `Admin: Atualiza corretor ${data.corretores[corretorIndex].nome}`,
      content: Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64'),
      branch: 'main',
      sha: response.data.sha
    })
    
    return NextResponse.json(data.corretores[corretorIndex])
    
  } catch (error) {
    console.error('❌ Erro ao atualizar corretor:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// DELETE - Deletar corretor
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }
    
    // Buscar dados atuais
    const filePath = 'public/dados/corretores.json'
    const response = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      ref: 'main'
    })
    
    if (!('content' in response.data)) {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
    }
    
    const content = Buffer.from(response.data.content, 'base64').toString('utf-8')
    const data: { corretores: Corretor[] } = JSON.parse(content)
    
    // Encontrar e remover corretor
    const corretorIndex = data.corretores.findIndex((c: Corretor) => c.id === id)
    if (corretorIndex === -1) {
      return NextResponse.json({ error: 'Corretor não encontrado' }, { status: 404 })
    }
    
    const corretorRemovido = data.corretores[corretorIndex]
    data.corretores.splice(corretorIndex, 1)
    
    // Salvar no GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: `Admin: Remove corretor ${corretorRemovido.nome}`,
      content: Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64'),
      branch: 'main',
      sha: response.data.sha
    })
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('❌ Erro ao deletar corretor:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
