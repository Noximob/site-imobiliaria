/**
 * Integração com API DWV
 * 
 * Documentação oficial: https://api.dwvapp.com.br/
 * Versão: 1.0.2
 * E-mail: suporte@dwvapp.com.br
 * 
 * URLs:
 * - Produção: https://agencies.dwvapp.com.br/integration/properties
 * - Sandbox: https://apisandbox.dwvapp.com.br/integration/properties
 */

// ============================================
// INTERFACES DWV (Conforme documentação oficial)
// ============================================

interface DWVSizes {
  small?: string
  medium?: string
  large?: string
  circle?: string
  xfullhd?: string
  xlarge?: string
  xmedium?: string
  xmediumhd?: string
}

interface DWVImage {
  url: string
  sizes?: DWVSizes
}

interface DWVAddress {
  street_name?: string
  street_number?: string
  neighborhood?: string
  complement?: string
  zip_code?: string
  city?: string
  state?: string
  country?: string
  latitude?: number
  longitude?: number
}

interface DWVFeature {
  type?: string
  tags?: string[]
}

interface DWVAdditionalGallery {
  title?: string
  files?: DWVImage[]
}

interface DWVUnit {
  id?: number
  title?: string
  price?: string
  type?: string
  floor_plan?: any
  section?: any
  parking_spaces?: number
  dorms?: number // Total de quartos (inclui suítes)
  suites?: number
  bathroom?: number // Total de banheiros
  private_area?: string
  util_area?: string
  total_area?: string
  payment_conditions?: any[]
  cover?: string
  additional_galleries?: DWVAdditionalGallery[]
  features?: DWVFeature[]
}

interface DWVBuilding {
  id?: number
  title?: string
  gallery?: DWVImage[]
  architectural_plans?: DWVImage[]
  video?: string
  videos?: any[]
  tour_360?: string
  description?: any[]
  address?: DWVAddress
  text_address?: string
  incorporation?: string
  cover?: DWVImage
  features?: DWVFeature[]
  delivery_date?: string
}

interface DWVThirdPartyProperty {
  id?: number
  title?: string
  price?: string
  type?: string
  unit_info?: string
  dorms?: number
  suites?: number
  bathroom?: number
  parking_spaces?: number
  private_area?: string
  util_area?: string
  total_area?: string
  text_address?: string
  address?: DWVAddress
  gallery?: DWVImage[]
  cover?: DWVImage
  features?: DWVFeature[]
  payment_conditions?: any[]
}

interface DWVConstructionCompany {
  title?: string
  site?: string
  whatsapp?: string
  instagram?: string
  email?: string
  business_contacts?: any[]
  additionals_contacts?: any[]
  logo?: DWVImage
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
  construction_company?: DWVConstructionCompany
  last_updated_at: string
}

