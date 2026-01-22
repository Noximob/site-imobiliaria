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

import { generateSlug } from './imoveis'

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
 * Remove parâmetros de crop da URL
 */
function removeCropParams(url: string): string {
  try {
    const urlObj = new URL(url)
    urlObj.searchParams.delete('crop')
    return urlObj.toString()
  } catch (error) {
    console.warn("Invalid URL for crop param removal:", url, error)
    return url
  }
}

/**
 * Verifica se uma imagem tem o tamanho 'medium' disponível
 */
function hasMediumSize(image?: string | DWVImage): boolean {
  if (!image || typeof image === 'string') {
    return false // Strings não têm sizes, assumir que não tem medium
  }
  return !!image.sizes?.medium
}

/**
 * Extrai URL da imagem com tamanho específico baseado na posição
 * @param image - Imagem do DWV (string ou DWVImage)
 * @param sizePreference - 'large' para foto principal, 'medium' para fotos menores
 */
function extractImageUrlBySize(image?: string | DWVImage, sizePreference: 'large' | 'medium' = 'large'): string | null {
  if (!image) return null
  
  if (typeof image === 'string') {
    return removeCropParams(image)
  }
  
  // Para foto grande (principal): priorizar xlarge ou large
  if (sizePreference === 'large') {
    // Tentar usar tamanhos maiores primeiro (xlarge > large > url original)
    const url = image.sizes?.xlarge || image.sizes?.large || image.url || null
    return url ? removeCropParams(url) : null
  }
  
  // Para fotos menores: priorizar medium para harmonia
  if (sizePreference === 'medium') {
    // Tentar usar medium primeiro, depois fallback para outros tamanhos
    const url = image.sizes?.medium || image.sizes?.large || image.url || image.sizes?.xlarge || null
    return url ? removeCropParams(url) : null
  }
  
  return null
}

/**
 * Extrai URL da imagem (compatibilidade - mantém comportamento antigo para listagens)
 * IMPORTANTE: As fotos são URLs do DWV, não são baixadas. Precisamos usar a URL original.
 */
