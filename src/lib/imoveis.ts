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

    // Durante o build, usar URL absoluta ou retornar vazio se não disponível
    const apiUrl = typeof window !== 'undefined' 
      ? '/api/imoveis-github'
      : process.env.NEXT_PUBLIC_SITE_URL 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/imoveis-github`
        : null;

    if (!apiUrl) {
      // Durante o build sem URL configurada, retornar vazio
      return [];
    }

    const response = await fetch(apiUrl, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Erro ao buscar imóveis do GitHub');
      return [];
    }

    const imoveis = await response.json();
    
    // Converter datas de string para Date e garantir que publicado seja boolean
    const imoveisFormatados = imoveis.map((imovel: any) => {
      // Garantir que publicado seja sempre boolean
      let publicado = false
      if (imovel.publicado !== undefined && imovel.publicado !== null) {
        publicado = imovel.publicado === true || 
                    imovel.publicado === 'true' || 
                    imovel.publicado === 1 ||
                    (imovel.publicado !== false && imovel.publicado !== 'false' && imovel.publicado !== 0 && imovel.publicado !== '')
      }
      
      return {
        ...imovel,
        createdAt: imovel.createdAt ? new Date(imovel.createdAt) : new Date(),
        updatedAt: imovel.updatedAt ? new Date(imovel.updatedAt) : new Date(),
        publicado: Boolean(publicado), // Sempre converter para boolean
      }
    }) as Imovel[];

    // Filtrar apenas publicados (agora que temos certeza que é boolean)
    const imoveisPublicados = imoveisFormatados.filter(imovel => imovel.publicado === true);
    
    console.log(`📊 Imóveis carregados: ${imoveis.length} total, ${imoveisPublicados.length} publicados`)

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
    
    // Debug: contar imóveis com dataEntrega por status
    if (filtros.dataEntrega && Array.isArray(filtros.dataEntrega) && filtros.dataEntrega.length > 0) {
      const temEntregues = filtros.dataEntrega.some((d: string | number) => d === 'entregues')
      const anosSelecionados = filtros.dataEntrega.filter((d: string | number): d is number => typeof d === 'number')
      
      const imoveisComDataEntrega = imoveis.filter(i => i.dataEntrega)
      const imoveisSemDataEntrega = imoveis.filter(i => !i.dataEntrega)
      const prontosComData = imoveis.filter(i => i.status === 'prontos' && i.dataEntrega)
      const prontosSemData = imoveis.filter(i => i.status === 'prontos' && !i.dataEntrega)
      const lancamentoComData = imoveis.filter(i => (i.status === 'lancamento' || i.status === 'em-construcao') && i.dataEntrega)
      const lancamentoSemData = imoveis.filter(i => (i.status === 'lancamento' || i.status === 'em-construcao') && !i.dataEntrega)
      
      console.log(`🔍 Filtro dataEntrega ativo.`)
      console.log(`📋 Filtros aplicados: entregues=${temEntregues}, anos=${anosSelecionados.join(',')}`)
      console.log(`📊 Total imóveis: ${imoveis.length}`)
      console.log(`📊 Prontos: ${prontosComData.length + prontosSemData.length} total (${prontosComData.length} com data, ${prontosSemData.length} sem data)`)
      console.log(`📊 Lançamento/Construção: ${lancamentoComData.length + lancamentoSemData.length} total (${lancamentoComData.length} com data, ${lancamentoSemData.length} sem data)`)
      
      // Contar quantos imóveis prontos existem
      const totalProntos = imoveis.filter(i => i.status === 'prontos').length
      console.log(`✅ Total de imóveis com status 'prontos': ${totalProntos}`)
      
      if (imoveisComDataEntrega.length > 0) {
        console.log(`📅 Exemplos de dataEntrega:`, imoveisComDataEntrega.slice(0, 5).map(i => ({ 
          id: i.id, 
          titulo: i.titulo.substring(0, 30), 
          status: i.status,
          dataEntrega: i.dataEntrega 
        })))
      }
    }
    
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
      if (filtros.status) {
        // Se o filtro for "lancamento", aceitar tanto "lancamento" quanto "em-construcao"
        if (filtros.status === 'lancamento') {
          if (imovel.status !== 'lancamento' && imovel.status !== 'em-construcao') {
            return false;
          }
        } else {
          if (imovel.status !== filtros.status) {
            return false;
          }
        }
      }
      
      // Filtro por data de entrega
      if (filtros.dataEntrega && Array.isArray(filtros.dataEntrega) && filtros.dataEntrega.length > 0) {
        const temEntregues = filtros.dataEntrega.some((d: string | number) => d === 'entregues')
        const anosSelecionados = filtros.dataEntrega.filter((d: string | number): d is number => typeof d === 'number')
        
        let matchDataEntrega = false
        
        // Se "entregues" está selecionado: imóveis com status 'prontos'
        // (podem ter delivery_date no passado ou não ter, ambos são considerados entregues)
        if (temEntregues) {
          if (imovel.status === 'prontos') {
            matchDataEntrega = true
          }
        }
        
        // Se anos estão selecionados: verificar se dataEntrega corresponde a algum ano
        // Funciona para TODOS os imóveis (prontos, lançamento, em construção) que têm dataEntrega
        if (anosSelecionados.length > 0 && imovel.dataEntrega) {
          try {
            const dataEntrega = new Date(imovel.dataEntrega)
            // Verificar se a data é válida
            if (isNaN(dataEntrega.getTime())) {
              console.warn(`⚠️ Data de entrega inválida para imóvel ${imovel.id}: ${imovel.dataEntrega}`)
            } else {
              const anoEntrega = dataEntrega.getFullYear()
              if (anosSelecionados.includes(anoEntrega)) {
                matchDataEntrega = true
              }
            }
          } catch (e) {
            // Se dataEntrega não for uma data válida, ignorar
            console.warn(`⚠️ Erro ao processar dataEntrega para imóvel ${imovel.id}:`, e)
          }
        }
        
        // Se nenhuma condição foi atendida, excluir imóvel
        if (!matchDataEntrega) {
          return false
        }
      }
      
      // Filtro por quartos (pode ser array para múltipla seleção)
      if (filtros.quartos !== undefined) {
        if (Array.isArray(filtros.quartos)) {
          // Múltiplos valores selecionados - imóvel deve ter pelo menos um dos valores
          const matches = filtros.quartos.some(qtd => {
            if (qtd === 4) {
              // "4+" significa 4 ou mais
              return imovel.caracteristicas.quartos >= 4;
            } else {
              // Valores exatos (1, 2, 3)
              return imovel.caracteristicas.quartos === qtd;
            }
          });
          if (!matches) {
            return false;
          }
        } else {
          // Valor único (compatibilidade)
          if (imovel.caracteristicas.quartos < filtros.quartos) {
            return false;
          }
        }
      }
      
      // Filtro por banheiros (>= para valores com +)
      if (filtros.banheiros !== undefined && imovel.caracteristicas.banheiros < filtros.banheiros) {
        return false;
      }
      
      // Filtro por vagas (>= para valores com +)
      if (filtros.vagas !== undefined && imovel.caracteristicas.vagas < filtros.vagas) {
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
      
      // Filtro por comodidades (buscar nas tags)
      const tags = imovel.tags || []
      
      // Debug: log quando filtro frenteMar está ativo
      if (filtros.frenteMar) {
        const temTag = tags.includes('Frente Mar')
        if (!temTag) {
          console.log(`🔍 Filtro Frente Mar: Imóvel ${imovel.id} (${imovel.titulo?.substring(0, 50)}) NÃO tem tag. Tags disponíveis: [${tags.join(', ')}]`)
        }
      }
      
      if (filtros.frenteMar && !tags.includes('Frente Mar')) {
        return false;
      }
      
      if (filtros.mobiliado && !tags.includes('Mobiliado')) {
        return false;
      }
      
      if (filtros.vistaMar && !tags.includes('Vista Mar')) {
        return false;
      }
      
      if (filtros.areaLazer && !tags.includes('Área de Lazer')) {
        return false;
      }
      
      if (filtros.homeClub && !tags.includes('Home Club completo')) {
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

export function generateSlug(titulo: string, imovel?: Partial<Imovel>): string {
  // Criar slug base do título
  let slug = titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  // Se tiver informações do imóvel, adicionar contexto para SEO
  if (imovel) {
    const partes: string[] = []
    
    // Adicionar tipo se disponível
    if (imovel.tipo) {
      partes.push(imovel.tipo)
    }
    
    // Adicionar cidade se disponível
    if (imovel.endereco?.cidade) {
      const cidade = imovel.endereco.cidade
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
      partes.push(cidade)
    }
    
    // Adicionar quartos se disponível (ex: "2-quartos")
    if (imovel.caracteristicas?.quartos) {
      partes.push(`${imovel.caracteristicas.quartos}-quartos`)
    }
    
    // Se tiver partes adicionais, adicionar ao slug
    if (partes.length > 0) {
      slug = `${partes.join('-')}-${slug}`
    }
  }
  
  // Limpar múltiplos hífens e remover hífens no início/fim
  slug = slug.replace(/-+/g, '-').replace(/^-+|-+$/g, '')
  
  return slug;
}

