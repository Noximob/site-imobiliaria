import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { Artigo } from '@/types';

export async function getAllArtigos(): Promise<Artigo[]> {
  try {
    const artigosRef = collection(db, 'artigos');
    const querySnapshot = await getDocs(artigosRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dataPublicacao: doc.data().dataPublicacao?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Artigo[];
  } catch (error) {
    console.error('Erro ao buscar artigos:', error);
    return [];
  }
}

export async function getArtigoBySlug(slug: string): Promise<Artigo | null> {
  try {
    const artigosRef = collection(db, 'artigos');
    const q = query(artigosRef, where('slug', '==', slug), where('publicado', '==', true));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      dataPublicacao: doc.data().dataPublicacao?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Artigo;
  } catch (error) {
    console.error('Erro ao buscar artigo:', error);
    return null;
  }
}

export async function createArtigo(artigo: Omit<Artigo, 'id' | 'createdAt' | 'updatedAt' | 'visualizacoes'>): Promise<string> {
  try {
    const artigosRef = collection(db, 'artigos');
    const docRef = await addDoc(artigosRef, {
      ...artigo,
      visualizacoes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar artigo:', error);
    throw error;
  }
}

export async function deleteArtigo(id: string): Promise<void> {
  try {
    const artigoRef = doc(db, 'artigos', id);
    await deleteDoc(artigoRef);
  } catch (error) {
    console.error('Erro ao deletar artigo:', error);
    throw error;
  }
}

export async function updateArtigo(
  id: string, 
  artigo: Partial<Omit<Artigo, 'id' | 'createdAt' | 'visualizacoes'>>
): Promise<void> {
  try {
    const artigoRef = doc(db, 'artigos', id);
    await updateDoc(artigoRef, {
      ...artigo,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Erro ao atualizar artigo:', error);
    throw error;
  }
}

export async function updateArtigoWithImage(
  id: string,
  artigo: Partial<Omit<Artigo, 'id' | 'createdAt' | 'visualizacoes' | 'imagem'>>,
  imageFile?: File
): Promise<void> {
  try {
    let updateData: any = {
      ...artigo,
      updatedAt: new Date(),
    };

    // Se uma nova imagem foi fornecida, converter para base64
    if (imageFile) {
      const base64Image = await convertToBase64(imageFile);
      updateData.imagem = base64Image;
    }

    const artigoRef = doc(db, 'artigos', id);
    await updateDoc(artigoRef, updateData);
  } catch (error) {
    console.error('Erro ao atualizar artigo com imagem:', error);
    throw error;
  }
}

export async function createArtigoWithImage(
  artigo: Omit<Artigo, 'id' | 'createdAt' | 'updatedAt' | 'visualizacoes' | 'imagem'>,
  imageFile: File
): Promise<string> {
  try {
    // Converter imagem para base64 e salvar no Firestore
    const base64Image = await convertToBase64(imageFile);
    
    // Criar artigo com imagem em base64
    const artigoData = {
      ...artigo,
      imagem: base64Image,
      visualizacoes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const artigosRef = collection(db, 'artigos');
    const docRef = await addDoc(artigosRef, artigoData);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar artigo com imagem:', error);
    throw error;
  }
}

async function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Redimensionar imagem se for muito grande
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calcular novo tamanho (máximo 800px de largura)
      const maxWidth = 800;
      const maxHeight = 600;
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
      
      // Desenhar imagem redimensionada
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Converter para base64 com qualidade reduzida
      const base64 = canvas.toDataURL('image/jpeg', 0.7);
      resolve(base64);
    };
    
    img.onerror = () => reject(new Error('Erro ao carregar imagem'));
    img.src = URL.createObjectURL(file);
  });
}

export function generateSlug(titulo: string): string {
  // Palavras-chave importantes para SEO
  const keywords = [
    'imovel', 'casa', 'apartamento', 'terreno', 'venda', 'aluguel',
    'balneario', 'camboriu', 'barra', 'velha', 'picarras', 'penha',
    'investimento', 'financiamento', 'decoracao', 'mercado', 'imobiliaria',
    'avenida', 'mobilidade', 'desenvolvimento', 'regiao', 'cidade',
    'construcao', 'lancamento', 'frente', 'mar', 'vista', 'cobertura'
  ];
  
  // Converter para lowercase e remover acentos
  let slug = titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  // Manter palavras-chave importantes
  const words = slug.split(/\s+/);
  const importantWords = words.filter(word => 
    keywords.some(keyword => word.includes(keyword) || keyword.includes(word))
  );
  
  // Se encontrou palavras-chave, usar elas + título
  if (importantWords.length > 0) {
    const cleanTitle = titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    return cleanTitle;
  }
  
  // Fallback para slug normal
  return slug
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
