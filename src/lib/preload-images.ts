import { getAllSiteImagesSSR, siteImagesConfig } from './site-images'

// Cache global para evitar múltiplas chamadas
let imageCache: Record<string, string> | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Pré-carregar todas as imagens durante o build com cache inteligente
export async function preloadAllImages(): Promise<Record<string, string>> {
  // Verifica se o cache ainda é válido
  if (imageCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    console.log('🚀 Usando cache de imagens')
    return imageCache
  }

  try {
    console.log('🔄 Pré-carregando imagens do Firebase...')
    
    // Busca imagens do Firebase
    const firebaseImages = await getAllSiteImagesSSR()
    
    // Cria mapa com fallback para imagens locais
    const imagesMap: Record<string, string> = {}
    
    siteImagesConfig.forEach(config => {
      // Usa imagem do Firebase se existir, senão usa a local
      imagesMap[config.id] = firebaseImages[config.id] || config.localPath
    })
    
    // Atualiza cache
    imageCache = imagesMap
    cacheTimestamp = Date.now()
    
    console.log(`✅ ${Object.keys(imagesMap).length} imagens pré-carregadas e cacheadas`)
    return imagesMap
  } catch (error) {
    console.error('❌ Erro ao pré-carregar imagens:', error)
    
    // Fallback: retorna todas as imagens locais
    const fallbackMap: Record<string, string> = {}
    siteImagesConfig.forEach(config => {
      fallbackMap[config.id] = config.localPath
    })
    
    // Atualiza cache com fallback
    imageCache = fallbackMap
    cacheTimestamp = Date.now()
    
    console.log(`⚠️ Usando ${Object.keys(fallbackMap).length} imagens locais como fallback`)
    return fallbackMap
  }
}

// Função para limpar cache (útil para desenvolvimento)
export function clearImageCache() {
  imageCache = null
  cacheTimestamp = 0
  console.log('🗑️ Cache de imagens limpo')
}