function extractImageUrl(image?: string | DWVImage): string | null {
  if (!image) return null
  
  if (typeof image === 'string') {
    return removeCropParams(image)
  }
  
  // Para listagens: usar URL original sem crop, ou maior versão disponível
  const url = image.url || image.sizes?.xfullhd || image.sizes?.xlarge || image.sizes?.large || image.sizes?.medium || null
  return url ? removeCropParams(url) : null
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
 * Extrai texto completo do campo description do DWV
 * O description é um array com objetos { title: string, items: [{ item: string }] }
 */
function extractDescriptionText(building?: DWVBuilding | null, dwvImovel?: any): string {
  let textoCompleto = ''
  
  // 1. Adicionar título do imóvel (importante para tags!)
  if (dwvImovel?.title) {
    textoCompleto += ' ' + dwvImovel.title
  }
  
  // 2. Extrair do building.description (array)
  if (building?.description && Array.isArray(building.description)) {
    building.description.forEach((section: any) => {
      if (section.title) {
        textoCompleto += ' ' + section.title
      }
      if (section.items && Array.isArray(section.items)) {
        section.items.forEach((item: any) => {
          if (item.item) {
            textoCompleto += ' ' + item.item
          }
        })
      }
    })
  }
  
  // 3. Extrair também do campo description direto do imóvel (se for string)
  if (dwvImovel?.description && typeof dwvImovel.description === 'string') {
    textoCompleto += ' ' + dwvImovel.description
  }
  
  // 4. Extrair do building.title também
  if (building?.title) {
    textoCompleto += ' ' + building.title
  }
  
  return textoCompleto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Extrai tags/comodidades das features da DWV E do descritivo
 */
function extractTags(unit?: DWVUnit | null, building?: DWVBuilding | null, thirdParty?: DWVThirdPartyProperty | null, dwvImovel?: any): string[] {
  const tags: string[] = []
  const allTags: string[] = []
  
  // 1. Coletar tags de todas as features (se existirem)
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
  
  // 2. Extrair texto completo do descritivo
  const textoDescricao = extractDescriptionText(building, dwvImovel)
  
  // Debug: log do texto extraído (apenas primeiros 200 caracteres)
  if (textoDescricao.length > 0) {
    console.log(`📝 Texto extraído (primeiros 200 chars): ${textoDescricao.substring(0, 200)}`)
  }
  
  // 3. Mapear palavras-chave para tags do site
  // Ordem importa: termos mais específicos primeiro
  // SOLUÇÃO SIMPLES: Buscar palavras-chave separadas também (ex: "frente" + "mar")
  const keywordMap: Array<{ keywords: string[], tag: string, palavrasSeparadas?: string[] }> = [
    // Frente Mar (mais específico primeiro)
    { 
      keywords: ['frente ao mar', 'frente mar', 'frente do mar', 'beira mar', 'beira-mar', 'frentemar', 'frente mar'], 
      tag: 'Frente Mar',
      palavrasSeparadas: ['frente', 'mar'] // Buscar "frente" E "mar" próximos (até 50 caracteres de distância)
    },
    
    // Vista Mar
    { 
      keywords: ['vista para o mar', 'vista mar', 'vista do mar', 'vista ao mar', 'vista para mar', 'vistamar'], 
      tag: 'Vista Mar',
      palavrasSeparadas: ['vista', 'mar']
    },
    
    // Quadra Mar
    { 
      keywords: ['quadra do mar', 'quadra mar', '1 quadra do mar', 'uma quadra do mar', 'quadramar'], 
      tag: 'Quadra Mar',
      palavrasSeparadas: ['quadra', 'mar']
    },
    
    // Mobiliado
    { keywords: ['mobiliado', 'mobiliada', 'mobília', 'mobilia', 'totalmente mobiliado', 'completo mobiliado'], tag: 'Mobiliado' },
    
    // Área de Lazer
    { keywords: ['área de lazer', 'area de lazer', 'área lazer', 'area lazer', 'lazer completo', 'espaço de lazer', 'espaco de lazer'], tag: 'Área de Lazer' },
    
    // Home Club
    { keywords: ['home club completo', 'home club', 'homeclub', 'clube completo', 'clube'], tag: 'Home Club completo' },
  ]
  
  // 4. Buscar palavras-chave no texto do descritivo
  keywordMap.forEach(({ keywords, tag, palavrasSeparadas }) => {
    let encontrou = false
    
    // Primeiro: buscar keywords completas (já normalizadas)
    encontrou = keywords.some(keyword => {
      const keywordNormalizada = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      const encontrouKeyword = textoDescricao.includes(keywordNormalizada)
      
      if (encontrouKeyword) {
        console.log(`✅ Tag encontrada: "${tag}" via keyword completa "${keyword}"`)
      }
      
      return encontrouKeyword
    })
    
    // Se não encontrou com keywords completas, tentar palavras separadas
    if (!encontrou && palavrasSeparadas && palavrasSeparadas.length >= 2) {
      const todasPalavrasPresentes = palavrasSeparadas.every(palavra => {
        const palavraNormalizada = palavra.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        return textoDescricao.includes(palavraNormalizada)
      })
      
      if (todasPalavrasPresentes) {
        // Verificar se estão próximas (dentro de 50 caracteres)
        const indices = palavrasSeparadas.map(palavra => {
          const palavraNormalizada = palavra.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          return textoDescricao.indexOf(palavraNormalizada)
        }).filter(idx => idx !== -1).sort((a, b) => a - b)
        
        if (indices.length === palavrasSeparadas.length) {
          const distancia = indices[indices.length - 1] - indices[0]
          if (distancia <= 50) { // Palavras dentro de 50 caracteres
            encontrou = true
            console.log(`✅ Tag encontrada: "${tag}" via palavras separadas próximas: ${palavrasSeparadas.join(' + ')}`)
          }
        }
      }
    }
    
    // Última tentativa: buscar a tag exatamente como escrita (case-insensitive)
    // Ex: "Frente Mar" no título deve ser encontrado
    if (!encontrou) {
      const tagNormalizada = tag.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      // Buscar a tag completa no texto (ex: "frente mar" deve encontrar "Frente Mar")
      const palavrasTag = tagNormalizada.split(/\s+/).filter(p => p.length > 0)
      if (palavrasTag.length >= 2) {
        const todasPalavrasTag = palavrasTag.every(palavra => textoDescricao.includes(palavra))
        if (todasPalavrasTag) {
          // Verificar se estão próximas
          const indicesTag = palavrasTag.map(p => textoDescricao.indexOf(p)).filter(idx => idx !== -1).sort((a, b) => a - b)
          if (indicesTag.length === palavrasTag.length) {
            const distanciaTag = indicesTag[indicesTag.length - 1] - indicesTag[0]
            if (distanciaTag <= 20) { // Palavras da tag dentro de 20 caracteres
              encontrou = true
              console.log(`✅ Tag encontrada: "${tag}" via busca direta da tag no texto`)
            }
          }
        }
      }
    }
    
    if (encontrou && !tags.includes(tag)) {
      tags.push(tag)
      console.log(`🏷️ Tag adicionada: "${tag}"`)
    }
  })
  
  // Debug: log final das tags encontradas
  if (tags.length > 0) {
    console.log(`📋 Tags finais extraídas: ${tags.join(', ')}`)
  } else {
    console.log(`⚠️ Nenhuma tag encontrada no descritivo`)
  }
  
  // 5. Processar tags das features (se existirem)
  const normalizedTags = allTags.map(t =>
    t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
  )
  
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
  
  normalizedTags.forEach(tag => {
    if (tagMap[tag] && !tags.includes(tagMap[tag])) {
      tags.push(tagMap[tag])
      return
    }
    
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
 * Extrai fotos de unit, building e third_party_property com tamanhos otimizados
 * Retorna objeto com:
 * - fotos: array de URLs onde índice 0 é foto principal (large/xlarge) e índices 1-4 são secundárias (medium)
 * - semMedium: array de índices (1-4) que não têm tamanho medium disponível e precisam de object-contain
 */
function extractFotos(unit?: DWVUnit | null, building?: DWVBuilding | null, thirdParty?: DWVThirdPartyProperty | null): { fotos: string[], semMedium: number[] } {
  const todasFotos: Array<{ image: string | DWVImage, source: 'unit' | 'building' | 'thirdParty' }> = []
  
  // Coletar todas as fotos com suas fontes
  // Fotos do unit
  if (unit) {
    // Cover do unit
    if (unit.cover) {
      todasFotos.push({ image: unit.cover, source: 'unit' })
    }
    
    // Additional galleries do unit
    if (unit.additional_galleries && Array.isArray(unit.additional_galleries)) {
      unit.additional_galleries.forEach(gallery => {
        if (gallery.files && Array.isArray(gallery.files)) {
          gallery.files.forEach(file => {
            todasFotos.push({ image: file, source: 'unit' })
          })
        }
      })
    }
  }
  
  // Fotos do building
  if (building) {
    // Cover do building (prioridade - vai no início)
    if (building.cover) {
      todasFotos.unshift({ image: building.cover, source: 'building' })
    }
    
    // Gallery do building
    if (building.gallery && Array.isArray(building.gallery)) {
      building.gallery.forEach(img => {
        todasFotos.push({ image: img, source: 'building' })
      })
    }
  }
  
  // Fotos do third_party_property
  if (thirdParty) {
    // Cover do third_party (prioridade - vai no início)
    if (thirdParty.cover) {
      todasFotos.unshift({ image: thirdParty.cover, source: 'thirdParty' })
    }
    
    // Gallery do third_party
    if (thirdParty.gallery && Array.isArray(thirdParty.gallery)) {
      thirdParty.gallery.forEach(img => {
        todasFotos.push({ image: img, source: 'thirdParty' })
      })
    }
  }
  
  // Remover duplicatas baseado na URL (antes de processar tamanhos)
  const fotosUnicas: Array<{ image: string | DWVImage, source: 'unit' | 'building' | 'thirdParty' }> = []
  const urlsVistas = new Set<string>()
  
  todasFotos.forEach(foto => {
    // Extrair URL temporária para verificar duplicatas
    let urlTemp: string | null = null
    if (typeof foto.image === 'string') {
      urlTemp = foto.image
    } else {
      urlTemp = foto.image.url || foto.image.sizes?.xlarge || foto.image.sizes?.large || foto.image.sizes?.medium || null
    }
    
    if (urlTemp && !urlsVistas.has(urlTemp)) {
      urlsVistas.add(urlTemp)
      fotosUnicas.push(foto)
    }
  })
  
  // Estratégia: escolher 4 fotos que têm tamanho "medium" disponível (geralmente mais quadradas/horizontais)
  // para as 4 menores, garantindo layout harmonioso
  
  if (fotosUnicas.length === 0) {
    return { fotos: [], semMedium: [] }
  }
  
  // 1. Escolher foto principal (primeira)
  const fotoPrincipal = fotosUnicas[0]
  const urlPrincipal = extractImageUrlBySize(fotoPrincipal.image, 'large') || extractImageUrl(fotoPrincipal.image)
  
  if (!urlPrincipal) {
    return { fotos: [], semMedium: [] }
  }
  
  // 2. Separar fotos restantes: as que têm medium vs as que não têm
  const fotosRestantes = fotosUnicas.slice(1)
  const fotosComMedium: Array<{ image: string | DWVImage, source: 'unit' | 'building' | 'thirdParty' }> = []
  const fotosSemMedium: Array<{ image: string | DWVImage, source: 'unit' | 'building' | 'thirdParty' }> = []
  
  fotosRestantes.forEach(foto => {
    if (hasMediumSize(foto.image)) {
      fotosComMedium.push(foto)
    } else {
      fotosSemMedium.push(foto)
    }
  })
  
  // 3. Escolher 4 fotos para as menores: priorizar as que têm medium (são geralmente mais horizontais/quadradas)
  const quatroParaMenores = [
    ...fotosComMedium.slice(0, 4),
    ...fotosSemMedium.slice(0, Math.max(0, 4 - fotosComMedium.length))
  ].slice(0, 4)
  
  // 4. Processar fotos: principal + 4 menores + demais
  const fotosProcessadas: string[] = [urlPrincipal]
  const semMedium: number[] = []
  
  // 4 menores (índices 1-4)
  quatroParaMenores.forEach((foto, idx) => {
    const indexReal = idx + 1 // Índices 1-4
    const temMedium = hasMediumSize(foto.image)
    
    if (temMedium) {
      const url = extractImageUrlBySize(foto.image, 'medium')
      if (url) {
        fotosProcessadas.push(url)
      } else {
        // Fallback se medium não retornou URL
        const urlFallback = extractImageUrl(foto.image)
        if (urlFallback) {
          fotosProcessadas.push(urlFallback)
          semMedium.push(indexReal)
        }
      }
    } else {
      // Não tem medium, usar fallback e marcar
      const urlFallback = extractImageUrl(foto.image)
      if (urlFallback) {
        fotosProcessadas.push(urlFallback)
        semMedium.push(indexReal)
      }
    }
  })
  
  // Demais fotos (índices 5+)
  // Criar Set com as fotos já usadas (principal + 4 menores) para comparação
  const fotosUsadasUrls = new Set<string>()
  const urlPrincipalTemp = extractImageUrl(fotoPrincipal.image)
  if (urlPrincipalTemp) fotosUsadasUrls.add(urlPrincipalTemp)
  quatroParaMenores.forEach(foto => {
    const url = extractImageUrl(foto.image)
    if (url) fotosUsadasUrls.add(url)
  })
  
  const demaisFotos = fotosRestantes.filter(foto => {
    const url = extractImageUrl(foto.image)
    return url && !fotosUsadasUrls.has(url)
  })
  demaisFotos.forEach(foto => {
    const url = extractImageUrl(foto.image)
    if (url) fotosProcessadas.push(url)
  })
  
  return { fotos: fotosProcessadas, semMedium }
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

  // Slug será gerado depois com todas as informações do imóvel

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
  const { fotos, semMedium } = extractFotos(unit, building, thirdParty)

  // Tags/comodidades (extrair de features E do descritivo)
  const tags = extractTags(unit, building, thirdParty, dwvImovel)
  
  // Debug: log das tags extraídas para este imóvel
  if (tags.length > 0) {
    console.log(`🏷️ Imóvel ${id} (${dwvImovel.title?.substring(0, 50)}): Tags = [${tags.join(', ')}]`)
  }

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

  // Data de entrega (do building, se disponível)
  // Imóveis prontos podem ter delivery_date (data passada de quando foram entregues)
  // Imóveis lançamento/em construção devem ter delivery_date (data futura de quando serão entregues)
  const dataEntrega = building?.delivery_date || undefined
  
  // Debug: log para entender o padrão de delivery_date
  if (dataEntrega) {
    console.log(`✅ Imóvel ${id} - Status: ${dwvImovel.construction_stage_raw}, delivery_date: ${dataEntrega}`)
  } else {
    // Log apenas para imóveis que deveriam ter data (lançamento/em construção)
    if (dwvImovel.construction_stage_raw === 'new' || dwvImovel.construction_stage_raw === 'under construction' || dwvImovel.construction_stage_raw === 'pre-market') {
      console.log(`⚠️ Imóvel ${id} (${dwvImovel.title}) - Status: ${dwvImovel.construction_stage_raw}, SEM delivery_date`)
    }
  }

  // Criar objeto do imóvel primeiro para gerar slug com todas as informações
  const titulo = dwvImovel.title || `Imóvel ${id}`
  const imovelData = {
    id,
    titulo,
    tipo,
    endereco,
    caracteristicas: {
      quartos: quartosTotal,
      banheiros,
      vagas,
      area,
      suite: suites,
      frenteMar: temFrenteMar,
      piscina: temAreaLazer || temHomeClub,
      churrasqueira: false,
      academia: temHomeClub,
      portaria: false,
      elevador: false,
      varanda: false,
      sacada: false,
    },
  }
  
  // Gerar slug amigável ao SEO com informações do imóvel
  const slug = generateSlug(titulo, imovelData)
  
  return {
    id,
    titulo,
    slug,
    descricao: dwvImovel.description || '',
    preco,
    tipo,
    status: mapStatus(dwvImovel.construction_stage, dwvImovel.construction_stage_raw),
    endereco,
    coordenadas,
    dataEntrega,
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
    fotosSemMedium: semMedium, // Índices das fotos menores (1-4) que não têm medium e precisam object-contain
    fotoPrincipalIndex: 0,
    dwvId: dwvImovel.id, // ID original do DWV para buscar fotos completas depois
    fonteDWV: true, // Marca origem DWV
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
  }
}

/**
 * Busca um imóvel específico do DWV pelo ID e retorna todas as fotos disponíveis
 */
export async function getDWVImovelFotos(dwvId: number): Promise<Array<{ url: string, hasMedium: boolean, image: string | DWVImage }>> {
  try {
    const apiToken = process.env.DWV_API_TOKEN
    const baseUrl = process.env.DWV_API_URL || 'https://agencies.dwvapp.com.br/integration/properties'
    
    if (!apiToken) {
      console.error('❌ DWV_API_TOKEN não configurado')
      return []
    }

    // Buscar todos os imóveis e encontrar o específico
    const allImoveis = await fetchDWVImoveis(1, 1000) // Buscar muitos para encontrar o específico
    const dwvImovel = allImoveis.find(imovel => imovel.id === dwvId)
    
    if (!dwvImovel) {
      console.error(`❌ Imóvel DWV com ID ${dwvId} não encontrado`)
      return []
    }

    const unit = dwvImovel.unit
    const building = dwvImovel.building
    const thirdParty = dwvImovel.third_party_property

    // Coletar TODAS as fotos disponíveis (igual extractFotos mas sem processamento)
    const todasFotos: Array<{ image: string | DWVImage, source: 'unit' | 'building' | 'thirdParty' }> = []
    
    // Fotos do unit
    if (unit) {
      if (unit.cover) {
        todasFotos.push({ image: unit.cover, source: 'unit' })
      }
      if (unit.additional_galleries) {
        unit.additional_galleries.forEach(gallery => {
          if (gallery.files) {
            gallery.files.forEach(file => {
              todasFotos.push({ image: file, source: 'unit' })
            })
          }
        })
      }
    }
    
    // Fotos do building
    if (building) {
      if (building.cover) {
        todasFotos.push({ image: building.cover, source: 'building' })
      }
      if (building.gallery) {
        building.gallery.forEach(img => {
          todasFotos.push({ image: img, source: 'building' })
        })
      }
    }
    
    // Fotos do third_party_property
    if (thirdParty) {
      if (thirdParty.cover) {
        todasFotos.push({ image: thirdParty.cover, source: 'thirdParty' })
      }
      if (thirdParty.gallery) {
        thirdParty.gallery.forEach(img => {
          todasFotos.push({ image: img, source: 'thirdParty' })
        })
      }
    }

    // Remover duplicatas baseado na URL
    const fotosUnicas: Array<{ image: string | DWVImage, source: 'unit' | 'building' | 'thirdParty' }> = []
    const urlsVistas = new Set<string>()
    
    todasFotos.forEach(foto => {
      const url = extractImageUrl(foto.image)
      if (url && !urlsVistas.has(url)) {
        urlsVistas.add(url)
        fotosUnicas.push(foto)
      }
    })

    // Retornar array com URL e informação se tem medium
    return fotosUnicas.map(foto => ({
      url: extractImageUrl(foto.image) || '',
      hasMedium: hasMediumSize(foto.image),
      image: foto.image
    }))
  } catch (error) {
    console.error('❌ Erro ao buscar fotos do imóvel DWV:', error)
    return []
  }
}
