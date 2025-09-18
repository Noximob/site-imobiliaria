import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { Imovel, FiltrosImovel } from '@/types';

export async function getAllImoveis(): Promise<Imovel[]> {
  try {
    const imoveisRef = collection(db, 'imoveis');
    const q = query(imoveisRef, where('publicado', '==', true), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Imovel[];
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    return [];
  }
}

export async function getImovelBySlug(slug: string): Promise<Imovel | null> {
  try {
    const imoveisRef = collection(db, 'imoveis');
    const q = query(imoveisRef, where('slug', '==', slug), where('publicado', '==', true));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Imovel;
  } catch (error) {
    console.error('Erro ao buscar imóvel:', error);
    return null;
  }
}

export async function searchImoveis(filtros: FiltrosImovel): Promise<Imovel[]> {
  try {
    const imoveisRef = collection(db, 'imoveis');
    let q = query(imoveisRef, where('publicado', '==', true));
    
    // Aplicar filtros
    if (filtros.cidade) {
      q = query(q, where('endereco.cidade', '==', filtros.cidade));
    }
    
    if (filtros.bairro) {
      q = query(q, where('endereco.bairro', '==', filtros.bairro));
    }
    
    if (filtros.tipo) {
      q = query(q, where('tipo', '==', filtros.tipo));
    }
    
    if (filtros.status) {
      q = query(q, where('status', '==', filtros.status));
    }
    
    if (filtros.quartos) {
      q = query(q, where('caracteristicas.quartos', '>=', filtros.quartos));
    }
    
    if (filtros.banheiros) {
      q = query(q, where('caracteristicas.banheiros', '>=', filtros.banheiros));
    }
    
    if (filtros.vagas) {
      q = query(q, where('caracteristicas.vagas', '>=', filtros.vagas));
    }
    
    if (filtros.precoMin) {
      q = query(q, where('preco', '>=', filtros.precoMin));
    }
    
    if (filtros.precoMax) {
      q = query(q, where('preco', '<=', filtros.precoMax));
    }
    
    if (filtros.frenteMar) {
      q = query(q, where('caracteristicas.frenteMar', '==', true));
    }
    
    if (filtros.piscina) {
      q = query(q, where('caracteristicas.piscina', '==', true));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Imovel[];
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    return [];
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
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
