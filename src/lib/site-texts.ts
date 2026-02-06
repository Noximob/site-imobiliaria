import siteTextsData from '../../public/textos/site.json'

export type HeadingType = 'H1' | 'H2' | 'H3' | 'H4' | 'meta' | 'paragrafo' | 'label'

export interface SiteText {
  value: string
  type: 'titulo' | 'texto' | 'link' | 'botao' | 'contato'
  label: string
  hint: string
  maxLength: number
  section: string
  /** Indica se o texto é usado como heading na página (para orientação no admin) */
  headingType?: HeadingType
  /** Mínimo recomendado de caracteres (para SEO/heading) */
  minLength?: number
}

export interface SiteTextsData {
  [section: string]: {
    [subsection: string]: {
      [key: string]: SiteText
    }
  }
}

// Cache para textos do GitHub
let githubTextsCache: any = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Função para buscar textos do GitHub
async function fetchTextsFromGitHub(): Promise<any> {
  try {
    const response = await fetch('/api/update-texts-github')
    if (response.ok) {
      return await response.json()
    }
    return siteTextsData
  } catch (error) {
    console.warn('Erro ao buscar textos do GitHub, usando cache local:', error)
    return siteTextsData
  }
}

// Função para obter textos (com cache)
async function getTextsData(): Promise<any> {
  const now = Date.now()
  
  // Se cache expirou ou não existe, buscar do GitHub
  if (!githubTextsCache || (now - cacheTimestamp) > CACHE_DURATION) {
    githubTextsCache = await fetchTextsFromGitHub()
    cacheTimestamp = now
  }
  
  return githubTextsCache
}

// Função para obter texto por caminho (ex: 'header.telefone')
export function getText(path: string): string {
  const keys = path.split('.')
  let value: any = siteTextsData
  
  for (const key of keys) {
    if (value && typeof value === 'object' && value.hasOwnProperty(key)) {
      value = value[key]
    } else {
      console.warn(`Caminho de texto não encontrado: ${path}`)
      return `[TEXTO NÃO ENCONTRADO: ${path}]`
    }
  }
  
  return value?.value || `[TEXTO VAZIO: ${path}]`
}

// Função assíncrona para obter texto (carrega do GitHub)
export async function getTextAsync(path: string): Promise<string> {
  try {
    const textsData = await getTextsData()
    const keys = path.split('.')
    let value: any = textsData
    
    for (const key of keys) {
      if (value && typeof value === 'object' && value.hasOwnProperty(key)) {
        value = value[key]
      } else {
        console.warn(`Caminho de texto não encontrado: ${path}`)
        return `[TEXTO NÃO ENCONTRADO: ${path}]`
      }
    }
    
    return value?.value || `[TEXTO VAZIO: ${path}]`
  } catch (error) {
    console.warn('Erro ao buscar texto do GitHub:', error)
    return getText(path) // Fallback para função síncrona
  }
}

// Função recursiva para extrair textos com caminho completo
function extractTextsRecursive(obj: any, parentPath: string = '', result: { [key: string]: SiteText } = {}): { [key: string]: SiteText } {
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object') {
      // Se tem 'value', é um texto final
      if ('value' in value && typeof value.value === 'string') {
        const fullPath = parentPath ? `${parentPath}.${key}` : key
        result[fullPath] = value as SiteText
      } else {
        // Continuar navegando
        const newPath = parentPath ? `${parentPath}.${key}` : key
        extractTextsRecursive(value, newPath, result)
      }
    }
  }
  return result
}

// Função para obter todos os textos de uma seção
export function getTextsBySection(section: string): { [key: string]: SiteText } {
  const result: { [key: string]: SiteText } = {}
  
  const sectionData = (siteTextsData as any)[section]
  if (!sectionData) {
    console.warn(`Seção não encontrada: ${section}`)
    return result
  }
  
  // Extrair todos os textos recursivamente
  return extractTextsRecursive(sectionData, section)
}

// Função para obter todas as seções disponíveis
export function getAllSections(): string[] {
  return Object.keys(siteTextsData as any)
}

// Função para obter estrutura completa dos textos
export function getAllTexts(): SiteTextsData {
  return siteTextsData as any
}

// Função para validar se um caminho existe
export function textPathExists(path: string): boolean {
  const keys = path.split('.')
  let value: any = siteTextsData
  
  for (const key of keys) {
    if (value && typeof value === 'object' && value.hasOwnProperty(key)) {
      value = value[key]
    } else {
      return false
    }
  }
  
  return value && typeof value === 'object' && 'value' in value
}

// Função para obter metadados de um texto
export function getTextMetadata(path: string): SiteText | null {
  const keys = path.split('.')
  let value: any = siteTextsData
  
  for (const key of keys) {
    if (value && typeof value === 'object' && value.hasOwnProperty(key)) {
      value = value[key]
    } else {
      return null
    }
  }
  
  if (value && typeof value === 'object' && 'value' in value) {
    return value as SiteText
  }
  
  return null
}
