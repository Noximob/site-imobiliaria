import siteTextsData from '../../public/textos/site.json'

export interface SiteText {
  value: string
  type: 'titulo' | 'texto' | 'link' | 'botao' | 'contato'
  label: string
  hint: string
  maxLength: number
  section: string
}

export interface SiteTextsData {
  [section: string]: {
    [subsection: string]: {
      [key: string]: SiteText
    }
  }
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

// Função para obter todos os textos de uma seção
export function getTextsBySection(section: string): { [key: string]: SiteText } {
  const result: { [key: string]: SiteText } = {}
  
  const sectionData = (siteTextsData as any)[section]
  if (!sectionData) {
    console.warn(`Seção não encontrada: ${section}`)
    return result
  }
  
  // Percorrer todas as subseções
  Object.values(sectionData).forEach(subsection => {
    if (typeof subsection === 'object' && subsection !== null) {
      Object.entries(subsection).forEach(([key, text]) => {
        if (text && typeof text === 'object' && 'value' in text) {
          result[key] = text as SiteText
        }
      })
    }
  })
  
  return result
}

// Função para obter todas as seções disponíveis
export function getAllSections(): string[] {
  return Object.keys(siteTextsData as any)
}

// Função para obter estrutura completa dos textos
export function getAllTexts(): SiteTextsData {
  return siteTextsData as SiteTextsData
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
