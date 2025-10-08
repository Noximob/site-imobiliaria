import { getAllSiteImagesSSR, siteImagesConfig } from './site-images'

// Pré-carregar todas as imagens durante o build
export async function preloadAllImages(): Promise<Record<string, string>> {
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
    
    console.log(`✅ ${Object.keys(imagesMap).length} imagens pré-carregadas`)
    return imagesMap
  } catch (error) {
    console.error('❌ Erro ao pré-carregar imagens:', error)
    
    // Fallback: retorna todas as imagens locais
    const fallbackMap: Record<string, string> = {}
    siteImagesConfig.forEach(config => {
      fallbackMap[config.id] = config.localPath
    })
    
    console.log(`⚠️ Usando ${Object.keys(fallbackMap).length} imagens locais como fallback`)
    return fallbackMap
  }
}
