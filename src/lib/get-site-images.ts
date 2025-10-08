import { getAllSiteImagesSSR, siteImagesConfig } from './site-images'

// Cache das imagens para evitar múltiplas chamadas ao Firebase
let cachedImages: Record<string, string> | null = null

// Buscar todas as imagens com fallback para imagens locais
export async function getSiteImagesForSSR(): Promise<Record<string, string>> {
  // Se já temos cache, retorna
  if (cachedImages) {
    return cachedImages
  }

  try {
    // Busca imagens do Firebase
    const firebaseImages = await getAllSiteImagesSSR()
    
    // Cria mapa com fallback para imagens locais
    const imagesMap: Record<string, string> = {}
    
    siteImagesConfig.forEach(config => {
      // Usa imagem do Firebase se existir, senão usa a local
      imagesMap[config.id] = firebaseImages[config.id] || config.localPath
    })
    
    // Salva no cache
    cachedImages = imagesMap
    
    return imagesMap
  } catch (error) {
    console.error('Erro ao buscar imagens para SSR:', error)
    
    // Fallback: retorna todas as imagens locais
    const fallbackMap: Record<string, string> = {}
    siteImagesConfig.forEach(config => {
      fallbackMap[config.id] = config.localPath
    })
    
    return fallbackMap
  }
}

// Limpar cache (útil para desenvolvimento)
export function clearSiteImagesCache() {
  cachedImages = null
}
