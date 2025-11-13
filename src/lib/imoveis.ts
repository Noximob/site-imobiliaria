import { Imovel, FiltrosImovel } from '@/types';

const CACHE_DURATION = 0; // Sem cache para desenvolvimento
let cachedImoveis: Imovel[] | null = null;
let cacheTimestamp: number | null = null;

export async function getAllImoveis(): Promise<Imovel[]> {
  try {
    // Verificar cache
    if (cachedImoveis && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
      return cachedImoveis;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/imoveis-github`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Erro ao buscar imóveis do GitHub');
      return [];
    }

    const imoveis = await response.json();
    
    // Converter datas de string para Date
    const imoveisFormatados = imoveis.map((imovel: any) => ({
      ...imovel,
      createdAt: imovel.createdAt ? new Date(imovel.createdAt) : new Date(),
      updatedAt: imovel.updatedAt ? new Date(imovel.updatedAt) : new Date(),
    })) as Imovel[];

    // Filtrar apenas publicados
    const imoveisPublicados = imoveisFormatados.filter(imovel => imovel.publicado);

    // Atualizar cache
    cachedImoveis = imoveisPublicados;
    cacheTimestamp = Date.now();

    return imoveisPublicados;
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    return [];
  }
}

export async function getImovelBySlug(slug: string): Promise<Imovel | null> {
  try {
    const imoveis = await getAllImoveis();
    const imovel = imoveis.find(i => i.slug === slug);
    return imovel || null;
  } catch (error) {
    console.error('Erro ao buscar imóvel:', error);
    return null;
  }
}

export async function searchImoveis(filtros: FiltrosImovel): Promise<Imovel[]> {
  try {
    const imoveis = await getAllImoveis();
    
    return imoveis.filter(imovel => {
      // Filtro por cidade
      if (filtros.cidade && imovel.endereco.cidade !== filtros.cidade) {
        return false;
      }
      
      // Filtro por bairro
      if (filtros.bairro && imovel.endereco.bairro !== filtros.bairro) {
        return false;
      }
      
      // Filtro por tipo
      if (filtros.tipo && imovel.tipo !== filtros.tipo) {
        return false;
      }
      
      // Filtro por status
      if (filtros.status && imovel.status !== filtros.status) {
        return false;
      }
      
      // Filtro por quartos
      if (filtros.quartos && imovel.caracteristicas.quartos < filtros.quartos) {
        return false;
      }
      
      // Filtro por banheiros
      if (filtros.banheiros && imovel.caracteristicas.banheiros < filtros.banheiros) {
        return false;
      }
      
      // Filtro por vagas
      if (filtros.vagas && imovel.caracteristicas.vagas < filtros.vagas) {
        return false;
      }
      
      // Filtro por preço mínimo
      if (filtros.precoMin && imovel.preco < filtros.precoMin) {
        return false;
      }
      
      // Filtro por preço máximo
      if (filtros.precoMax && imovel.preco > filtros.precoMax) {
        return false;
      }
      
      // Filtro por frente mar
      if (filtros.frenteMar && !imovel.caracteristicas.frenteMar) {
        return false;
      }
      
      // Filtro por piscina
      if (filtros.piscina && !imovel.caracteristicas.piscina) {
        return false;
      }
      
      // Filtro por área mínima
      if (filtros.areaMin && imovel.caracteristicas.area < filtros.areaMin) {
        return false;
      }
      
      // Filtro por área máxima
      if (filtros.areaMax && imovel.caracteristicas.area > filtros.areaMax) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Ordenar por data de criação (mais recente primeiro)
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
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
