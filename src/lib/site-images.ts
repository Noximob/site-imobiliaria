import { db, storage } from './firebase'
import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

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
    description: 'Frente Mar - Penha',
    localPath: '/imagens/Encontre Imovel/Frente-Mar.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Penha'
  },
  {
    id: 'mobiliados',
    description: 'Mobiliados - Penha',
    localPath: '/imagens/Encontre Imovel/Mobiliados.png',
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

  // Encontre seu imóvel - Piçarras
  {
    id: 'picarras-cobertura',
    description: 'Apartamento Cobertura - Piçarras',
    localPath: '/imagens/Encontre Imovel/Piçarras/Apartamento-Cobertura.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Piçarras'
  },
  {
    id: 'picarras-mobiliado',
    description: 'Mobiliado - Piçarras',
    localPath: '/imagens/Encontre Imovel/Piçarras/Mobiliado.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Piçarras'
  },
  {
    id: 'picarras-vista-mar',
    description: 'Vista Mar - Piçarras',
    localPath: '/imagens/Encontre Imovel/Piçarras/Vista-Mar.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Piçarras'
  },
  {
    id: 'picarras-lancamentos',
    description: 'Lançamentos - Piçarras',
    localPath: '/imagens/Encontre Imovel/Piçarras/Lançamentos.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Piçarras'
  },

  // Encontre seu imóvel - Barra Velha
  {
    id: 'bv-lancamentos-frente-mar',
    description: 'Lançamentos Frente Mar - Barra Velha',
    localPath: '/imagens/Encontre Imovel/Barra Velha/Lançamentos Frente mar.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Barra Velha'
  },
  {
    id: 'bv-em-construcao',
    description: 'Em Construção - Barra Velha',
    localPath: '/imagens/Encontre Imovel/Barra Velha/Em Construção.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Barra Velha'
  },
  {
    id: 'bv-imoveis-prontos',
    description: 'Imóveis Prontos - Barra Velha',
    localPath: '/imagens/Encontre Imovel/Barra Velha/Imoveis Prontos.png',
    recommendedSize: '800x600px',
    category: 'Página Principal',
    subcategory: 'Encontre Imóvel - Barra Velha'
  },

  // Imóveis na Planta
  {
    id: 'imoveis-planta-1',
    description: 'Imóveis na Planta - Penha',
    localPath: '/imagens/Imoveis na Planta/1.png',
    recommendedSize: '600x800px',
    category: 'Página Principal',
    subcategory: 'Imóveis na Planta'
  },
  {
    id: 'imoveis-planta-2',
    description: 'Imóveis na Planta - Piçarras',
    localPath: '/imagens/Imoveis na Planta/2.png',
    recommendedSize: '600x800px',
    category: 'Página Principal',
    subcategory: 'Imóveis na Planta'
  },
  {
    id: 'imoveis-planta-3',
    description: 'Imóveis na Planta - Barra Velha',
    localPath: '/imagens/Imoveis na Planta/3.png',
    recommendedSize: '600x800px',
    category: 'Página Principal',
    subcategory: 'Imóveis na Planta'
  },

  // Anuncie com a Nox
  {
    id: 'anuncie-nox-mulher',
    description: 'Foto da corretora - Anuncie com a Nox',
    localPath: '/imagens/Anuncie Nox/Mulher.png',
    recommendedSize: '800x1000px',
    category: 'Página Principal',
    subcategory: 'Anuncie com a Nox'
  },

  // ==================== ANUNCIAR IMÓVEL ====================
  {
    id: 'anunciar-banner',
    description: 'Banner de fundo da página Anunciar',
    localPath: '/imagens/Anunciar Imovel/Anunciar Imovel.png',
    recommendedSize: '1920x1080px',
    category: 'Anunciar Imóvel'
  },

  // ==================== ENCONTRE MEU IMÓVEL ====================
  {
    id: 'encontre-imovel-equipe',
    description: 'Foto da equipe - Ficou com alguma dúvida?',
    localPath: '/imagens/Encontre Meu Imovel/Equipe.png',
    recommendedSize: '800x600px',
    category: 'Encontre Meu Imóvel'
  },

  // ==================== COMO COMPRAR ====================
  {
    id: 'como-comprar-banner',
    description: 'Banner principal - Como Comprar',
    localPath: '/imagens/Como Comprar/Topico Como Comprar.png',
    recommendedSize: '1920x600px',
    category: 'Como Comprar',
    subcategory: 'Banner'
  },
  {
    id: 'como-comprar-penha',
    description: 'Imóveis em Penha',
    localPath: '/imagens/Como Comprar/1.png',
    recommendedSize: '800x600px',
    category: 'Como Comprar',
    subcategory: 'Cidades'
  },
  {
    id: 'como-comprar-picarras',
    description: 'Imóveis em Piçarras',
    localPath: '/imagens/Como Comprar/2.png',
    recommendedSize: '800x600px',
    category: 'Como Comprar',
    subcategory: 'Cidades'
  },
  {
    id: 'como-comprar-bv',
    description: 'Imóveis em Barra Velha',
    localPath: '/imagens/Como Comprar/3.png',
    recommendedSize: '800x600px',
    category: 'Como Comprar',
    subcategory: 'Cidades'
  },
  {
    id: 'como-comprar-investimento',
    description: 'Foto da Praia - Investimento',
    localPath: '/imagens/Como Comprar/4.png',
    recommendedSize: '800x600px',
    category: 'Como Comprar',
    subcategory: 'Localização'
  },
  {
    id: 'como-comprar-anuncie',
    description: 'Foto da Equipe - Anuncie',
    localPath: '/imagens/Como Comprar/5.png',
    recommendedSize: '800x600px',
    category: 'Como Comprar',
    subcategory: 'Localização'
  },

  // ==================== QUEM SOMOS ====================
  {
    id: 'quem-somos-banner',
    description: 'Banner principal - Quem Somos',
    localPath: '/imagens/banners/quem-somos-hero.jpg',
    recommendedSize: '1920x800px',
    category: 'Quem Somos',
    subcategory: 'Banner'
  },
  {
    id: 'quem-somos-equipe',
    description: 'Equipe Imobiliária',
    localPath: '/imagens/equipe/equipe-principal.jpg',
    recommendedSize: '800x600px',
    category: 'Quem Somos',
    subcategory: 'Equipe'
  },

  // ==================== CONTATO ====================
  {
    id: 'contato-banner',
    description: 'Banner de fundo - Contato',
    localPath: '/imagens/Contato/Contato.png',
    recommendedSize: '1920x1080px',
    category: 'Contato'
  },

  // ==================== TRABALHE CONOSCO ====================
  {
    id: 'trabalhe-conosco-equipe',
    description: 'Foto da equipe no banner (metade direita)',
    localPath: '/imagens/Trabalhe Conosco/Trabalhe Conosco.png',
    recommendedSize: '960x1080px',
    category: 'Trabalhe Conosco'
  },

  // ==================== VIVA PENHA ====================
  {
    id: 'viva-penha-banner',
    description: 'Banner principal - Viva Penha',
    localPath: '/imagens/banners/penha-hero.jpg',
    recommendedSize: '1920x800px',
    category: 'Viva Penha',
    subcategory: 'Banner'
  },
  {
    id: 'viva-penha-praia-principal',
    description: 'Praia de Penha (foto maior)',
    localPath: '/imagens/penha/praia-principal.jpg',
    recommendedSize: '800x600px',
    category: 'Viva Penha',
    subcategory: 'Praias'
  },
  {
    id: 'viva-penha-praia-secundaria',
    description: 'Vista praia de Penha (foto menor)',
    localPath: '/imagens/penha/praia-secundaria.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Penha',
    subcategory: 'Praias'
  },
  {
    id: 'viva-penha-oque-fazer-1',
    description: 'O que fazer em Penha - Foto 1',
    localPath: '/imagens/penha/praia1.jpg',
    recommendedSize: '400x600px',
    category: 'Viva Penha',
    subcategory: 'O que fazer'
  },
  {
    id: 'viva-penha-oque-fazer-2',
    description: 'O que fazer em Penha - Cristo Luz',
    localPath: '/imagens/penha/cristo-luz.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Penha',
    subcategory: 'O que fazer'
  },
  {
    id: 'viva-penha-oque-fazer-3',
    description: 'O que fazer em Penha - Beto Carrero',
    localPath: '/imagens/penha/beto-carrero.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Penha',
    subcategory: 'O que fazer'
  },
  {
    id: 'viva-penha-oque-fazer-4',
    description: 'O que fazer em Penha - Jantar Romântico',
    localPath: '/imagens/penha/jantar-romantico.jpg',
    recommendedSize: '400x600px',
    category: 'Viva Penha',
    subcategory: 'O que fazer'
  },
  {
    id: 'viva-penha-oque-fazer-5',
    description: 'O que fazer em Penha - Skyline',
    localPath: '/imagens/penha/skyline.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Penha',
    subcategory: 'O que fazer'
  },
  {
    id: 'viva-penha-localizacao-praia',
    description: 'Localização - Foto da Praia',
    localPath: '/imagens/Como Comprar/4.png',
    recommendedSize: '800x600px',
    category: 'Viva Penha',
    subcategory: 'Localização'
  },
  {
    id: 'viva-penha-localizacao-equipe',
    description: 'Localização - Foto da Equipe',
    localPath: '/imagens/Como Comprar/5.png',
    recommendedSize: '800x600px',
    category: 'Viva Penha',
    subcategory: 'Localização'
  },

  // ==================== VIVA BARRA VELHA ====================
  {
    id: 'viva-bv-banner',
    description: 'Banner principal - Viva Barra Velha',
    localPath: '/imagens/banners/barra-velha-hero.jpg',
    recommendedSize: '1920x800px',
    category: 'Viva Barra Velha',
    subcategory: 'Banner'
  },
  {
    id: 'viva-bv-praia-principal',
    description: 'Praia de Barra Velha (foto maior)',
    localPath: '/imagens/barra-velha/praia-principal.jpg',
    recommendedSize: '800x600px',
    category: 'Viva Barra Velha',
    subcategory: 'Praias'
  },
  {
    id: 'viva-bv-praia-secundaria',
    description: 'Vista praia de Barra Velha (foto menor)',
    localPath: '/imagens/barra-velha/praia-secundaria.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Barra Velha',
    subcategory: 'Praias'
  },
  {
    id: 'viva-bv-oque-fazer-1',
    description: 'O que fazer em Barra Velha - Foto 1',
    localPath: '/imagens/barra-velha/oque-fazer-1.jpg',
    recommendedSize: '400x600px',
    category: 'Viva Barra Velha',
    subcategory: 'O que fazer'
  },
  {
    id: 'viva-bv-oque-fazer-2',
    description: 'O que fazer em Barra Velha - Foto 2',
    localPath: '/imagens/barra-velha/oque-fazer-2.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Barra Velha',
    subcategory: 'O que fazer'
  },
  {
    id: 'viva-bv-oque-fazer-3',
    description: 'O que fazer em Barra Velha - Foto 3',
    localPath: '/imagens/barra-velha/oque-fazer-3.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Barra Velha',
    subcategory: 'O que fazer'
  },
  {
    id: 'viva-bv-oque-fazer-4',
    description: 'O que fazer em Barra Velha - Foto 4',
    localPath: '/imagens/barra-velha/oque-fazer-4.jpg',
    recommendedSize: '400x600px',
    category: 'Viva Barra Velha',
    subcategory: 'O que fazer'
  },
  {
    id: 'viva-bv-oque-fazer-5',
    description: 'O que fazer em Barra Velha - Foto 5',
    localPath: '/imagens/barra-velha/oque-fazer-5.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Barra Velha',
    subcategory: 'O que fazer'
  },
  {
    id: 'viva-bv-localizacao-praia',
    description: 'Localização - Foto da Praia',
    localPath: '/imagens/Como Comprar/4.png',
    recommendedSize: '800x600px',
    category: 'Viva Barra Velha',
    subcategory: 'Localização'
  },
  {
    id: 'viva-bv-localizacao-equipe',
    description: 'Localização - Foto da Equipe',
    localPath: '/imagens/Como Comprar/5.png',
    recommendedSize: '800x600px',
    category: 'Viva Barra Velha',
    subcategory: 'Localização'
  },

  // ==================== VIVA BALNEÁRIO PIÇARRAS ====================
  {
    id: 'viva-picarras-banner',
    description: 'Banner principal - Viva Piçarras',
    localPath: '/imagens/banners/picarras-hero.jpg',
    recommendedSize: '1920x800px',
    category: 'Viva Balneário Piçarras',
    subcategory: 'Banner'
  },
  {
    id: 'viva-picarras-praia-principal',
    description: 'Praia de Piçarras (foto maior)',
    localPath: '/imagens/picarras/praia-principal.jpg',
    recommendedSize: '800x600px',
    category: 'Viva Balneário Piçarras',
    subcategory: 'Praias'
  },
  {
    id: 'viva-picarras-praia-secundaria',
    description: 'Vista praia de Piçarras (foto menor)',
    localPath: '/imagens/picarras/praia-secundaria.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Balneário Piçarras',
    subcategory: 'Praias'
  },
  {
    id: 'viva-picarras-oque-fazer-1',
    description: 'O que fazer em Piçarras - Foto 1',
    localPath: '/imagens/picarras/oque-fazer-1.jpg',
    recommendedSize: '400x600px',
    category: 'Viva Balneário Piçarras',
    subcategory: 'O que fazer'
  },
  {
    id: 'viva-picarras-oque-fazer-2',
    description: 'O que fazer em Piçarras - Foto 2',
    localPath: '/imagens/picarras/oque-fazer-2.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Balneário Piçarras',
    subcategory: 'O que fazer'
  },
  {
    id: 'viva-picarras-oque-fazer-3',
    description: 'O que fazer em Piçarras - Foto 3',
    localPath: '/imagens/picarras/oque-fazer-3.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Balneário Piçarras',
    subcategory: 'O que fazer'
  },
  {
    id: 'viva-picarras-oque-fazer-4',
    description: 'O que fazer em Piçarras - Foto 4',
    localPath: '/imagens/picarras/oque-fazer-4.jpg',
    recommendedSize: '400x600px',
    category: 'Viva Balneário Piçarras',
    subcategory: 'O que fazer'
  },
  {
    id: 'viva-picarras-oque-fazer-5',
    description: 'O que fazer em Piçarras - Foto 5',
    localPath: '/imagens/picarras/oque-fazer-5.jpg',
    recommendedSize: '400x300px',
    category: 'Viva Balneário Piçarras',
    subcategory: 'O que fazer'
  },
  {
    id: 'viva-picarras-localizacao-praia',
    description: 'Localização - Foto da Praia',
    localPath: '/imagens/Como Comprar/4.png',
    recommendedSize: '800x600px',
    category: 'Viva Balneário Piçarras',
    subcategory: 'Localização'
  },
  {
    id: 'viva-picarras-localizacao-equipe',
    description: 'Localização - Foto da Equipe',
    localPath: '/imagens/Como Comprar/5.png',
    recommendedSize: '800x600px',
    category: 'Viva Balneário Piçarras',
    subcategory: 'Localização'
  },
]

