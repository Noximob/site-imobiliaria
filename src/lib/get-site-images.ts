import { getAllSiteImagesSSR, siteImagesConfig } from './site-images'

// Cache global das imagens (persiste entre requests)
const globalImageCache = new Map<string, string>()

// Buscar todas as imagens com fallback para imagens locais
export async function getSiteImagesForSSR(): Promise<Record<string, string>> {
  // Verifica se já temos todas as imagens no cache global
  if (globalImageCache.size === siteImagesConfig.length) {
    const cachedImages: Record<string, string> = {}
    globalImageCache.forEach((value, key) => {
      cachedImages[key] = value
    })
    return cachedImages
  }

  try {
    // Busca imagens do Firebase
    const firebaseImages = await getAllSiteImagesSSR()
    
    // Cria mapa com fallback para imagens locais
    const imagesMap: Record<string, string> = {}
    
    siteImagesConfig.forEach(config => {
      // Usa imagem do Firebase se existir, senão usa a local
      const imageUrl = firebaseImages[config.id] || config.localPath
      imagesMap[config.id] = imageUrl
      
      // Salva no cache global
      globalImageCache.set(config.id, imageUrl)
    })
    
    return imagesMap
  } catch (error) {
    console.error('Erro ao buscar imagens para SSR:', error)
    
    // Fallback: retorna todas as imagens locais
    const fallbackMap: Record<string, string> = {}
    siteImagesConfig.forEach(config => {
      fallbackMap[config.id] = config.localPath
      globalImageCache.set(config.id, config.localPath)
    })
    
    return fallbackMap
  }
}

// Limpar cache (útil para desenvolvimento)
export function clearSiteImagesCache() {
  globalImageCache.clear()
}
