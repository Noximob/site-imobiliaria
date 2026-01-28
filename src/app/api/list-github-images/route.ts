import { NextResponse } from 'next/server'
import { getResolvedImagesMap } from '@/lib/github-images-resolve'

// Função auxiliar para formatar tamanho (apenas para log)
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export async function GET() {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GitHub token não configurado' }, { status: 500 })
    }
    const imagesMap = await getResolvedImagesMap()
    const count = Object.keys(imagesMap).length
    console.log(`🎯 Total de imagens mapeadas: ${count}`)
    Object.entries(imagesMap).forEach(([id, info]) => {
      console.log(`✅ ${id} -> ${info.path} (${formatFileSize(info.size)})`)
    })
    return NextResponse.json(imagesMap)
  } catch (error) {
    console.error('❌ Erro ao listar imagens do GitHub:', error)
    return NextResponse.json({ error: 'Erro ao buscar imagens' }, { status: 500 })
  }
}
