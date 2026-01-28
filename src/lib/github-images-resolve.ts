import { Octokit } from '@octokit/rest'
import { siteImagesConfig } from '@/lib/github-images'

const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'

export type ResolvedImageInfo = { path: string; extension: string; size: number }

async function getAllFilesRecursive(octokit: Octokit, path: string): Promise<any[]> {
  try {
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: path,
    })
    if (!Array.isArray(data)) return []
    let files: any[] = []
    for (const item of data) {
      if (item.type === 'file') {
        files.push(item)
      } else if (item.type === 'dir') {
        const subFiles = await getAllFilesRecursive(octokit, item.path)
        files = files.concat(subFiles)
      }
    }
    return files
  } catch (error) {
    console.error(`Erro ao buscar arquivos em ${path}:`, error)
    return []
  }
}

function getBaseName(path: string): string {
  const lastSlash = path.lastIndexOf('/')
  const filename = path.substring(lastSlash + 1)
  const lastDot = filename.lastIndexOf('.')
  return lastDot > 0 ? filename.substring(0, lastDot) : filename
}

function getExtension(path: string): string {
  const lastDot = path.lastIndexOf('.')
  return lastDot > 0 ? path.substring(lastDot + 1).toLowerCase() : ''
}

const EXT_PRIORITY: { [key: string]: number } = {
  avif: 5,
  webp: 4,
  jpg: 3,
  jpeg: 3,
  png: 2,
  gif: 1,
}

/**
 * Resolve o mapa de imagens (id -> path real, extension, size) consultando o GitHub.
 * Usado pelo admin (list-github-images) e pelo site (api/image) para sempre usar o arquivo correto.
 */
export async function getResolvedImagesMap(): Promise<Record<string, ResolvedImageInfo>> {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return {}
  }
  const octokit = new Octokit({ auth: token })
  const allFiles = await getAllFilesRecursive(octokit, 'public/imagens')

  const filesByBaseNameArray: { [baseName: string]: Array<{ path: string; ext: string }> } = {}
  for (const file of allFiles) {
    if (file.type === 'file') {
      const relativePath = (file.path as string).replace('public', '')
      const baseName = getBaseName(relativePath)
      const ext = getExtension(relativePath)
      if (!filesByBaseNameArray[baseName]) filesByBaseNameArray[baseName] = []
      filesByBaseNameArray[baseName].push({ path: relativePath, ext })
    }
  }

  const filesByBaseName: { [baseName: string]: string } = {}
  for (const baseName in filesByBaseNameArray) {
    const files = [...filesByBaseNameArray[baseName]]
    files.sort((a, b) => (EXT_PRIORITY[b.ext] || 0) - (EXT_PRIORITY[a.ext] || 0))
    filesByBaseName[baseName] = files[0].path
  }

  const filesByFullPath: { [path: string]: number } = {}
  for (const file of allFiles) {
    if (file.type === 'file') {
      const relativePath = (file.path as string).replace('public', '')
      filesByFullPath[relativePath] = (file as any).size || 0
    }
  }

  const imagesMap: Record<string, ResolvedImageInfo> = {}
  for (const config of siteImagesConfig) {
    const configBaseName = getBaseName(config.localPath)
    const foundPath = filesByBaseName[configBaseName]
    if (foundPath) {
      imagesMap[config.id] = {
        path: foundPath,
        extension: getExtension(foundPath),
        size: filesByFullPath[foundPath] || 0,
      }
    }
  }
  return imagesMap
}
