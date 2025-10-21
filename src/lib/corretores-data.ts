import corretoresData from '../../public/dados/corretores.json'

export interface Corretor {
  id: string
  nome: string
  cargo: string
  creci: string
  telefone: string
  instagram?: string
  email: string
  foto: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

export interface CorretoresData {
  corretores: Corretor[]
}

// Cache para corretores do GitHub
let githubCorretoresCache: Corretor[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Função para buscar corretores do GitHub
async function fetchCorretoresFromGitHub(): Promise<Corretor[]> {
  try {
    const response = await fetch('/api/corretores')
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Erro ao buscar corretores do GitHub:', error)
  }
  return []
}

// Função principal para obter corretores
export async function getCorretores(): Promise<Corretor[]> {
  // Se estamos no servidor (build time), usar dados locais
  if (typeof window === 'undefined') {
    return corretoresData.corretores || []
  }

  // Se estamos no cliente, verificar cache
  const now = Date.now()
  if (githubCorretoresCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return githubCorretoresCache
  }

  // Buscar do GitHub
  try {
    const corretores = await fetchCorretoresFromGitHub()
    githubCorretoresCache = corretores
    cacheTimestamp = now
    return corretores
  } catch (error) {
    console.error('Erro ao buscar corretores:', error)
    // Fallback para dados locais
    return corretoresData.corretores || []
  }
}

// Função para obter corretores ativos
export async function getCorretoresAtivos(): Promise<Corretor[]> {
  const corretores = await getCorretores()
  return corretores.filter(corretor => corretor.ativo)
}
