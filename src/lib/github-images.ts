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
    localPath: '/imagens/logo-nox-imoveis-penha-picarras-barra-velha.png',
    recommendedSize: '400x150px',
    category: 'Todas as Páginas'
  },
  {
    id: 'logo-footer',
    description: 'Logo da Nox Imóveis no rodapé',
    localPath: '/imagens/logo-nox-imoveis-rodape.png',
    recommendedSize: '400x150px',
    category: 'Todas as Páginas'
  },

  // ==================== PÁGINA PRINCIPAL ====================
  {
    id: 'banner-home',
    description: 'Banner principal da home',
    localPath: '/imagens/banner-principal-imoveis-penha-picarras-barra-velha.jpg',
    recommendedSize: '1920x1080px',
    category: 'Página Principal',
    subcategory: 'Banner'
  },
  
  // Encontre seu imóvel - Penha
  {
    id: 'lancamentos-investidor',
    description: 'Lançamentos Investidor - Penha',
    localPath: '/imagens/lancamentos-investidor-penha-sc-praia.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Penha'
  },
  {
    id: 'frente-mar',
    description: 'Frente-Mar - Penha',
    localPath: '/imagens/apartamentos-frente-mar-penha-sc.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Penha'
  },
  {
    id: 'apartamentos',
    description: 'Apartamentos - Penha',
    localPath: '/imagens/apartamentos-venda-penha-sc.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Penha'
  },

  // Encontre seu imóvel - Balneário Piçarras
  {
    id: 'apartamento-cobertura-picarras',
    description: 'Apartamento Cobertura - Piçarras',
    localPath: '/imagens/apartamento-cobertura-picarras-sc.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Piçarras'
  },
  {
    id: 'lancamentos-picarras',
    description: 'Lançamentos - Piçarras',
    localPath: '/imagens/lancamentos-picarras-sc-praia.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Piçarras'
  },
  {
    id: 'mobiliado-picarras',
    description: 'Mobiliado - Piçarras',
    localPath: '/imagens/apartamento-mobiliado-picarras-sc.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Piçarras'
  },
  {
    id: 'vista-mar-picarras',
    description: 'Vista-Mar - Piçarras',
    localPath: '/imagens/apartamento-vista-mar-picarras-sc.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Piçarras'
  },

  // Encontre seu imóvel - Barra Velha
  {
    id: 'em-construcao-barra-velha',
    description: 'Em Construção - Barra Velha',
    localPath: '/imagens/imoveis-em-construcao-barra-velha-sc.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Barra Velha'
  },
  {
    id: 'imoveis-prontos-barra-velha',
    description: 'Imóveis Prontos - Barra Velha',
    localPath: '/imagens/imoveis-prontos-barra-velha-sc.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Barra Velha'
  },
  {
    id: 'lancamentos-frente-mar-barra-velha',
    description: 'Lançamentos Frente-Mar - Barra Velha',
    localPath: '/imagens/lancamentos-frente-mar-barra-velha-sc.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Barra Velha'
  },

  // Outros imóveis
  {
    id: 'mobiliados',
    description: 'Mobiliados',
    localPath: '/imagens/apartamentos-mobiliados-praia-sc.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Outros Imóveis'
  },

  // Imóveis na Planta
  {
    id: 'imoveis-na-planta-1',
    description: 'Imóveis na Planta - Imagem 1',
    localPath: '/imagens/imoveis-na-planta-lancamento-praia-1.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Imóveis na Planta'
  },
  {
    id: 'imoveis-na-planta-2',
    description: 'Imóveis na Planta - Imagem 2',
    localPath: '/imagens/imoveis-na-planta-lancamento-praia-2.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Imóveis na Planta'
  },
  {
    id: 'imoveis-na-planta-3',
    description: 'Imóveis na Planta - Imagem 3',
    localPath: '/imagens/imoveis-na-planta-lancamento-praia-3.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Imóveis na Planta'
  },

  // Seleção Nox
  {
    id: 'selecao-nox-1',
    description: 'Seleção Nox - Imagem 1',
    localPath: '/imagens/imovel-destaque-nox-penha-picarras-1.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Seleção Nox'
  },
  {
    id: 'selecao-nox-2',
    description: 'Seleção Nox - Imagem 2',
    localPath: '/imagens/imovel-destaque-nox-penha-picarras-2.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Seleção Nox'
  },
  {
    id: 'selecao-nox-3',
    description: 'Seleção Nox - Imagem 3',
    localPath: '/imagens/imovel-destaque-nox-penha-picarras-3.jpg',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Seleção Nox'
  },

  // ==================== COMO COMPRAR ====================
  {
    id: 'topico-como-comprar',
    description: 'Tópico Como Comprar',
    localPath: '/imagens/como-comprar-imovel-guia-completo.jpg',
    recommendedSize: '800x400px',
    category: 'Como Comprar',
    subcategory: 'Tópico'
  },
  {
    id: 'como-comprar-1',
    description: 'Como Comprar - Passo 1',
    localPath: '/imagens/como-comprar-imovel-passo-1-pesquisa.jpg',
    recommendedSize: '400x300px',
    category: 'Como Comprar',
    subcategory: 'Passos'
  },
  {
    id: 'como-comprar-2',
    description: 'Como Comprar - Passo 2',
    localPath: '/imagens/como-comprar-imovel-passo-2-visita.jpg',
    recommendedSize: '400x300px',
    category: 'Como Comprar',
    subcategory: 'Passos'
  },
  {
    id: 'como-comprar-3',
    description: 'Como Comprar - Passo 3',
    localPath: '/imagens/como-comprar-imovel-passo-3-financiamento.jpg',
    recommendedSize: '400x300px',
    category: 'Como Comprar',
    subcategory: 'Passos'
  },
  {
    id: 'como-comprar-4',
    description: 'Como Comprar - Passo 4',
    localPath: '/imagens/como-comprar-imovel-passo-4-documentacao.jpg',
    recommendedSize: '400x300px',
    category: 'Como Comprar',
    subcategory: 'Passos'
  },
  {
    id: 'como-comprar-5',
    description: 'Como Comprar - Passo 5',
    localPath: '/imagens/como-comprar-imovel-passo-5-escritura.jpg',
    recommendedSize: '400x300px',
    category: 'Como Comprar',
    subcategory: 'Passos'
  },

  // ==================== ENCONTRE MEU IMÓVEL ====================
  {
    id: 'equipe',
    description: 'Equipe - Encontre Meu Imóvel',
    localPath: '/imagens/equipe-nox-imoveis-corretores.jpg',
    recommendedSize: '800x600px',
    category: 'Encontre Meu Imóvel',
    subcategory: 'Equipe'
  },

  // ==================== CORRETORES ====================
  {
    id: 'corretores-1',
    description: 'Corretores - Imagem 1',
    localPath: '/imagens/corretor-imoveis-penha-picarras-1.jpg',
    recommendedSize: '400x400px',
    category: 'Corretores',
    subcategory: 'Fotos'
  },
  {
    id: 'corretores-2',
    description: 'Corretores - Imagem 2',
    localPath: '/imagens/corretor-imoveis-penha-picarras-2.jpg',
    recommendedSize: '400x400px',
    category: 'Corretores',
    subcategory: 'Fotos'
  },
  {
    id: 'corretores-3',
    description: 'Corretores - Imagem 3',
    localPath: '/imagens/corretor-imoveis-penha-picarras-3.jpg',
    recommendedSize: '400x400px',
    category: 'Corretores',
    subcategory: 'Fotos'
  },
  {
    id: 'corretores-4',
    description: 'Corretores - Imagem 4',
    localPath: '/imagens/corretor-imoveis-penha-picarras-4.jpg',
    recommendedSize: '400x400px',
    category: 'Corretores',
    subcategory: 'Fotos'
  },

  // ==================== CONTATO ====================
  {
    id: 'contato',
    description: 'Imagem de Contato',
    localPath: '/imagens/contato-nox-imoveis-penha-picarras.jpg',
    recommendedSize: '800x600px',
    category: 'Contato',
    subcategory: 'Principal'
  },

  // ==================== ANUNCIAR ====================
  {
    id: 'anunciar-imovel',
    description: 'Anunciar Imóvel',
    localPath: '/imagens/anunciar-imovel-nox-penha-picarras.jpg',
    recommendedSize: '800x600px',
    category: 'Anunciar',
    subcategory: 'Principal'
  },
  {
    id: 'anuncie-nox-mulher',
    description: 'Anuncie Nox - Mulher',
    localPath: '/imagens/anuncie-imovel-corretora-nox.jpg',
    recommendedSize: '400x600px',
    category: 'Anunciar',
    subcategory: 'Anuncie Nox'
  },

  // ==================== TRABALHE CONOSCO ====================
  {
    id: 'trabalhe-conosco',
    description: 'Trabalhe Conosco',
    localPath: '/imagens/trabalhe-conosco-nox-imoveis-corretor.jpg',
    recommendedSize: '800x600px',
    category: 'Trabalhe Conosco',
    subcategory: 'Principal'
  },

  // ==================== VIVA PENHA ====================
  {
    id: 'penha-hero',
    description: 'Banner Hero - Viva Penha',
    localPath: '/imagens/banner-penha-sc-praia-turismo.jpg',
    recommendedSize: '1920x1080px',
    category: 'Viva Penha',
    subcategory: 'Banner'
  },
  {
    id: 'penha-praia-principal',
    description: 'Praia Principal - Penha',
    localPath: '/imagens/praia-penha-sc-litoral-norte.jpg',
    recommendedSize: '800x600px',
    category: 'Viva Penha',
    subcategory: 'Praias'
  },
  {
    id: 'penha-praia-secundaria',
    description: 'Praia Secundária - Penha',
    localPath: '/imagens/praia-armacao-penha-sc.jpg',
    recommendedSize: '800x600px',
    category: 'Viva Penha',
    subcategory: 'Praias'
  },
  {
    id: 'penha-praia1',
    description: 'Praia 1 - Penha',
    localPath: '/imagens/praia-grande-penha-sc.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Penha',
    subcategory: 'Atrações'
  },
  {
    id: 'penha-cristo-luz',
    description: 'Cristo Luz - Penha',
    localPath: '/imagens/cristo-luz-penha-sc-ponto-turistico.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Penha',
    subcategory: 'Atrações'
  },
  {
    id: 'penha-beto-carrero',
    description: 'Beto Carrero World - Penha',
    localPath: '/imagens/beto-carrero-world-penha-sc.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Penha',
    subcategory: 'Atrações'
  },
  {
    id: 'penha-jantar-romantico',
    description: 'Jantar Romântico - Penha',
    localPath: '/imagens/restaurante-penha-sc-gastronomia.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Penha',
    subcategory: 'Atrações'
  },
  {
    id: 'penha-praia2',
    description: 'Praia 2 - Penha',
    localPath: '/imagens/praia-alegre-penha-sc.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Penha',
    subcategory: 'Atrações'
  },
  {
    id: 'penha-skyline',
    description: 'Skyline - Penha',
    localPath: '/imagens/vista-aerea-penha-sc-litoral.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Penha',
    subcategory: 'Atrações'
  },

  // ==================== VIVA PIÇARRAS ====================
  {
    id: 'picarras-hero',
    description: 'Banner Hero - Viva Piçarras',
    localPath: '/imagens/banner-balneario-picarras-sc-praia.jpg',
    recommendedSize: '1920x1080px',
    category: 'Viva Piçarras',
    subcategory: 'Banner'
  },
  {
    id: 'picarras-praia-principal',
    description: 'Praia Principal - Piçarras',
    localPath: '/imagens/praia-balneario-picarras-sc.jpg',
    recommendedSize: '800x600px',
    category: 'Viva Piçarras',
    subcategory: 'Praias'
  },
  {
    id: 'picarras-praia-secundaria',
    description: 'Praia Secundária - Piçarras',
    localPath: '/imagens/praia-central-picarras-sc.jpg',
    recommendedSize: '800x600px',
    category: 'Viva Piçarras',
    subcategory: 'Praias'
  },
  {
    id: 'picarras-praia1',
    description: 'Praia 1 - Piçarras',
    localPath: '/imagens/orla-picarras-sc-litoral.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Piçarras',
    subcategory: 'Atrações'
  },
  {
    id: 'picarras-atracao1',
    description: 'Atração 1 - Piçarras',
    localPath: '/imagens/ponto-turistico-picarras-sc-1.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Piçarras',
    subcategory: 'Atrações'
  },
  {
    id: 'picarras-atracao2',
    description: 'Atração 2 - Piçarras',
    localPath: '/imagens/ponto-turistico-picarras-sc-2.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Piçarras',
    subcategory: 'Atrações'
  },
  {
    id: 'picarras-gastronomia',
    description: 'Gastronomia - Piçarras',
    localPath: '/imagens/restaurante-picarras-sc-gastronomia.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Piçarras',
    subcategory: 'Atrações'
  },
  {
    id: 'picarras-praia2',
    description: 'Praia 2 - Piçarras',
    localPath: '/imagens/beira-mar-picarras-sc.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Piçarras',
    subcategory: 'Atrações'
  },
  {
    id: 'picarras-skyline',
    description: 'Skyline - Piçarras',
    localPath: '/imagens/vista-aerea-picarras-sc-litoral.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Piçarras',
    subcategory: 'Atrações'
  },

  // ==================== VIVA BARRA VELHA ====================
  {
    id: 'barra-velha-hero',
    description: 'Banner Hero - Viva Barra Velha',
    localPath: '/imagens/banner-barra-velha-sc-praia.jpg',
    recommendedSize: '1920x1080px',
    category: 'Viva Barra Velha',
    subcategory: 'Banner'
  },
  {
    id: 'barra-velha-praia-principal',
    description: 'Praia Principal - Barra Velha',
    localPath: '/imagens/praia-barra-velha-sc-litoral.jpg',
    recommendedSize: '800x600px',
    category: 'Viva Barra Velha',
    subcategory: 'Praias'
  },
  {
    id: 'barra-velha-praia-secundaria',
    description: 'Praia Secundária - Barra Velha',
    localPath: '/imagens/praia-central-barra-velha-sc.jpg',
    recommendedSize: '800x600px',
    category: 'Viva Barra Velha',
    subcategory: 'Praias'
  },
  {
    id: 'barra-velha-praia1',
    description: 'Praia 1 - Barra Velha',
    localPath: '/imagens/orla-barra-velha-sc.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Barra Velha',
    subcategory: 'Atrações'
  },
  {
    id: 'barra-velha-atracao1',
    description: 'Atração 1 - Barra Velha',
    localPath: '/imagens/ponto-turistico-barra-velha-sc-1.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Barra Velha',
    subcategory: 'Atrações'
  },
  {
    id: 'barra-velha-atracao2',
    description: 'Atração 2 - Barra Velha',
    localPath: '/imagens/ponto-turistico-barra-velha-sc-2.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Barra Velha',
    subcategory: 'Atrações'
  },
  {
    id: 'barra-velha-gastronomia',
    description: 'Gastronomia - Barra Velha',
    localPath: '/imagens/restaurante-barra-velha-sc-gastronomia.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Barra Velha',
    subcategory: 'Atrações'
  },
  {
    id: 'barra-velha-praia2',
    description: 'Praia 2 - Barra Velha',
    localPath: '/imagens/beira-mar-barra-velha-sc.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Barra Velha',
    subcategory: 'Atrações'
  },
  {
    id: 'barra-velha-skyline',
    description: 'Skyline - Barra Velha',
    localPath: '/imagens/vista-aerea-barra-velha-sc-litoral.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Barra Velha',
    subcategory: 'Atrações'
  },

  // ==================== QUEM SOMOS / SOBRE ====================
  {
    id: 'quem-somos-hero',
    description: 'Banner Hero - Quem Somos',
    localPath: '/imagens/banner-quem-somos-nox-imoveis.jpg',
    recommendedSize: '1920x1080px',
    category: 'Quem Somos',
    subcategory: 'Banner'
  },
  {
    id: 'equipe-principal',
    description: 'Equipe Principal - Quem Somos',
    localPath: '/imagens/equipe-nox-imoveis-penha-picarras.jpg',
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