interface DWVResponse {
  total: number
  perPage: number
  page: number
  lastPage: number
  data: DWVImovel[]
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Extrai URL da imagem (prioriza URL original para evitar cortes)
 */
function extractImageUrl(image?: string | DWVImage): string | null {
  if (!image) return null
  
  if (typeof image === 'string') {
    return image
  }
  
  // Priorizar URL original (sem redimensionamento/corte) ou xfullhd (maior versão completa)
  // As versões large/medium/xlarge podem estar cortadas pelo DWV
  return image.url || image.sizes?.xfullhd || image.sizes?.xlarge || image.sizes?.large || image.sizes?.medium || null
}

/**
 * Extrai múltiplas URLs de imagens de um array
 */
function extractImageUrls(images?: (string | DWVImage)[]): string[] {
  if (!images || !Array.isArray(images)) return []
  
  return images
    .map(img => extractImageUrl(img))
    .filter((url): url is string => url !== null)
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
 * A API DWV retorna preços em centavos (sem decimais) como string
 * Exemplos: "420492998" (sem decimais, 9 dígitos) = R$ 4.204.929,98
 * Estratégia: Se não tem decimais e tem 7+ dígitos, os últimos 2 são centavos
 */
function parsePrice(priceStr?: string): number {
  if (!priceStr) return 0
  
  // Guardar formato original
  const originalStr = priceStr.trim()
  
  // Remove tudo exceto dígitos, vírgulas e pontos
  let numStr = originalStr.replace(/[^\d,.]/g, '')
  
  // Verificar se tinha decimais no original
  const tinhaVirgula = originalStr.includes(',')
  const temPontoDecimal = originalStr.includes('.') && 
    originalStr.split('.').pop()?.length === 2
  const tinhaDecimais = tinhaVirgula || temPontoDecimal
  
  // Se tem vírgula, é formato brasileiro (ex: "400.000,00" ou "400000,00")
  if (numStr.includes(',')) {
    // Remove pontos (separadores de milhar) e substitui vírgula por ponto
    numStr = numStr.replace(/\./g, '').replace(',', '.')
  }
  // Se tem ponto mas não vírgula, verificar se é decimal ou separador de milhar
  else if (numStr.includes('.')) {
    // Se o ponto está nas últimas 3 posições, é decimal (formato americano)
    const lastDotIndex = numStr.lastIndexOf('.')
    const afterDot = numStr.substring(lastDotIndex + 1)
    
    if (afterDot.length <= 2) {
      // É formato americano (ex: "400000.00") - manter o ponto decimal
      // Remover apenas pontos que são separadores de milhar (antes do último ponto)
      const beforeDot = numStr.substring(0, lastDotIndex).replace(/\./g, '')
      numStr = beforeDot + '.' + afterDot
    } else {
      // É separador de milhar (ex: "400.000") - remover todos os pontos
      numStr = numStr.replace(/\./g, '')
    }
  }
  // Se não tem nem vírgula nem ponto, é número puro
  else {
    // Se não tinha decimais no original E tem 7+ dígitos, 
    // assumir que os últimos 2 dígitos são centavos
    if (!tinhaDecimais && numStr.length >= 7) {
      const parteInteira = numStr.slice(0, -2)
      const centavos = numStr.slice(-2)
      numStr = parteInteira + '.' + centavos
    }
  }
  
  return parseFloat(numStr) || 0
}

/**
 * Normaliza nome da cidade para o formato do site
 */
function normalizeCity(city?: string): string {
  if (!city) return 'penha'
  
  const normalized = city.toLowerCase().trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/-/g, ' ')
  
  if (normalized.includes('penha')) return 'penha'
  if (normalized.includes('picarras')) return 'balneario-picarras'
  if (normalized.includes('barra') && normalized.includes('velha')) return 'barra-velha'
  
  return normalized
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
    'comercialroom': 'comercial',
    'comercial_room': 'comercial',
    'showroom': 'comercial',
    'warehouse': 'comercial',
    'hotel': 'comercial',
    'penthouse': 'cobertura',
    'roof': 'cobertura',
    'differentiated': 'cobertura',
    'garden': 'apartamento',
    'duplex': 'casa',
    'smallfarm': 'terreno',
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
 * Extrai tags/comodidades das features da DWV
 */
function extractTags(unit?: DWVUnit | null, building?: DWVBuilding | null, thirdParty?: DWVThirdPartyProperty | null): string[] {
  const tags: string[] = []
  const allTags: string[] = []
  
  // Coletar tags de todas as features
  const collectTags = (features?: DWVFeature[]) => {
    if (!features || !Array.isArray(features)) return
    
    features.forEach(feature => {
      if (feature.tags && Array.isArray(feature.tags)) {
        allTags.push(...feature.tags.map(t => t.toLowerCase().trim()))
      }
    })
  }
  
  collectTags(unit?.features)
  collectTags(building?.features)
  collectTags(thirdParty?.features)
  
  // Normalizar tags para comparação
  const normalizedTags = allTags.map(t =>
    t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
  )
  
  // Mapear para tags do site
  const tagMap: { [key: string]: string } = {
    'frente ao mar': 'Frente Mar',
    'frente mar': 'Frente Mar',
    'vista para o mar': 'Vista Mar',
    'vista mar': 'Vista Mar',
    'vista do mar': 'Vista Mar',
    'quadra do mar': 'Quadra Mar',
    'quadra mar': 'Quadra Mar',
    'mobiliada': 'Mobiliado',
    'mobiliado': 'Mobiliado',
    'area de lazer': 'Área de Lazer',
    'area lazer': 'Área de Lazer',
    'lazer': 'Área de Lazer',
    'home club completo': 'Home Club completo',
    'home club': 'Home Club completo',
    'clube': 'Home Club completo',
  }
  
  // Adicionar tags mapeadas (sem duplicatas)
  normalizedTags.forEach(tag => {
    // Busca exata
    if (tagMap[tag] && !tags.includes(tagMap[tag])) {
      tags.push(tagMap[tag])
      return
    }
    
    // Busca parcial
    Object.keys(tagMap).forEach(key => {
      if (tag.includes(key) && !tags.includes(tagMap[key])) {
        tags.push(tagMap[key])
      }
    })
  })
  
  return tags
}

/**
 * Extrai endereço de building ou third_party_property
 */
function extractAddress(building?: DWVBuilding | null, thirdParty?: DWVThirdPartyProperty | null): any {
  const defaultAddress = {
    cidade: 'penha',
    bairro: '',
    rua: '',
    numero: '',
    cep: '',
    estado: 'SC',
  }
  
  // Priorizar building.address, depois third_party.address
  let address: DWVAddress | undefined
  
  if (building?.address) {
    address = building.address
  } else if (thirdParty?.address) {
    address = thirdParty.address
  }
  
  if (address) {
    return {
      cidade: normalizeCity(address.city),
      bairro: address.neighborhood || '',
      rua: address.street_name || '',
      numero: address.street_number || '',
      cep: address.zip_code || '',
      estado: address.state || 'SC',
      lat: address.latitude,
      lng: address.longitude,
    }
  }
  
  // Fallback: tentar extrair de text_address
  const textAddress = building?.text_address || thirdParty?.text_address || ''
  if (textAddress) {
    const cityMatch = textAddress.match(/(Penha|Balneário Piçarras|Barra Velha)/i)
    if (cityMatch) {
      defaultAddress.cidade = normalizeCity(cityMatch[0])
    }
  }
  
  return defaultAddress
}

/**
 * Extrai fotos de unit, building e third_party_property
 */
function extractFotos(unit?: DWVUnit | null, building?: DWVBuilding | null, thirdParty?: DWVThirdPartyProperty | null): string[] {
  const fotos: string[] = []
  
  // Fotos do unit
  if (unit) {
    // Cover do unit
    if (unit.cover) {
      fotos.push(unit.cover)
    }
    
    // Additional galleries do unit
    if (unit.additional_galleries && Array.isArray(unit.additional_galleries)) {
      unit.additional_galleries.forEach(gallery => {
        if (gallery.files && Array.isArray(gallery.files)) {
          gallery.files.forEach(file => {
            const url = extractImageUrl(file)
            if (url) fotos.push(url)
          })
        }
      })
    }
  }
  
  // Fotos do building
  if (building) {
    // Cover do building (prioridade)
    if (building.cover) {
      const coverUrl = extractImageUrl(building.cover)
      if (coverUrl) fotos.unshift(coverUrl) // Adicionar no início
    }
    
    // Gallery do building
    if (building.gallery && Array.isArray(building.gallery)) {
      const buildingFotos = extractImageUrls(building.gallery)
      fotos.push(...buildingFotos)
    }
  }
  
  // Fotos do third_party_property
  if (thirdParty) {
    // Cover do third_party
    if (thirdParty.cover) {
      const coverUrl = extractImageUrl(thirdParty.cover)
      if (coverUrl) fotos.unshift(coverUrl)
    }
    
    // Gallery do third_party
    if (thirdParty.gallery && Array.isArray(thirdParty.gallery)) {
      const thirdPartyFotos = extractImageUrls(thirdParty.gallery)
      fotos.push(...thirdPartyFotos)
    }
  }
  
  // Remover duplicatas mantendo ordem
  return Array.from(new Set(fotos))
}

// ============================================
// FUNÇÃO PRINCIPAL: Buscar imóveis da DWV
// ============================================

/**
 * Busca imóveis da API DWV com paginação automática
 */
export async function fetchDWVImoveis(page: number = 1, limit: number = 100): Promise<DWVImovel[]> {
  try {
    const baseUrl = process.env.DWV_API_URL || 'https://agencies.dwvapp.com.br/integration/properties'
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

      const url = `${baseUrl}?page=${currentPage}&limit=${limit}`
      
      console.log(`📍 URL: ${url}`)
      console.log(`🔑 Token: ${apiToken.substring(0, 20)}...`)
      
      // Autenticação conforme documentação: header 'token: TOKEN_IMOBILIARIA'
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'token': apiToken,
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
          await new Promise(resolve => setTimeout(resolve, 60000))
          continue
        }
        console.error(`❌ Erro na API DWV: ${response.status} ${response.statusText}`)
        try {
          const errorText = await response.text()
          console.error('❌ Resposta:', errorText)
        } catch (e) {
          console.error('❌ Não foi possível ler resposta de erro')
        }
        return []
      }

      let data: DWVResponse
      try {
        data = await response.json()
      } catch (error: any) {
        console.error('❌ Erro ao fazer parse do JSON da API DWV:', error)
        const text = await response.text().catch(() => 'Não foi possível ler resposta')
        console.error('❌ Resposta bruta:', text.substring(0, 500))
        return []
      }
      
      console.log(`📊 Resposta da API: total=${data.total}, perPage=${data.perPage}, page=${data.page}, lastPage=${data.lastPage}`)
      console.log(`📊 Imóveis brutos retornados: ${data.data.length}`)
      
      // Filtrar apenas imóveis não deletados
      const imoveisValidos = data.data.filter(imovel => !imovel.deleted)
      
      console.log(`✅ Imóveis válidos após filtro (apenas !deleted): ${imoveisValidos.length} de ${data.data.length}`)
      
      allImoveis.push(...imoveisValidos)
      lastPage = data.lastPage
      currentPage++
      
      console.log(`✅ Página ${currentPage - 1}: ${imoveisValidos.length} imóveis válidos (Total: ${allImoveis.length})`)
      
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

// ============================================
// FUNÇÃO PRINCIPAL: Converter DWV para Imovel
// ============================================

/**
 * Converte um imóvel da API DWV para o formato do site
 */
export function convertDWVToImovel(dwvImovel: DWVImovel, index: number): any {
  // ID: usar ID da DWV com 5 dígitos
  const id = dwvImovel.id.toString().padStart(5, '0').slice(-5)

  // Slug: gerar do título
  const slug = dwvImovel.title
    ? dwvImovel.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') + `-${id}`
    : `imovel-${id}`

  // Extrair dados principais
  const unit = dwvImovel.unit
  const building = dwvImovel.building
  const thirdParty = dwvImovel.third_party_property

  // Preço
  let preco = 0
  if (unit?.price) preco = parsePrice(unit.price)
  else if (thirdParty?.price) preco = parsePrice(thirdParty.price)

  // Tipo
  let tipo = 'apartamento' as any
  if (unit?.type) tipo = mapType(unit.type)
  else if (thirdParty?.type) tipo = mapType(thirdParty.type)

  // Quartos e suítes (conforme documentação: quartos incluem suítes)
  // Total de quartos = dorms (que já inclui suítes)
  // Quartos sociais = dorms - suites
  let quartosTotal = 0
  let suites = 0
  
  if (unit) {
    quartosTotal = unit.dorms || 0 // Total já inclui suítes
    suites = unit.suites || 0
  } else if (thirdParty) {
    quartosTotal = thirdParty.dorms || 0
    suites = thirdParty.suites || 0
  }

  // Banheiros (conforme documentação: total - banheiros da suíte = banheiros sociais)
  let banheiros = 0
  if (unit) banheiros = unit.bathroom || 0
  else if (thirdParty) banheiros = thirdParty.bathroom || 0

  // Vagas
  let vagas = 0
  if (unit) vagas = unit.parking_spaces || 0
  else if (thirdParty) vagas = thirdParty.parking_spaces || 0

  // Área (priorizar private_area, depois total_area, depois util_area)
  let area = 0
  if (unit) {
    area = parseArea(unit.private_area || unit.total_area || unit.util_area)
  } else if (thirdParty) {
    area = parseArea(thirdParty.private_area || thirdParty.total_area || thirdParty.util_area)
  }

  // Endereço
  const endereco = extractAddress(building, thirdParty)

  // Fotos
  const fotos = extractFotos(unit, building, thirdParty)

  // Tags/comodidades
  const tags = extractTags(unit, building, thirdParty)

  // Detectar comodidades para caracteristicas
  const temFrenteMar = tags.includes('Frente Mar')
  const temVistaMar = tags.includes('Vista Mar')
  const temQuadraMar = tags.includes('Quadra Mar')
  const temMobiliado = tags.includes('Mobiliado')
  const temAreaLazer = tags.includes('Área de Lazer')
  const temHomeClub = tags.includes('Home Club completo')

  // Contato
  const whatsapp = dwvImovel.construction_company?.whatsapp || '(47) 99753-0113'
  const corretor = dwvImovel.construction_company?.title || 'Nox Imóveis'

  // Coordenadas do endereço
  const coordenadas = (endereco.lat && endereco.lng) ? {
    lat: endereco.lat,
    lng: endereco.lng,
  } : undefined

  return {
    id,
    titulo: dwvImovel.title || `Imóvel ${id}`,
    slug,
    descricao: dwvImovel.description || '',
    preco,
    tipo,
    status: mapStatus(dwvImovel.construction_stage, dwvImovel.construction_stage_raw),
    endereco,
    coordenadas,
    caracteristicas: {
      quartos: quartosTotal, // Total de quartos (já inclui suítes)
      banheiros,
      vagas,
      area,
      suite: suites, // Número de suítes separado
      frenteMar: temFrenteMar,
      piscina: temAreaLazer || temHomeClub,
      churrasqueira: false,
      academia: temHomeClub,
      portaria: false,
      elevador: false,
      varanda: false,
      sacada: false,
    },
    tags, // Tags para filtros
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
    publicado: true, // Sempre publicado
    selecaoNox: false,
    fonteDWV: true, // Marca origem DWV
  }
}
