import { NextResponse } from 'next/server'

const SITEMAP_URL = 'https://noximobiliaria.com.br/sitemap.xml'
const GOOGLE_PING_URL = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
const BING_PING_URL = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`

const FETCH_OPTIONS: RequestInit = {
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; SitemapPing/1.0; +https://noximobiliaria.com.br)',
  },
  signal: AbortSignal.timeout(10000),
}

/**
 * GET /api/submit-sitemap
 * Notifica o Google e Bing que o sitemap foi atualizado (ex: novos imóveis).
 * Chamar após adicionar/editar imóveis no admin.
 */
export async function GET() {
  const results: { google: boolean; bing: boolean } = { google: false, bing: false }

  try {
    const [googleRes, bingRes] = await Promise.allSettled([
      fetch(GOOGLE_PING_URL, FETCH_OPTIONS),
      fetch(BING_PING_URL, FETCH_OPTIONS),
    ])

    if (googleRes.status === 'fulfilled' && googleRes.value.ok) results.google = true
    if (bingRes.status === 'fulfilled' && bingRes.value.ok) results.bing = true

    const anyOk = results.google || results.bing
    return NextResponse.json({
      ok: anyOk,
      message: anyOk
        ? `Sitemap notificado: ${results.google ? 'Google' : ''}${results.google && results.bing ? ' e ' : ''}${results.bing ? 'Bing' : ''}`
        : 'Google/Bing podem bloquear requisições de servidor. Submeta manualmente em: search.google.com/search-console',
      sitemap: SITEMAP_URL,
      google: results.google,
      bing: results.bing,
    })
  } catch (err) {
    console.error('Erro ao submeter sitemap:', err)
    return NextResponse.json({
      ok: false,
      error: 'Erro ao notificar buscadores',
      sitemap: SITEMAP_URL,
      alternativa: 'Submeta manualmente em search.google.com/search-console > Sitemaps',
    })
  }
}
