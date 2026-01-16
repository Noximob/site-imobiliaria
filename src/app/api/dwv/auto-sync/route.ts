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
 * Sincronização automática da API DWV
 * 
 * Este endpoint pode ser chamado automaticamente via:
 * - Netlify Scheduled Functions (cron job)
 * - Webhook externo
 * - Outros sistemas de automação
 * 
 * Para configurar no Netlify:
 * 1. Vá em Functions > Scheduled Functions
 * 2. Crie uma função que chama este endpoint
 * 3. Configure o schedule (ex: a cada hora)
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se há um token de segurança (opcional, recomendado para webhooks)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.DWV_AUTO_SYNC_TOKEN
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Não autorizado',
          message: 'Token de autenticação inválido ou ausente.'
        },
        { status: 401 }
      )
    }

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

    console.log('🔄 [AUTO-SYNC] Iniciando sincronização automática com API DWV...')
    console.log(`📍 URL: ${process.env.DWV_API_URL}`)
    console.log(`🔑 Token: ${process.env.DWV_API_TOKEN.substring(0, 10)}...`)

    // Buscar TODOS os imóveis da API DWV (com paginação automática)
    const dwvImoveis = await fetchDWVImoveis(1, 100)
    
    if (dwvImoveis.length === 0) {
      console.log('⚠️ [AUTO-SYNC] Nenhum imóvel encontrado na API DWV')
      return NextResponse.json({
        success: false,
        error: 'Nenhum imóvel encontrado',
        message: 'Nenhum imóvel encontrado na API DWV para sincronizar.'
      })
    }

    console.log(`📊 [AUTO-SYNC] ${dwvImoveis.length} imóveis encontrados na API DWV`)

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

    // Modo MERGE: manter existentes e adicionar/atualizar da DWV
    const imoveisMap = new Map<string, any>()
    
    // Adicionar imóveis existentes
    imoveisExistentes.forEach(imovel => {
      imoveisMap.set(imovel.id, imovel)
    })
    
    // Adicionar/atualizar com imóveis da DWV
    let novos = 0
    let atualizados = 0
    
    imoveisNovos.forEach(imovel => {
      const existia = imoveisMap.has(imovel.id)
      imoveisMap.set(imovel.id, {
        ...imovel,
        // Preservar visualizações se já existir
        visualizacoes: imoveisMap.get(imovel.id)?.visualizacoes || 0,
        // Preservar createdAt se já existir, senão usar novo
        createdAt: imoveisMap.get(imovel.id)?.createdAt || imovel.createdAt,
        updatedAt: new Date(), // Sempre atualizar updatedAt
      })
      
      if (exisia) {
        atualizados++
      } else {
        novos++
      }
    })
    
    const imoveisFinais = Array.from(imoveisMap.values())
    
    console.log(`✅ [AUTO-SYNC] MERGE: ${imoveisExistentes.length} existentes + ${imoveisNovos.length} da DWV = ${imoveisFinais.length} total`)
    console.log(`📈 [AUTO-SYNC] Novos: ${novos}, Atualizados: ${atualizados}`)

    // Salvar no GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: IMOVEIS_PATH,
      message: `[AUTO-SYNC] Sincronização automática DWV: ${novos} novos, ${atualizados} atualizados`,
      content: Buffer.from(JSON.stringify(imoveisFinais, null, 2), 'utf-8').toString('base64'),
      branch: 'main',
      ...(sha && { sha })
    })

    console.log('✅ [AUTO-SYNC] Sincronização concluída com sucesso')

    return NextResponse.json({
      success: true,
      message: `Sincronização automática concluída: ${novos} novos, ${atualizados} atualizados`,
      total: imoveisFinais.length,
      novos,
      atualizados,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('❌ [AUTO-SYNC] Erro ao sincronizar imóveis:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao sincronizar imóveis',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// GET para verificar status sem sincronizar
export async function GET() {
  return NextResponse.json({
    message: 'Endpoint de sincronização automática DWV',
    instructions: {
      method: 'POST',
      description: 'Chame este endpoint via POST para sincronizar imóveis automaticamente',
      auth: 'Opcional: envie Authorization: Bearer {DWV_AUTO_SYNC_TOKEN}',
      schedule: 'Configure no Netlify Scheduled Functions para execução periódica',
    },
    config: {
      githubToken: !!process.env.GITHUB_TOKEN,
      dwvApiToken: !!process.env.DWV_API_TOKEN,
      dwvApiUrl: !!process.env.DWV_API_URL,
      autoSyncToken: !!process.env.DWV_AUTO_SYNC_TOKEN,
    }
  })
}
