import { Octokit } from '@octokit/rest'

// Configuração do GitHub
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'

// Função para fazer upload de imagem para o GitHub (SEM OTIMIZAÇÃO)
export async function uploadImageToGitHub(
  filePath: string,
  fileBuffer: Buffer
): Promise<string> {
  try {
    const content = fileBuffer.toString('base64')
    
    // Tentar pegar SHA do arquivo existente (para sobrescrever)
    let sha: string | undefined
    try {
      const existingFile = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: filePath,
        ref: 'main'
      })
      
      if ('sha' in existingFile.data) {
        sha = existingFile.data.sha
      }
    } catch (error) {
      // Arquivo não existe, está ok
    }
    
    // Fazer commit no GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: `Admin: Atualiza ${filePath}`,
      content: content,
      branch: 'main',
      ...(sha && { sha })
    })
    
    // Retornar URL da imagem
    return `/${filePath.replace('public/', '')}`
    
  } catch (error) {
    console.error('Erro ao fazer upload para GitHub:', error)
    throw new Error('Erro ao fazer upload da imagem')
  }
}

// Função para fazer upload em batch (múltiplas imagens)
export async function uploadMultipleImages(
  files: Array<{ path: string; buffer: Buffer }>
): Promise<string[]> {
  try {
    const uploadPromises = files.map(file => 
      uploadImageToGitHub(file.path, file.buffer)
    )
    
    return await Promise.all(uploadPromises)
  } catch (error) {
    console.error('Erro ao fazer upload em batch:', error)
    throw new Error('Erro ao fazer upload das imagens')
  }
}
