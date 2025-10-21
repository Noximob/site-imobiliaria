import depoimentosData from '../../public/dados/depoimentos.json'

export interface Depoimento {
  id: string
  nome: string
  comentario: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

let githubDepoimentosCache: Depoimento[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

async function fetchDepoimentosFromGitHub(): Promise<Depoimento[]> {
  try {
    const response = await fetch('/api/depoimentos', {
      cache: 'no-store' // Always fetch fresh data
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao buscar depoimentos do GitHub:', error)
    return []
  }
}

export async function getDepoimentos(): Promise<Depoimento[]> {
  // No server-side (build time), use local data
  if (typeof window === 'undefined') {
    return depoimentosData.depoimentos as Depoimento[]
  }

  // On client-side, try to use cache first
  const now = Date.now()
  if (githubDepoimentosCache && (now - cacheTimestamp < CACHE_DURATION)) {
    return githubDepoimentosCache
  }

  // Fetch from GitHub API
  const data = await fetchDepoimentosFromGitHub()
  githubDepoimentosCache = data
  cacheTimestamp = now
  return data
}

export async function getDepoimentosAtivos(): Promise<Depoimento[]> {
  const allDepoimentos = await getDepoimentos()
  return allDepoimentos.filter(d => d.ativo)
}
