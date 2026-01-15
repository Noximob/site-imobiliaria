/**
 * Integração com API DWV
 * 
 * Esta função busca imóveis da API DWV e converte para o formato do site
 * Documentação: https://apisandbox.dwvapp.com.br/docs
 */

interface DWVUnit {
  id?: number
  title?: string
  price?: string
  type?: string
  parking_spaces?: number
  dorms?: number
  suites?: number
  bathroom?: number
  private_area?: string
  util_area?: string
  total_area?: string
  cover?: string
  additional_galleries?: string[]
  payment_conditions?: any[]
}

interface DWVBuilding {
  id?: number
  title?: string
  gallery?: string[]
  address?: {
    street?: string
    number?: string
    neighborhood?: string
    city?: string
    state?: string
    zip_code?: string
  }
  text_address?: string
  cover?: string
}

interface DWVThirdPartyProperty {
  id?: number
  title?: string
  price?: string
  type?: string
  dorms?: number
  suites?: number
  bathroom?: number
  parking_spaces?: number
  private_area?: string
  text_address?: string
  gallery?: string[]
  cover?: string
}

interface DWVImovel {
  id: number
  title: string
  description: string
  status: 'active' | 'inactive' | 'auto_inactive'
  construction_stage: 'Pré-lançamento' | 'Em construção' | 'Lançamento' | 'Usado'
  construction_stage_raw: 'pre-market' | 'under construction' | 'new' | 'used'
  rent: boolean
  deleted: boolean
  address_display_type?: string
  unit?: DWVUnit | null
  building?: DWVBuilding | null
  third_party_property?: DWVThirdPartyProperty | null
  construction_company?: {
    title?: string
    whatsapp?: string
    email?: string
  }
  last_updated_at: string
}

interface DWVResponse {
  total: number
  perPage: number
  page: number
  lastPage: number
  data: DWVImovel[]
}

/**
 * Busca imóveis da API DWV com paginação
 */
export async function fetchDWVImoveis(page: number = 1, limit: number = 100): Promise<DWVImovel[]> {
  try {
    // URL base - usar produção ou sandbox conforme configurado
    const baseUrl = process.env.DWV_API_URL || 'https://api.dwvapp.com.br/integration/properties'
    const apiToken = process.env.DWV_API_TOKEN

    if (!apiToken) {
      console.error('❌ DWV_API_TOKEN não configurado no Netlify')
      return []
    }

    const allImoveis: DWVImovel[] = []
    let currentPage = page
    let lastPage = 1

    do {
      console.log(`🔍 Buscando imóveis da API DWV (página ${currentPage}/${lastPage})...`)

      const url = `${baseUrl}?page=${currentPage}&limit=${limit}&status=active&deleted=false`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'token': apiToken, // DWV usa header 'token', não 'Authorization'
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          console.error('❌ Token inválido ou não autorizado')
          return []
        }
        if (response.status === 429) {
          console.error('❌ Limite de requisições excedido (100/minuto). Aguardando...')
          await new Promise(resolve => setTimeout(resolve, 60000)) // Aguarda 1 minuto
          continue
        }
        console.error(`❌ Erro na API DWV: ${response.status} ${response.statusText}`)
        const errorText = await response.text()
        console.error('❌ Resposta:', errorText)
        return []
      }

      const data: DWVResponse = await response.json()
      
      // Filtrar apenas imóveis ativos e não deletados
      const imoveisAtivos = data.data.filter(imovel => 
        imovel.status === 'active' && !imovel.deleted
      )
      
      allImoveis.push(...imoveisAtivos)
      lastPage = data.lastPage
      currentPage++
      
      console.log(`✅ Página ${currentPage - 1}: ${imoveisAtivos.length} imóveis encontrados (Total: ${allImoveis.length})`)
      
      // Pequeno delay para respeitar rate limit
      if (currentPage <= lastPage) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
    } while (currentPage <= lastPage)
    
    console.log(`✅ Total: ${allImoveis.length} imóveis encontrados na API DWV`)
    
    return allImoveis
  } catch (error) {
    console.error('❌ Erro ao buscar imóveis da API DWV:', error)
    return []
  }
}

/**
 * Converte área de string para número (remove "m²" e converte)
 */
function parseArea(areaStr?: string): number {
  if (!areaStr) return 0
  const numStr = areaStr.replace(/[^\d,.]/g, '').replace(',', '.')
  return parseFloat(numStr) || 0
}

/**
 * Converte preço de string para número (remove formatação)
 */
function parsePrice(priceStr?: string): number {
  if (!priceStr) return 0
  const numStr = priceStr.replace(/[^\d,.]/g, '').replace(/\./g, '').replace(',', '.')
  return parseFloat(numStr) || 0
}

/**
 * Normaliza nome da cidade para o formato do site
 */
function normalizeCity(city?: string): string {
  if (!city) return 'penha'
  
  const cityMap: { [key: string]: string } = {
    'penha': 'penha',
    'balneário piçarras': 'balneario-picarras',
    'balneario picarras': 'balneario-picarras',
    'balneário-piçarras': 'balneario-picarras',
    'balneário piçarras': 'balneario-picarras',
    'barra velha': 'barra-velha',
    'barra-velha': 'barra-velha',
  }
  
  const normalized = city.toLowerCase().trim()
  return cityMap[normalized] || normalized
}

/**
 * Mapeia tipo da DWV para tipo do site
 */
function mapType(dwvType?: string): 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'cobertura' {
  if (!dwvType) return 'apartamento'
  
  const typeMap: { [key: string]: 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'cobertura' } = {
    'apartment': 'apartamento',
    'house': 'casa',
    'land': 'terreno',
    'comercialRoom': 'comercial',
    'showroom': 'comercial',
    'warehouse': 'comercial',
    'penthouse': 'cobertura',
    'roof': 'cobertura',
    'differentiated': 'cobertura',
  }
  
  return typeMap[dwvType.toLowerCase()] || 'apartamento'
}

