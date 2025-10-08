// Função para pré-carregar uma imagem específica
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

// Função para pré-carregar múltiplas imagens
export async function preloadImages(srcs: string[]): Promise<void> {
  const promises = srcs.map(src => preloadImage(src))
  await Promise.all(promises)
}
