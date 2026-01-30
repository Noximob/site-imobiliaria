import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'
import { sendEmail, formatFormularioTrabalheConoscoEmail } from '@/lib/email'

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
  arquivos?: string[] // nomes (retrocompatível)
  arquivosUrls?: { name: string; url: string }[] // nome + link para download
  createdAt: string
  lido: boolean
}

const ARQUIVOS_DIR = 'public/dados/trabalhe-conosco-arquivos'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB por arquivo
const MAX_FILES = 15

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100) || 'arquivo'
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
        const list = data.formularios
        return NextResponse.json(Array.isArray(list) ? list : [])
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
    const body = await request.json()
    const { arquivos: arquivosPayload, ...rest } = body
    const dados = rest as Omit<FormularioTrabalheConosco, 'id' | 'createdAt' | 'lido' | 'arquivos' | 'arquivosUrls'>

    const formId = Date.now().toString()
    const arquivosUrls: { name: string; url: string }[] = []

    // Upload de arquivos para o GitHub (se vierem com conteúdo em base64)
    if (Array.isArray(arquivosPayload) && arquivosPayload.length > 0 && arquivosPayload.length <= MAX_FILES) {
      for (let i = 0; i < arquivosPayload.length; i++) {
        const item = arquivosPayload[i]
        const name = typeof item?.name === 'string' ? item.name : `arquivo-${i}`
        const contentBase64 = item?.contentBase64
        if (typeof contentBase64 !== 'string') continue
        const size = Buffer.byteLength(contentBase64, 'base64')
        if (size > MAX_FILE_SIZE) continue
        const safeName = sanitizeFileName(name)
        const filePath = `${ARQUIVOS_DIR}/${formId}/${safeName}`
        try {
          await octokit.repos.createOrUpdateFileContents({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: filePath,
            message: `Currículo: ${dados.nome} - ${safeName}`,
            content: contentBase64,
            branch: 'main'
          })
          const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${filePath}`
          arquivosUrls.push({ name, url })
        } catch (err) {
          console.error('Erro ao salvar arquivo no GitHub:', safeName, err)
        }
      }
    }

    // Buscar dados atuais do JSON
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
    } catch {
      // Arquivo não existe, será criado
    }

    const novoFormulario: FormularioTrabalheConosco = {
      ...dados,
      id: formId,
      createdAt: new Date().toISOString(),
      lido: false,
      arquivos: arquivosPayload?.map((a: { name?: string }) => a?.name).filter(Boolean) || [],
      ...(arquivosUrls.length > 0 && { arquivosUrls })
    }

    currentData.formularios.push(novoFormulario)

    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: `Formulário: Trabalhe conosco de ${dados.nome}`,
      content: Buffer.from(JSON.stringify(currentData, null, 2), 'utf-8').toString('base64'),
      branch: 'main',
      ...(sha && { sha })
    })
    
    // Enviar email (não bloqueia a resposta se falhar)
    try {
      const emailPayload = {
        ...dados,
        arquivos: arquivosUrls.length > 0 ? arquivosUrls.map(a => a.name) : (arquivosPayload?.map((a: { name?: string }) => a?.name).filter(Boolean) || [])
      }
      const emailResult = await sendEmail({
        to: 'imoveisnox@gmail.com',
        subject: `Novo Formulário: Trabalhe Conosco - ${dados.nome}`,
        html: formatFormularioTrabalheConoscoEmail(emailPayload)
      })
      
      if (!emailResult.success) {
        console.error('⚠️ Email não foi enviado, mas formulário foi salvo:', emailResult.error)
      }
    } catch (error) {
      console.error('⚠️ Erro ao enviar email (não crítico, formulário foi salvo):', error)
    }
    
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

