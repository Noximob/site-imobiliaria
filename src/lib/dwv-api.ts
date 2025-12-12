/**
 * Integração com API DWV
 * 
 * Esta função busca imóveis da API DWV e converte para o formato do site
 */

interface DWVImovel {
  // TODO: Ajustar conforme a estrutura real da API DWV
  id?: string | number
  codigo?: string
  titulo?: string
  descricao?: string
  preco?: number
  tipo?: string
  status?: string
  cidade?: string
  bairro?: string
  rua?: string
  numero?: string
  cep?: string
  estado?: string
  quartos?: number
  banheiros?: number
  vagas?: number
  area?: number
  fotos?: string[]
  [key: string]: any // Para campos adicionais
}

interface DWVResponse {
  // TODO: Ajustar conforme a estrutura real da resposta da API
  data?: DWVImovel[]
  imoveis?: DWVImovel[]
  results?: DWVImovel[]
  [key: string]: any
}

/**
 * Busca imóveis da API DWV
 */
export async function fetchDWVImoveis(): Promise<DWVImovel[]> {
  try {
    const apiUrl = process.env.DWV_API_URL || 'https://api.dwv.com.br/v1/imoveis' // TODO: Ajustar URL
    const apiToken = process.env.DWV_API_TOKEN

    if (!apiToken) {
      console.error('❌ DWV_API_TOKEN não configurado no Netlify')
      return []
    }

    console.log('🔍 Buscando imóveis da API DWV...')

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`, // TODO: Ajustar formato do header
        'Content-Type': 'application/json',
        // Adicione outros headers se necessário
      },
    })

    if (!response.ok) {
      console.error(`❌ Erro na API DWV: ${response.status} ${response.statusText}`)
      const errorText = await response.text()
      console.error('❌ Resposta:', errorText)
      return []
    }

    const data: DWVResponse = await response.json()
    
    // TODO: Ajustar conforme a estrutura real da resposta
    // A API pode retornar: data.data, data.imoveis, data.results, etc.
    const imoveis = data.data || data.imoveis || data.results || []
    
    console.log(`✅ ${imoveis.length} imóveis encontrados na API DWV`)
    
    return imoveis
  } catch (error) {
    console.error('❌ Erro ao buscar imóveis da API DWV:', error)
    return []
  }
}

/**
 * Converte um imóvel da API DWV para o formato do site
 */
export function convertDWVToImovel(dwvImovel: DWVImovel, index: number): any {
  // Gerar ID único de 5 dígitos baseado no código ou índice
  const id = dwvImovel.codigo 
    ? dwvImovel.codigo.toString().padStart(5, '0').slice(-5)
    : String(index + 10000).padStart(5, '0').slice(-5)

  // Gerar slug do título
  const slug = dwvImovel.titulo
    ? dwvImovel.titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') + `-${id}`
    : `imovel-${id}`

  // Mapear tipo
  const tipoMap: { [key: string]: string } = {
    'apartamento': 'apartamento',
    'casa': 'casa',
    'terreno': 'terreno',
    'comercial': 'comercial',
    'sala': 'comercial',
    'cobertura': 'cobertura',
    'cobertura/diferenciado': 'cobertura',
  }
  const tipo = tipoMap[dwvImovel.tipo?.toLowerCase() || ''] || 'apartamento'

  // Mapear status
  const statusMap: { [key: string]: string } = {
    'pronto': 'prontos',
    'prontos': 'prontos',
    'lançamento': 'lancamento',
    'lancamento': 'lancamento',
    'em construção': 'em-construcao',
    'em-construcao': 'em-construcao',
  }
  const status = statusMap[dwvImovel.status?.toLowerCase() || ''] || 'prontos'

  // Normalizar cidade
  const cidadeMap: { [key: string]: string } = {
    'penha': 'penha',
    'balneário piçarras': 'balneario-picarras',
    'balneario picarras': 'balneario-picarras',
    'balneário-piçarras': 'balneario-picarras',
    'barra velha': 'barra-velha',
    'barra-velha': 'barra-velha',
  }
  const cidade = cidadeMap[dwvImovel.cidade?.toLowerCase() || ''] || dwvImovel.cidade?.toLowerCase() || 'penha'

  return {
    id,
    titulo: dwvImovel.titulo || `Imóvel ${id}`,
    slug,
    descricao: dwvImovel.descricao || '',
    preco: dwvImovel.preco || 0,
    tipo: tipo as any,
    status: status as any,
    endereco: {
      cidade,
      bairro: dwvImovel.bairro || '',
      rua: dwvImovel.rua || '',
      numero: dwvImovel.numero || '',
      cep: dwvImovel.cep || '',
      estado: dwvImovel.estado || 'SC',
    },
    caracteristicas: {
      quartos: dwvImovel.quartos || 0,
      banheiros: dwvImovel.banheiros || 0,
      vagas: dwvImovel.vagas || 0,
      area: dwvImovel.area || 0,
      frenteMar: false, // TODO: Mapear da API se disponível
      piscina: false,
      churrasqueira: false,
      academia: false,
      portaria: false,
      elevador: false,
      varanda: false,
      sacada: false,
    },
    fotos: dwvImovel.fotos || [],
    fotoPrincipalIndex: 0,
    contato: {
      whatsapp: '(47) 99753-0113', // TODO: Pegar da API se disponível
      corretor: 'Nox Imóveis',
    },
    visualizacoes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    publicado: true,
    selecaoNox: false,
  }
}

