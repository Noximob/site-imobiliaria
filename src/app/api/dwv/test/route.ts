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

    // Tentar buscar apenas 1 imóvel para teste
    console.log('🧪 Testando conexão com API DWV...')
    console.log(`📍 URL: ${apiUrl}`)
    console.log(`🔑 Token: ${apiToken.substring(0, 10)}...`)

    const imoveis = await fetchDWVImoveis(1, 1)

    return NextResponse.json({
      success: true,
      message: 'Conexão com API DWV OK',
      config: {
        url: apiUrl,
        tokenLength: apiToken.length,
        tokenPreview: `${apiToken.substring(0, 10)}...`,
      },
      result: {
        totalEncontrados: imoveis.length,
        primeiroImovel: imoveis[0] ? {
          id: imoveis[0].id,
          title: imoveis[0].title,
          status: imoveis[0].status,
          hasUnit: !!imoveis[0].unit,
          hasBuilding: !!imoveis[0].building,
          hasThirdParty: !!imoveis[0].third_party_property,
        } : null,
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
