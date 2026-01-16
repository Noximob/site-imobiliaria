import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'
import { fetchDWVImoveis, convertDWVToImovel } from '@/lib/dwv-api'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'
const IMOVEIS_PATH = 'public/imoveis/imoveis.json'

export async function POST(request: NextRequest) {
  try {
    // Verificar variáveis de ambiente
    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json({
        success: false,
        error: 'GitHub token não configurado',
        message: 'Configure a variável GITHUB_TOKEN no Netlify.',
      }, { status: 500 })
    }

    if (!process.env.DWV_API_TOKEN) {
      return NextResponse.json({
        success: false,
        error: 'DWV_API_TOKEN não configurado',
        message: 'Configure a variável DWV_API_TOKEN no Netlify.',
      }, { status: 500 })
    }

    if (!process.env.DWV_API_URL) {
      return NextResponse.json({
        success: false,
        error: 'DWV_API_URL não configurado',
        message: 'Configure a variável DWV_API_URL no Netlify.',
      }, { status: 500 })
    }

    // Ler mode do body de forma segura
    let mode = 'merge'
    try {
      const bodyText = await request.text()
      if (bodyText && bodyText.trim()) {
        const body = JSON.parse(bodyText)
        mode = body.mode === 'replace' ? 'replace' : 'merge'
      }
    } catch (error) {
      // Body vazio ou inválido, usar padrão
      mode = 'merge'
    }

    console.log('🔄 Iniciando sincronização com API DWV...')
    console.log(`📋 Modo: ${mode}`)
    console.log(`📍 URL: ${process.env.DWV_API_URL}`)
    console.log(`🔑 Token: ${process.env.DWV_API_TOKEN.substring(0, 10)}...`)

    // Buscar imóveis da DWV
    const dwvImoveis = await fetchDWVImoveis(1, 100)

    if (dwvImoveis.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Nenhum imóvel encontrado',
        message: 'Nenhum imóvel encontrado na API DWV. Verifique se o token está correto e se há imóveis selecionados.',
      }, { status: 200 })
    }

    console.log(`✅ ${dwvImoveis.length} imóveis encontrados na DWV`)

    // Converter para formato do site
    const imoveisNovos = dwvImoveis.map((dwv, index) =>
      convertDWVToImovel(dwv, index)
    )

    // Buscar imóveis existentes do GitHub
    let imoveisExistentes: any[] = []
    let sha: string | undefined

    try {
      const { data } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: IMOVEIS_PATH,
      })

      if ('content' in data && data.content) {
        try {
          const content = Buffer.from(data.content, 'base64').toString('utf-8')
          if (content.trim()) {
            imoveisExistentes = JSON.parse(content)
            sha = data.sha
          }
        } catch (parseError: any) {
          console.error('❌ Erro ao fazer parse do JSON do GitHub:', parseError.message)
          // Continuar com array vazio se o JSON estiver corrompido
          imoveisExistentes = []
        }
      }
    } catch (error: any) {
      if (error.status === 404) {
        // Arquivo não existe, será criado
        console.log('📝 Arquivo de imóveis não existe, será criado')
      } else {
        console.error('❌ Erro ao buscar imóveis do GitHub:', error.message)
        throw error
      }
    }

    // Processar sincronização
    let imoveisFinais: any[] = []
    let removidos = 0
    let adicionados = 0
    let atualizados = 0

    if (mode === 'replace') {
      // Substituir todos
      imoveisFinais = imoveisNovos
      adicionados = imoveisNovos.length
      removidos = imoveisExistentes.length
    } else {
      // MERGE: remover DWV que não estão mais na lista, adicionar/atualizar novos, manter manuais
      const imoveisDWVExistentes = imoveisExistentes.filter((im: any) => im.fonteDWV === true)
      const imoveisNaoDWV = imoveisExistentes.filter((im: any) => im.fonteDWV !== true)

      const imoveisDWVMap = new Map<string, any>()
      imoveisDWVExistentes.forEach((imovel: any) => {
        imoveisDWVMap.set(imovel.id, imovel)
      })

      imoveisNovos.forEach((imovel: any) => {
        const jaExistia = imoveisDWVMap.has(imovel.id)

        imoveisDWVMap.set(imovel.id, {
          ...imovel,
          visualizacoes: imoveisDWVMap.get(imovel.id)?.visualizacoes || 0,
          createdAt: imoveisDWVMap.get(imovel.id)?.createdAt || imovel.createdAt,
          updatedAt: new Date().toISOString(),
          fonteDWV: true,
        })

        if (jaExistia) {
          atualizados++
        } else {
          adicionados++
        }
      })

      const idsDWVNovos = new Set(imoveisNovos.map((im: any) => im.id))
      removidos = imoveisDWVExistentes.filter((im: any) => !idsDWVNovos.has(im.id)).length

      imoveisFinais = [
        ...Array.from(imoveisDWVMap.values()),
        ...imoveisNaoDWV,
      ]
    }

    // Salvar no GitHub
    try {
      await octokit.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: IMOVEIS_PATH,
        message: `Sync DWV: ${imoveisNovos.length} imóveis (${mode})`,
        content: Buffer.from(JSON.stringify(imoveisFinais, null, 2), 'utf-8').toString('base64'),
        branch: 'main',
        ...(sha && { sha }),
      })

      console.log('✅ Imóveis salvos no GitHub com sucesso')
    } catch (githubError: any) {
      console.error('❌ Erro ao salvar no GitHub:', githubError.message)
      throw new Error(`Erro ao salvar no GitHub: ${githubError.message}`)
    }

    return NextResponse.json({
      success: true,
      message: `Sincronização concluída: ${adicionados} adicionados, ${atualizados} atualizados, ${removidos} removidos`,
      total: imoveisFinais.length,
      adicionados,
      atualizados,
      removidos,
      totalDWV: imoveisNovos.length,
    })
  } catch (error: any) {
    console.error('❌ Erro ao sincronizar:', error)
    
    // Garantir que sempre retornamos JSON válido
    return NextResponse.json({
      success: false,
      error: error?.message || 'Erro desconhecido ao sincronizar imóveis',
      message: error?.message || 'Ocorreu um erro durante a sincronização.',
    }, { status: 500 })
  }
}
