import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const baseUrl = 'https://noximobiliaria.com.br'

export async function GET() {
  try {
    const artigosPath = path.join(process.cwd(), 'public/blog/artigos.json')
    if (!fs.existsSync(artigosPath)) {
      return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Blog Nox Imóveis</title><link>' + baseUrl + '/blog</link></channel></rss>', {
        headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
      })
    }
    const data = fs.readFileSync(artigosPath, 'utf-8')
    const artigos = JSON.parse(data).filter((a: { publicado?: boolean }) => a.publicado === true)
    const items = artigos
      .slice(0, 50)
      .map(
        (a: { titulo: string; slug: string; resumo?: string; dataPublicacao?: string; updatedAt?: string }) =>
          `  <item>
    <title>${escapeXml(a.titulo)}</title>
    <link>${baseUrl}/blog/${a.slug}/</link>
    <description>${escapeXml((a.resumo || a.titulo).substring(0, 300))}</description>
    <pubDate>${new Date(a.dataPublicacao || a.updatedAt || Date.now()).toUTCString()}</pubDate>
    <guid isPermaLink="true">${baseUrl}/blog/${a.slug}/</guid>
  </item>`
      )
      .join('\n')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog Nox Imóveis - Penha, Piçarras e Barra Velha</title>
    <link>${baseUrl}/blog</link>
    <description>Dicas, mercado e novidades sobre imóveis no litoral norte de SC</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
    })
  } catch (err) {
    console.error('Erro ao gerar RSS:', err)
    return new NextResponse('Erro ao gerar RSS', { status: 500 })
  }
}

function escapeXml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