/**
 * Mapeia estágio de construção para status do site
 */
function mapStatus(constructionStage?: string, constructionStageRaw?: string): 'prontos' | 'lancamento' | 'em-construcao' {
  if (constructionStageRaw === 'used') return 'prontos'
  if (constructionStageRaw === 'new') return 'lancamento'
  if (constructionStageRaw === 'under construction') return 'em-construcao'
  if (constructionStageRaw === 'pre-market') return 'lancamento'
  
  if (constructionStage === 'Usado') return 'prontos'
  if (constructionStage === 'Lançamento') return 'lancamento'
  if (constructionStage === 'Em construção') return 'em-construcao'
  if (constructionStage === 'Pré-lançamento') return 'lancamento'
  
  return 'prontos'
}

/**
 * Converte um imóvel da API DWV para o formato do site
 */
export function convertDWVToImovel(dwvImovel: DWVImovel, index: number): any {
  // Usar ID da DWV como base, garantir 5 dígitos
  const id = dwvImovel.id.toString().padStart(5, '0').slice(-5)

  // Gerar slug do título
  const slug = dwvImovel.title
    ? dwvImovel.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') + `-${id}`
    : `imovel-${id}`

  // Determinar se é unit, building ou third_party_property
  const unit = dwvImovel.unit
  const building = dwvImovel.building
  const thirdParty = dwvImovel.third_party_property

  // Extrair informações principais
  let preco = 0
  let tipo = 'apartamento' as any
  let quartos = 0
  let suites = 0
  let banheiros = 0
  let vagas = 0
  let area = 0
  let fotos: string[] = []
  let endereco: any = {
    cidade: 'penha',
    bairro: '',
    rua: '',
    numero: '',
    cep: '',
    estado: 'SC',
  }

  if (unit) {
    // É uma unidade (apartamento, casa, etc.)
    preco = parsePrice(unit.price)
    tipo = mapType(unit.type)
    quartos = unit.dorms || 0
    suites = unit.suites || 0
    banheiros = unit.bathroom || 0
    vagas = unit.parking_spaces || 0
    area = parseArea(unit.private_area || unit.total_area || unit.util_area)
    
    // Fotos: cover + additional_galleries
    if (unit.cover) fotos.push(unit.cover)
    if (unit.additional_galleries) {
      fotos.push(...unit.additional_galleries)
    }
    
    // Endereço do building
    if (building?.address) {
      endereco = {
        cidade: normalizeCity(building.address.city),
        bairro: building.address.neighborhood || '',
        rua: building.address.street || '',
        numero: building.address.number || '',
        cep: building.address.zip_code || '',
        estado: building.address.state || 'SC',
      }
    } else if (building?.text_address) {
      // Tentar extrair cidade do text_address
      const cityMatch = building.text_address.match(/(Penha|Balneário Piçarras|Barra Velha)/i)
      if (cityMatch) {
        endereco.cidade = normalizeCity(cityMatch[0])
      }
    }
    
    // Adicionar fotos do building também
    if (building?.gallery) {
      fotos.push(...building.gallery)
    }
    if (building?.cover) {
      fotos.unshift(building.cover) // Cover do building como primeira foto
    }
  } else if (thirdParty) {
    // É um imóvel de terceiro (usado)
    preco = parsePrice(thirdParty.price)
    tipo = mapType(thirdParty.type)
    quartos = thirdParty.dorms || 0
    suites = thirdParty.suites || 0
    banheiros = thirdParty.bathroom || 0
    vagas = thirdParty.parking_spaces || 0
    area = parseArea(thirdParty.private_area || thirdParty.total_area)
    
    // Fotos
    if (thirdParty.cover) fotos.push(thirdParty.cover)
    if (thirdParty.gallery) {
      fotos.push(...thirdParty.gallery)
    }
    
    // Endereço do third_party
    if (thirdParty.text_address) {
      const cityMatch = thirdParty.text_address.match(/(Penha|Balneário Piçarras|Barra Velha)/i)
      if (cityMatch) {
        endereco.cidade = normalizeCity(cityMatch[0])
      }
    }
  }

  // Remover duplicatas das fotos
  fotos = [...new Set(fotos)]

  // Contato da construtora ou padrão
  const whatsapp = dwvImovel.construction_company?.whatsapp || '(47) 99753-0113'
  const corretor = dwvImovel.construction_company?.title || 'Nox Imóveis'

  return {
    id,
    titulo: dwvImovel.title || `Imóvel ${id}`,
    slug,
    descricao: dwvImovel.description || '',
    preco,
    tipo,
    status: mapStatus(dwvImovel.construction_stage, dwvImovel.construction_stage_raw),
    endereco,
    caracteristicas: {
      quartos: quartos + suites, // Total de quartos (incluindo suítes)
      banheiros,
      vagas,
      area,
      suite: suites, // Número de suítes separado
      frenteMar: false, // TODO: Verificar se há campo na API
      piscina: false,
      churrasqueira: false,
      academia: false,
      portaria: false,
      elevador: false,
      varanda: false,
      sacada: false,
    },
    fotos,
    fotoPrincipalIndex: 0,
    contato: {
      whatsapp,
      corretor,
      email: dwvImovel.construction_company?.email,
    },
    visualizacoes: 0,
    createdAt: new Date(dwvImovel.last_updated_at || new Date()),
    updatedAt: new Date(dwvImovel.last_updated_at || new Date()),
    publicado: true,
    selecaoNox: false,
  }
}


