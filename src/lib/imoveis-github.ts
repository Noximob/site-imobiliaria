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
        // Aceitar true, 'true', 1, ou qualquer valor truthy
        selecaoNox = imovel.selecaoNox === true || 
                     imovel.selecaoNox === 'true' || 
                     imovel.selecaoNox === 1 ||
                     (imovel.selecaoNox !== false && imovel.selecaoNox !== 'false' && imovel.selecaoNox !== 0 && imovel.selecaoNox !== '')
      }
      
      return {
        ...imovel,
        createdAt: imovel.createdAt ? new Date(imovel.createdAt) : new Date(),
        updatedAt: imovel.updatedAt ? new Date(imovel.updatedAt) : new Date(),
        selecaoNox: Boolean(selecaoNox), // Sempre converter para boolean
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
    // Comprimir fotos antes de enviar (evita limite de tamanho da API)
    const fotosBase64: string[] = []
    for (const foto of fotosFiles) {
      const base64 = await compressImage(foto)
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

    const text = await response.text()
    let data: { id?: string; error?: string }
    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      throw new Error(response.ok ? 'Resposta inválida do servidor' : `Erro ${response.status}: ${text.slice(0, 200)}`)
    }

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao criar imóvel')
    }

    return data.id!
  } catch (error) {
    console.error('Erro ao criar imóvel:', error)
    throw error
  }
}

export async function updateImovelWithFotos(id: string, imovelData: any, fotosFiles?: File[]): Promise<void> {
  try {
    let fotosBase64: string[] | undefined

    if (fotosFiles && fotosFiles.length > 0) {
      fotosBase64 = []
      for (const foto of fotosFiles) {
        const base64 = await compressImage(foto)
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

    const text = await response.text()
    if (!response.ok) {
      try {
        const data = text ? JSON.parse(text) : {}
        throw new Error(data.error || 'Erro ao atualizar imóvel')
      } catch (err) {
        if (err instanceof SyntaxError || (err instanceof Error && !err.message.includes('Erro ao atualizar'))) {
          throw new Error(`Erro ${response.status}: ${text.slice(0, 200)}`)
        }
        throw err
      }
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

/** Redimensiona e comprime a imagem para caber no limite da API (~4MB total) */
async function compressImage(file: File, maxWidth = 1600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      let { width, height } = img
      if (width > maxWidth || height > maxWidth) {
        if (width > height) {
          height = (height / width) * maxWidth
          width = maxWidth
        } else {
          width = (width / height) * maxWidth
          height = maxWidth
        }
      }
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        fileToBase64(file).then(resolve).catch(reject)
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            fileToBase64(file).then(resolve).catch(reject)
            return
          }
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      fileToBase64(file).then(resolve).catch(reject)
    }
    img.src = url
  })
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

