import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'

interface Depoimento {
  id: string
  nome: string
  comentario: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

// GET - Buscar todos os depoimentos
export async function GET() {
  try {
    const filePath = 'public/dados/depoimentos.json'
    
    try {
      const response = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: filePath,
        ref: 'main'
      })
      
      if ('content' in response.data) {
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8')
        const data = JSON.parse(content)
        return NextResponse.json(data.depoimentos || [])
      }
    } catch (error) {
      // Arquivo não existe, retorna array vazio
    }
    
    return NextResponse.json([])
    
  } catch (error) {
    console.error('❌ Erro ao buscar depoimentos:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST - Criar novo depoimento
export async function POST(request: NextRequest) {
  try {
    const depoimento: Omit<Depoimento, 'id' | 'createdAt' | 'updatedAt'> = await request.json()
    
    // Buscar dados atuais
    const filePath = 'public/dados/depoimentos.json'
    let currentData: { depoimentos: Depoimento[] } = { depoimentos: [] }
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
    
    // Criar novo depoimento
    const novoDepoimento: Depoimento = {
      ...depoimento,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    currentData.depoimentos.push(novoDepoimento)
    
    // Salvar no GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: `Admin: Adiciona depoimento de ${novoDepoimento.nome}`,
      content: Buffer.from(JSON.stringify(currentData, null, 2), 'utf-8').toString('base64'),
      branch: 'main',
      ...(sha && { sha })
    })
    
    return NextResponse.json(novoDepoimento)
    
  } catch (error) {
    console.error('❌ Erro ao criar depoimento:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// PUT - Atualizar depoimento
export async function PUT(request: NextRequest) {
  try {
    const { id, ...depoimentoData }: Depoimento = await request.json()
    
    // Buscar dados atuais
    const filePath = 'public/dados/depoimentos.json'
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
    const currentData: { depoimentos: Depoimento[] } = JSON.parse(content)
    
    // Encontrar e atualizar depoimento
    const depoimentoIndex = currentData.depoimentos.findIndex(d => d.id === id)
    if (depoimentoIndex === -1) {
      return NextResponse.json({ error: 'Depoimento não encontrado' }, { status: 404 })
    }
    
    currentData.depoimentos[depoimentoIndex] = {
      ...depoimentoData,
      id,
      updatedAt: new Date().toISOString()
    }
    
    // Salvar no GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: `Admin: Atualiza depoimento de ${depoimentoData.nome}`,
      content: Buffer.from(JSON.stringify(currentData, null, 2), 'utf-8').toString('base64'),
      branch: 'main',
      sha: response.data.sha
    })
    
    return NextResponse.json(currentData.depoimentos[depoimentoIndex])
    
  } catch (error) {
    console.error('❌ Erro ao atualizar depoimento:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// DELETE - Deletar depoimento
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }
    
    // Buscar dados atuais
    const filePath = 'public/dados/depoimentos.json'
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
    const currentData: { depoimentos: Depoimento[] } = JSON.parse(content)
    
    // Filtrar depoimento
    const depoimentoRemovido = currentData.depoimentos.find(d => d.id === id)
    currentData.depoimentos = currentData.depoimentos.filter(d => d.id !== id)
    
    // Salvar no GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: `Admin: Remove depoimento de ${depoimentoRemovido?.nome || 'cliente'}`,
      content: Buffer.from(JSON.stringify(currentData, null, 2), 'utf-8').toString('base64'),
      branch: 'main',
      sha: response.data.sha
    })
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('❌ Erro ao deletar depoimento:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
