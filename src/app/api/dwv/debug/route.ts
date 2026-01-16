import { NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'
const IMOVEIS_PATH = 'public/imoveis/imoveis.json'

export async function GET() {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GitHub token não configurado' }, { status: 500 })
    }

    // Buscar arquivo do GitHub
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: IMOVEIS_PATH,
    })

    if (!('content' in data)) {
      return NextResponse.json({
        arquivoExiste: false,
        total: 0,
        publicados: 0,
        naoPublicados: 0,
        fonteDWV: 0,
        naoDWV: 0,
      })
    }

    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    const imoveis = JSON.parse(content)

    const publicados = imoveis.filter((im: any) => im.publicado === true || im.publicado === 'true')
    const naoPublicados = imoveis.filter((im: any) => !im.publicado || im.publicado === false)
    const fonteDWV = imoveis.filter((im: any) => im.fonteDWV === true)
    const naoDWV = imoveis.filter((im: any) => im.fonteDWV !== true)

    // Verificar campos obrigatórios
    const imoveisComProblemas = imoveis.filter((im: any) => {
      return !im.id || !im.titulo || !im.slug || im.publicado === undefined
    })

    // Primeiros 3 imóveis como exemplo
    const exemplos = imoveis.slice(0, 3).map((im: any) => ({
      id: im.id,
      titulo: im.titulo,
      publicado: im.publicado,
      fonteDWV: im.fonteDWV,
      temFotos: !!(im.fotos && im.fotos.length > 0),
      temEndereco: !!im.endereco,
      temCaracteristicas: !!im.caracteristicas,
    }))

    return NextResponse.json({
      arquivoExiste: true,
      total: imoveis.length,
      publicados: publicados.length,
      naoPublicados: naoPublicados.length,
      fonteDWV: fonteDWV.length,
      naoDWV: naoDWV.length,
      imoveisComProblemas: imoveisComProblemas.length,
      exemplos,
      ultimaAtualizacao: data.sha ? 'Arquivo existe' : 'Arquivo não encontrado',
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: error.status,
    }, { status: 500 })
  }
}