// Buscar todas as imagens do site (client-side)
export async function getAllSiteImages(): Promise<Record<string, string>> {
  try {
    const imagesDoc = await getDoc(doc(db, 'site-config', 'images'))
    
    if (imagesDoc.exists()) {
      return imagesDoc.data() as Record<string, string>
    }
    
    return {}
  } catch (error) {
    console.error('Erro ao buscar imagens do site:', error)
    return {}
  }
}

// Buscar URL de uma imagem específica (server-side - para SSR)
export async function getSiteImageUrl(imageId: string): Promise<string | null> {
  try {
    const imagesDoc = await getDoc(doc(db, 'site-config', 'images'))
    
    if (imagesDoc.exists()) {
      const data = imagesDoc.data() as Record<string, string>
      return data[imageId] || null
    }
    
    return null
  } catch (error) {
    console.error(`Erro ao buscar imagem ${imageId}:`, error)
    return null
  }
}

// Buscar todas as URLs de imagens (server-side - para SSR)
export async function getAllSiteImagesSSR(): Promise<Record<string, string>> {
  try {
    const imagesDoc = await getDoc(doc(db, 'site-config', 'images'))
    
    if (imagesDoc.exists()) {
      return imagesDoc.data() as Record<string, string>
    }
    
    return {}
  } catch (error) {
    console.error('Erro ao buscar imagens do site (SSR):', error)
    return {}
  }
}

// Upload de imagem do site
export async function uploadSiteImage(imageId: string, file: File): Promise<string> {
  try {
    // Redimensionar imagem antes do upload
    const resizedBlob = await resizeImage(file, 1200, 900)
    
    // Upload para o Firebase Storage
    const storageRef = ref(storage, `site-images/${imageId}`)
    await uploadBytes(storageRef, resizedBlob)
    const downloadURL = await getDownloadURL(storageRef)
    
    // Salvar URL no Firestore
    const imagesDocRef = doc(db, 'site-config', 'images')
    const currentData = (await getDoc(imagesDocRef)).data() || {}
    
    await setDoc(imagesDocRef, {
      ...currentData,
      [imageId]: downloadURL
    })
    
    return downloadURL
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error)
    throw error
  }
}

// Função auxiliar para redimensionar imagem
async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    img.onload = () => {
      let width = img.width
      let height = img.height
      
      // Calcular novas dimensões mantendo aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = height * (maxWidth / width)
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = width * (maxHeight / height)
          height = maxHeight
        }
      }
      
      canvas.width = width
      canvas.height = height
      
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Erro ao converter imagem'))
        }
      }, 'image/jpeg', 0.85)
    }
    
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}