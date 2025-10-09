import { Octokit } from '@octokit/rest'

// Configuração do GitHub
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'

// Função para otimizar imagem
export async function optimizeImage(file: File): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Redimensionar para máximo 1200x800
      const maxWidth = 1200
      const maxHeight = 800
      
      let { width, height } = img
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }
      
      canvas.width = width
      canvas.height = height
      
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob((blob) => {
        if (blob) {
          blob.arrayBuffer().then(buffer => {
            resolve(Buffer.from(buffer))
          })
        } else {
          reject(new Error('Erro ao otimizar imagem'))
        }
      }, 'image/webp', 0.9)
    }
    
    img.onerror = () => reject(new Error('Erro ao carregar imagem'))
    img.src = URL.createObjectURL(file)
  })
}

// Função para fazer upload de imagem para o GitHub
export async function uploadImageToGitHub(
  imageId: string, 
  file: File, 
  category: string = 'site'
): Promise<string> {
  try {
    // Otimizar imagem
    const optimizedImage = await optimizeImage(file)
    const content = optimizedImage.toString('base64')
    
    // Determinar caminho baseado na categoria
    const basePath = category === 'imoveis' ? 'public/imoveis' : 'public/imagens'
    const filePath = `${basePath}/${imageId}.webp`
    
    // Fazer commit no GitHub
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: `Admin: Atualiza ${imageId}`,
      content: content,
      branch: 'main'
    })
    
    // Retornar URL da imagem
    return `/${filePath.replace('public/', '')}`
    
  } catch (error) {
    console.error('Erro ao fazer upload para GitHub:', error)
    throw new Error('Erro ao fazer upload da imagem')
  }
}

// Função para listar imagens existentes
export async function listImages(): Promise<string[]> {
  try {
    const response = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: 'public/imagens'
    })
    
    if (Array.isArray(response.data)) {
      return response.data
        .filter(item => item.type === 'file')
        .map(item => item.name)
    }
    
    return []
  } catch (error) {
    console.error('Erro ao listar imagens:', error)
    return []
  }
}

// Função para deletar imagem
export async function deleteImage(imagePath: string): Promise<void> {
  try {
    // Primeiro, buscar o SHA do arquivo
    const fileResponse = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: imagePath
    })
    
    if ('sha' in fileResponse.data) {
      await octokit.repos.deleteFile({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: imagePath,
        message: `Admin: Remove ${imagePath}`,
        sha: fileResponse.data.sha
      })
    }
  } catch (error) {
    console.error('Erro ao deletar imagem:', error)
    throw new Error('Erro ao deletar imagem')
  }
}
