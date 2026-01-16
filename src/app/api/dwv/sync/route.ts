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
 * POST: Sincroniza imóveis da DWV com o GitHub (substitui ou adiciona)
 */
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

    // Tentar ler o body, mas não falhar se vier vazio ou inválido
    let mode = 'merge'
    try {
      const body = await request.json()
      mode = body.mode || 'merge'
    } catch (error) {
      // Body vazio ou inválido, usar padrão 'merge'
      mode = 'merge'
    }
    
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
    let removidos = 0
    let adicionados = 0
    let atualizados = 0

    if (mode === 'replace') {
      // Substituir todos os imóveis pelos da DWV
      imoveisFinais = imoveisNovos
      adicionados = imoveisNovos.length
      removidos = imoveisExistentes.length
      console.log(`✅ Modo REPLACE: ${imoveisNovos.length} imóveis da DWV`)
    } else {
      // Modo MERGE: 
      // - Remover imóveis da DWV que não estão mais na lista atual
      // - Adicionar novos da DWV
      // - Atualizar existentes da DWV
      // - MANTER imóveis que não são da DWV (imóveis adicionados manualmente)
      
      // Criar Set com IDs dos imóveis da DWV atuais (para verificação rápida)
      const idsDWV = new Set(imoveisNovos.map(im => im.id))
      
      // Separar imóveis existentes em: da DWV (com flag fonteDWV) e não-DWV (manuais)
      const imoveisDWVExistentes = imoveisExistentes.filter(im => im.fonteDWV === true)
      const imoveisNaoDWV = imoveisExistentes.filter(im => im.fonteDWV !== true)
      
      // Criar mapa com imóveis da DWV existentes (para preservar dados como visualizações)
      const imoveisDWVMap = new Map<string, any>()
      imoveisDWVExistentes.forEach(imovel => {
        imoveisDWVMap.set(imovel.id, imovel)
      })
      
      // Processar imóveis novos da DWV
      imoveisNovos.forEach(imovel => {
        const existia = imoveisDWVMap.has(imovel.id)
        
        imoveisDWVMap.set(imovel.id, {
          ...imovel,
          // Preservar visualizações se já existir
          visualizacoes: imoveisDWVMap.get(imovel.id)?.visualizacoes || 0,
          // Preservar createdAt se já existir, senão usar novo
          createdAt: imoveisDWVMap.get(imovel.id)?.createdAt || imovel.createdAt,
          updatedAt: new Date(), // Sempre atualizar updatedAt
          fonteDWV: true, // Garantir flag
        })
        
        if (exista) {
          atualizados++
        } else {
          adicionados++
        }
      })
      
      // Contar quantos foram removidos (eram da DWV mas não estão mais na lista atual)
      // Removidos = imóveis que tinham fonteDWV mas não estão na lista nova
      const idsDWVNovos = new Set(imoveisNovos.map(im => im.id))
      removidos = imoveisDWVExistentes.filter(im => !idsDWVNovos.has(im.id)).length
      
      // Combinar: imóveis da DWV (atualizados) + imóveis não-DWV (mantidos)
      imoveisFinais = [
        ...Array.from(imoveisDWVMap.values()),
        ...imoveisNaoDWV
      ]
      
      console.log(`✅ Modo MERGE:`)
      console.log(`   - Adicionados da DWV: ${adicionados}`)
      console.log(`   - Atualizados da DWV: ${atualizados}`)
      console.log(`   - Removidos da DWV (não estão mais na lista): ${removidos}`)
      console.log(`   - Mantidos não-DWV (manuais): ${imoveisNaoDWV.length}`)
      console.log(`   - Total final: ${imoveisFinais.length}`)
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
      message: `Sincronização concluída: ${adicionados} adicionados, ${atualizados} atualizados, ${removidos} removidos`,
      total: imoveisFinais.length,
      adicionados,
      atualizados,
      removidos,
      totalDWV: imoveisNovos.length
    })
  } catch (error: any) {
    console.error('❌ Erro ao sincronizar imóveis:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao sincronizar imóveis'
    }, { status: 500 })
  }
}
