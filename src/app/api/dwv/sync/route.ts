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

    console.log('🔄 Iniciando sincronização com API DWV...')
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
    // Lógica: Puxar apenas o que está selecionado no DWV (o que vem da API)
    // - Adicionar novos que estão na lista do DWV
    // - NÃO atualizar existentes (preservar edições futuras do admin)
    // - Remover os que não estão mais na lista do DWV (foram desmarcados)
    // - Manter imóveis manuais (não-DWV) intactos
    
    let imoveisFinais: any[] = []
    let removidos = 0
    let adicionados = 0
    let atualizados = 0

    // Separar imóveis DWV dos manuais
    const imoveisDWVExistentes = imoveisExistentes.filter((im: any) => im.fonteDWV === true || im.dwvId)
    const imoveisNaoDWV = imoveisExistentes.filter((im: any) => !im.fonteDWV && !im.dwvId)

    // Criar mapa dos imóveis DWV existentes por ID (usar dwvId se disponível, senão id)
    const imoveisDWVMap = new Map<string, any>()
    imoveisDWVExistentes.forEach((imovel: any) => {
      const key = imovel.dwvId?.toString() || imovel.id
      imoveisDWVMap.set(key, imovel)
    })

    // Processar imóveis novos do DWV (apenas os que estão selecionados na API)
    const idsDWVNovos = new Set<string>()
    imoveisNovos.forEach((imovel: any) => {
      const key = imovel.dwvId?.toString() || imovel.id
      idsDWVNovos.add(key)
      
      const jaExistia = imoveisDWVMap.has(key)

      if (!jaExistia) {
        // NOVO imóvel: adicionar
        imoveisDWVMap.set(key, {
          ...imovel,
          visualizacoes: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publicado: true,
          fonteDWV: true,
          dwvId: imovel.dwvId || imovel.id,
        })
        adicionados++
      } else {
        // IMÓVEL EXISTENTE: manter como está (não atualizar para preservar edições futuras)
        // EXCEÇÃO: atualizar dataEntrega se estiver faltando e o DWV tiver enviado
        const imovelExistente = imoveisDWVMap.get(key)
        const precisaAtualizarDataEntrega = !imovelExistente.dataEntrega && imovel.dataEntrega
        
        if (precisaAtualizarDataEntrega) {
          imoveisDWVMap.set(key, {
            ...imovelExistente, // Manter dados existentes
            dataEntrega: imovel.dataEntrega, // Adicionar dataEntrega que estava faltando
            fonteDWV: true, // Garantir flag
            dwvId: imovel.dwvId || imovel.id, // Garantir dwvId
            updatedAt: new Date().toISOString(), // Atualizar timestamp
          })
          atualizados++
          console.log(`📅 Atualizando dataEntrega para imóvel ${key}: ${imovel.dataEntrega}`)
        } else {
          imoveisDWVMap.set(key, {
            ...imovelExistente, // Manter dados existentes
            fonteDWV: true, // Garantir flag
            dwvId: imovel.dwvId || imovel.id, // Garantir dwvId
          })
        }
      }
    })

    // Remover imóveis DWV que não estão mais na lista (foram desmarcados no DWV)
    const imoveisParaRemover = imoveisDWVExistentes.filter((im: any) => {
      const key = im.dwvId?.toString() || im.id
      return !idsDWVNovos.has(key)
    })
    removidos = imoveisParaRemover.length

    // Remover do mapa
    imoveisParaRemover.forEach((im: any) => {
      const key = im.dwvId?.toString() || im.id
      imoveisDWVMap.delete(key)
    })

    // Montar lista final: imóveis DWV (mantidos + novos) + imóveis manuais
    imoveisFinais = [
      ...Array.from(imoveisDWVMap.values()),
      ...imoveisNaoDWV,
    ]

    // Verificar se há mudanças reais antes de fazer commit
    const temMudancas = adicionados > 0 || removidos > 0 || atualizados > 0

    if (!temMudancas) {
      // Não há mudanças, retornar sem fazer commit
      return NextResponse.json({
        success: true,
        message: `Nenhuma alteração necessária. ${imoveisNovos.length} imóvel(is) sincronizado(s) do DWV.`,
        total: imoveisFinais.length,
        adicionados: 0,
        atualizados: 0,
        removidos: 0,
        totalDWV: imoveisNovos.length,
        temMudancas: false,
      })
    }

    // Há mudanças, fazer commit no GitHub
    try {
      const fileContent = JSON.stringify(imoveisFinais, null, 2)
      const encodedContent = Buffer.from(fileContent, 'utf-8').toString('base64')

      const updateParams: any = {
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: IMOVEIS_PATH,
        message: `Sync DWV: ${adicionados} novo(s), ${removidos} removido(s)`,
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

    const mensagem = `Sincronização concluída: ${adicionados} novo(s), ${removidos} removido(s)`

    return NextResponse.json({
      success: true,
      message: mensagem,
      total: imoveisFinais.length,
      adicionados,
      atualizados: 0, // Sempre 0, pois não atualizamos existentes
      removidos,
      totalDWV: imoveisNovos.length,
      temMudancas: true,
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
