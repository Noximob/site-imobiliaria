import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

export interface SiteImageData {
  id: string;
  description: string;
  url: string;
  category: string;
  recommendedSize: string;
  updatedAt: Date;
}

// Função para obter uma imagem específica
export async function getSiteImage(imageId: string): Promise<string> {
  try {
    const docRef = doc(db, 'site-images', imageId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().url;
    }
    
    // Fallback para imagem local caso não exista no Firebase
    console.warn(`Imagem ${imageId} não encontrada no Firestore, usando local`);
    return `/imagens/placeholder.png`;
  } catch (error) {
    console.error(`Erro ao buscar imagem ${imageId}:`, error);
    return `/imagens/placeholder.png`;
  }
}

// Função para obter todas as imagens
export async function getAllSiteImages(): Promise<SiteImageData[]> {
  try {
    const imagesRef = collection(db, 'site-images');
    const snapshot = await getDocs(imagesRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as SiteImageData));
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
    return [];
  }
}

// Função para fazer upload de uma nova imagem
export async function uploadSiteImage(
  imageId: string,
  file: File,
  description: string,
  category: string,
  recommendedSize: string
): Promise<string> {
  try {
    // Redimensionar imagem antes do upload
    const resizedFile = await resizeImage(file);
    
    // Upload para Storage
    const timestamp = Date.now();
    const fileName = `site/${category.toLowerCase().replace(/\s+/g, '-')}/${imageId}-${timestamp}.${file.name.split('.').pop()}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, resizedFile);
    const downloadURL = await getDownloadURL(storageRef);
    
    // Salvar no Firestore
    const docRef = doc(db, 'site-images', imageId);
    await setDoc(docRef, {
      url: downloadURL,
      description,
      category,
      recommendedSize,
      updatedAt: new Date(),
    });
    
    return downloadURL;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw error;
  }
}

// Função para redimensionar imagem
async function resizeImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Tamanhos máximos baseados no tipo de imagem
      let maxWidth = 1920;
      let maxHeight = 1200;
      
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(resizedFile);
        } else {
          reject(new Error('Erro ao redimensionar imagem'));
        }
      }, 'image/jpeg', 0.85);
    };
    
    img.onerror = () => reject(new Error('Erro ao carregar imagem'));
    img.src = URL.createObjectURL(file);
  });
}

// Mapeamento das imagens do site
export const siteImagesConfig = [
  // Banners
  { id: 'banner-home', description: 'Banner da Página Principal', localPath: '/imagens/banners/banner-home.png', recommendedSize: '1920x600px', category: 'Banners' },
  
  // Logos
  { id: 'logo', description: 'Logo Principal', localPath: '/imagens/Logo.png', recommendedSize: '200x80px', category: 'Logo' },
  { id: 'logo1', description: 'Logo Alternativo', localPath: '/imagens/Logo1.png', recommendedSize: '200x80px', category: 'Logo' },
  
  // Como Comprar
  { id: 'como-comprar-topico', description: 'Tópico Como Comprar', localPath: '/imagens/Como Comprar/Topico Como Comprar.png', recommendedSize: '800x400px', category: 'Como Comprar' },
  { id: 'como-comprar-1', description: 'Como Comprar - Passo 1', localPath: '/imagens/Como Comprar/1.png', recommendedSize: '400x400px', category: 'Como Comprar' },
  { id: 'como-comprar-2', description: 'Como Comprar - Passo 2', localPath: '/imagens/Como Comprar/2.png', recommendedSize: '400x400px', category: 'Como Comprar' },
  { id: 'como-comprar-3', description: 'Como Comprar - Passo 3', localPath: '/imagens/Como Comprar/3.png', recommendedSize: '400x400px', category: 'Como Comprar' },
  { id: 'como-comprar-4', description: 'Como Comprar - Passo 4', localPath: '/imagens/Como Comprar/4.png', recommendedSize: '400x400px', category: 'Como Comprar' },
  { id: 'como-comprar-5', description: 'Como Comprar - Passo 5', localPath: '/imagens/Como Comprar/5.png', recommendedSize: '400x400px', category: 'Como Comprar' },
  
  // Páginas
  { id: 'anunciar-imovel', description: 'Anunciar Imóvel', localPath: '/imagens/Anunciar Imovel/Anunciar Imovel.png', recommendedSize: '1200x800px', category: 'Páginas' },
  { id: 'anuncie-nox-mulher', description: 'Anuncie Nox - Mulher', localPath: '/imagens/Anuncie Nox/Mulher.png', recommendedSize: '800x1000px', category: 'Páginas' },
  { id: 'contato', description: 'Página de Contato', localPath: '/imagens/Contato/Contato.png', recommendedSize: '1200x800px', category: 'Páginas' },
  { id: 'trabalhe-conosco', description: 'Trabalhe Conosco', localPath: '/imagens/Trabalhe Conosco/Trabalhe Conosco.png', recommendedSize: '1200x800px', category: 'Páginas' },
  { id: 'encontre-imovel-equipe', description: 'Encontre Imóvel - Equipe', localPath: '/imagens/Encontre Meu Imovel/Equipe.png', recommendedSize: '1200x600px', category: 'Páginas' },
  
  // Categorias
  { id: 'apartamentos', description: 'Categoria - Apartamentos', localPath: '/imagens/Encontre Imovel/Apartamentos.png', recommendedSize: '600x400px', category: 'Categorias' },
  { id: 'frente-mar', description: 'Categoria - Frente Mar', localPath: '/imagens/Encontre Imovel/Frente-Mar.png', recommendedSize: '600x400px', category: 'Categorias' },
  { id: 'lancamentos-investidor', description: 'Categoria - Lançamentos Investidor', localPath: '/imagens/Encontre Imovel/Lançamentos-Investidor.png', recommendedSize: '600x400px', category: 'Categorias' },
  { id: 'mobiliados', description: 'Categoria - Mobiliados', localPath: '/imagens/Encontre Imovel/Mobiliados.png', recommendedSize: '600x400px', category: 'Categorias' },
  
  // Barra Velha
  { id: 'bv-em-construcao', description: 'Barra Velha - Em Construção', localPath: '/imagens/Encontre Imovel/Barra Velha/Em Construção.png', recommendedSize: '600x400px', category: 'Barra Velha' },
  { id: 'bv-imoveis-prontos', description: 'Barra Velha - Imóveis Prontos', localPath: '/imagens/Encontre Imovel/Barra Velha/Imoveis Prontos.png', recommendedSize: '600x400px', category: 'Barra Velha' },
  { id: 'bv-lancamentos-frente-mar', description: 'Barra Velha - Lançamentos Frente Mar', localPath: '/imagens/Encontre Imovel/Barra Velha/Lançamentos Frente mar.png', recommendedSize: '600x400px', category: 'Barra Velha' },
  
  // Piçarras
  { id: 'picarras-cobertura', description: 'Piçarras - Apartamento Cobertura', localPath: '/imagens/Encontre Imovel/Piçarras/Apartamento-Cobertura.png', recommendedSize: '600x400px', category: 'Piçarras' },
  { id: 'picarras-lancamentos', description: 'Piçarras - Lançamentos', localPath: '/imagens/Encontre Imovel/Piçarras/Lançamentos.png', recommendedSize: '600x400px', category: 'Piçarras' },
  { id: 'picarras-mobiliado', description: 'Piçarras - Mobiliado', localPath: '/imagens/Encontre Imovel/Piçarras/Mobiliado.png', recommendedSize: '600x400px', category: 'Piçarras' },
  { id: 'picarras-vista-mar', description: 'Piçarras - Vista Mar', localPath: '/imagens/Encontre Imovel/Piçarras/Vista-Mar.png', recommendedSize: '600x400px', category: 'Piçarras' },
  
  // Imóveis na Planta
  { id: 'imoveis-planta-1', description: 'Imóveis na Planta - Imagem 1', localPath: '/imagens/Imoveis na Planta/1.png', recommendedSize: '800x600px', category: 'Imóveis na Planta' },
  { id: 'imoveis-planta-2', description: 'Imóveis na Planta - Imagem 2', localPath: '/imagens/Imoveis na Planta/2.png', recommendedSize: '800x600px', category: 'Imóveis na Planta' },
  { id: 'imoveis-planta-3', description: 'Imóveis na Planta - Imagem 3', localPath: '/imagens/Imoveis na Planta/3.png', recommendedSize: '800x600px', category: 'Imóveis na Planta' },
];

