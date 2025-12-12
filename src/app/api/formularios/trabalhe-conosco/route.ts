import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'

interface FormularioTrabalheConosco {
  id: string
  nome: string
  telefone: string
  email: string
  instagram: string
  informacoes: string
  arquivos?: string[] // URLs dos arquivos se houver
  createdAt: string
  lido: boolean
}

// GET - Buscar todos os formulários
export async function GET() {
  try {
    const filePath = 'public/dados/formularios-trabalhe-conosco.json'
    
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
        return NextResponse.json(data.formularios || [])
      }
    } catch (error) {
      // Arquivo não existe, retorna array vazio
    }
    
    return NextResponse.json([])
    
  } catch (error) {
    console.error('❌ Erro ao buscar formulários:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST - Criar novo formulário
export async function POST(request: NextRequest) {
  try {
    const dados: Omit<FormularioTrabalheConosco, 'id' | 'createdAt' | 'lido'> = await request.json()
    
    // Buscar dados atuais
    const filePath = 'public/dados/formularios-trabalhe-conosco.json'
    let currentData: { formularios: FormularioTrabalheConosco[] } = { formularios: [] }
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
    
    // Criar novo formulário
    const novoFormulario: FormularioTrabalheConosco = {
      ...dados,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lido: false
    }
    
    currentData.formularios.push(novoFormulario)
    
    // Salvar no GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: `Formulário: Trabalhe conosco de ${dados.nome}`,
      content: Buffer.from(JSON.stringify(currentData, null, 2), 'utf-8').toString('base64'),
      branch: 'main',
      ...(sha && { sha })
    })
    
    return NextResponse.json({ success: true, id: novoFormulario.id })
    
  } catch (error) {
    console.error('❌ Erro ao salvar formulário:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// DELETE - Deletar formulário
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
    }
    
    const filePath = 'public/dados/formularios-trabalhe-conosco.json'
    
    const response = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      ref: 'main'
    })
    
    if ('content' in response.data) {
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8')
      const data = JSON.parse(content)
      
      data.formularios = data.formularios.filter((f: FormularioTrabalheConosco) => f.id !== id)
      
      await octokit.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: filePath,
        message: `Admin: Remove formulário de trabalhe conosco ${id}`,
        content: Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64'),
        branch: 'main',
        sha: response.data.sha
      })
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('❌ Erro ao deletar formulário:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

