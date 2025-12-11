// Utilitários para gerenciar favoritos no localStorage

const FAVORITOS_KEY = 'nox_imoveis_favoritos'

export function getFavoritos(): string[] {
  if (typeof window === 'undefined') return []
  
  try {
    const favoritos = localStorage.getItem(FAVORITOS_KEY)
    return favoritos ? JSON.parse(favoritos) : []
  } catch (error) {
    console.error('Erro ao ler favoritos:', error)
    return []
  }
}

export function adicionarFavorito(imovelId: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const favoritos = getFavoritos()
    if (!favoritos.includes(imovelId)) {
      favoritos.push(imovelId)
      localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos))
    }
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error)
  }
}

export function removerFavorito(imovelId: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const favoritos = getFavoritos()
    const novosFavoritos = favoritos.filter((id: string) => id !== imovelId)
    localStorage.setItem(FAVORITOS_KEY, JSON.stringify(novosFavoritos))
  } catch (error) {
    console.error('Erro ao remover favorito:', error)
  }
}

export function toggleFavorito(imovelId: string): boolean {
  if (typeof window === 'undefined') return false
  
  const favoritos = getFavoritos()
  const isFavorito = favoritos.includes(imovelId)
  
  if (isFavorito) {
    removerFavorito(imovelId)
    // Disparar evento para atualizar componentes
    window.dispatchEvent(new Event('favoritos-changed'))
    return false
  } else {
    adicionarFavorito(imovelId)
    // Disparar evento para atualizar componentes
    window.dispatchEvent(new Event('favoritos-changed'))
    return true
  }
}

export function isFavorito(imovelId: string): boolean {
  if (typeof window === 'undefined') return false
  return getFavoritos().includes(imovelId)
}

