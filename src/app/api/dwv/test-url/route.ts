import { NextResponse } from 'next/server'

/**
 * Rota para testar diferentes URLs da API DWV
 * GET /api/dwv/test-url
 */
export async function GET() {
  try {
    const apiToken = process.env.DWV_API_TOKEN

    if (!apiToken) {
      return NextResponse.json({
        success: false,
        error: 'DWV_API_TOKEN não configurado'
      }, { status: 500 })
    }

    // URLs possíveis para testar
    const urlsToTest = [
      'https://api.dwvapp.com.br/integration/properties',
      'https://api.dwvapp.com.br/api/integration/properties',
      'https://api.dwvapp.com.br/v1/properties',
      'https://api.dwvapp.com.br/v1/integration/properties',
      'https://api.dwvapp.com.br/api/v1/properties',
      'https://api.dwvapp.com.br/api/v1/integration/properties',
      'https://api.dwvapp.com.br/properties',
      'https://api.dwvapp.com.br/integration',
      'https://apisandbox.dwvapp.com.br/integration/properties',
      'https://apisandbox.dwvapp.com.br/api/integration/properties',
      'https://apisandbox.dwvapp.com.br/v1/properties',
      'https://apisandbox.dwvapp.com.br/api/v1/properties',
    ]

    const results = []

    for (const url of urlsToTest) {
      try {
        const testUrl = `${url}?page=1&limit=5`
        console.log(`🧪 Testando URL: ${testUrl}`)

        const response = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'token': apiToken,
            'Content-Type': 'application/json',
          },
        })

        let data: any = null
        if (response.ok) {
          data = await response.json()
        } else {
          const errorText = await response.text()
          results.push({
            url,
            status: response.status,
            ok: false,
            error: errorText.substring(0, 200), // Limitar tamanho
          })
          continue
        }

        results.push({
          url,
          status: response.status,
          ok: true,
          total: data.total || 0,
          dataCount: data.data?.length || 0,
          hasData: !!(data.data && data.data.length > 0),
          firstItem: data.data?.[0] ? {
            id: data.data[0].id,
            title: data.data[0].title,
            status: data.data[0].status,
          } : null,
        })
      } catch (error: any) {
        results.push({
          url,
          ok: false,
          error: error.message,
        })
      }
    }

    // Encontrar a melhor URL (que retornou dados)
    const workingUrl = results.find(r => r.ok && r.hasData)

    return NextResponse.json({
      success: true,
      results,
      recommendation: workingUrl
        ? {
            url: workingUrl.url,
            message: 'Esta URL retornou imóveis! Use esta no DWV_API_URL',
            total: workingUrl.total,
            dataCount: workingUrl.dataCount,
          }
        : {
            message: 'Nenhuma URL retornou imóveis. Verifique: 1) Se o token está correto, 2) Se os imóveis estão publicados no DWV, 3) Se precisa de outra URL.',
            allResults: results,
          },
    })
  } catch (error: any) {
    console.error('❌ Erro ao testar URLs:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro desconhecido',
    }, { status: 500 })
  }
}
