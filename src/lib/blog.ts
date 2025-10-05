import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { uploadImage, generateImagePath } from './storage';
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

export async function updateArtigo(id: string, artigo: Partial<Artigo>): Promise<void> {
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

export async function deleteArtigo(id: string): Promise<void> {
  try {
    const artigoRef = doc(db, 'artigos', id);
    await deleteDoc(artigoRef);
  } catch (error) {
    console.error('Erro ao deletar artigo:', error);
    throw error;
  }
}

export async function createArtigoWithImage(
  artigo: Omit<Artigo, 'id' | 'createdAt' | 'updatedAt' | 'visualizacoes' | 'imagem'>,
  imageFile: File
): Promise<string> {
  try {
    // Upload da imagem
    const imagePath = generateImagePath(imageFile.name, 'blog');
    const imageUrl = await uploadImage(imageFile, imagePath);
    
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

export function generateSlug(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
