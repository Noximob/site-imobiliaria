import { Imovel } from '@/types'

const API_URL = '/api/imoveis-github'

export async function getAllImoveis(): Promise<Imovel[]> {
  try {
    const response = await fetch(API_URL, {
      cache: 'no-store'
    })

    if (!response.ok) {
      console.error('Erro ao buscar imóveis do GitHub')
      return []
    }

    const imoveis = await response.json()
    
    // Converter datas de string para Date
    return imoveis.map((imovel: any) => ({
      ...imovel,
      createdAt: imovel.createdAt ? new Date(imovel.createdAt) : new Date(),
      updatedAt: imovel.updatedAt ? new Date(imovel.updatedAt) : new Date(),
    })) as Imovel[]
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
    // Redimensionar e converter fotos para base64
    // Todas as fotos são redimensionadas para tamanho otimizado (800x400)
    // Isso garante qualidade tanto para foto principal quanto para menores
    const fotosBase64: string[] = []
    
    for (const foto of fotosFiles) {
      const base64 = await resizeFoto(foto)
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
      // Redimensionar e converter fotos para base64
      // Todas as fotos são redimensionadas para tamanho otimizado (800x400)
      // Isso garante qualidade mesmo se o usuário definir como principal depois
      fotosBase64 = []
      
      for (const foto of fotosFiles) {
        const base64 = await resizeFotoPrincipal(foto)
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

// Função para redimensionar imagem
function resizeImage(file: File, maxWidth: number, maxHeight: number, quality: number = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Calcular novas dimensões mantendo aspect ratio
        let width = img.width
        let height = img.height
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = width * ratio
          height = height * ratio
        }
        
        // Criar canvas e redimensionar
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Não foi possível criar contexto do canvas'))
          return
        }
        
        ctx.drawImage(img, 0, 0, width, height)
        
        // Converter para base64 com qualidade
        const base64 = canvas.toDataURL('image/jpeg', quality)
        resolve(base64)
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
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

// Função para redimensionar fotos para tamanho otimizado
// Tamanho: 800x400px (suficiente para foto principal e menores)
// Mantém aspect ratio e qualidade de 85%
async function resizeFoto(file: File): Promise<string> {
  return resizeImage(file, 800, 400, 0.85)
}

