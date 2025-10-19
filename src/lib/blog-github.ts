import { Artigo } from '@/types'

// Cache dos artigos
let artigosCache: Artigo[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 0 // Desabilitar cache temporariamente

export async function getAllArtigos(): Promise<Artigo[]> {
  // Verificar cache
  const now = Date.now()
  if (artigosCache && (now - cacheTimestamp < CACHE_DURATION)) {
    return artigosCache
  }

  try {
    const response = await fetch('/api/blog-github', {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar artigos')
    }

    const artigos = await response.json()
    
    // Converter strings de data para objetos Date
    const artigosFormatados = artigos.map((artigo: any) => ({
      ...artigo,
      dataPublicacao: new Date(artigo.dataPublicacao),
      createdAt: new Date(artigo.createdAt),
      updatedAt: new Date(artigo.updatedAt),
    }))

    // Atualizar cache
    artigosCache = artigosFormatados
    cacheTimestamp = now

    return artigosFormatados
  } catch (error) {
    console.error('Erro ao buscar artigos:', error)
    return []
  }
}

export async function getArtigoBySlug(slug: string): Promise<Artigo | null> {
  try {
    const artigos = await getAllArtigos()
    const artigo = artigos.find(a => a.slug === slug && a.publicado)
    return artigo || null
  } catch (error) {
    console.error('Erro ao buscar artigo:', error)
    return null
  }
}

export async function createArtigoWithImage(
  artigo: Omit<Artigo, 'id' | 'createdAt' | 'updatedAt' | 'visualizacoes' | 'imagem'>,
  imageFile: File
): Promise<string> {
  try {
    // Converter imagem para base64
    const reader = new FileReader()
    const imageData = await new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(imageFile)
    })

    const response = await fetch('/api/blog-github', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ artigo, imagem: imageData }),
    })

    if (!response.ok) {
      throw new Error('Erro ao criar artigo')
    }

    const { id } = await response.json()
    
    // Limpar cache
    artigosCache = null

    return id
  } catch (error) {
    console.error('Erro ao criar artigo:', error)
    throw error
  }
}

export async function updateArtigoWithImage(
  id: string,
  artigo: Partial<Omit<Artigo, 'id' | 'createdAt' | 'visualizacoes' | 'imagem'>>,
  imageFile?: File
): Promise<void> {
  try {
    let imageData: string | undefined

    if (imageFile) {
      const reader = new FileReader()
      imageData = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(imageFile)
      })
    }

    const response = await fetch('/api/blog-github', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, artigo, imagem: imageData }),
    })

    if (!response.ok) {
      throw new Error('Erro ao atualizar artigo')
    }

    // Limpar cache
    artigosCache = null
  } catch (error) {
    console.error('Erro ao atualizar artigo:', error)
    throw error
  }
}

export async function deleteArtigo(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/blog-github?id=${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Erro ao deletar artigo')
    }

    // Limpar cache
    artigosCache = null
  } catch (error) {
    console.error('Erro ao deletar artigo:', error)
    throw error
  }
}

export function generateSlug(titulo: string): string {
  // Palavras-chave importantes para SEO
  const keywords = [
    'imovel', 'casa', 'apartamento', 'terreno', 'venda', 'aluguel',
    'balneario', 'camboriu', 'barra', 'velha', 'picarras', 'penha',
    'investimento', 'financiamento', 'decoracao', 'mercado', 'imobiliaria',
    'avenida', 'mobilidade', 'desenvolvimento', 'regiao', 'cidade',
    'construcao', 'lancamento', 'frente', 'mar', 'vista', 'cobertura'
  ]
  
  // Converter para lowercase e remover acentos
  let slug = titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  
  return slug
}

