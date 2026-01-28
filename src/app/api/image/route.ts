import { NextRequest, NextResponse } from 'next/server'
import { getResolvedImagesMap } from '@/lib/github-images-resolve'

/**
 * GET /api/image?id=xxx
 * Redireciona para o path real da imagem no repositório (ex: /imagens/banner.avif).
 * Assim o site sempre usa o arquivo que está no GitHub, igual ao admin.
 */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })
  }
  const map = await getResolvedImagesMap()
  const info = map[id]
  if (!info) {
    return NextResponse.json({ error: 'Imagem não encontrada' }, { status: 404 })
  }
  // Redirecionar para o path no mesmo origin (arquivo em public/ no deploy)
  return NextResponse.redirect(new URL(info.path, request.url), 302)
}
