export interface SiteImageConfig {
  id: string
  description: string
  localPath: string
  recommendedSize: string
  category: string
  subcategory?: string
}

// Configuração de todas as imagens do site organizadas por categoria
export const siteImagesConfig: SiteImageConfig[] = [
  // ==================== TODAS AS PÁGINAS ====================
  {
    id: 'logo-header',
    description: 'Logo da Nox Imóveis no cabeçalho',
    localPath: '/imagens/Logo.png',
    recommendedSize: '400x150px',
    category: 'Todas as Páginas'
  },
  {
    id: 'logo-footer',
    description: 'Logo da Nox Imóveis no rodapé',
    localPath: '/imagens/Logo1.png',
    recommendedSize: '400x150px',
    category: 'Todas as Páginas'
  },

  // ==================== PÁGINA PRINCIPAL ====================
  {
    id: 'banner-home',
    description: 'Banner principal da home',
    localPath: '/imagens/banners/banner-home.png',
    recommendedSize: '1920x1080px',
    category: 'Página Principal',
    subcategory: 'Banner'
  },
  
  // Encontre seu imóvel - Penha
  {
    id: 'lancamentos-investidor',
    description: 'Lançamentos Investidor - Penha',
    localPath: '/imagens/Encontre Imovel/Lançamentos-Investidor.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Penha'
  },
  {
    id: 'frente-mar',
    description: 'Frente-Mar - Penha',
    localPath: '/imagens/Encontre Imovel/Frente-Mar.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Penha'
  },
  {
    id: 'apartamentos',
    description: 'Apartamentos - Penha',
    localPath: '/imagens/Encontre Imovel/Apartamentos.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Penha'
  },

  // Encontre seu imóvel - Balneário Piçarras
  {
    id: 'apartamento-cobertura-picarras',
    description: 'Apartamento Cobertura - Piçarras',
    localPath: '/imagens/Encontre Imovel/Piçarras/Apartamento-Cobertura.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Piçarras'
  },
  {
    id: 'lancamentos-picarras',
    description: 'Lançamentos - Piçarras',
    localPath: '/imagens/Encontre Imovel/Piçarras/Lançamentos.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Piçarras'
  },
  {
    id: 'mobiliado-picarras',
    description: 'Mobiliado - Piçarras',
    localPath: '/imagens/Encontre Imovel/Piçarras/Mobiliado.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Piçarras'
  },
  {
    id: 'vista-mar-picarras',
    description: 'Vista-Mar - Piçarras',
    localPath: '/imagens/Encontre Imovel/Piçarras/Vista-Mar.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Piçarras'
  },

  // Encontre seu imóvel - Barra Velha
  {
    id: 'em-construcao-barra-velha',
    description: 'Em Construção - Barra Velha',
    localPath: '/imagens/Encontre Imovel/Barra Velha/Em Construção.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Barra Velha'
  },
  {
    id: 'imoveis-prontos-barra-velha',
    description: 'Imóveis Prontos - Barra Velha',
    localPath: '/imagens/Encontre Imovel/Barra Velha/Imoveis Prontos.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Barra Velha'
  },
  {
    id: 'lancamentos-frente-mar-barra-velha',
    description: 'Lançamentos Frente-Mar - Barra Velha',
    localPath: '/imagens/Encontre Imovel/Barra Velha/Lançamentos Frente mar.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Barra Velha'
  },

  // Outros imóveis
  {
    id: 'mobiliados',
    description: 'Mobiliados',
    localPath: '/imagens/Encontre Imovel/Mobiliados.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Outros Imóveis'
  },

  // Imóveis na Planta
  {
    id: 'imoveis-na-planta-1',
    description: 'Imóveis na Planta - Imagem 1',
    localPath: '/imagens/Imoveis na Planta/1.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Imóveis na Planta'
  },
  {
    id: 'imoveis-na-planta-2',
    description: 'Imóveis na Planta - Imagem 2',
    localPath: '/imagens/Imoveis na Planta/2.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Imóveis na Planta'
  },
  {
    id: 'imoveis-na-planta-3',
    description: 'Imóveis na Planta - Imagem 3',
    localPath: '/imagens/Imoveis na Planta/3.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Imóveis na Planta'
  },

  // Seleção Nox
  {
    id: 'selecao-nox-1',
    description: 'Seleção Nox - Imagem 1',
    localPath: '/imagens/Seleção Nox/1.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Seleção Nox'
  },
  {
    id: 'selecao-nox-2',
    description: 'Seleção Nox - Imagem 2',
    localPath: '/imagens/Seleção Nox/2.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Seleção Nox'
  },
  {
    id: 'selecao-nox-3',
    description: 'Seleção Nox - Imagem 3',
    localPath: '/imagens/Seleção Nox/3.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Seleção Nox'
  },

  // ==================== COMO COMPRAR ====================
  {
    id: 'topico-como-comprar',
    description: 'Tópico Como Comprar',
    localPath: '/imagens/Como Comprar/Topico Como Comprar.png',
    recommendedSize: '800x400px',
    category: 'Como Comprar',
    subcategory: 'Tópico'
  },
  {
    id: 'como-comprar-1',
    description: 'Como Comprar - Passo 1',
    localPath: '/imagens/Como Comprar/1.png',
    recommendedSize: '400x300px',
    category: 'Como Comprar',
    subcategory: 'Passos'
  },
  {
    id: 'como-comprar-2',
    description: 'Como Comprar - Passo 2',
    localPath: '/imagens/Como Comprar/2.png',
    recommendedSize: '400x300px',
    category: 'Como Comprar',
    subcategory: 'Passos'
  },
  {
    id: 'como-comprar-3',
    description: 'Como Comprar - Passo 3',
    localPath: '/imagens/Como Comprar/3.png',
    recommendedSize: '400x300px',
    category: 'Como Comprar',
    subcategory: 'Passos'
  },
  {
    id: 'como-comprar-4',
    description: 'Como Comprar - Passo 4',
    localPath: '/imagens/Como Comprar/4.png',
    recommendedSize: '400x300px',
    category: 'Como Comprar',
    subcategory: 'Passos'
  },
  {
    id: 'como-comprar-5',
    description: 'Como Comprar - Passo 5',
    localPath: '/imagens/Como Comprar/5.png',
    recommendedSize: '400x300px',
    category: 'Como Comprar',
    subcategory: 'Passos'
  },

  // ==================== ENCONTRE MEU IMÓVEL ====================
  {
    id: 'equipe',
    description: 'Equipe - Encontre Meu Imóvel',
    localPath: '/imagens/Encontre Meu Imovel/Equipe.png',
    recommendedSize: '800x600px',
    category: 'Encontre Meu Imóvel',
    subcategory: 'Equipe'
  },

  // ==================== CORRETORES ====================
  {
    id: 'corretores-1',
    description: 'Corretores - Imagem 1',
    localPath: '/imagens/Corretores/1.png',
    recommendedSize: '400x400px',
    category: 'Corretores',
    subcategory: 'Fotos'
  },
  {
    id: 'corretores-2',
    description: 'Corretores - Imagem 2',
    localPath: '/imagens/Corretores/2.png',
    recommendedSize: '400x400px',
    category: 'Corretores',
    subcategory: 'Fotos'
  },
  {
    id: 'corretores-3',
    description: 'Corretores - Imagem 3',
    localPath: '/imagens/Corretores/3.png',
    recommendedSize: '400x400px',
    category: 'Corretores',
    subcategory: 'Fotos'
  },
  {
    id: 'corretores-4',
    description: 'Corretores - Imagem 4',
    localPath: '/imagens/Corretores/4.png',
    recommendedSize: '400x400px',
    category: 'Corretores',
    subcategory: 'Fotos'
  },

  // ==================== CONTATO ====================
  {
    id: 'contato',
    description: 'Imagem de Contato',
    localPath: '/imagens/Contato/Contato.png',
    recommendedSize: '800x600px',
    category: 'Contato',
    subcategory: 'Principal'
  },

  // ==================== ANUNCIAR ====================
  {
    id: 'anunciar-imovel',
    description: 'Anunciar Imóvel',
    localPath: '/imagens/Anunciar Imovel/Anunciar Imovel.png',
    recommendedSize: '800x600px',
    category: 'Anunciar',
    subcategory: 'Principal'
  },
  {
    id: 'anuncie-nox-mulher',
    description: 'Anuncie Nox - Mulher',
    localPath: '/imagens/Anuncie Nox/Mulher.png',
    recommendedSize: '400x600px',
    category: 'Anunciar',
    subcategory: 'Anuncie Nox'
  },

  // ==================== TRABALHE CONOSCO ====================
  {
    id: 'trabalhe-conosco',
    description: 'Trabalhe Conosco',
    localPath: '/imagens/Trabalhe Conosco/Trabalhe Conosco.png',
    recommendedSize: '800x600px',
    category: 'Trabalhe Conosco',
    subcategory: 'Principal'
  },

  // ==================== VIVA PENHA ====================
  {
    id: 'penha-hero',
    description: 'Banner Hero - Viva Penha',
    localPath: '/imagens/banners/penha-hero.jpg',
    recommendedSize: '1920x1080px',
    category: 'Viva Penha',
    subcategory: 'Banner'
  },
  {
    id: 'penha-praia-principal',
    description: 'Praia Principal - Penha',
    localPath: '/imagens/penha/praia-principal.jpg',
    recommendedSize: '800x600px',
    category: 'Viva Penha',
    subcategory: 'Praias'
  },
  {
    id: 'penha-praia-secundaria',
    description: 'Praia Secundária - Penha',
    localPath: '/imagens/penha/praia-secundaria.jpg',
    recommendedSize: '800x600px',
    category: 'Viva Penha',
    subcategory: 'Praias'
  },
  {
    id: 'penha-praia1',
    description: 'Praia 1 - Penha',
    localPath: '/imagens/penha/praia1.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Penha',
    subcategory: 'Atrações'
  },
  {
    id: 'penha-cristo-luz',
    description: 'Cristo Luz - Penha',
    localPath: '/imagens/penha/cristo-luz.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Penha',
    subcategory: 'Atrações'
  },
  {
    id: 'penha-beto-carrero',
    description: 'Beto Carrero World - Penha',
    localPath: '/imagens/penha/beto-carrero.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Penha',
    subcategory: 'Atrações'
  },
  {
    id: 'penha-jantar-romantico',
    description: 'Jantar Romântico - Penha',
    localPath: '/imagens/penha/jantar-romantico.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Penha',
    subcategory: 'Atrações'
  },
  {
    id: 'penha-praia2',
    description: 'Praia 2 - Penha',
    localPath: '/imagens/penha/praia2.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Penha',
    subcategory: 'Atrações'
  },
  {
    id: 'penha-skyline',
    description: 'Skyline - Penha',
    localPath: '/imagens/penha/skyline.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Penha',
    subcategory: 'Atrações'
  },

  // ==================== VIVA PIÇARRAS ====================
  {
    id: 'picarras-hero',
    description: 'Banner Hero - Viva Piçarras',
    localPath: '/imagens/banners/picarras-hero.jpg',
    recommendedSize: '1920x1080px',
    category: 'Viva Piçarras',
    subcategory: 'Banner'
  },
  {
    id: 'picarras-praia-principal',
    description: 'Praia Principal - Piçarras',
    localPath: '/imagens/picarras/praia-principal.jpg',
    recommendedSize: '800x600px',
    category: 'Viva Piçarras',
    subcategory: 'Praias'
  },
  {
    id: 'picarras-praia-secundaria',
    description: 'Praia Secundária - Piçarras',
    localPath: '/imagens/picarras/praia-secundaria.jpg',
    recommendedSize: '800x600px',
    category: 'Viva Piçarras',
    subcategory: 'Praias'
  },
  {
    id: 'picarras-praia1',
    description: 'Praia 1 - Piçarras',
    localPath: '/imagens/picarras/praia1.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Piçarras',
    subcategory: 'Atrações'
  },
  {
    id: 'picarras-atracao1',
    description: 'Atração 1 - Piçarras',
    localPath: '/imagens/picarras/atracao1.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Piçarras',
    subcategory: 'Atrações'
  },
  {
    id: 'picarras-atracao2',
    description: 'Atração 2 - Piçarras',
    localPath: '/imagens/picarras/atracao2.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Piçarras',
    subcategory: 'Atrações'
  },
  {
    id: 'picarras-gastronomia',
    description: 'Gastronomia - Piçarras',
    localPath: '/imagens/picarras/gastronomia.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Piçarras',
    subcategory: 'Atrações'
  },
  {
    id: 'picarras-praia2',
    description: 'Praia 2 - Piçarras',
    localPath: '/imagens/picarras/praia2.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Piçarras',
    subcategory: 'Atrações'
  },
  {
    id: 'picarras-skyline',
    description: 'Skyline - Piçarras',
    localPath: '/imagens/picarras/skyline.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Piçarras',
    subcategory: 'Atrações'
  },

  // ==================== VIVA BARRA VELHA ====================
  {
    id: 'barra-velha-hero',
    description: 'Banner Hero - Viva Barra Velha',
    localPath: '/imagens/banners/barra-velha-hero.jpg',
    recommendedSize: '1920x1080px',
    category: 'Viva Barra Velha',
    subcategory: 'Banner'
  },
  {
    id: 'barra-velha-praia-principal',
    description: 'Praia Principal - Barra Velha',
    localPath: '/imagens/barra-velha/praia-principal.jpg',
    recommendedSize: '800x600px',
    category: 'Viva Barra Velha',
    subcategory: 'Praias'
  },
  {
    id: 'barra-velha-praia-secundaria',
    description: 'Praia Secundária - Barra Velha',
    localPath: '/imagens/barra-velha/praia-secundaria.jpg',
    recommendedSize: '800x600px',
    category: 'Viva Barra Velha',
    subcategory: 'Praias'
  },
  {
    id: 'barra-velha-praia1',
    description: 'Praia 1 - Barra Velha',
    localPath: '/imagens/barra-velha/praia1.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Barra Velha',
    subcategory: 'Atrações'
  },
  {
    id: 'barra-velha-atracao1',
    description: 'Atração 1 - Barra Velha',
    localPath: '/imagens/barra-velha/atracao1.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Barra Velha',
    subcategory: 'Atrações'
  },
  {
    id: 'barra-velha-atracao2',
    description: 'Atração 2 - Barra Velha',
    localPath: '/imagens/barra-velha/atracao2.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Barra Velha',
    subcategory: 'Atrações'
  },
  {
    id: 'barra-velha-gastronomia',
    description: 'Gastronomia - Barra Velha',
    localPath: '/imagens/barra-velha/gastronomia.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Barra Velha',
    subcategory: 'Atrações'
  },
  {
    id: 'barra-velha-praia2',
    description: 'Praia 2 - Barra Velha',
    localPath: '/imagens/barra-velha/praia2.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Barra Velha',
    subcategory: 'Atrações'
  },
  {
    id: 'barra-velha-skyline',
    description: 'Skyline - Barra Velha',
    localPath: '/imagens/barra-velha/skyline.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Barra Velha',
    subcategory: 'Atrações'
  },

  // ==================== QUEM SOMOS / SOBRE ====================
  {
    id: 'quem-somos-hero',
    description: 'Banner Hero - Quem Somos',
    localPath: '/imagens/banners/quem-somos-hero.jpg',
    recommendedSize: '1920x1080px',
    category: 'Quem Somos',
    subcategory: 'Banner'
  },
  {
    id: 'equipe-principal',
    description: 'Equipe Principal - Quem Somos',
    localPath: '/imagens/equipe/equipe-principal.jpg',
    recommendedSize: '800x600px',
    category: 'Quem Somos',
    subcategory: 'Equipe'
  }
]

// Função para obter URL da imagem (SOMENTE GitHub - sem fallback)
export function getImageUrl(imageId: string): string {
  const config = siteImagesConfig.find(img => img.id === imageId)
  if (!config) {
    console.warn(`Imagem não encontrada: ${imageId}`)
    return ''
  }
  
  // Retorna URL do GitHub (sem fallback local)
  return config.localPath
}

// Função para obter todas as imagens
export function getAllImages(): Record<string, string> {
  const images: Record<string, string> = {}
  
  siteImagesConfig.forEach(config => {
    images[config.id] = getImageUrl(config.id)
  })
  
  return images
}

// Função para obter imagens por categoria
export function getImagesByCategory(category: string): SiteImageConfig[] {
  return siteImagesConfig.filter(img => img.category === category)
}

// Função para obter imagens por subcategoria
export function getImagesBySubcategory(category: string, subcategory: string): SiteImageConfig[] {
  return siteImagesConfig.filter(img => 
    img.category === category && img.subcategory === subcategory
  )
}
