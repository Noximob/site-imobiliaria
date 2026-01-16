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

    // Buscar imóveis existentes do GitHub e obter SHA
    let imoveisExistentes: any[] = []
    let fileSha: string | undefined

    try {
      const { data } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: IMOVEIS_PATH,
      })

      // Pegar SHA do arquivo (necessário para atualização)
      if ('sha' in data && data.sha) {
        fileSha = data.sha
        console.log('📝 Arquivo existe no GitHub, SHA:', fileSha.substring(0, 10) + '...')
      }

      if ('content' in data && data.content) {
        try {
          const content = Buffer.from(data.content, 'base64').toString('utf-8')
          if (content.trim()) {
            imoveisExistentes = JSON.parse(content)
            console.log(`📋 ${imoveisExistentes.length} imóveis encontrados no GitHub`)
          }
        } catch (parseError: any) {
          console.error('❌ Erro ao fazer parse do JSON do GitHub:', parseError.message)
          // Continuar com array vazio se o JSON estiver corrompido
          imoveisExistentes = []
        }
      }
    } catch (error: any) {
      if (error.status === 404) {
        // Arquivo não existe, será criado (não precisa de SHA)
        console.log('📝 Arquivo de imóveis não existe, será criado')
        fileSha = undefined
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

        // Garantir que publicado seja sempre true para imóveis da DWV
        const imovelExistente = imoveisDWVMap.get(imovel.id)
        
        imoveisDWVMap.set(imovel.id, {
          ...imovel,
          visualizacoes: imovelExistente?.visualizacoes || 0,
          createdAt: imovelExistente?.createdAt || imovel.createdAt,
          updatedAt: new Date().toISOString(),
          publicado: true, // Garantir que sempre está publicado
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
      const fileContent = JSON.stringify(imoveisFinais, null, 2)
      const encodedContent = Buffer.from(fileContent, 'utf-8').toString('base64')

      const updateParams: any = {
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: IMOVEIS_PATH,
        message: `Sync DWV: ${imoveisNovos.length} imóveis (${mode})`,
        content: encodedContent,
        branch: 'main',
      }

      // Se o arquivo já existe, precisa fornecer o SHA
      if (fileSha) {
        updateParams.sha = fileSha
        console.log('📝 Atualizando arquivo existente no GitHub...')
      } else {
        console.log('📝 Criando novo arquivo no GitHub...')
      }

      await octokit.repos.createOrUpdateFileContents(updateParams)

      console.log('✅ Imóveis salvos no GitHub com sucesso')
    } catch (githubError: any) {
      console.error('❌ Erro ao salvar no GitHub:', githubError.message)
      console.error('❌ Detalhes:', githubError)
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
