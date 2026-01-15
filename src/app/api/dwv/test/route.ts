import { NextResponse } from 'next/server'
import { fetchDWVImoveis } from '@/lib/dwv-api'

/**
 * Rota de teste para verificar conexão com API DWV
 * GET /api/dwv/test
 */
export async function GET() {
  try {
    // Verificar variáveis de ambiente
    const apiUrl = process.env.DWV_API_URL
    const apiToken = process.env.DWV_API_TOKEN

    if (!apiUrl || !apiToken) {
      return NextResponse.json({
        success: false,
        error: 'Variáveis de ambiente não configuradas',
        config: {
          hasUrl: !!apiUrl,
          hasToken: !!apiToken,
          url: apiUrl || 'NÃO CONFIGURADO',
          tokenLength: apiToken?.length || 0,
        }
      }, { status: 500 })
    }

    // Tentar buscar imóveis para teste (sem filtros)
    console.log('🧪 Testando conexão com API DWV...')
    console.log(`📍 URL: ${apiUrl}`)
    console.log(`🔑 Token: ${apiToken.substring(0, 10)}...`)

    // Fazer requisição direta para ver resposta bruta
    const testUrl = `${apiUrl}?page=1&limit=10`
    console.log(`🔗 Testando URL: ${testUrl}`)
    
    const testResponse = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'token': apiToken,
        'Content-Type': 'application/json',
      },
    })

    let rawData: any = null
    if (testResponse.ok) {
      rawData = await testResponse.json()
      console.log('📊 Resposta bruta da API:', JSON.stringify(rawData, null, 2))
    } else {
      const errorText = await testResponse.text()
      console.error('❌ Erro na resposta:', errorText)
    }

    const imoveis = await fetchDWVImoveis(1, 10)

    return NextResponse.json({
      success: true,
      message: rawData && rawData.data && rawData.data.length > 0 
        ? 'Conexão com API DWV OK - Imóveis encontrados!' 
        : 'Conexão com API DWV OK - Mas nenhum imóvel retornado',
      config: {
        url: apiUrl,
        tokenLength: apiToken.length,
        tokenPreview: `${apiToken.substring(0, 10)}...`,
        testUrl: testUrl,
        responseStatus: testResponse.status,
        responseOk: testResponse.ok,
      },
      result: {
        totalEncontrados: imoveis.length,
        primeiroImovel: imoveis[0] ? {
          id: imoveis[0].id,
          title: imoveis[0].title,
          status: imoveis[0].status,
          deleted: imoveis[0].deleted,
          hasUnit: !!imoveis[0].unit,
          hasBuilding: !!imoveis[0].building,
          hasThirdParty: !!imoveis[0].third_party_property,
        } : null,
        rawResponse: rawData ? {
          total: rawData.total,
          perPage: rawData.perPage,
          page: rawData.page,
          lastPage: rawData.lastPage,
          dataCount: rawData.data?.length || 0,
          firstItem: rawData.data?.[0] ? {
            id: rawData.data[0].id,
            title: rawData.data[0].title,
            status: rawData.data[0].status,
            deleted: rawData.data[0].deleted,
            construction_stage: rawData.data[0].construction_stage,
            rent: rawData.data[0].rent,
          } : null,
          // Mostrar todos os status diferentes encontrados
          statuses: rawData.data ? [...new Set(rawData.data.map((i: any) => i.status))] : [],
        } : null,
      },
      diagnostic: {
        connectionOk: testResponse.ok,
        hasData: !!(rawData && rawData.data),
        dataCount: rawData?.data?.length || 0,
        suggestion: rawData && rawData.data && rawData.data.length === 0
          ? 'A API retornou sucesso mas sem imóveis. Verifique: 1) Se os imóveis estão publicados/ativos no DWV, 2) Se a URL do endpoint está correta, 3) Se precisa de parâmetros adicionais na URL.'
          : 'Conexão funcionando normalmente.'
      }
    })
  } catch (error: any) {
    console.error('❌ Erro no teste da API DWV:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro desconhecido',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 })
  }
}
