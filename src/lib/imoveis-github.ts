import { Imovel } from '@/types'

const API_URL = '/api/imoveis-github'

export async function getAllImoveis(includeUnpublished: boolean = false): Promise<Imovel[]> {
  try {
    const response = await fetch(API_URL, {
      cache: 'no-store'
    })

    if (!response.ok) {
      console.error('Erro ao buscar imóveis do GitHub')
      return []
    }

    const imoveis = await response.json()
    
    // Converter datas de string para Date e garantir que selecaoNox seja boolean
    const imoveisFormatados = imoveis.map((imovel: any) => {
      // Garantir que selecaoNox seja sempre boolean
      // Aceitar true, 'true', 1, ou qualquer valor truthy
      let selecaoNox = false
      if (imovel.selecaoNox !== undefined && imovel.selecaoNox !== null) {
        if (imovel.selecaoNox === true || imovel.selecaoNox === 'true' || imovel.selecaoNox === 1) {
          selecaoNox = true
        } else if (imovel.selecaoNox !== false && imovel.selecaoNox !== 'false' && imovel.selecaoNox !== 0) {
          selecaoNox = Boolean(imovel.selecaoNox)
        }
      }
      
      return {
        ...imovel,
        createdAt: imovel.createdAt ? new Date(imovel.createdAt) : new Date(),
        updatedAt: imovel.updatedAt ? new Date(imovel.updatedAt) : new Date(),
        selecaoNox: selecaoNox,
      } as Imovel
    })
    
    // Se includeUnpublished for false, filtrar apenas publicados
    if (!includeUnpublished) {
      return imoveisFormatados.filter((imovel: Imovel) => imovel.publicado)
    }
    
    return imoveisFormatados
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error)
    return []
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
    .trim()
}

export async function createImovelWithFotos(imovelData: any, fotosFiles: File[]): Promise<string> {
  try {
    // Converter fotos para base64 (sem redimensionamento automático)
    const fotosBase64: string[] = []
    
    for (const foto of fotosFiles) {
      const base64 = await fileToBase64(foto)
      fotosBase64.push(base64)
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imovel: imovelData,
        fotos: fotosBase64,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erro ao criar imóvel')
    }

    const data = await response.json()
    return data.id
  } catch (error) {
    console.error('Erro ao criar imóvel:', error)
    throw error
  }
}

export async function updateImovelWithFotos(id: string, imovelData: any, fotosFiles?: File[]): Promise<void> {
  try {
    let fotosBase64: string[] | undefined

    if (fotosFiles && fotosFiles.length > 0) {
      // Converter fotos para base64 (sem redimensionamento automático)
      fotosBase64 = []
      
      for (const foto of fotosFiles) {
        const base64 = await fileToBase64(foto)
        fotosBase64.push(base64)
      }
    }

    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        imovel: imovelData,
        fotos: fotosBase64,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erro ao atualizar imóvel')
    }
  } catch (error) {
    console.error('Erro ao atualizar imóvel:', error)
    throw error
  }
}

export async function deleteImovel(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erro ao deletar imóvel')
    }
  } catch (error) {
    console.error('Erro ao deletar imóvel:', error)
    throw error
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

