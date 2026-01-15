import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'
import { fetchDWVImoveis, convertDWVToImovel } from '@/lib/dwv-api'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'
const IMOVEIS_PATH = 'public/imoveis/imoveis.json'

/**
 * Sincroniza imóveis da API DWV com o GitHub
 * 
 * GET: Busca imóveis da DWV e mostra preview (não salva)
 * POST: Sincroniza imóveis da DWV com o GitHub (substitui ou adiciona)
 */
export async function GET() {
  try {
    // Verificar variáveis de ambiente
    if (!process.env.DWV_API_TOKEN) {
      return NextResponse.json({
        success: false,
        error: 'DWV_API_TOKEN não configurado no Netlify',
        message: 'Configure a variável DWV_API_TOKEN no Netlify com o token da API DWV.',
        preview: []
      }, { status: 500 })
    }

    if (!process.env.DWV_API_URL) {
      return NextResponse.json({
        success: false,
        error: 'DWV_API_URL não configurado no Netlify',
        message: 'Configure a variável DWV_API_URL no Netlify com a URL da API DWV.',
        preview: []
      }, { status: 500 })
    }

    console.log('🔍 Iniciando busca de imóveis da API DWV...')
    console.log(`📍 URL: ${process.env.DWV_API_URL}`)
    console.log(`🔑 Token: ${process.env.DWV_API_TOKEN.substring(0, 10)}...`)
    
    // Buscar apenas primeira página para preview (mais rápido)
    const dwvImoveis = await fetchDWVImoveis(1, 20)
    
    if (dwvImoveis.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Nenhum imóvel encontrado na API DWV. Verifique se o token está correto e se há imóveis selecionados para integração.',
        error: 'Nenhum imóvel retornado pela API',
        preview: []
      })
    }

    // Converter para formato do site
    const imoveisConvertidos = dwvImoveis.map((dwv, index) => 
      convertDWVToImovel(dwv, index)
    )

    return NextResponse.json({
      success: true,
      message: `${imoveisConvertidos.length} imóveis encontrados na API DWV (primeira página)`,
      preview: imoveisConvertidos.slice(0, 5), // Mostrar apenas 5 como preview
      total: imoveisConvertidos.length,
      note: 'Esta é apenas a primeira página. Ao sincronizar, todos os imóveis serão buscados.'
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar imóveis da DWV:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro desconhecido',
      message: `Erro ao conectar com a API DWV: ${error.message}`,
      preview: []
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json(
        { 
          success: false,
          error: 'GitHub token não configurado',
          message: 'Configure a variável GITHUB_TOKEN no Netlify.'
        },
        { status: 500 }
      )
    }

    if (!process.env.DWV_API_TOKEN) {
      return NextResponse.json(
        { 
          success: false,
          error: 'DWV_API_TOKEN não configurado',
          message: 'Configure a variável DWV_API_TOKEN no Netlify.'
        },
        { status: 500 }
      )
    }

    if (!process.env.DWV_API_URL) {
      return NextResponse.json(
        { 
          success: false,
          error: 'DWV_API_URL não configurado',
          message: 'Configure a variável DWV_API_URL no Netlify.'
        },
        { status: 500 }
      )
    }

    const { mode = 'merge' } = await request.json() // 'merge' ou 'replace'
    
    console.log('🔄 Iniciando sincronização com API DWV...')
    console.log(`📋 Modo: ${mode}`)
    console.log(`📍 URL: ${process.env.DWV_API_URL}`)
    console.log(`🔑 Token: ${process.env.DWV_API_TOKEN.substring(0, 10)}...`)

    // Buscar TODOS os imóveis da API DWV (com paginação automática)
    const dwvImoveis = await fetchDWVImoveis(1, 100) // Busca todas as páginas automaticamente
    
    if (dwvImoveis.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Nenhum imóvel encontrado',
        message: 'Nenhum imóvel encontrado na API DWV para sincronizar. Verifique se o token está correto e se há imóveis ativos na API.'
      })
    }

    // Converter para formato do site
    const imoveisNovos = dwvImoveis.map((dwv, index) => 
      convertDWVToImovel(dwv, index)
    )

    // Buscar imóveis existentes no GitHub
    let imoveisExistentes: any[] = []
    let sha: string | undefined

    try {
      const { data } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: IMOVEIS_PATH,
      })

      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString('utf-8')
        imoveisExistentes = JSON.parse(content)
        sha = data.sha
      }
    } catch (error: any) {
      if (error.status !== 404) {
        throw error
      }
      // Arquivo não existe, será criado
    }

    let imoveisFinais: any[]

    if (mode === 'replace') {
      // Substituir todos os imóveis pelos da DWV
      imoveisFinais = imoveisNovos
      console.log(`✅ Modo REPLACE: ${imoveisNovos.length} imóveis da DWV`)
    } else {
      // Modo MERGE: manter existentes e adicionar/atualizar da DWV
      const imoveisMap = new Map<string, any>()
      
      // Adicionar imóveis existentes
      imoveisExistentes.forEach(imovel => {
        imoveisMap.set(imovel.id, imovel)
      })
      
      // Adicionar/atualizar com imóveis da DWV
      imoveisNovos.forEach(imovel => {
        imoveisMap.set(imovel.id, {
          ...imovel,
          // Preservar visualizações se já existir
          visualizacoes: imoveisMap.get(imovel.id)?.visualizacoes || 0,
          // Preservar createdAt se já existir, senão usar novo
          createdAt: imoveisMap.get(imovel.id)?.createdAt || imovel.createdAt,
          updatedAt: new Date(), // Sempre atualizar updatedAt
        })
      })
      
      imoveisFinais = Array.from(imoveisMap.values())
      console.log(`✅ Modo MERGE: ${imoveisExistentes.length} existentes + ${imoveisNovos.length} da DWV = ${imoveisFinais.length} total`)
    }

    // Salvar no GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: IMOVEIS_PATH,
      message: `Sync DWV: ${imoveisNovos.length} imóveis sincronizados (modo: ${mode})`,
      content: Buffer.from(JSON.stringify(imoveisFinais, null, 2), 'utf-8').toString('base64'),
      branch: 'main',
      ...(sha && { sha })
    })

    return NextResponse.json({
      success: true,
      message: `${imoveisNovos.length} imóveis sincronizados com sucesso`,
      total: imoveisFinais.length,
      novos: imoveisNovos.length,
      existentes: imoveisExistentes.length
    })
  } catch (error: any) {
    console.error('❌ Erro ao sincronizar imóveis:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao sincronizar imóveis'
    }, { status: 500 })
  }
}


