import { NextResponse } from 'next/server'

const SITEMAP_URL = 'https://noximobiliaria.com.br/sitemap.xml'
const GOOGLE_PING_URL = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`

/**
 * GET /api/submit-sitemap
 * Notifica o Google que o sitemap foi atualizado (ex: novos imóveis).
 * Chamar após adicionar/editar imóveis no admin.
 */
export async function GET() {
  try {
    const res = await fetch(GOOGLE_PING_URL, { method: 'GET' })
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: 'Falha ao notificar Google' }, { status: 500 })
    }
    return NextResponse.json({
      ok: true,
      message: 'Sitemap notificado ao Google com sucesso',
      sitemap: SITEMAP_URL,
    })
  } catch (err) {
    console.error('Erro ao submeter sitemap:', err)
    return NextResponse.json({ ok: false, error: 'Erro ao notificar Google' }, { status: 500 })
  }
}
