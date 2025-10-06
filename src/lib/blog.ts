import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
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
    // Buscar o artigo para obter a URL da imagem
    const artigoRef = doc(db, 'artigos', id);
    const artigoDoc = await getDoc(artigoRef);
    
    if (artigoDoc.exists()) {
      const artigoData = artigoDoc.data();
      
      // Se tiver imagem, deletar do Storage
      if (artigoData.imagem && artigoData.imagem.startsWith('https://firebasestorage.googleapis.com')) {
        try {
          const imageRef = ref(storage, artigoData.imagem);
          await deleteObject(imageRef);
        } catch (storageError) {
          console.warn('Erro ao deletar imagem do Storage:', storageError);
          // Não falhar se não conseguir deletar a imagem
        }
      }
    }
    
    // Deletar o documento do Firestore
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

    // Se uma nova imagem foi fornecida, fazer upload para Storage
    if (imageFile) {
      const imageUrl = await uploadImageToStorage(imageFile);
      updateData.imagem = imageUrl;
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
    // Fazer upload da imagem para Storage
    const imageUrl = await uploadImageToStorage(imageFile);
    
    // Criar artigo com URL da imagem
    const artigoData = {
      ...artigo,
      imagem: imageUrl,
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

async function uploadImageToStorage(file: File): Promise<string> {
  try {
    // Redimensionar imagem se for muito grande
    const resizedFile = await resizeImage(file);
    
    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const fileName = `blog/${timestamp}-${file.name}`;
    
    // Referência no Storage
    const storageRef = ref(storage, fileName);
    
    // Upload da imagem
    await uploadBytes(storageRef, resizedFile);
    
    // Obter URL de download
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw error;
  }
}

async function resizeImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calcular novo tamanho (máximo 1200px de largura)
      const maxWidth = 1200;
      const maxHeight = 900;
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
      
      // Converter para blob
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
      }, 'image/jpeg', 0.8);
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
