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
    // Baseado em: https://app.dwvapp.com.br/integrations (onde você seleciona as unidades)
    const urlsToTest = [
      // URLs baseadas no app.dwvapp.com.br/integrations (painel de integração)
      'https://app.dwvapp.com.br/integrations/properties',
      'https://app.dwvapp.com.br/integrations/api/properties',
      'https://app.dwvapp.com.br/integrations/integration/properties',
      'https://app.dwvapp.com.br/api/integrations/properties',
      'https://app.dwvapp.com.br/api/integration/properties',
      'https://app.dwvapp.com.br/integration/properties',
      'https://app.dwvapp.com.br/api/v1/integrations/properties',
      'https://app.dwvapp.com.br/api/v1/integration/properties',
      'https://app.dwvapp.com.br/integrations/v1/properties',
      // URLs sandbox (conforme documentação oficial)
      'https://apisandbox.dwvapp.com.br/integration/properties',
      'https://apisandbox.dwvapp.com.br/integrations/properties',
      'https://apisandbox.dwvapp.com.br/api/integration/properties',
      'https://apisandbox.dwvapp.com.br/api/integrations/properties',
      'https://apisandbox.dwvapp.com.br/integrations/api/properties',
      // URLs produção (conforme documentação oficial)
      'https://api.dwvapp.com.br/integration/properties',
      'https://api.dwvapp.com.br/integrations/properties',
      'https://api.dwvapp.com.br/api/integration/properties',
      'https://api.dwvapp.com.br/api/integrations/properties',
      // Outras variações
      'https://api.dwvapp.com.br/v1/properties',
      'https://api.dwvapp.com.br/v1/integration/properties',
      'https://api.dwvapp.com.br/api/v1/properties',
      'https://api.dwvapp.com.br/api/v1/integration/properties',
      'https://api.dwvapp.com.br/properties',
      'https://api.dwvapp.com.br/integration',
    ]

    const results = []

    for (const url of urlsToTest) {
      // Testar diferentes formatos de autenticação
      const authFormats: Array<{ name: string; headers: Record<string, string>; urlSuffix?: string }> = [
        { name: 'Header token', headers: { 'token': apiToken, 'Content-Type': 'application/json' } },
        { name: 'Header X-Token', headers: { 'X-Token': apiToken, 'Content-Type': 'application/json' } },
        { name: 'Header X-API-Token', headers: { 'X-API-Token': apiToken, 'Content-Type': 'application/json' } },
        { name: 'Header Authorization Bearer', headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' } },
        { name: 'Header Authorization Token', headers: { 'Authorization': `Token ${apiToken}`, 'Content-Type': 'application/json' } },
        { name: 'Header Authorization (sem prefixo)', headers: { 'Authorization': apiToken, 'Content-Type': 'application/json' } },
        { name: 'Query param token', headers: { 'Content-Type': 'application/json' }, urlSuffix: `&token=${apiToken}` },
        { name: 'Query param api_token', headers: { 'Content-Type': 'application/json' }, urlSuffix: `&api_token=${apiToken}` },
        { name: 'Query param access_token', headers: { 'Content-Type': 'application/json' }, urlSuffix: `&access_token=${apiToken}` },
      ]

      for (const authFormat of authFormats) {
        try {
          const urlSuffix = authFormat.urlSuffix || ''
          const testUrl = `${url}?page=1&limit=5${urlSuffix}`
          console.log(`🧪 Testando URL: ${testUrl} com formato: ${authFormat.name}`)

          const response = await fetch(testUrl, {
            method: 'GET',
            headers: authFormat.headers,
          })

          let data: any = null
          if (response.ok) {
            data = await response.json()
            
            // Se funcionou, adicionar ao resultado e parar de testar outros formatos para esta URL
            results.push({
              url,
              authFormat: authFormat.name,
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
            break // Parar de testar outros formatos se este funcionou
          } else {
            const errorText = await response.text()
            // Sempre adicionar erros 401 para ver qual formato está sendo usado
            if (response.status === 401) {
              results.push({
                url,
                authFormat: authFormat.name,
                status: response.status,
                ok: false,
                error: errorText.substring(0, 200), // Limitar tamanho
                note: errorText.includes('não fornecido') 
                  ? 'Token não está sendo enviado corretamente neste formato'
                  : 'Token está sendo enviado mas foi rejeitado (pode estar incorreto ou expirado)'
              })
            } else if (authFormat === authFormats[authFormats.length - 1]) {
              // Só adicionar outros erros no último formato para não poluir
              results.push({
                url,
                authFormat: authFormat.name,
                status: response.status,
                ok: false,
                error: errorText.substring(0, 200),
              })
            }
          }
        } catch (error: any) {
          // Só adicionar erro se for o último formato
          if (authFormat === authFormats[authFormats.length - 1]) {
            results.push({
              url,
              authFormat: authFormat.name,
              ok: false,
              error: error.message,
            })
          }
        }
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
